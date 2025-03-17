import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import AuthGuard from '@/components/layout/AuthGuard';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Clipboard, Eye, FileDown, Terminal } from 'lucide-react';
import { generateMockSqlResults } from '@/lib/database';
import { toast } from "@/lib/toast";

const SqlResults = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get the query from localStorage
    const storedQuery = localStorage.getItem('sqlQuery');
    
    if (!storedQuery) {
      toast.error('No SQL query found');
      navigate('/sql-generation');
      return;
    }
    
    setQuery(storedQuery);
    
    // Simulate loading results
    setIsLoading(true);
    setTimeout(() => {
      const mockResults = generateMockSqlResults(storedQuery);
      setResults(mockResults);
      setIsLoading(false);
    }, 1000);
  }, [navigate]);

  const handleBack = () => {
    navigate('/sql-generation');
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(query);
    toast.success('Query copied to clipboard');
  };

  const handleExportCSV = () => {
    if (!results) return;
    
    const headers = results.columns.join(',');
    const rows = results.rows.map((row: any) => 
      results.columns.map((col: string) => `"${row[col]}"`).join(',')
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
    
    toast.success('Results exported as CSV');
  };

  return (
    <AuthGuard>
      <AppLayout>
        <div className="container-lg py-8 animate-fade-in">
          <div className="space-y-2 mb-8">
            <Button 
              variant="ghost" 
              onClick={handleBack}
              className="mb-4 -ml-2"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Query Generation
            </Button>
            
            <h1 className="text-3xl font-bold tracking-tighter">SQL Query Results</h1>
            <p className="text-muted-foreground mb-6">
              View the results of your SQL query execution
            </p>
            
            <Card className="p-4 mb-6 bg-muted/40">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-sm font-medium flex items-center">
                  <Terminal className="mr-2 h-4 w-4" />
                  Executed Query
                </h3>
                <Button 
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0"
                  onClick={handleCopyToClipboard}
                >
                  <Clipboard className="h-4 w-4" />
                </Button>
              </div>
              <pre className="text-sm text-muted-foreground overflow-auto p-2 bg-muted/60 rounded">
                <code>{query}</code>
              </pre>
            </Card>
          </div>

          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Eye className="mr-2 h-5 w-5" />
                Query Results
              </h2>
              
              {results && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleExportCSV}
                  className="gap-2"
                >
                  <FileDown className="h-4 w-4" />
                  Export CSV
                </Button>
              )}
            </div>
            
            {isLoading ? (
              <div className="h-60 flex items-center justify-center">
                <div className="animate-pulse space-y-4 w-full">
                  <div className="h-10 bg-muted rounded-md w-full"></div>
                  <div className="h-32 bg-muted rounded-md w-full"></div>
                </div>
              </div>
            ) : results ? (
              <div className="overflow-x-auto">
                <div className="inline-block min-w-full align-middle">
                  <div className="overflow-hidden border rounded-lg">
                    <table className="min-w-full divide-y divide-border">
                      <thead className="bg-muted/50">
                        <tr>
                          {results.columns.map((column: string, index: number) => (
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
                        {results.rows.map((row: any, rowIndex: number) => (
                          <tr key={rowIndex} className="hover:bg-muted/30">
                            {results.columns.map((column: string, colIndex: number) => (
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
                    {results.rows.length} row{results.rows.length !== 1 ? 's' : ''} returned
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-muted-foreground">No results available</p>
              </div>
            )}
          </div>
        </div>
      </AppLayout>
    </AuthGuard>
  );
};

export default SqlResults;
