
// This file contains mock database information and utilities

export type DatabaseType = 'sql' | 'nosql';

export interface DatabaseOption {
  id: string;
  name: string;
  type: DatabaseType;
  description: string;
  image: string;
  popular?: boolean;
}

// Mock database options
export const databaseOptions: DatabaseOption[] = [
  {
    id: 'mysql',
    name: 'MySQL',
    type: 'sql',
    description: 'Open-source relational database management system',
    image: 'https://www.mysql.com/common/logos/logo-mysql-170x115.png',
    popular: true,
  },
  {
    id: 'postgresql',
    name: 'PostgreSQL',
    type: 'sql',
    description: 'Powerful, open source object-relational database system',
    image: 'https://www.postgresql.org/media/img/about/press/elephant.png',
    popular: true,
  },
  {
    id: 'sqlite',
    name: 'SQLite',
    type: 'sql',
    description: 'Lightweight, disk-based database that doesn\'t require a server',
    image: 'https://www.sqlite.org/images/sqlite370_banner.gif',
  },
  {
    id: 'sqlserver',
    name: 'SQL Server',
    type: 'sql',
    description: 'Microsoft\'s relational database management system',
    image: 'https://cdn-icons-png.flaticon.com/512/5968/5968364.png',
  },
  {
    id: 'mongodb',
    name: 'MongoDB',
    type: 'nosql',
    description: 'Document-oriented NoSQL database',
    image: 'https://cdn.iconscout.com/icon/free/png-256/free-mongodb-5-1175140.png',
    popular: true,
  },
  {
    id: 'couchdb',
    name: 'CouchDB',
    type: 'nosql',
    description: 'Document-oriented NoSQL database that uses JSON',
    image: 'https://couchdb.apache.org/image/couch-logo.png',
  },
  {
    id: 'dynamodb',
    name: 'DynamoDB',
    type: 'nosql',
    description: 'AWS\'s fully managed NoSQL database service',
    image: 'https://cdn.worldvectorlogo.com/logos/aws-dynamodb.svg',
  },
  {
    id: 'cassandra',
    name: 'Cassandra',
    type: 'nosql',
    description: 'Free and open-source, distributed, wide column store',
    image: 'https://cassandra.apache.org/_/img/cassandra_logo.png',
  },
];

// Mock database schemas for examples
export const mockSchemas = {
  mysql: [
    { name: 'users', columns: ['id', 'name', 'email', 'created_at'] },
    { name: 'products', columns: ['id', 'name', 'price', 'category', 'description'] },
    { name: 'orders', columns: ['id', 'user_id', 'total', 'status', 'created_at'] },
    { name: 'order_items', columns: ['id', 'order_id', 'product_id', 'quantity', 'price'] },
  ],
  mongodb: [
    { collection: 'users', fields: ['_id', 'name', 'email', 'createdAt'] },
    { collection: 'products', fields: ['_id', 'name', 'price', 'category', 'description'] },
    { collection: 'orders', fields: ['_id', 'userId', 'items', 'total', 'status', 'createdAt'] },
  ],
};

