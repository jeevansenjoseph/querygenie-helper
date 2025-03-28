import { ReactNode, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from "@/components/ui/button";
import { 
  Database, 
  LogOut, 
  MessageSquare,
  Terminal,
  Plus,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { toast } from "@/lib/toast";
import ThemeToggle from '@/components/theme/ThemeToggle';
import { SessionType } from '@/types/query';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface AppLayoutProps {
  children: ReactNode;
  onCreateNewChat?: () => void;
  onLoadChat?: (chatId: string) => void;
  chatHistory?: SessionType[];
  currentChat?: SessionType;
}

const AppLayout = ({ 
  children, 
  onCreateNewChat,
  onLoadChat,
  chatHistory = [],
  currentChat
}: AppLayoutProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // Initialize from localStorage
  useEffect(() => {
    const savedState = localStorage.getItem('sidebar-collapsed');
    if (savedState) {
      setSidebarCollapsed(savedState === 'true');
    }
  }, []);
  
  // Save sidebar state to localStorage
  useEffect(() => {
    localStorage.setItem('sidebar-collapsed', String(sidebarCollapsed));
  }, [sidebarCollapsed]);

  // Determine active route for navigation highlighting
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleCreateNewChat = () => {
    if (onCreateNewChat) {
      onCreateNewChat();
    } else {
      const newChat = {
        id: Date.now().toString(),
        name: `Chat ${new Date().toLocaleString('en-US', { 
          month: 'short', 
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric'
        })}`,
        messages: [{
          id: '1',
          text: 'Hello! I can help you generate queries. What would you like to know?',
          sender: 'system',
          timestamp: new Date()
        }],
        databaseType: 'sql',
        dateCreated: new Date()
      };
      
      // Set current chat
      localStorage.setItem('current-chat', JSON.stringify(newChat));
      
      // Navigate to query generator or reload if already there
      if (location.pathname === '/query-generator') {
        window.location.reload();
      } else {
        navigate('/query-generator');
      }
      
      toast.success('New chat created');
    }
  };

  const handleLoadChat = (chatId: string) => {
    if (onLoadChat) {
      onLoadChat(chatId);
    } else {
      // Find the chat in localStorage
      const savedHistory = localStorage.getItem('query-history');
      const history = savedHistory ? JSON.parse(savedHistory) : [];
      const chat = history.find((c: any) => c.id === chatId);
      
      if (chat) {
        // Set the current chat in localStorage
        localStorage.setItem('current-chat', JSON.stringify(chat));
        
        // If already on query generator page, refresh the page to load the chat
        if (location.pathname === '/query-generator') {
          window.location.reload();
        } else {
          // Otherwise navigate to query generator
          navigate('/query-generator');
        }
        
        toast.success(`Loaded: ${chat.name}`);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col dark:bg-gray-900 transition-colors duration-200">
      {/* Header */}
      <header className="border-b bg-white/80 dark:bg-gray-800/80 backdrop-blur-md sticky top-0 z-10 transition-colors duration-200">
        <div className="container-xl flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="h-6 w-6 text-primary dark:text-white" />
            <span className="text-xl font-medium dark:text-white">QueryGenie</span>
            
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
            <ThemeToggle />
            
            {user && (
              <>
                <div className="text-sm font-medium text-muted-foreground hidden sm:block dark:text-gray-300">
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
            className={`${sidebarCollapsed ? 'w-16' : 'w-72'} transition-all duration-300 border-r 
              bg-white/80 dark:bg-gray-800/80 backdrop-blur-md h-[calc(100vh-4rem)] sticky top-16
              dark:border-gray-700`}
          >
            <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
              <h3 className={`font-medium ${sidebarCollapsed ? 'hidden' : 'block'} dark:text-white`}>
                Chat History
              </h3>
              <div className="flex items-center gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleCreateNewChat}
                        className="h-8 w-8 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>New Chat</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                        className="h-8 w-8 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
                      >
                        {sidebarCollapsed ? (
                          <ChevronRight className="h-4 w-4" />
                        ) : (
                          <ChevronLeft className="h-4 w-4" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
            
            {/* Chat history */}
            <ScrollArea className="h-[calc(100%-60px)]">
              <div className="p-2">
                {Array.isArray(chatHistory) && chatHistory.length > 0 ? (
                  chatHistory.map((chat: SessionType) => (
                    <Button
                      key={chat.id}
                      variant="ghost"
                      size="sm"
                      className={`w-full justify-start mb-1 ${
                        currentChat?.id === chat.id ? 'bg-accent' : ''
                      } ${sidebarCollapsed ? 'px-2' : ''}`}
                      onClick={() => handleLoadChat(chat.id)}
                    >
                      <MessageSquare className="h-4 w-4 mr-0 md:mr-2 flex-shrink-0" />
                      {!sidebarCollapsed && (
                        <div className="flex flex-col items-start overflow-hidden w-full">
                          <span className="truncate text-left w-full font-medium">
                            {chat.name}
                          </span>
                          <span className="text-xs text-muted-foreground truncate w-full">
                            {new Date(chat.dateCreated).toLocaleString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: 'numeric',
                              minute: 'numeric'
                            })}
                          </span>
                        </div>
                      )}
                    </Button>
                  ))
                ) : (
                  <div className={`text-xs text-muted-foreground ${sidebarCollapsed ? 'hidden' : 'block'} p-2`}>
                    No chat history yet
                  </div>
                )}
              </div>
            </ScrollArea>
          </aside>
        )}
        
        {/* Content area */}
        <main className="flex-1 animate-fade-in dark:bg-gray-900 transition-colors duration-200">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
