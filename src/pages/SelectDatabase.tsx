
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import AuthGuard from '@/components/layout/AuthGuard';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { databaseOptions, DatabaseOption, DatabaseType } from '@/lib/database';
import { toast } from "@/components/ui/sonner";

const SelectDatabase = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState<DatabaseType>('sql');
  const [selectedDatabase, setSelectedDatabase] = useState<string | null>(null);

  const handleDatabaseSelect = (database: DatabaseOption) => {
    setSelectedDatabase(database.id);
    localStorage.setItem('selectedDatabase', database.id);
    localStorage.setItem('selectedDatabaseType', database.type);
    toast.success(`Selected ${database.name}`);
    
    // Navigate to the appropriate generation page based on database type
    if (database.type === 'sql') {
      navigate('/sql-generation');
    } else {
      navigate('/nosql-generation');
    }
  };

  // Filter databases based on current tab
  const filteredDatabases = databaseOptions.filter(db => db.type === selectedTab);
  const popularDatabases = filteredDatabases.filter(db => db.popular);
  const otherDatabases = filteredDatabases.filter(db => !db.popular);

  return (
    <AuthGuard>
      <AppLayout>
        <div className="container-lg py-8 animate-fade-in">
          <div className="space-y-2 text-center mb-12">
            <h1 className="text-3xl font-bold tracking-tighter">Select Database</h1>
            <p className="text-muted-foreground">
              Choose the database you want to generate queries for
            </p>
          </div>

          <Tabs 
            defaultValue="sql" 
            value={selectedTab}
            onValueChange={(value) => setSelectedTab(value as DatabaseType)}
            className="w-full"
          >
            <div className="flex justify-center mb-8">
              <TabsList className="w-full max-w-md grid grid-cols-2">
                <TabsTrigger value="sql" className="text-base py-3">
                  SQL
                </TabsTrigger>
                <TabsTrigger value="nosql" className="text-base py-3">
                  NoSQL
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="sql" className="mt-0">
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {popularDatabases.map((db) => (
                  <DatabaseCard 
                    key={db.id} 
                    database={db} 
                    isSelected={selectedDatabase === db.id}
                    onSelect={handleDatabaseSelect}
                  />
                ))}
              </div>

              {otherDatabases.length > 0 && (
                <>
                  <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-muted"></div>
                    </div>
                    <div className="relative flex justify-center">
                      <span className="bg-background px-4 text-sm text-muted-foreground">
                        Other SQL Databases
                      </span>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {otherDatabases.map((db) => (
                      <DatabaseCard 
                        key={db.id} 
                        database={db} 
                        isSelected={selectedDatabase === db.id}
                        onSelect={handleDatabaseSelect}
                        isCompact
                      />
                    ))}
                  </div>
                </>
              )}
            </TabsContent>

            <TabsContent value="nosql" className="mt-0">
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {popularDatabases.map((db) => (
                  <DatabaseCard 
                    key={db.id} 
                    database={db} 
                    isSelected={selectedDatabase === db.id}
                    onSelect={handleDatabaseSelect}
                  />
                ))}
              </div>

              {otherDatabases.length > 0 && (
                <>
                  <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-muted"></div>
                    </div>
                    <div className="relative flex justify-center">
                      <span className="bg-background px-4 text-sm text-muted-foreground">
                        Other NoSQL Databases
                      </span>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {otherDatabases.map((db) => (
                      <DatabaseCard 
                        key={db.id} 
                        database={db} 
                        isSelected={selectedDatabase === db.id}
                        onSelect={handleDatabaseSelect}
                        isCompact
                      />
                    ))}
                  </div>
                </>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </AppLayout>
    </AuthGuard>
  );
};

interface DatabaseCardProps {
  database: DatabaseOption;
  isSelected: boolean;
  onSelect: (database: DatabaseOption) => void;
  isCompact?: boolean;
}

const DatabaseCard = ({ database, isSelected, onSelect, isCompact = false }: DatabaseCardProps) => {
  return (
    <Card 
      className={`overflow-hidden transition-all hover:shadow-md ${isSelected ? 'ring-2 ring-primary' : ''}`}
    >
      <CardHeader className={isCompact ? 'p-4' : 'p-6'}>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 overflow-hidden rounded flex items-center justify-center bg-white shadow-sm border">
            <img 
              src={database.image} 
              alt={database.name} 
              className="max-w-full max-h-full object-contain"
              style={{ maxWidth: '32px', maxHeight: '32px' }}
            />
          </div>
          <div>
            <CardTitle className={isCompact ? 'text-lg' : 'text-xl'}>
              {database.name}
            </CardTitle>
            {!isCompact && (
              <CardDescription>
                {database.type === 'sql' ? 'SQL Database' : 'NoSQL Database'}
              </CardDescription>
            )}
          </div>
        </div>
      </CardHeader>
      {!isCompact && (
        <CardContent>
          <p className="text-muted-foreground">
            {database.description}
          </p>
        </CardContent>
      )}
      <CardFooter className={isCompact ? 'p-4' : 'p-6'}>
        <Button
          onClick={() => onSelect(database)}
          variant={isSelected ? "default" : "outline"}
          className="w-full"
        >
          {isSelected ? 'Selected' : 'Select'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SelectDatabase;
