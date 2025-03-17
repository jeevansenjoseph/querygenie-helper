
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import SelectDatabase from "./pages/SelectDatabase";
import SqlGeneration from "./pages/SqlGeneration";
import NoSqlGeneration from "./pages/NoSqlGeneration";
import SqlResults from "./pages/SqlResults";
import NoSqlResults from "./pages/NoSqlResults";
import NotFound from "./pages/NotFound";
import AuthGuard from "./components/layout/AuthGuard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
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
              path="/select-database" 
              element={
                <AuthGuard>
                  <SelectDatabase />
                </AuthGuard>
              } 
            />
            <Route 
              path="/sql-generation" 
              element={
                <AuthGuard>
                  <SqlGeneration />
                </AuthGuard>
              } 
            />
            <Route 
              path="/nosql-generation" 
              element={
                <AuthGuard>
                  <NoSqlGeneration />
                </AuthGuard>
              } 
            />
            <Route 
              path="/sql-results" 
              element={
                <AuthGuard>
                  <SqlResults />
                </AuthGuard>
              } 
            />
            <Route 
              path="/nosql-results" 
              element={
                <AuthGuard>
                  <NoSqlResults />
                </AuthGuard>
              } 
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
