import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import SortingPage from "./pages/SortingPage";
import GraphPage from "./pages/GraphPage";
import DPPage from "./pages/DPPage";
import DataStructuresPage from "./pages/DataStructuresPage";
import ComparisonPage from "./pages/ComparisonPage";
import PathfindingPage from "./pages/PathfindingPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/sorting" element={<SortingPage />} />
          <Route path="/comparison" element={<ComparisonPage />} />
          <Route path="/pathfinding" element={<PathfindingPage />} />
          <Route path="/graph" element={<GraphPage />} />
          <Route path="/dp" element={<DPPage />} />
          <Route path="/structures" element={<DataStructuresPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
