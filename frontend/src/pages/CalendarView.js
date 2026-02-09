import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Calendar as CalendarIcon } from "lucide-react";
import { toast } from "sonner";
import { format, parseISO, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday } from "date-fns";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const CalendarView = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await axios.get(`${API}/applications`);
      setApplications(response.data);
    } catch (error) {
      console.error("Error fetching applications:", error);
      toast.error("Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getInterviewsForDay = (day) => {
    return applications.filter(app => {
      if (!app.interview_date) return false;
      try {
        const interviewDate = parseISO(app.interview_date);
        return isSameDay(interviewDate, day);
      } catch {
        return false;
      }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/')}
                data-testid="back-to-dashboard-btn"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-3xl font-bold tracking-tight" data-testid="calendar-title">Interview Calendar</h1>
                <p className="text-sm text-muted-foreground mt-1">Track your upcoming interviews</p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => navigate('/kanban')}
              data-testid="kanban-nav-btn"
            >
              View Kanban Board
            </Button>
          </div>
        </div>
      </header>

      {/* Calendar */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card data-testid="calendar-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-semibold">
                {format(currentDate, 'MMMM yyyy')}
              </CardTitle>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
                  data-testid="prev-month-btn"
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentDate(new Date())}
                  data-testid="today-btn"
                >
                  Today
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
                  data-testid="next-month-btn"
                >
                  Next
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Weekday Headers */}
            <div className="grid grid-cols-7 gap-2 mb-4">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center text-sm font-medium text-muted-foreground uppercase tracking-wider py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-2">
              {/* Empty cells for days before month starts */}
              {Array.from({ length: monthStart.getDay() }).map((_, i) => (
                <div key={`empty-${i}`} className="aspect-square" />
              ))}

              {/* Actual days */}
              {daysInMonth.map(day => {
                const interviews = getInterviewsForDay(day);
                const hasInterview = interviews.length > 0;
                const isTodayDate = isToday(day);

                return (
                  <div
                    key={day.toString()}
                    className={`aspect-square border rounded-lg p-2 ${
                      isTodayDate ? 'border-primary bg-primary/5' : 'border-border'
                    } ${hasInterview ? 'bg-blue-50 dark:bg-blue-950/30' : ''}`}
                    data-testid={`calendar-day-${format(day, 'yyyy-MM-dd')}`}
                  >
                    <div className={`text-sm font-medium mb-1 ${
                      isTodayDate ? 'text-primary' : 'text-foreground'
                    }`}>
                      {format(day, 'd')}
                    </div>
                    {hasInterview && (
                      <div className="space-y-1">
                        {interviews.map(app => (
                          <div
                            key={app.id}
                            className="text-xs bg-blue-600 text-white rounded px-1 py-0.5 truncate"
                            title={`${app.company} - ${app.position}`}
                            data-testid={`interview-${app.id}`}
                          >
                            {app.company}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Interviews List */}
        <Card className="mt-8" data-testid="upcoming-interviews-card">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">Upcoming Interviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {applications
                .filter(app => {
                  if (!app.interview_date) return false;
                  try {
                    const interviewDate = parseISO(app.interview_date);
                    return interviewDate >= new Date();
                  } catch {
                    return false;
                  }
                })
                .sort((a, b) => new Date(a.interview_date) - new Date(b.interview_date))
                .map(app => (
                  <div
                    key={app.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                    data-testid={`interview-item-${app.id}`}
                  >
                    <div className="flex items-center gap-4">
                      {app.company_logo ? (
                        <img src={app.company_logo} alt={app.company} className="w-12 h-12 rounded object-cover" />
                      ) : (
                        <div className="w-12 h-12 rounded bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                          <CalendarIcon className="w-6 h-6 text-muted-foreground" />
                        </div>
                      )}
                      <div>
                        <div className="font-semibold">{app.company}</div>
                        <div className="text-sm text-muted-foreground">{app.position}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{format(parseISO(app.interview_date), 'MMM d, yyyy')}</div>
                      <div className="text-sm text-muted-foreground">{format(parseISO(app.interview_date), 'h:mm a')}</div>
                    </div>
                  </div>
                ))}
              {applications.filter(app => app.interview_date && parseISO(app.interview_date) >= new Date()).length === 0 && (
                <div className="text-center text-muted-foreground py-8" data-testid="no-interviews-message">
                  No upcoming interviews scheduled
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default CalendarView;