import { ConnectionPool } from 'mssql';

let connection: ConnectionPool;

export const connectToDatabase = async (): Promise<ConnectionPool> => {
  if (connection) {
    return connection;
  }

  try {
    connection = new ConnectionPool({
      user: 'sa1',
      password: 'sa',
      server: '10.108.6.194',
      database: 'NotesInCloud',
      options: {
        encrypt: false,
      }
    });

    await connection.connect();

    console.log('Connected to the database');
    return connection;
  } catch (error) {
    console.error('Failed to connect to the database:', error);
    throw error;
  }
};
