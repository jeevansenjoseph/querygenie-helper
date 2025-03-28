
import React, { useRef, useEffect } from 'react';
import { MessageType } from '@/types/query';
import { Button } from "@/components/ui/button";
import { Clipboard, Sparkles } from 'lucide-react';
import { toast } from "@/lib/toast";

interface MessageListProps {
  messages: MessageType[];
  onExecuteQuery: (query: string) => void;
}

const MessageList: React.FC<MessageListProps> = ({ messages, onExecuteQuery }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of messages when new message is added
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleCopyQuery = (query: string) => {
    navigator.clipboard.writeText(query);
    toast.success('Query copied to clipboard');
  };

  return (
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
              <div className="mt-2 mb-1 relative">
                <div className="bg-background bg-opacity-10 rounded p-2 font-mono text-sm">
                  <pre className="overflow-x-auto pr-2">{message.query}</pre>
                </div>
                <div className="flex space-x-2 mt-2 absolute top-2 right-2">
                  <Button 
                    size="sm"
                    variant="secondary"
                    className="h-7 rounded-full opacity-80 hover:opacity-100"
                    onClick={() => handleCopyQuery(message.query!)}
                  >
                    <Clipboard className="h-3 w-3 mr-1" />
                    Copy
                  </Button>
                  <Button 
                    size="sm"
                    variant={message.isExecuted ? "ghost" : "secondary"}
                    className={`h-7 rounded-full opacity-80 hover:opacity-100 ${message.isExecuted ? 'bg-green-100 text-green-700' : ''}`}
                    onClick={() => onExecuteQuery(message.query!)}
                  >
                    <Sparkles className="h-3 w-3 mr-1" />
                    {message.isExecuted ? 'Executed' : 'Execute'}
                  </Button>
                </div>
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
  );
};

export default MessageList;
