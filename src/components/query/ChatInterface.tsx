
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { MessageType } from '@/types/query';
import { translateToSql, translateToNoSql } from '@/lib/database';
import { toast } from "@/lib/toast";
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import DatabaseTypeSelector from './DatabaseTypeSelector';

interface ChatInterfaceProps {
  messages: MessageType[];
  databaseType: 'sql' | 'nosql';
  onDatabaseTypeChange: (value: 'sql' | 'nosql') => void;
  updateMessages: (messages: MessageType[]) => void;
  onExecuteQuery: (query: string) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  databaseType,
  onDatabaseTypeChange,
  updateMessages,
  onExecuteQuery
}) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSendMessage = (userInput: string) => {
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
    
    // Ensure messages is an array
    const safeMessages = Array.isArray(messages) ? messages : [];
    const updatedMessages = [...safeMessages, userMessage];
    
    updateMessages(updatedMessages);
    setIsGenerating(true);
    
    // Simulate query generation
    setTimeout(() => {
      let generatedQuery = '';
      
      if (databaseType === 'sql') {
        generatedQuery = translateToSql(userMessage.text, databaseType);
      } else {
        generatedQuery = translateToNoSql(userMessage.text, databaseType);
      }
      
      // Extract just the query without the translation message
      const queryText = generatedQuery.replace(/^-- Translated query from:.*\n/, '');
      
      // Add system response with generated query
      const systemResponse: MessageType = {
        id: (Date.now() + 1).toString(),
        text: `Here's your ${databaseType.toUpperCase()} query:`,
        sender: 'system',
        timestamp: new Date(),
        query: queryText,
        isExecuted: false
      };
      
      updateMessages([...updatedMessages, systemResponse]);
      setIsGenerating(false);
    }, 1200);
  };

  return (
    <div className="flex flex-col h-full">
      <Card className="flex-1 flex flex-col overflow-hidden">
        <CardContent className="flex-1 p-4 overflow-hidden flex flex-col">
          <DatabaseTypeSelector 
            databaseType={databaseType} 
            onDatabaseTypeChange={onDatabaseTypeChange} 
          />
          
          <MessageList 
            messages={Array.isArray(messages) ? messages : []} 
            onExecuteQuery={onExecuteQuery} 
          />
          
          <ChatInput 
            onSendMessage={handleSendMessage} 
            isGenerating={isGenerating} 
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatInterface;
