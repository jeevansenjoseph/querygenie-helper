
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save } from 'lucide-react';
import { MessageType } from '@/types/query';
import { translateToSql, translateToNoSql } from '@/lib/database';
import { toast } from "@/lib/toast";
import MessageList from './MessageList';
import ChatInput from './ChatInput';

interface ChatInterfaceProps {
  messages: MessageType[];
  databaseType: 'sql' | 'nosql';
  onDatabaseTypeChange: (value: 'sql' | 'nosql') => void;
  onSaveSession: () => void;
  updateMessages: (messages: MessageType[]) => void;
  onExecuteQuery: (query: string) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  databaseType,
  onDatabaseTypeChange,
  onSaveSession,
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
    
    const updatedMessages = [...messages, userMessage];
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
      
      // Add system response with generated query
      const systemResponse: MessageType = {
        id: (Date.now() + 1).toString(),
        text: `Here's your ${databaseType.toUpperCase()} query:`,
        sender: 'system',
        timestamp: new Date(),
        query: generatedQuery,
        isExecuted: false
      };
      
      updateMessages([...updatedMessages, systemResponse]);
      setIsGenerating(false);
    }, 1200);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <Label>Database Type:</Label>
          <Select 
            value={databaseType} 
            onValueChange={(value) => onDatabaseTypeChange(value as 'sql' | 'nosql')}
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
        
        <Button 
          variant="outline" 
          size="sm"
          onClick={onSaveSession}
          className="gap-2"
        >
          <Save className="h-4 w-4 mr-2" />
          Save
        </Button>
      </div>
      
      <Card className="flex-1 flex flex-col overflow-hidden">
        <CardContent className="flex-1 p-4 overflow-hidden flex flex-col">
          <MessageList 
            messages={messages} 
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
