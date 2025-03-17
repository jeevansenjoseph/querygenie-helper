import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import AuthGuard from '@/components/layout/AuthGuard';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Clipboard, Code, Eye, FileDown } from 'lucide-react';
import { generateMockNoSqlResults } from '@/lib/database';
import { toast } from "@/lib/toast";

const NoSqlResults = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get the query from localStorage
    const storedQuery = localStorage.getItem('nosqlQuery');
    
    if (!storedQuery) {
      toast.error('No NoSQL query found');
      navigate('/nosql-generation');
      return;
    }
    
    setQuery(storedQuery);
    
    // Simulate loading results
    setIsLoading(true);
    setTimeout(() => {
      const mockResults = generateMockNoSqlResults(storedQuery);
      setResults(mockResults);
      setIsLoading(false);
    }, 1000);
  }, [navigate]);

  const handleBack = () => {
    navigate('/nosql-generation');
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(query);
    toast.success('Query copied to clipboard');
  };

  const handleExportJSON = () => {
    if (!results.length) return;
    
    const json = JSON.stringify(results, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'nosql_results.json');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    toast.success('Results exported as JSON');
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
            
            <h1 className="text-3xl font-bold tracking-tighter">NoSQL Query Results</h1>
            <p className="text-muted-foreground mb-6">
              View the results of your NoSQL query execution
            </p>
            
            <Card className="p-4 mb-6 bg-muted/40">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-sm font-medium flex items-center">
                  <Code className="mr-2 h-4 w-4" />
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
              
              {results.length > 0 && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleExportJSON}
                  className="gap-2"
                >
                  <FileDown className="h-4 w-4" />
                  Export JSON
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
            ) : results.length > 0 ? (
              <div className="space-y-4">
                {results.map((item, index) => (
                  <div 
                    key={index} 
                    className="border rounded-lg p-4 hover:bg-muted/30 transition-colors"
                  >
                    <pre className="text-sm whitespace-pre-wrap overflow-auto">
                      {JSON.stringify(item, null, 2)}
                    </pre>
                  </div>
                ))}
                <p className="text-sm text-muted-foreground mt-2">
                  {results.length} document{results.length !== 1 ? 's' : ''} returned
                </p>
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

export default NoSqlResults;
