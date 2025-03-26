
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import AuthGuard from '@/components/layout/AuthGuard';
import { Button } from "@/components/ui/button";
import { ArrowRight, Database, Server } from 'lucide-react';
import { databaseOptions } from '@/lib/database';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "@/lib/toast";

const SelectDatabase = () => {
  const navigate = useNavigate();
  const [selectedDatabase, setSelectedDatabase] = useState<string | null>(null);
  const [selectedDatabaseType, setSelectedDatabaseType] = useState<'sql' | 'nosql' | null>(null);

  const handleDatabaseSelect = (databaseId: string, databaseType: 'sql' | 'nosql') => {
    setSelectedDatabase(databaseId);
    setSelectedDatabaseType(databaseType);
  };

  const handleContinue = () => {
    if (!selectedDatabase || !selectedDatabaseType) {
      toast.error('Please select a database');
      return;
    }

    // Store the selected database in localStorage
    localStorage.setItem('selectedDatabase', selectedDatabase);
    localStorage.setItem('selectedDatabaseType', selectedDatabaseType);

    // Navigate to the appropriate generation page based on database type
    if (selectedDatabaseType === 'sql') {
      navigate('/sql-generation');
    } else if (selectedDatabaseType === 'nosql') {
      navigate('/nosql-generation');
    }
  };

  return (
    <AuthGuard>
      <AppLayout>
        <div className="container-lg py-8 animate-fade-in">
          <div className="space-y-2 text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tighter">Select Your Database</h1>
            <p className="text-muted-foreground">
              Choose the database you want to generate queries for
            </p>
          </div>

          <div className="flex flex-col items-center justify-center">
            <RadioGroup defaultValue={selectedDatabase || undefined} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {databaseOptions.map((database) => (
                <div key={database.id} className="flex items-center space-x-2">
                  <RadioGroupItem 
                    value={database.id} 
                    id={database.id} 
                    onClick={() => handleDatabaseSelect(database.id, database.type)}
                  />
                  <Label htmlFor={database.id} className="flex items-center gap-2 cursor-pointer">
                    <Database className="w-4 h-4" />
                    <span>{database.name}</span>
                    {/* Display server icon if database is cloud-based */}
                    {'isCloud' in database && database.isCloud && 
                      <Server className="w-4 h-4 text-muted-foreground" />
                    }
                  </Label>
                </div>
              ))}
            </RadioGroup>

            <Button 
              onClick={handleContinue} 
              className="mt-8 gap-2"
              disabled={!selectedDatabase}
            >
              Continue
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </AppLayout>
    </AuthGuard>
  );
};

export default SelectDatabase;
