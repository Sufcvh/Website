import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, Users, TrendingUp, Calendar, Layout } from "lucide-react";
import { toast } from "sonner";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API}/stats`);
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
      toast.error("Failed to load statistics");
    } finally {
      setLoading(false);
    }
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
            <div>
              <h1 className="text-3xl font-bold tracking-tight" data-testid="dashboard-title">Job Tracker</h1>
              <p className="text-sm text-muted-foreground mt-1">Manage your job applications efficiently</p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => navigate('/calendar')}
                data-testid="calendar-nav-btn"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Calendar
              </Button>
              <Button
                onClick={() => navigate('/kanban')}
                data-testid="kanban-nav-btn"
              >
                <Layout className="w-4 h-4 mr-2" />
                Kanban Board
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card data-testid="total-applications-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Total Applications
              </CardTitle>
              <BarChart3 className="w-5 h-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold" data-testid="total-applications-count">{stats?.total_applications || 0}</div>
            </CardContent>
          </Card>

          <Card data-testid="response-rate-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Response Rate
              </CardTitle>
              <TrendingUp className="w-5 h-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold" data-testid="response-rate-value">{stats?.response_rate || 0}%</div>
            </CardContent>
          </Card>

          <Card data-testid="upcoming-interviews-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Upcoming Interviews
              </CardTitle>
              <Calendar className="w-5 h-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold" data-testid="upcoming-interviews-count">{stats?.upcoming_interviews || 0}</div>
            </CardContent>
          </Card>

          <Card data-testid="active-stage-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                In Progress
              </CardTitle>
              <Users className="w-5 h-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold" data-testid="in-progress-count">
                {((stats?.by_status?.shortlisted || 0) + 
                  (stats?.by_status?.round1 || 0) + 
                  (stats?.by_status?.round2 || 0) + 
                  (stats?.by_status?.round3 || 0))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Status Breakdown */}
        <Card className="mt-8" data-testid="status-breakdown-card">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">Applications by Stage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { key: 'applied', label: 'Applied', color: 'bg-zinc-100 text-zinc-900' },
                { key: 'shortlisted', label: 'Shortlisted', color: 'bg-blue-50 text-blue-900' },
                { key: 'round1', label: 'Round 1', color: 'bg-amber-50 text-amber-900' },
                { key: 'round2', label: 'Round 2', color: 'bg-orange-50 text-orange-900' },
                { key: 'round3', label: 'Round 3', color: 'bg-purple-50 text-purple-900' },
                { key: 'offer', label: 'Offer', color: 'bg-emerald-50 text-emerald-900' },
              ].map((status) => (
                <div
                  key={status.key}
                  className={`p-4 rounded-lg border ${status.color}`}
                  data-testid={`status-${status.key}-card`}
                >
                  <div className="text-sm font-medium uppercase tracking-wider">{status.label}</div>
                  <div className="text-3xl font-bold mt-2" data-testid={`status-${status.key}-count`}>
                    {stats?.by_status?.[status.key] || 0}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;