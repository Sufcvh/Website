import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import ApplicationCard from "./ApplicationCard";

const KanbanColumn = ({ stage, applications, onCardClick }) => {
  const { setNodeRef } = useDroppable({
    id: stage.id,
  });

  return (
    <div
      ref={setNodeRef}
      className="flex-shrink-0 w-80 flex flex-col bg-zinc-50/50 dark:bg-zinc-900/50 p-4 rounded-xl border border-zinc-200/50 dark:border-zinc-800/50 h-[calc(100vh-12rem)]"
      data-testid={`kanban-column-${stage.id}`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          {stage.label}
        </h3>
        <span className="text-sm bg-zinc-200 dark:bg-zinc-800 px-2 py-1 rounded" data-testid={`column-count-${stage.id}`}>
          {applications.length}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3">
        <SortableContext items={applications.map(app => app.id)} strategy={verticalListSortingStrategy}>
          {applications.map(app => (
            <ApplicationCard
              key={app.id}
              application={app}
              onClick={() => onCardClick(app)}
            />
          ))}
        </SortableContext>
      </div>
    </div>
  );
};

export default KanbanColumn;