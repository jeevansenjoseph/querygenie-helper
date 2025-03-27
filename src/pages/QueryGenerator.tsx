
import { useState, useEffect, useRef } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Clipboard, FileDown, Loader2, Sparkles, MessageCircle, Save } from 'lucide-react';
import { translateToSql, translateToNoSql, generateMockSqlResults, generateMockNoSqlResults } from '@/lib/database';
import { toast } from "@/lib/toast";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

type MessageType = {
  id: string;
  text: string;
  sender: 'user' | 'system';
  timestamp: Date;
  query?: string;
  isExecuted?: boolean;
};

type SessionType = {
  id: string;
  name: string;
  messages: MessageType[];
  databaseType: 'sql' | 'nosql';
  dateCreated: Date;
};

const QueryGenerator = () => {
  // Database type state
  const [databaseType, setDatabaseType] = useState<'sql' | 'nosql'>('sql');
  
  // Chat and query state
  const [userInput, setUserInput] = useState('');
  const [messages, setMessages] = useState<MessageType[]>([
    {
      id: '1',
      text: 'Hello! I can help you generate queries. What would you like to know?',
      sender: 'system',
      timestamp: new Date()
    }
  ]);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Results state
  const [activeQuery, setActiveQuery] = useState<string | null>(null);
  const [queryResults, setQueryResults] = useState<any>(null);
  const [isLoadingResults, setIsLoadingResults] = useState(false);
  
  // Sessions state
  const [sessions, setSessions] = useState<SessionType[]>([]);
  const [currentSession, setCurrentSession] = useState<SessionType>({
    id: '1',
    name: 'New Session',
    messages: [...messages],
    databaseType,
    dateCreated: new Date()
  });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load sessions from localStorage on mount
  useEffect(() => {
    const savedSessions = localStorage.getItem('query-sessions');
    if (savedSessions) {
      const parsedSessions = JSON.parse(savedSessions);
      setSessions(parsedSessions);
      
      // Check for current session
      const currentSessionData = localStorage.getItem('current-session');
      if (currentSessionData) {
        const parsedCurrentSession = JSON.parse(currentSessionData);
        setCurrentSession(parsedCurrentSession);
        setMessages(parsedCurrentSession.messages);
        setDatabaseType(parsedCurrentSession.databaseType);
      } else if (parsedSessions.length > 0) {
        // Set current session to the last one if no current session
        const lastSession = parsedSessions[parsedSessions.length - 1];
        setCurrentSession(lastSession);
        setMessages(lastSession.messages);
        setDatabaseType(lastSession.databaseType);
      }
    }
  }, []);

  // Scroll to bottom of messages when new message is added
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Save sessions to localStorage when they change
  useEffect(() => {
    if (sessions.length > 0) {
      localStorage.setItem('query-sessions', JSON.stringify(sessions));
    }
  }, [sessions]);

  const handleSendMessage = () => {
    if (!userInput.trim()) {
      toast.error('Please enter a message');
      return;
    }
    
    // Add user message
    const userMessage: MessageType = {
      id: Date.now().toString(),
      text: userInput,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setUserInput('');
    setIsGenerating(true);
    
    // Simulate query generation
    setTimeout(() => {
      let generatedQuery = '';
      
      if (databaseType === 'sql') {
        generatedQuery = translateToSql(userMessage.text);
      } else {
        generatedQuery = translateToNoSql(userMessage.text);
      }
      
      // Add system response with generated query
      const systemResponse: MessageType = {
        id: (Date.now() + 1).toString(),
        text: `Here's your ${databaseType.toUpperCase()} query:`,
        sender: 'system',
        timestamp: new Date(),
        query: generatedQuery,
        isExecuted: false
      };
      
      setMessages(prev => [...prev, systemResponse]);
      setIsGenerating(false);
      
      // Update current session
      const updatedSession = {
        ...currentSession,
        messages: [...messages, userMessage, systemResponse],
        databaseType
      };
      setCurrentSession(updatedSession);
      localStorage.setItem('current-session', JSON.stringify(updatedSession));
      
      // Update session in sessions array
      setSessions(prev => {
        const updatedSessions = prev.map(session => 
          session.id === currentSession.id ? updatedSession : session
        );
        return updatedSessions;
      });
    }, 1200);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleExecuteQuery = (query: string) => {
    setActiveQuery(query);
    setIsLoadingResults(true);
    
    // Simulate query execution
    setTimeout(() => {
      if (databaseType === 'sql') {
        const results = generateMockSqlResults(query);
        setQueryResults(results);
      } else {
        const results = generateMockNoSqlResults(query);
        setQueryResults(results);
      }
      
      setIsLoadingResults(false);
      
      // Mark the query as executed
      setMessages(prev => 
        prev.map(msg => 
          msg.query === query ? { ...msg, isExecuted: true } : msg
        )
      );
      
      toast.success('Query executed successfully');
    }, 1000);
  };

  const handleDatabaseTypeChange = (value: 'sql' | 'nosql') => {
    setDatabaseType(value);
    
    // Update current session
    const updatedSession = {
      ...currentSession,
      databaseType: value
    };
    setCurrentSession(updatedSession);
    localStorage.setItem('current-session', JSON.stringify(updatedSession));
    
    // Update session in sessions array
    setSessions(prev => {
      const updatedSessions = prev.map(session => 
        session.id === currentSession.id ? updatedSession : session
      );
      return updatedSessions;
    });
  };

  const handleSaveSession = () => {
    // Update current session in sessions array
    const updatedSession = {
      ...currentSession,
      messages,
      databaseType
    };
    
    setSessions(prev => {
      const updatedSessions = prev.map(session => 
        session.id === currentSession.id ? updatedSession : session
      );
      return updatedSessions;
    });
    
    localStorage.setItem('current-session', JSON.stringify(updatedSession));
    toast.success('Session saved');
  };

  const handleExportResults = () => {
    if (!queryResults) return;
    
    if (databaseType === 'sql') {
      // Export as CSV for SQL results
      const headers = queryResults.columns.join(',');
      const rows = queryResults.rows.map((row: any) => 
        queryResults.columns.map((col: string) => `"${row[col]}"`).join(',')
      ).join('\n');
      
      const csv = `${headers}\n${rows}`;
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.setAttribute('hidden', '');
      a.setAttribute('href', url);
      a.setAttribute('download', 'sql_results.csv');
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      // Export as JSON for NoSQL results
      const json = JSON.stringify(queryResults, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.setAttribute('hidden', '');
      a.setAttribute('href', url);
      a.setAttribute('download', 'nosql_results.json');
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
    
    toast.success(`Results exported as ${databaseType === 'sql' ? 'CSV' : 'JSON'}`);
  };

  const handleCopyQuery = (query: string) => {
    navigator.clipboard.writeText(query);
    toast.success('Query copied to clipboard');
  };

  return (
    <AppLayout>
      <div className="container-xl py-4 animate-fade-in">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[calc(100vh-120px)]">
          {/* Left Column - Query Generation */}
          <div className="flex flex-col h-full">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-2">
                <Label>Database Type:</Label>
                <Select 
                  value={databaseType} 
                  onValueChange={(value) => handleDatabaseTypeChange(value as 'sql' | 'nosql')}
                >
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Select database type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sql">SQL</SelectItem>
                    <SelectItem value="nosql">NoSQL</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleSaveSession}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
              </div>
            </div>
            
            <Card className="flex-1 flex flex-col overflow-hidden">
              <CardContent className="flex-1 p-4 overflow-hidden flex flex-col">
                <div className="flex-1 overflow-y-auto pr-1 mb-4 space-y-4">
                  {messages.map((message) => (
                    <div 
                      key={message.id} 
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div 
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.sender === 'user' 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-muted'
                        }`}
                      >
                        <p className="whitespace-pre-wrap break-words">{message.text}</p>
                        {message.query && (
                          <div className="mt-2 mb-3 relative">
                            <div className="bg-background bg-opacity-10 rounded p-2 font-mono text-sm">
                              <pre className="overflow-x-auto pr-2">{message.query}</pre>
                            </div>
                          </div>
                        )}
                        {message.query && (
                          <div className="flex space-x-2 mt-2">
                            <Button 
                              size="sm"
                              variant="secondary"
                              className="h-8 rounded-full"
                              onClick={() => handleCopyQuery(message.query!)}
                            >
                              <Clipboard className="h-4 w-4 mr-1" />
                              Copy
                            </Button>
                            <Button 
                              size="sm"
                              variant={message.isExecuted ? "ghost" : "secondary"}
                              className={`h-8 rounded-full ${message.isExecuted ? 'bg-green-100 text-green-700' : ''}`}
                              onClick={() => handleExecuteQuery(message.query!)}
                            >
                              <Sparkles className="h-4 w-4 mr-1" />
                              {message.isExecuted ? 'Executed' : 'Execute'}
                            </Button>
                          </div>
                        )}
                        <div className="text-xs mt-1 opacity-70">
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
                
                <div className="relative">
                  <Textarea
                    placeholder="Type your query in natural language..."
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="pr-12 resize-none"
                    rows={3}
                  />
                  <Button 
                    className="absolute bottom-2 right-2"
                    size="sm"
                    onClick={handleSendMessage}
                    disabled={isGenerating || !userInput.trim()}
                  >
                    {isGenerating ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <MessageCircle className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Right Column - Query Results */}
          <div className="flex flex-col h-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                Query Results
              </h2>
              
              {queryResults && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleExportResults}
                  className="gap-2"
                >
                  <FileDown className="h-4 w-4" />
                  Export {databaseType === 'sql' ? 'CSV' : 'JSON'}
                </Button>
              )}
            </div>
            
            <Card className="flex-1 overflow-hidden">
              <CardContent className="p-4 h-full overflow-auto">
                {isLoadingResults ? (
                  <div className="h-full flex items-center justify-center">
                    <div className="animate-pulse space-y-4 w-full">
                      <div className="h-10 bg-muted rounded-md w-full"></div>
                      <div className="h-32 bg-muted rounded-md w-full"></div>
                    </div>
                  </div>
                ) : activeQuery ? (
                  <div className="space-y-4">
                    <div className="text-sm font-medium flex items-center">
                      Executed Query:
                      <pre className="ml-2 text-xs text-muted-foreground overflow-auto p-2 bg-muted/60 rounded">
                        <code>{activeQuery}</code>
                      </pre>
                    </div>
                    
                    {queryResults ? (
                      databaseType === 'sql' ? (
                        <div className="overflow-x-auto">
                          <div className="inline-block min-w-full align-middle">
                            <div className="overflow-hidden border rounded-lg">
                              <table className="min-w-full divide-y divide-border">
                                <thead className="bg-muted/50">
                                  <tr>
                                    {queryResults.columns.map((column: string, index: number) => (
                                      <th
                                        key={index}
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                                      >
                                        {column}
                                      </th>
                                    ))}
                                  </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-border">
                                  {queryResults.rows.map((row: any, rowIndex: number) => (
                                    <tr key={rowIndex} className="hover:bg-muted/30">
                                      {queryResults.columns.map((column: string, colIndex: number) => (
                                        <td
                                          key={colIndex}
                                          className="px-6 py-4 whitespace-nowrap text-sm"
                                        >
                                          {row[column]?.toString()}
                                        </td>
                                      ))}
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                            <p className="text-sm text-muted-foreground mt-2">
                              {queryResults.rows.length} row{queryResults.rows.length !== 1 ? 's' : ''} returned
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {queryResults.map((item: any, index: number) => (
                            <div 
                              key={index} 
                              className="border rounded-lg p-4 hover:bg-muted/30 transition-colors"
                            >
                              <pre className="text-sm whitespace-pre-wrap overflow-auto">
                                {JSON.stringify(item, null, 2)}
                              </pre>
                            </div>
                          ))}
                          <p className="text-sm text-muted-foreground mt-2">
                            {queryResults.length} document{queryResults.length !== 1 ? 's' : ''} returned
                          </p>
                        </div>
                      )
                    ) : (
                      <div className="text-center py-10">
                        <p className="text-muted-foreground">No results available</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      <p>Generate a query and execute it to see results here</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default QueryGenerator;
