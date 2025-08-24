import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import HealthDiary from "./pages/HealthDiary";
import Summaries from "./pages/Summaries";
import Prescriptions from "./pages/Prescriptions";
import NotFound from "./pages/NotFound";
import VytalHero from "./pages/hero";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
  <Routes>
    {/* Standalone Hero page */}
    <Route path="/" element={<VytalHero />} />

    {/* Layout wrapper for all dashboard pages */}
    <Route element={<Layout />}>
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="diary" element={<HealthDiary />} />
      <Route path="summaries" element={<Summaries />} />
      <Route path="prescriptions" element={<Prescriptions />} />
    </Route>

    {/* Catch-all */}
    <Route path="*" element={<NotFound />} />
  </Routes>
</BrowserRouter>

    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
