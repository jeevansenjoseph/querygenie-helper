
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "next-themes";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import QueryGenerator from "./pages/QueryGenerator";
import NotFound from "./pages/NotFound";
import AuthGuard from "./components/layout/AuthGuard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route 
                path="/query-generator" 
                element={
                  <AuthGuard>
                    <QueryGenerator />
                  </AuthGuard>
                } 
              />
              {/* Redirect from select-database to query-generator */}
              <Route path="/select-database" element={<Navigate to="/query-generator" replace />} />
              <Route path="/sql-generation" element={<Navigate to="/query-generator" replace />} />
              <Route path="/nosql-generation" element={<Navigate to="/query-generator" replace />} />
              <Route path="/sql-results" element={<Navigate to="/query-generator" replace />} />
              <Route path="/nosql-results" element={<Navigate to="/query-generator" replace />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
