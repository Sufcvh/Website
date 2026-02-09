import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { DndContext, DragOverlay, closestCorners, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus } from "lucide-react";
import { toast } from "sonner";
import KanbanColumn from "@/components/KanbanColumn";
import ApplicationCard from "@/components/ApplicationCard";
import AddApplicationDialog from "@/components/AddApplicationDialog";
import ApplicationDetailDialog from "@/components/ApplicationDetailDialog";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const STAGES = [
  { id: 'applied', label: 'Applied', color: 'bg-zinc-100' },
  { id: 'shortlisted', label: 'Shortlisted', color: 'bg-blue-50' },
  { id: 'round1', label: 'Round 1', color: 'bg-amber-50' },
  { id: 'round2', label: 'Round 2', color: 'bg-orange-50' },
  { id: 'round3', label: 'Round 3', color: 'bg-purple-50' },
  { id: 'offer', label: 'Offer', color: 'bg-emerald-50' },
];

const KanbanBoard = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [loading, setLoading] = useState(true);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

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

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeApp = applications.find(app => app.id === active.id);
    const newStatus = over.id;

    if (activeApp && activeApp.status !== newStatus) {
      try {
        await axios.put(`${API}/applications/${activeApp.id}`, {
          status: newStatus
        });
        
        setApplications(apps =>
          apps.map(app =>
            app.id === activeApp.id ? { ...app, status: newStatus } : app
          )
        );
        
        toast.success(`Moved to ${STAGES.find(s => s.id === newStatus)?.label}`);
      } catch (error) {
        console.error("Error updating application:", error);
        toast.error("Failed to update application");
      }
    }
  };

  const handleAddApplication = async (data) => {
    try {
      const response = await axios.post(`${API}/applications`, data);
      setApplications([...applications, response.data]);
      toast.success("Application added successfully");
      setShowAddDialog(false);
    } catch (error) {
      console.error("Error adding application:", error);
      toast.error("Failed to add application");
    }
  };

  const handleUpdateApplication = async (id, data) => {
    try {
      const response = await axios.put(`${API}/applications/${id}`, data);
      setApplications(apps => apps.map(app => app.id === id ? response.data : app));
      toast.success("Application updated successfully");
    } catch (error) {
      console.error("Error updating application:", error);
      toast.error("Failed to update application");
    }
  };

  const handleDeleteApplication = async (id) => {
    try {
      await axios.delete(`${API}/applications/${id}`);
      setApplications(apps => apps.filter(app => app.id !== id));
      toast.success("Application deleted successfully");
      setSelectedApp(null);
    } catch (error) {
      console.error("Error deleting application:", error);
      toast.error("Failed to delete application");
    }
  };

  const activeApp = applications.find(app => app.id === activeId);

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
                <h1 className="text-3xl font-bold tracking-tight" data-testid="kanban-title">Kanban Board</h1>
                <p className="text-sm text-muted-foreground mt-1">Drag and drop to update status</p>
              </div>
            </div>
            <Button
              onClick={() => setShowAddDialog(true)}
              data-testid="add-application-btn"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Application
            </Button>
          </div>
        </div>
      </header>

      {/* Kanban Board */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="flex overflow-x-auto gap-6 pb-4" data-testid="kanban-container">
            {STAGES.map(stage => (
              <KanbanColumn
                key={stage.id}
                stage={stage}
                applications={applications.filter(app => app.status === stage.id)}
                onCardClick={setSelectedApp}
              />
            ))}
          </div>

          <DragOverlay>
            {activeId && activeApp ? (
              <div className="opacity-90">
                <ApplicationCard application={activeApp} isDragging />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </main>

      {/* Dialogs */}
      <AddApplicationDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onSubmit={handleAddApplication}
      />

      <ApplicationDetailDialog
        application={selectedApp}
        onClose={() => setSelectedApp(null)}
        onUpdate={handleUpdateApplication}
        onDelete={handleDeleteApplication}
      />
    </div>
  );
};

export default KanbanBoard;