
import { useState } from 'react';
import { MessageType } from '@/types/query';
import { toast } from "@/lib/toast";
import { generateMockSqlResults, generateMockNoSqlResults } from '@/lib/database';

export const useQueryExecution = (
  databaseType: 'sql' | 'nosql',
  messages: MessageType[],
  updateMessagesInSession: (messages: MessageType[]) => void
) => {
  // Results state
  const [activeQuery, setActiveQuery] = useState<string | null>(null);
  const [queryResults, setQueryResults] = useState<any>(null);
  const [isLoadingResults, setIsLoadingResults] = useState(false);

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
      
      // Mark the query as executed and update session
      const updatedMessages = messages.map(msg => 
        msg.query === query ? { ...msg, isExecuted: true } : msg
      );
      
      // Update messages in session to ensure executed state is saved
      updateMessagesInSession(updatedMessages);
      
      toast.success('Query executed successfully');
    }, 1000);
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

  return {
    activeQuery,
    queryResults,
    isLoadingResults,
    handleExecuteQuery,
    handleExportResults
  };
};
