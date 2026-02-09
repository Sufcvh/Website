import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const STAGES = [
  { value: 'applied', label: 'Applied' },
  { value: 'shortlisted', label: 'Shortlisted' },
  { value: 'round1', label: 'Round 1' },
  { value: 'round2', label: 'Round 2' },
  { value: 'round3', label: 'Round 3' },
  { value: 'offer', label: 'Offer' },
];

const AddApplicationDialog = ({ open, onOpenChange, onSubmit }) => {
  const [formData, setFormData] = useState({
    company: "",
    position: "",
    status: "applied",
    date_applied: new Date().toISOString().split('T')[0],
    salary_range: "",
    job_description: "",
    contact_person: "",
    contact_email: "",
    notes: "",
    company_logo: "",
    interview_date: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      company: "",
      position: "",
      status: "applied",
      date_applied: new Date().toISOString().split('T')[0],
      salary_range: "",
      job_description: "",
      contact_person: "",
      contact_email: "",
      notes: "",
      company_logo: "",
      interview_date: "",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" data-testid="add-application-dialog">
        <DialogHeader>
          <DialogTitle className="text-2xl">Add New Application</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company">Company *</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                required
                data-testid="input-company"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="position">Position *</Label>
              <Input
                id="position"
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                required
                data-testid="input-position"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger data-testid="select-status">
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
              <Label htmlFor="date_applied">Date Applied</Label>
              <Input
                id="date_applied"
                type="date"
                value={formData.date_applied}
                onChange={(e) => setFormData({ ...formData, date_applied: e.target.value })}
                data-testid="input-date-applied"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="salary_range">Salary Range</Label>
              <Input
                id="salary_range"
                placeholder="e.g., $80k - $120k"
                value={formData.salary_range}
                onChange={(e) => setFormData({ ...formData, salary_range: e.target.value })}
                data-testid="input-salary-range"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company_logo">Company Logo URL</Label>
              <Input
                id="company_logo"
                placeholder="https://..."
                value={formData.company_logo}
                onChange={(e) => setFormData({ ...formData, company_logo: e.target.value })}
                data-testid="input-company-logo"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contact_person">Contact Person</Label>
              <Input
                id="contact_person"
                value={formData.contact_person}
                onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
                data-testid="input-contact-person"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact_email">Contact Email</Label>
              <Input
                id="contact_email"
                type="email"
                value={formData.contact_email}
                onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                data-testid="input-contact-email"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="interview_date">Interview Date & Time</Label>
            <Input
              id="interview_date"
              type="datetime-local"
              value={formData.interview_date}
              onChange={(e) => setFormData({ ...formData, interview_date: e.target.value })}
              data-testid="input-interview-date"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="job_description">Job Description</Label>
            <Textarea
              id="job_description"
              value={formData.job_description}
              onChange={(e) => setFormData({ ...formData, job_description: e.target.value })}
              rows={4}
              data-testid="input-job-description"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={4}
              placeholder="Interview prep, follow-up reminders, etc."
              data-testid="input-notes"
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} data-testid="cancel-btn">
              Cancel
            </Button>
            <Button type="submit" data-testid="submit-application-btn">Add Application</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddApplicationDialog;