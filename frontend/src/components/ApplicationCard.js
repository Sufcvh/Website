import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Briefcase, Calendar, DollarSign } from "lucide-react";
import { format, parseISO } from "date-fns";

const ApplicationCard = ({ application, onClick, isDragging = false }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: application.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isSortableDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className="group relative rounded-md border bg-card p-4 shadow-sm hover:shadow-md transition-all duration-200 cursor-grab active:cursor-grabbing hover:border-zinc-400 dark:hover:border-zinc-600"
      data-testid={`application-card-${application.id}`}
    >
      <div className="flex items-start gap-3">
        {application.company_logo ? (
          <img
            src={application.company_logo}
            alt={application.company}
            className="w-12 h-12 rounded object-cover flex-shrink-0"
          />
        ) : (
          <div className="w-12 h-12 rounded bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center flex-shrink-0">
            <Briefcase className="w-6 h-6 text-muted-foreground" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm truncate" data-testid={`card-company-${application.id}`}>{application.company}</h4>
          <p className="text-xs text-muted-foreground truncate" data-testid={`card-position-${application.id}`}>{application.position}</p>
        </div>
      </div>

      <div className="mt-3 space-y-1.5 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <Calendar className="w-3 h-3" />
          <span>Applied: {application.date_applied}</span>
        </div>
        {application.salary_range && (
          <div className="flex items-center gap-2">
            <DollarSign className="w-3 h-3" />
            <span>{application.salary_range}</span>
          </div>
        )}
        {application.interview_date && (
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-medium">
            <Calendar className="w-3 h-3" />
            <span>Interview: {format(parseISO(application.interview_date), 'MMM d, h:mm a')}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationCard;