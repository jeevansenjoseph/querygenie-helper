
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

  // Save sessions to localStorage when they change
  useEffect(() => {
    if (sessions.length > 0) {
      localStorage.setItem('query-sessions', JSON.stringify(sessions));
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
    localStorage.setItem('current-session', JSON.stringify(updatedSession));
    
    // Update session in sessions array
    setSessions(prev => {
      const updatedSessions = prev.map(session => 
        session.id === currentSession.id ? updatedSession : session
      );
      return updatedSessions;
    });
  };

  const saveSession = () => {
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

  const updateMessagesInSession = (newMessages: MessageType[]) => {
    setMessages(newMessages);
    
    // Update current session
    const updatedSession = {
      ...currentSession,
      messages: newMessages
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

  return {
    messages,
    setMessages,
    databaseType,
    setDatabaseType,
    sessions,
    currentSession,
    handleDatabaseTypeChange,
    saveSession,
    updateMessagesInSession
  };
};