// Mock SQL results
export const generateMockSqlResults = (query: string) => {
  // Very simple mock results just for demo purposes
  if (query.toLowerCase().includes('select') && query.toLowerCase().includes('from users')) {
    return {
      columns: ['id', 'name', 'email', 'created_at'],
      rows: [
        { id: 1, name: 'John Doe', email: 'john@example.com', created_at: '2023-01-15' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', created_at: '2023-02-20' },
        { id: 3, name: 'Mike Johnson', email: 'mike@example.com', created_at: '2023-03-10' },
      ],
    };
  } else if (query.toLowerCase().includes('select') && query.toLowerCase().includes('from products')) {
    return {
      columns: ['id', 'name', 'price', 'category'],
      rows: [
        { id: 1, name: 'Laptop', price: 1299.99, category: 'Electronics' },
        { id: 2, name: 'Headphones', price: 199.99, category: 'Electronics' },
        { id: 3, name: 'Coffee Maker', price: 89.99, category: 'Kitchen' },
      ],
    };
  } else if (query.toLowerCase().includes('select') && query.toLowerCase().includes('from orders')) {
    return {
      columns: ['id', 'user_id', 'total', 'status'],
      rows: [
        { id: 1, user_id: 1, total: 1499.98, status: 'Completed' },
        { id: 2, user_id: 2, total: 89.99, status: 'Processing' },
        { id: 3, user_id: 1, total: 199.99, status: 'Shipped' },
      ],
    };
  }
  
  return {
    columns: ['result'],
    rows: [{ result: 'Query executed successfully' }],
  };
};

// Mock NoSQL results
export const generateMockNoSqlResults = (query: string) => {
  // Simple mock results for NoSQL queries
  if (query.toLowerCase().includes('find') && query.toLowerCase().includes('users')) {
    return [
      { _id: 'a1b2c3', name: 'John Doe', email: 'john@example.com', createdAt: '2023-01-15' },
      { _id: 'd4e5f6', name: 'Jane Smith', email: 'jane@example.com', createdAt: '2023-02-20' },
      { _id: 'g7h8i9', name: 'Mike Johnson', email: 'mike@example.com', createdAt: '2023-03-10' },
    ];
  } else if (query.toLowerCase().includes('find') && query.toLowerCase().includes('products')) {
    return [
      { _id: 'p1q2r3', name: 'Laptop', price: 1299.99, category: 'Electronics' },
      { _id: 's4t5u6', name: 'Headphones', price: 199.99, category: 'Electronics' },
      { _id: 'v7w8x9', name: 'Coffee Maker', price: 89.99, category: 'Kitchen' },
    ];
  } else if (query.toLowerCase().includes('find') && query.toLowerCase().includes('orders')) {
    return [
      { 
        _id: 'o1p2q3', 
        userId: 'a1b2c3',
        items: [
          { productId: 'p1q2r3', quantity: 1, price: 1299.99 },
          { productId: 's4t5u6', quantity: 1, price: 199.99 },
        ],
        total: 1499.98, 
        status: 'Completed',
        createdAt: '2023-04-12'
      },
      {
        _id: 'r4s5t6',
        userId: 'd4e5f6',
        items: [
          { productId: 'v7w8x9', quantity: 1, price: 89.99 },
        ],
        total: 89.99,
        status: 'Processing',
        createdAt: '2023-05-05'
      }
    ];
  }
  
  return [{ result: 'Query executed successfully' }];
};

// Mock translation from natural language to SQL
export const translateToSql = (naturalLanguage: string, databaseType: string): string => {
  // Basic translations for demo purposes
  const nlQuery = naturalLanguage.toLowerCase();
  
  if (nlQuery.includes('show all users') || nlQuery.includes('list all users')) {
    return `SELECT * FROM users;`;
  } else if (nlQuery.includes('find user') && nlQuery.includes('email')) {
    const match = nlQuery.match(/email is (.+?)($|\s+and|\s+where|\s+with)/i);
    const email = match ? match[1].replace(/['"]/g, '') : 'example@email.com';
    return `SELECT * FROM users WHERE email = '${email}';`;
  } else if (nlQuery.includes('count') && nlQuery.includes('products')) {
    if (nlQuery.includes('category')) {
      const match = nlQuery.match(/category is (.+?)($|\s+and|\s+where|\s+with)/i);
      const category = match ? match[1].replace(/['"]/g, '') : 'Electronics';
      return `SELECT COUNT(*) FROM products WHERE category = '${category}';`;
    }
    return `SELECT COUNT(*) FROM products;`;
  } else if (nlQuery.includes('sum') && nlQuery.includes('orders')) {
    return `SELECT SUM(total) FROM orders;`;
  } else if (nlQuery.includes('average') && nlQuery.includes('price')) {
    return `SELECT AVG(price) FROM products;`;
  } else if (nlQuery.includes('join') || (nlQuery.includes('users') && nlQuery.includes('orders'))) {
    return `SELECT users.name, orders.total, orders.status 
FROM users 
JOIN orders ON users.id = orders.user_id;`;
  }

  return `-- Translated query from: "${naturalLanguage}"\nSELECT * FROM table_name WHERE condition;`;
};

// Mock translation from natural language to NoSQL
export const translateToNoSql = (naturalLanguage: string, databaseType: string): string => {
  // Basic translations for demo purposes
  const nlQuery = naturalLanguage.toLowerCase();
  
  if (databaseType === 'mongodb') {
    if (nlQuery.includes('show all users') || nlQuery.includes('list all users')) {
      return `db.users.find({})`;
    } else if (nlQuery.includes('find user') && nlQuery.includes('email')) {
      const match = nlQuery.match(/email is (.+?)($|\s+and|\s+where|\s+with)/i);
      const email = match ? match[1].replace(/['"]/g, '') : 'example@email.com';
      return `db.users.find({ email: "${email}" })`;
    } else if (nlQuery.includes('count') && nlQuery.includes('products')) {
      if (nlQuery.includes('category')) {
        const match = nlQuery.match(/category is (.+?)($|\s+and|\s+where|\s+with)/i);
        const category = match ? match[1].replace(/['"]/g, '') : 'Electronics';
        return `db.products.countDocuments({ category: "${category}" })`;
      }
      return `db.products.countDocuments({})`;
    } else if (nlQuery.includes('sum') && nlQuery.includes('orders')) {
      return `db.orders.aggregate([
  { $group: { _id: null, total: { $sum: "$total" } } }
])`;
    } else if (nlQuery.includes('average') && nlQuery.includes('price')) {
      return `db.products.aggregate([
  { $group: { _id: null, avgPrice: { $avg: "$price" } } }
])`;
    } else if (nlQuery.includes('join') || (nlQuery.includes('users') && nlQuery.includes('orders'))) {
      return `db.orders.aggregate([
  { $lookup: {
      from: "users",
      localField: "userId",
      foreignField: "_id",
      as: "user"
  }},
  { $unwind: "$user" },
  { $project: { "user.name": 1, total: 1, status: 1 } }
])`;
    }
  }

  return `// Translated query from: "${naturalLanguage}"\ndb.collection.find({ key: "value" })`;
};
