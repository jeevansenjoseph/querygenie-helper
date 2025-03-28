
import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { useSessionManager } from '@/hooks/useSessionManager';
import { useQueryExecution } from '@/hooks/useQueryExecution';
import ChatInterface from '@/components/query/ChatInterface';
import QueryResults from '@/components/query/QueryResults';

const QueryGenerator = () => {
  // Use our custom hooks
  const {
    messages,
    databaseType,
    handleDatabaseTypeChange,
    updateMessagesInChat,
    chatHistory,
    currentChat,
    createNewChat,
    loadChat
  } = useSessionManager();

  const {
    activeQuery,
    queryResults,
    isLoadingResults,
    handleExecuteQuery,
    handleExportResults
  } = useQueryExecution(databaseType, messages, updateMessagesInChat);

  return (
    <AppLayout
      onCreateNewChat={createNewChat}
      onLoadChat={loadChat}
      chatHistory={chatHistory}
      currentChat={currentChat}
    >
      <div className="container-xl py-4 animate-fade-in">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[calc(100vh-120px)]">
          {/* Left Column - Query Generation */}
          <ChatInterface
            messages={Array.isArray(messages) ? messages : []}
            databaseType={databaseType}
            onDatabaseTypeChange={handleDatabaseTypeChange}
            updateMessages={updateMessagesInChat}
            onExecuteQuery={handleExecuteQuery}
          />
          
          {/* Right Column - Query Results */}
          <QueryResults
            databaseType={databaseType}
            activeQuery={activeQuery}
            queryResults={queryResults}
            isLoadingResults={isLoadingResults}
            onExportResults={handleExportResults}
          />
        </div>
      </div>
    </AppLayout>
  );
};

export default QueryGenerator;
