import sql, { ConnectionPool } from 'mssql';

let connectionPool: ConnectionPool;

export const connectToDatabase = async (): Promise<ConnectionPool> => {
  if (connectionPool) {
    return connectionPool;
  }

  try {
    const config = {
      user: 'sa',
      password: 'Pesho',
      server: '192.168.192.110:1433',
      database: 'Library',
      options: {
        encrypt: false, // For secure connection, enable encryption
      },
    };

    connectionPool = await sql.connect(config);
    console.log('Connected to the database');
    return connectionPool;
  } catch (error) {
    console.error('Failed to connect to the database:', error);
    throw error;
  }
};
//host: 192.168.192.110:1433
//username:sa
//password:Pesho
//db_name: Library