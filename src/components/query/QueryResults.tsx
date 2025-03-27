
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileDown } from 'lucide-react';

interface QueryResultsProps {
  databaseType: 'sql' | 'nosql';
  activeQuery: string | null;
  queryResults: any;
  isLoadingResults: boolean;
  onExportResults: () => void;
}

const QueryResults: React.FC<QueryResultsProps> = ({
  databaseType,
  activeQuery,
  queryResults,
  isLoadingResults,
  onExportResults
}) => {
  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">
          Query Results
        </h2>
        
        {queryResults && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={onExportResults}
            className="gap-2"
          >
            <FileDown className="h-4 w-4" />
            Export {databaseType === 'sql' ? 'CSV' : 'JSON'}
          </Button>
        )}
      </div>
      
      <Card className="flex-1 overflow-hidden">
        <CardContent className="p-4 h-full overflow-auto">
          {isLoadingResults ? (
            <div className="h-full flex items-center justify-center">
              <div className="animate-pulse space-y-4 w-full">
                <div className="h-10 bg-muted rounded-md w-full"></div>
                <div className="h-32 bg-muted rounded-md w-full"></div>
              </div>
            </div>
          ) : activeQuery ? (
            <div className="space-y-4">
              <div className="text-sm font-medium flex items-center">
                Executed Query:
                <pre className="ml-2 text-xs text-muted-foreground overflow-auto p-2 bg-muted/60 rounded">
                  <code>{activeQuery}</code>
                </pre>
              </div>
              
              {queryResults ? (
                databaseType === 'sql' ? (
                  <div className="overflow-x-auto">
                    <div className="inline-block min-w-full align-middle">
                      <div className="overflow-hidden border rounded-lg">
                        <table className="min-w-full divide-y divide-border">
                          <thead className="bg-muted/50">
                            <tr>
                              {queryResults.columns.map((column: string, index: number) => (
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
                            {queryResults.rows.map((row: any, rowIndex: number) => (
                              <tr key={rowIndex} className="hover:bg-muted/30">
                                {queryResults.columns.map((column: string, colIndex: number) => (
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
                        {queryResults.rows.length} row{queryResults.rows.length !== 1 ? 's' : ''} returned
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {queryResults.map((item: any, index: number) => (
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
                      {queryResults.length} document{queryResults.length !== 1 ? 's' : ''} returned
                    </p>
                  </div>
                )
              ) : (
                <div className="text-center py-10">
                  <p className="text-muted-foreground">No results available</p>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <p>Generate a query and execute it to see results here</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default QueryResults;
