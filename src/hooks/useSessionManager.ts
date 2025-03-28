
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
  
  // Sessions state - now we'll store these as chat history
  const [chatHistory, setChatHistory] = useState<SessionType[]>([]);
  const [currentChat, setCurrentChat] = useState<SessionType>({
    id: Date.now().toString(),
    name: `Chat ${new Date().toLocaleString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    })}`,
    messages: [...messages],
    databaseType,
    dateCreated: new Date()
  });

  // Load chat history from localStorage on mount
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('query-history');
      if (savedHistory) {
        const parsedHistory = JSON.parse(savedHistory);
        if (Array.isArray(parsedHistory)) {
          setChatHistory(parsedHistory);
          
          // Check for current chat
          const currentChatData = localStorage.getItem('current-chat');
          if (currentChatData) {
            try {
              const parsedCurrentChat = JSON.parse(currentChatData);
              
              // Ensure currentChat has valid structure
              if (parsedCurrentChat && typeof parsedCurrentChat === 'object') {
                setCurrentChat(parsedCurrentChat);
                
                // Ensure messages is always an array
                const chatMessages = Array.isArray(parsedCurrentChat.messages) 
                  ? parsedCurrentChat.messages 
                  : [];
                
                setMessages(chatMessages);
                setDatabaseType(parsedCurrentChat.databaseType || 'sql');
              }
            } catch (error) {
              console.error("Error parsing current chat:", error);
              localStorage.removeItem('current-chat');
            }
          } else if (parsedHistory.length > 0) {
            // Set current chat to the last one if no current chat
            const lastChat = parsedHistory[parsedHistory.length - 1];
            if (lastChat && typeof lastChat === 'object') {
              setCurrentChat(lastChat);
              
              // Ensure messages is always an array
              const chatMessages = Array.isArray(lastChat.messages) 
                ? lastChat.messages 
                : [];
              
              setMessages(chatMessages);
              setDatabaseType(lastChat.databaseType || 'sql');
            }
          }
        }
      }
    } catch (error) {
      console.error("Error loading chat history:", error);
      localStorage.removeItem('query-history');
      localStorage.removeItem('current-chat');
    }
  }, []);

  // Save chat history to localStorage when it changes
  useEffect(() => {
    if (Array.isArray(chatHistory) && chatHistory.length > 0) {
      try {
        localStorage.setItem('query-history', JSON.stringify(chatHistory));
      } catch (error) {
        console.error("Error saving chat history:", error);
      }
    }
  }, [chatHistory]);

  // Auto save current chat when messages change
  useEffect(() => {
    if (Array.isArray(messages) && messages.length > 0) {
      const updatedChat = {
        ...currentChat,
        messages: [...messages],
        lastUpdated: new Date()
      };
      
      setCurrentChat(updatedChat);
      
      try {
        localStorage.setItem('current-chat', JSON.stringify(updatedChat));
        
        // Update chat in history
        setChatHistory(prev => {
          const updatedHistory = Array.isArray(prev) ? [...prev] : [];
          const chatIndex = updatedHistory.findIndex(chat => chat.id === currentChat.id);
          
          if (chatIndex >= 0) {
            updatedHistory[chatIndex] = updatedChat;
          } else {
            updatedHistory.push(updatedChat);
          }
          
          return updatedHistory;
        });
      } catch (error) {
        console.error("Error auto-saving chat:", error);
      }
    }
  }, [messages]);

  const handleDatabaseTypeChange = (value: 'sql' | 'nosql') => {
    setDatabaseType(value);
    
    // Update current chat
    const updatedChat = {
      ...currentChat,
      databaseType: value
    };
    setCurrentChat(updatedChat);
    
    try {
      localStorage.setItem('current-chat', JSON.stringify(updatedChat));
      
      // Update chat in history
      setChatHistory(prev => {
        if (!Array.isArray(prev)) {
          return [updatedChat];
        }
        
        const chatIndex = prev.findIndex(chat => chat.id === currentChat.id);
        const updatedHistory = [...prev];
        
        if (chatIndex >= 0) {
          updatedHistory[chatIndex] = updatedChat;
        } else {
          updatedHistory.push(updatedChat);
        }
        
        return updatedHistory;
      });
    } catch (error) {
      console.error("Error updating database type:", error);
    }
  };

  const updateMessagesInChat = (newMessages: MessageType[]) => {
    if (!Array.isArray(newMessages)) {
      console.error("updateMessagesInChat received non-array:", newMessages);
      newMessages = [];
    }
    
    setMessages(newMessages);
    
    // Update current chat
    const updatedChat = {
      ...currentChat,
      messages: newMessages,
      lastUpdated: new Date()
    };
    setCurrentChat(updatedChat);
    
    try {
      localStorage.setItem('current-chat', JSON.stringify(updatedChat));
      
      // Update chat in history
      setChatHistory(prev => {
        if (!Array.isArray(prev)) {
          console.error("Chat history state is not an array:", prev);
          return [updatedChat];
        }
        
        const chatIndex = prev.findIndex(chat => chat.id === currentChat.id);
        const updatedHistory = [...prev];
        
        if (chatIndex >= 0) {
          updatedHistory[chatIndex] = updatedChat;
        } else {
          updatedHistory.push(updatedChat);
        }
        
        return updatedHistory;
      });
    } catch (error) {
      console.error("Error updating messages in chat:", error);
    }
  };

  const createNewChat = () => {
    const welcomeMessage: MessageType = {
      id: '1',
      text: 'Hello! I can help you generate queries. What would you like to know?',
      sender: 'system' as 'system', // Explicitly type as 'system'
      timestamp: new Date()
    };

    const newChat: SessionType = {
      id: Date.now().toString(),
      name: `Chat ${new Date().toLocaleString('en-US', { 
        month: 'short', 
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
      })}`,
      messages: [welcomeMessage],
      databaseType: 'sql',
      dateCreated: new Date()
    };
    
    setCurrentChat(newChat);
    setMessages(newChat.messages);
    setDatabaseType('sql');
    
    try {
      localStorage.setItem('current-chat', JSON.stringify(newChat));
      
      // Add to history
      setChatHistory(prev => {
        const updatedHistory = Array.isArray(prev) ? [...prev] : [];
        updatedHistory.push(newChat);
        return updatedHistory;
      });
      
      toast.success('New chat created');
    } catch (error) {
      console.error("Error creating new chat:", error);
    }
  };

  const loadChat = (chatId: string) => {
    if (!Array.isArray(chatHistory)) return;
    
    const chat = chatHistory.find(c => c.id === chatId);
    if (!chat) return;
    
    setCurrentChat(chat);
    setMessages(Array.isArray(chat.messages) ? chat.messages : []);
    setDatabaseType(chat.databaseType || 'sql');
    
    try {
      localStorage.setItem('current-chat', JSON.stringify(chat));
      toast.success(`Loaded: ${chat.name}`);
    } catch (error) {
      console.error("Error loading chat:", error);
    }
  };

  return {
    messages,
    setMessages,
    databaseType,
    setDatabaseType,
    chatHistory,
    currentChat,
    handleDatabaseTypeChange,
    updateMessagesInChat,
    createNewChat,
    loadChat
  };
};
