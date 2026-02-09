import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "@/pages/Dashboard";
import KanbanBoard from "@/pages/KanbanBoard";
import CalendarView from "@/pages/CalendarView";
import { Toaster } from "sonner";
import "@/App.css";

function App() {
  return (
    <div className="App">
      <Toaster position="top-right" richColors />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/kanban" element={<KanbanBoard />} />
          <Route path="/calendar" element={<CalendarView />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;