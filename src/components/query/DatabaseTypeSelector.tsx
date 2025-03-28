
import React from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Database } from 'lucide-react';

interface DatabaseTypeSelectorProps {
  databaseType: 'sql' | 'nosql';
  onDatabaseTypeChange: (value: 'sql' | 'nosql') => void;
}

const DatabaseTypeSelector: React.FC<DatabaseTypeSelectorProps> = ({
  databaseType,
  onDatabaseTypeChange
}) => {
  return (
    <div className="mb-4 flex items-center">
      <Database className="mr-2 h-4 w-4" />
      <span className="mr-3 text-sm font-medium">Database Type:</span>
      <RadioGroup 
        value={databaseType} 
        onValueChange={(value) => onDatabaseTypeChange(value as 'sql' | 'nosql')}
        className="flex space-x-4"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="sql" id="sql" />
          <Label htmlFor="sql" className="cursor-pointer">SQL</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="nosql" id="nosql" />
          <Label htmlFor="nosql" className="cursor-pointer">NoSQL</Label>
        </div>
      </RadioGroup>
    </div>
  );
};

export default DatabaseTypeSelector;
