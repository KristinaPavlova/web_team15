import express, { Request, Response, NextFunction } from 'express';
import Ajv, { JSONSchemaType } from 'ajv';
import { ConnectionPool, Request as MSSQLRequest } from 'mssql';
import { connectToDatabase } from '../db';
// User JSON schema
const userSchema: JSONSchemaType<{
  username: string;
  password: string;
  email: string;
}> = {
  type: 'object',
  properties: {
    username: { type: 'string' },
    password: { type: 'string' },
    email: { type: 'string' },
  },
  required: ['username', 'password', 'email'],
  additionalProperties: false,
};

// Request validation middleware
const validateRequest = <T>(schema: JSONSchemaType<T>) => {
  const ajv = new Ajv();
  const validate = ajv.compile(schema);

  return (req: Request, res: Response, next: NextFunction) => {
    if (req.method !== 'POST') {
      return res.status(400).json({ error: 'Invalid request method.' });
    }

    if (!req.is('application/json')) {
      return res.status(400).json({ error: 'Invalid content type. Expected JSON.' });
    }

    if (!validate(req.body)) {
      return res.status(400).json({ error: 'Invalid request body.' });
    }

    next();
  };
};

// User router
export const userRouter = express.Router();

// Create user endpoint
userRouter.post('/', validateRequest(userSchema), async (req: Request, res: Response) => {
  // Handle user creation logic
  // Access the validated request body using req.body
  const { username, password, email } = req.body;

  try {
    const db = await connectToDatabase(); // Connect to the database
    const request = new MSSQLRequest(db); // Create a new request object

    // Set up the SQL query with parameters
    request.input('username', username);
    request.input('password', password);
    request.input('email', email);
    const query = `INSERT INTO dbo.Users (Username, Password, Email) VALUES (@username , @password, @email);`;

    // Execute the SQL query
    await request.query(query);

    // Return success response
    res.json({ message: 'User created successfully.' });
  } catch (error) {
    console.error('Failed to create user:', error);
    res.status(500).json({ error: 'Failed to create user.' });
  }
});

// Check if user exists endpoint
userRouter.get('/exists', async (req: Request, res: Response) => {
  const { username, password } = req.query;

  if (typeof username !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ error: 'Invalid query parameters. Both username and password are required.' });
  }

  try {
    const db = await connectToDatabase(); // Connect to the database
    const userCheckRequest = new MSSQLRequest(db); // Create a new request object

    // Set up the SQL query to check user existence with parameters
    userCheckRequest.input('username', username);
    userCheckRequest.input('password', password);
    const userCheckQuery = `SELECT COUNT(*) AS UserCount FROM Users WHERE Username = @username AND Password = @password;`;

    // Execute the user check query
    const userCheckResult = await userCheckRequest.query(userCheckQuery);

    // Check if the user exists
    const userExists = userCheckResult.recordset[0].UserCount > 0;

    if (userExists) {
      // User exists, proceed to select titles and creations from notes
      const notesRequest = new MSSQLRequest(db); // Create a new request object

      // Set up the SQL query to select titles and creations from notes with the given username
      notesRequest.input('username', username);
      const notesQuery = `SELECT Title, Creation_Date FROM notes WHERE Username_FK = @username;`;

      // Execute the notes query
      const notesResult = await notesRequest.query(notesQuery);

      // Return the array of elements {title, creation}
      res.json(notesResult.recordset);
    } else {
      // User does not exist - unauthorized
      res.status(401).json({ message: 'User does not exist.' });
    }
  } catch (error) {
    console.error('Failed to check user existence:', error);
    res.status(500).json({ error: 'Failed to check user existence.' });
  }
});
