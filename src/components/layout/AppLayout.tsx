import { ReactNode, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from "@/components/ui/button";
import { 
  Database, 
  LogOut, 
  PanelLeft,
  Terminal,
  Plus
} from 'lucide-react';
import { toast } from "@/lib/toast";

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Load sessions from localStorage
  const getSessions = () => {
    const savedSessions = localStorage.getItem('query-sessions');
    return savedSessions ? JSON.parse(savedSessions) : [];
  };

  const sessions = getSessions();

  // Determine active route for navigation highlighting
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const handleLoadSession = (sessionId: string) => {
    // Find the session in localStorage
    const sessions = getSessions();
    const session = sessions.find((s: any) => s.id === sessionId);
    
    if (session) {
      // Set the current session in localStorage
      localStorage.setItem('current-session', JSON.stringify(session));
      
      // If already on query generator page, refresh the page to load the session
      if (location.pathname === '/query-generator') {
        window.location.reload();
      } else {
        // Otherwise navigate to query generator
        navigate('/query-generator');
      }
      
      toast.success(`Loaded session: ${session.name}`);
    }
  };

  const handleCreateNewSession = () => {
    const newSession = {
      id: Date.now().toString(),
      name: `Session ${sessions.length + 1}`,
      messages: [{
        id: '1',
        text: 'Hello! I can help you generate queries. What would you like to know?',
        sender: 'system',
        timestamp: new Date()
      }],
      databaseType: 'sql',
      dateCreated: new Date()
    };
    
    // Add new session to sessions in localStorage
    const updatedSessions = [...sessions, newSession];
    localStorage.setItem('query-sessions', JSON.stringify(updatedSessions));
    
    // Set current session
    localStorage.setItem('current-session', JSON.stringify(newSession));
    
    // Navigate to query generator or reload if already there
    if (location.pathname === '/query-generator') {
      window.location.reload();
    } else {
      navigate('/query-generator');
    }
    
    toast.success('New session created');
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-10">
        <div className="container-xl flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="h-6 w-6 text-primary" />
            <span className="text-xl font-medium">QueryGenie</span>
            
            {/* Navigation links in the title bar */}
            {user && (
              <div className="ml-8 flex items-center gap-4">
                <Button
                  variant={isActive('/query-generator') ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => navigate('/query-generator')}
                  className="gap-2"
                >
                  <Terminal className="h-4 w-4" />
                  <span className="hidden sm:inline">Query Generator</span>
                </Button>
              </div>
            )}
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
            
            {/* Sessions in sidebar */}
            <div className="p-2 md:p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className={`font-medium text-sm ${sidebarCollapsed ? 'hidden' : 'hidden md:block'}`}>
                  Sessions
                </h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCreateNewSession}
                  className="h-8 w-8"
                  title="Create New Session"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="space-y-1">
                {sessions.map((session: any) => (
                  <Button
                    key={session.id}
                    variant="ghost"
                    size="sm"
                    className={`w-full justify-start ${sidebarCollapsed ? 'px-2' : ''}`}
                    onClick={() => handleLoadSession(session.id)}
                  >
                    <Database className="h-4 w-4 mr-0 md:mr-2 flex-shrink-0" />
                    <span className={`${sidebarCollapsed ? 'hidden' : 'hidden md:inline'} truncate text-left`}>
                      {session.name}
                    </span>
                  </Button>
                ))}
                
                {sessions.length === 0 && (
                  <div className={`text-xs text-muted-foreground ${sidebarCollapsed ? 'hidden' : 'hidden md:block'} p-2`}>
                    No sessions yet
                  </div>
                )}
              </div>
            </div>
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
