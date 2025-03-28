
import React, { useEffect } from 'react';
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
    updateMessagesInSession
  } = useSessionManager();

  const {
    activeQuery,
    queryResults,
    isLoadingResults,
    handleExecuteQuery,
    handleExportResults
  } = useQueryExecution(databaseType, messages, updateMessagesInSession);

  // Auto-save effect
  useEffect(() => {
    // updateMessagesInSession already handles saving to localStorage
  }, [messages, databaseType]);

  return (
    <AppLayout>
      <div className="container-xl py-4 animate-fade-in">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[calc(100vh-120px)]">
          {/* Left Column - Query Generation */}
          <ChatInterface
            messages={messages}
            databaseType={databaseType}
            onDatabaseTypeChange={handleDatabaseTypeChange}
            updateMessages={updateMessagesInSession}
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
