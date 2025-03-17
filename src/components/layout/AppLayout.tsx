
import { ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from "@/components/ui/button";
import { 
  Database, 
  Home, 
  KeyRound, 
  LogOut, 
  Moon, 
  Settings, 
  Sun, 
  Terminal, 
  User
} from 'lucide-react';

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

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
          <aside className="w-16 md:w-64 border-r bg-white/80 backdrop-blur-md h-[calc(100vh-4rem)] sticky top-16">
            <nav className="flex flex-col p-2 md:p-4 gap-1 md:gap-2">
              <Button
                variant={isActive('/select-database') ? "secondary" : "ghost"}
                className={`justify-start ${isActive('/select-database') ? 'bg-secondary font-medium' : ''}`}
                onClick={() => navigate('/select-database')}
              >
                <Database className="h-5 w-5 mr-0 md:mr-2" />
                <span className="hidden md:inline">Database Selection</span>
              </Button>
              
              <Button
                variant={isActive('/sql-generation') ? "secondary" : "ghost"}
                className={`justify-start ${isActive('/sql-generation') ? 'bg-secondary font-medium' : ''}`}
                onClick={() => navigate('/sql-generation')}
              >
                <Terminal className="h-5 w-5 mr-0 md:mr-2" />
                <span className="hidden md:inline">SQL Generation</span>
              </Button>
              
              <Button
                variant={isActive('/nosql-generation') ? "secondary" : "ghost"}
                className={`justify-start ${isActive('/nosql-generation') ? 'bg-secondary font-medium' : ''}`}
                onClick={() => navigate('/nosql-generation')}
              >
                <Terminal className="h-5 w-5 mr-0 md:mr-2" />
                <span className="hidden md:inline">NoSQL Generation</span>
              </Button>
              
              <Button
                variant={isActive('/sql-results') ? "secondary" : "ghost"}
                className={`justify-start ${isActive('/sql-results') ? 'bg-secondary font-medium' : ''}`}
                onClick={() => navigate('/sql-results')}
              >
                <Database className="h-5 w-5 mr-0 md:mr-2" />
                <span className="hidden md:inline">SQL Results</span>
              </Button>
              
              <Button
                variant={isActive('/nosql-results') ? "secondary" : "ghost"}
                className={`justify-start ${isActive('/nosql-results') ? 'bg-secondary font-medium' : ''}`}
                onClick={() => navigate('/nosql-results')}
              >
                <Database className="h-5 w-5 mr-0 md:mr-2" />
                <span className="hidden md:inline">NoSQL Results</span>
              </Button>
            </nav>
          </aside>
        )}
        
        {/* Content area */}
        <main className="flex-1 p-4 md:p-6 animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
