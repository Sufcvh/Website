import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Briefcase, Mail, User, DollarSign, Calendar, FileText, Trash2 } from "lucide-react";
import { format, parseISO } from "date-fns";

const STAGES = [
  { value: 'applied', label: 'Applied' },
  { value: 'shortlisted', label: 'Shortlisted' },
  { value: 'round1', label: 'Round 1' },
  { value: 'round2', label: 'Round 2' },
  { value: 'round3', label: 'Round 3' },
  { value: 'offer', label: 'Offer' },
];

const ApplicationDetailDialog = ({ application, onClose, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (application) {
      setFormData({
        company: application.company || "",
        position: application.position || "",
        status: application.status || "applied",
        date_applied: application.date_applied || "",
        salary_range: application.salary_range || "",
        job_description: application.job_description || "",
        contact_person: application.contact_person || "",
        contact_email: application.contact_email || "",
        notes: application.notes || "",
        company_logo: application.company_logo || "",
        interview_date: application.interview_date || "",
      });
    }
  }, [application]);

  const handleUpdate = () => {
    onUpdate(application.id, formData);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this application?')) {
      onDelete(application.id);
    }
  };

  if (!application) return null;

  return (
    <Dialog open={!!application} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto" data-testid="application-detail-dialog">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              {application.company_logo ? (
                <img src={application.company_logo} alt={application.company} className="w-16 h-16 rounded object-cover" />
              ) : (
                <div className="w-16 h-16 rounded bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                  <Briefcase className="w-8 h-8 text-muted-foreground" />
                </div>
              )}
              <div>
                <DialogTitle className="text-2xl" data-testid="detail-company-name">{application.company}</DialogTitle>
                <p className="text-muted-foreground" data-testid="detail-position">{application.position}</p>
              </div>
            </div>
            <div className="flex gap-2">
              {!isEditing ? (
                <>
                  <Button onClick={() => setIsEditing(true)} data-testid="edit-application-btn">Edit</Button>
                  <Button variant="destructive" size="icon" onClick={handleDelete} data-testid="delete-application-btn">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" onClick={() => setIsEditing(false)} data-testid="cancel-edit-btn">Cancel</Button>
                  <Button onClick={handleUpdate} data-testid="save-changes-btn">Save Changes</Button>
                </>
              )}
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="details" className="mt-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details" data-testid="tab-details">Details</TabsTrigger>
            <TabsTrigger value="notes" data-testid="tab-notes">Notes</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-6 mt-6">
            {!isEditing ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Status</div>
                      <div className="font-medium capitalize" data-testid="detail-status">{application.status}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Date Applied
                      </div>
                      <div className="font-medium" data-testid="detail-date-applied">{application.date_applied}</div>
                    </div>
                    {application.interview_date && (
                      <div>
                        <div className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          Interview Date
                        </div>
                        <div className="font-medium text-blue-600 dark:text-blue-400" data-testid="detail-interview-date">
                          {format(parseISO(application.interview_date), 'MMM d, yyyy h:mm a')}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    {application.salary_range && (
                      <div>
                        <div className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                          <DollarSign className="w-4 h-4" />
                          Salary Range
                        </div>
                        <div className="font-medium" data-testid="detail-salary-range">{application.salary_range}</div>
                      </div>
                    )}
                    {application.contact_person && (
                      <div>
                        <div className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                          <User className="w-4 h-4" />
                          Contact Person
                        </div>
                        <div className="font-medium" data-testid="detail-contact-person">{application.contact_person}</div>
                      </div>
                    )}
                    {application.contact_email && (
                      <div>
                        <div className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          Contact Email
                        </div>
                        <div className="font-medium" data-testid="detail-contact-email">{application.contact_email}</div>
                      </div>
                    )}
                  </div>
                </div>

                {application.job_description && (
                  <div>
                    <div className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Job Description
                    </div>
                    <div className="text-sm whitespace-pre-wrap p-4 bg-muted rounded-lg" data-testid="detail-job-description">
                      {application.job_description}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-company">Company</Label>
                    <Input
                      id="edit-company"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      data-testid="edit-input-company"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-position">Position</Label>
                    <Input
                      id="edit-position"
                      value={formData.position}
                      onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                      data-testid="edit-input-position"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-status">Status</Label>
                    <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                      <SelectTrigger data-testid="edit-select-status">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {STAGES.map(stage => (
                          <SelectItem key={stage.value} value={stage.value}>{stage.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-date-applied">Date Applied</Label>
                    <Input
                      id="edit-date-applied"
                      type="date"
                      value={formData.date_applied}
                      onChange={(e) => setFormData({ ...formData, date_applied: e.target.value })}
                      data-testid="edit-input-date-applied"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-salary-range">Salary Range</Label>
                    <Input
                      id="edit-salary-range"
                      value={formData.salary_range}
                      onChange={(e) => setFormData({ ...formData, salary_range: e.target.value })}
                      data-testid="edit-input-salary-range"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-company-logo">Company Logo URL</Label>
                    <Input
                      id="edit-company-logo"
                      value={formData.company_logo}
                      onChange={(e) => setFormData({ ...formData, company_logo: e.target.value })}
                      data-testid="edit-input-company-logo"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-contact-person">Contact Person</Label>
                    <Input
                      id="edit-contact-person"
                      value={formData.contact_person}
                      onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
                      data-testid="edit-input-contact-person"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-contact-email">Contact Email</Label>
                    <Input
                      id="edit-contact-email"
                      value={formData.contact_email}
                      onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                      data-testid="edit-input-contact-email"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-interview-date">Interview Date & Time</Label>
                  <Input
                    id="edit-interview-date"
                    type="datetime-local"
                    value={formData.interview_date}
                    onChange={(e) => setFormData({ ...formData, interview_date: e.target.value })}
                    data-testid="edit-input-interview-date"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-job-description">Job Description</Label>
                  <Textarea
                    id="edit-job-description"
                    value={formData.job_description}
                    onChange={(e) => setFormData({ ...formData, job_description: e.target.value })}
                    rows={6}
                    data-testid="edit-input-job-description"
                  />
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="notes" className="mt-6">
            {!isEditing ? (
              <div className="min-h-[200px]">
                {application.notes ? (
                  <div className="whitespace-pre-wrap text-sm p-4 bg-muted rounded-lg" data-testid="detail-notes">
                    {application.notes}
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground py-12" data-testid="no-notes-message">
                    No notes added yet. Click Edit to add notes.
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="edit-notes">Notes</Label>
                <Textarea
                  id="edit-notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={12}
                  placeholder="Add interview prep notes, follow-up reminders, etc."
                  data-testid="edit-input-notes"
                />
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ApplicationDetailDialog;