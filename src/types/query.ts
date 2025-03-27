
export type MessageType = {
  id: string;
  text: string;
  sender: 'user' | 'system';
  timestamp: Date;
  query?: string;
  isExecuted?: boolean;
};

export type SessionType = {
  id: string;
  name: string;
  messages: MessageType[];
  databaseType: 'sql' | 'nosql';
  dateCreated: Date;
};
