import mysql, { Connection } from 'mysql';

let connection: Connection;

export const connectToDatabase = (): Connection => {
  if (connection) {
    return connection;
  }

  try {
    connection = mysql.createConnection({
      host: 'localhost',
      user: 'your_username',
      password: 'your_password',
      database: 'your_database_name',
    });

    connection.connect();
    console.log('Connected to the database');
    return connection;
  } catch (error) {
    console.error('Failed to connect to the database:', error);
    throw error;
  }
};
