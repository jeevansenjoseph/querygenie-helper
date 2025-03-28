
import { useState, useEffect } from 'react';
import { MessageType, SessionType } from '@/types/query';
import { toast } from "@/lib/toast";

export const useSessionManager = () => {
  // Chat and query state
  const [messages, setMessages] = useState<MessageType[]>([
    {
      id: '1',
      text: 'Hello! I can help you generate queries. What would you like to know?',
      sender: 'system',
      timestamp: new Date()
    }
  ]);

  // Database type state
  const [databaseType, setDatabaseType] = useState<'sql' | 'nosql'>('sql');
  
  // Sessions state
  const [sessions, setSessions] = useState<SessionType[]>([]);
  const [currentSession, setCurrentSession] = useState<SessionType>({
    id: '1',
    name: 'New Session',
    messages: [...messages],
    databaseType,
    dateCreated: new Date()
  });

  // Load sessions from localStorage on mount
  useEffect(() => {
    try {
      const savedSessions = localStorage.getItem('query-sessions');
      if (savedSessions) {
        const parsedSessions = JSON.parse(savedSessions);
        if (Array.isArray(parsedSessions)) {
          setSessions(parsedSessions);
          
          // Check for current session
          const currentSessionData = localStorage.getItem('current-session');
          if (currentSessionData) {
            try {
              const parsedCurrentSession = JSON.parse(currentSessionData);
              
              // Ensure currentSession has valid structure
              if (parsedCurrentSession && typeof parsedCurrentSession === 'object') {
                setCurrentSession(parsedCurrentSession);
                
                // Ensure messages is always an array
                const sessionMessages = Array.isArray(parsedCurrentSession.messages) 
                  ? parsedCurrentSession.messages 
                  : [];
                
                setMessages(sessionMessages);
                setDatabaseType(parsedCurrentSession.databaseType || 'sql');
              }
            } catch (error) {
              console.error("Error parsing current session:", error);
              // Fall back to default session
              localStorage.removeItem('current-session');
            }
          } else if (parsedSessions.length > 0) {
            // Set current session to the last one if no current session
            const lastSession = parsedSessions[parsedSessions.length - 1];
            if (lastSession && typeof lastSession === 'object') {
              setCurrentSession(lastSession);
              
              // Ensure messages is always an array
              const sessionMessages = Array.isArray(lastSession.messages) 
                ? lastSession.messages 
                : [];
              
              setMessages(sessionMessages);
              setDatabaseType(lastSession.databaseType || 'sql');
            }
          }
        }
      }
    } catch (error) {
      console.error("Error loading sessions:", error);
      // Fallback to empty sessions if there's an error
      localStorage.removeItem('query-sessions');
      localStorage.removeItem('current-session');
    }
  }, []);

  // Save sessions to localStorage when they change
  useEffect(() => {
    if (Array.isArray(sessions) && sessions.length > 0) {
      try {
        localStorage.setItem('query-sessions', JSON.stringify(sessions));
      } catch (error) {
        console.error("Error saving sessions:", error);
      }
    }
  }, [sessions]);

  const handleDatabaseTypeChange = (value: 'sql' | 'nosql') => {
    setDatabaseType(value);
    
    // Update current session
    const updatedSession = {
      ...currentSession,
      databaseType: value
    };
    setCurrentSession(updatedSession);
    
    try {
      localStorage.setItem('current-session', JSON.stringify(updatedSession));
      
      // Update session in sessions array
      if (Array.isArray(sessions)) {
        setSessions(prev => {
          if (!Array.isArray(prev)) {
            return [updatedSession];
          }
          
          const updatedSessions = prev.map(session => 
            session.id === currentSession.id ? updatedSession : session
          );
          return updatedSessions;
        });
      }
    } catch (error) {
      console.error("Error updating database type:", error);
    }
  };

  const updateMessagesInSession = (newMessages: MessageType[]) => {
    if (!Array.isArray(newMessages)) {
      console.error("updateMessagesInSession received non-array:", newMessages);
      newMessages = [];
    }
    
    setMessages(newMessages);
    
    // Update current session
    const updatedSession = {
      ...currentSession,
      messages: newMessages
    };
    setCurrentSession(updatedSession);
    
    try {
      localStorage.setItem('current-session', JSON.stringify(updatedSession));
      
      // Update session in sessions array
      if (Array.isArray(sessions)) {
        setSessions(prev => {
          if (!Array.isArray(prev)) {
            console.error("Sessions state is not an array:", prev);
            return [updatedSession];
          }
          
          const updatedSessions = prev.map(session => 
            session.id === currentSession.id ? updatedSession : session
          );
          return updatedSessions;
        });
      }
    } catch (error) {
      console.error("Error updating messages in session:", error);
    }
  };

  return {
    messages,
    setMessages,
    databaseType,
    setDatabaseType,
    sessions,
    currentSession,
    handleDatabaseTypeChange,
    updateMessagesInSession
  };
};
