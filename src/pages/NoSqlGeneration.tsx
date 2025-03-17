
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import AuthGuard from '@/components/layout/AuthGuard';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, Clipboard, Database, Loader2, Sparkles } from 'lucide-react';
import { translateToNoSql, databaseOptions, mockSchemas } from '@/lib/database';
import { toast } from "@/components/ui/sonner";

const NoSqlGeneration = () => {
  const navigate = useNavigate();
  const [naturalLanguage, setNaturalLanguage] = useState('');
  const [generatedQuery, setGeneratedQuery] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedDatabase, setSelectedDatabase] = useState<string | null>(null);
  const [databaseName, setDatabaseName] = useState('');

  useEffect(() => {
    // Check if database has been selected
    const storedDb = localStorage.getItem('selectedDatabase');
    const storedDbType = localStorage.getItem('selectedDatabaseType');
    
    if (!storedDb || storedDbType !== 'nosql') {
      toast.error('Please select a NoSQL database first');
      navigate('/select-database');
      return;
    }
    
    setSelectedDatabase(storedDb);
    
    // Find database info
    const dbInfo = databaseOptions.find(db => db.id === storedDb);
    if (dbInfo) {
      setDatabaseName(dbInfo.name);
    }
  }, [navigate]);

  const handleGenerate = () => {
    if (!naturalLanguage.trim()) {
      toast.error('Please enter a query in natural language');
      return;
    }
    
    setIsGenerating(true);
    
    // Simulating API call delay
    setTimeout(() => {
      const query = translateToNoSql(naturalLanguage, selectedDatabase || '');
      setGeneratedQuery(query);
      setIsGenerating(false);
      toast.success('Query generated successfully');
    }, 1200);
  };

  const handleRunQuery = () => {
    if (!generatedQuery.trim()) {
      toast.error('Please generate a query first');
      return;
    }
    
    // Store the query in localStorage to display in results page
    localStorage.setItem('nosqlQuery', generatedQuery);
    
    // Navigate to results page
    navigate('/nosql-results');
  };

  const handleCopyToClipboard = () => {
    if (!generatedQuery.trim()) {
      toast.error('Generate a query first');
      return;
    }
    
    navigator.clipboard.writeText(generatedQuery);
    toast.success('Query copied to clipboard');
  };

  const handleClear = () => {
    setNaturalLanguage('');
    setGeneratedQuery('');
  };

  const exampleQueries = [
    "Show all users",
    "Find user where email is john@example.com",
    "Count all products in Electronics category",
    "Calculate the sum of all order totals",
    "Find the average price of products",
    "Join users with their orders"
  ];

  const handleExampleClick = (example: string) => {
    setNaturalLanguage(example);
  };

  return (
    <AuthGuard>
      <AppLayout>
        <div className="container-lg py-8 animate-fade-in">
          <div className="space-y-2 text-center mb-8">
            <div className="inline-flex items-center gap-2 text-muted-foreground mb-2">
              <Database className="w-5 h-5" />
              <span>Using <strong>{databaseName}</strong></span>
            </div>
            <h1 className="text-3xl font-bold tracking-tighter">NoSQL Query Generation</h1>
            <p className="text-muted-foreground">
              Write your query in natural language and we'll convert it to NoSQL
            </p>
          </div>

          <div className="grid lg:grid-cols-[1fr_400px] gap-8">
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label htmlFor="natural-language" className="text-base">
                    Write your query in natural language
                  </Label>
                  <Button onClick={handleClear} variant="ghost" size="sm">
                    Clear
                  </Button>
                </div>
                <Textarea
                  id="natural-language"
                  placeholder="Enter your query in natural language, e.g. 'Show all users'"
                  value={naturalLanguage}
                  onChange={(e) => setNaturalLanguage(e.target.value)}
                  className="min-h-40 text-base p-4"
                />
              </div>

              <div className="flex gap-4">
                <Button 
                  onClick={handleGenerate} 
                  className="gap-2 h-12 px-6"
                  disabled={isGenerating || !naturalLanguage.trim()}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Generate NoSQL
                    </>
                  )}
                </Button>
                
                <Button 
                  onClick={handleRunQuery} 
                  variant="outline" 
                  className="gap-2 h-12"
                  disabled={!generatedQuery || isGenerating}
                >
                  Run Query
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>

              {generatedQuery && (
                <div className="mt-6 relative">
                  <Label htmlFor="generated-query" className="text-base">
                    Generated NoSQL Query
                  </Label>
                  <div className="relative mt-2">
                    <pre
                      id="generated-query"
                      className="bg-muted text-muted-foreground p-4 rounded-md overflow-auto text-sm"
                      style={{ maxHeight: '240px' }}
                    >
                      <code>{generatedQuery}</code>
                    </pre>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-2 right-2 h-8 w-8 p-0"
                      onClick={handleCopyToClipboard}
                    >
                      <Clipboard className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Example Queries</CardTitle>
                  <CardDescription>
                    Click on an example to try it
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {exampleQueries.map((example, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="w-full justify-start text-left h-auto p-3"
                        onClick={() => handleExampleClick(example)}
                      >
                        {example}
                      </Button>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="flex-col items-start gap-2">
                  <h4 className="text-sm font-medium">Available Collections</h4>
                  <div className="w-full text-xs text-muted-foreground">
                    <pre className="overflow-auto bg-muted p-2 rounded-md">
                      {selectedDatabase === 'mongodb' && JSON.stringify(mockSchemas.mongodb, null, 2)}
                    </pre>
                  </div>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </AppLayout>
    </AuthGuard>
  );
};

export default NoSqlGeneration;
