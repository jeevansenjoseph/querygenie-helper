
import { ReactNode, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from "@/components/ui/button";
import { 
  Database, 
  Home, 
  LogOut, 
  PanelLeft,
  Terminal
} from 'lucide-react';

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Determine active route for navigation highlighting
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-10">
        <div className="container-xl flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="h-6 w-6 text-primary" />
            <span className="text-xl font-medium">QueryGenie</span>
          </div>
          
          <div className="flex items-center gap-4">
            {user && (
              <>
                <div className="text-sm font-medium text-muted-foreground hidden sm:block">
                  Welcome, {user.name}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => logout()}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="sr-only">Logout</span>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex">
        {/* Sidebar */}
        {user && (
          <aside 
            className={`${sidebarCollapsed ? 'w-16' : 'w-16 md:w-64'} transition-all duration-300 border-r bg-white/80 backdrop-blur-md h-[calc(100vh-4rem)] sticky top-16`}
          >
            <div className="flex justify-end p-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="text-muted-foreground hover:text-foreground md:flex"
              >
                <PanelLeft className="h-5 w-5" />
                <span className="sr-only">Toggle Sidebar</span>
              </Button>
            </div>
            <nav className="flex flex-col p-2 md:p-4 gap-1 md:gap-2">
              <Button
                variant={isActive('/query-generator') ? "secondary" : "ghost"}
                className={`justify-start ${isActive('/query-generator') ? 'bg-secondary font-medium' : ''}`}
                onClick={() => navigate('/query-generator')}
              >
                <Terminal className="h-5 w-5 mr-0 md:mr-2" />
                <span className={`${sidebarCollapsed ? 'hidden' : 'hidden md:inline'}`}>Query Generator</span>
              </Button>
              
              {/* Home button for future use */}
              <Button
                variant={isActive('/') ? "secondary" : "ghost"}
                className={`justify-start ${isActive('/') ? 'bg-secondary font-medium' : ''}`}
                onClick={() => navigate('/')}
              >
                <Home className="h-5 w-5 mr-0 md:mr-2" />
                <span className={`${sidebarCollapsed ? 'hidden' : 'hidden md:inline'}`}>Home</span>
              </Button>
            </nav>
          </aside>
        )}
        
        {/* Content area */}
        <main className="flex-1 animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
