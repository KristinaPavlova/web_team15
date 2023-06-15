import express, { Request, Response, NextFunction } from 'express';
import Ajv, { JSONSchemaType } from 'ajv';
import { ConnectionPool, Request as MSSQLRequest } from 'mssql';
import { connectToDatabase } from '../db';

// Note JSON schema
const noteSchema: JSONSchemaType<{
  title: string;
  content: string;
  username: string;
  created: number;
  last_modified: number;
}> = {
  type: 'object',
  properties: {
    title: { type: 'string' },
    content: { type: 'string' },
    username: { type: 'string' },
    created: { type: 'number' },
    last_modified: { type: 'number' },
  },
  required: ['title', 'content', 'username', 'created', 'last_modified'],
  additionalProperties: false,
};

// Request validationinteger middleware
const validateRequest = <T>(schema: JSONSchemaType<T>) => {
  const ajv = new Ajv();
  const validate = ajv.compile(schema);

  return (req: Request, res: Response, next: NextFunction) => {
    if (req.method !== 'POST' && req.method !== 'PUT') {
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

// Note router
export const noteRouter = express.Router();

// Create note endpoint
noteRouter.post('/', validateRequest(noteSchema), (req: Request, res: Response) => {
    // Handle note creation logic
    // Access the validated request body using req.body
    const { title, content, username, created, last_modified } = req.body;
    // Perform necessary operations to create a note
    
});

// Get note information endpoint
noteRouter.get('/', (req: Request, res: Response) => {
  const { title, username } = req.query;

  // Validate query parameters
  if (typeof title !== 'string' || typeof username !== 'string') {
    return res
      .status(400)
      .json({ error: 'Invalid query parameters. Both title and username are required.' });
  }

  // Perform necessary operations to retrieve note information
  // Here you can query the database or data store based on the provided title and username

  // For demonstration purposes, we assume the note exists
  const note = {
    title,
    content: 'Note content',
    username,
    created: Date.now(),
    last_modified: Date.now(),
  };

  res.status(200).json(note);
});

// Update note endpoint
noteRouter.put('/', validateRequest(noteSchema), (req: Request, res: Response) => {
    const { title, content, username, created, last_modified } = req.body;
  
    // Perform necessary operations to update the note with the given noteId
    // Here you can update the note in the database or data store based on the provided noteId
  
    res.status(200).json({ message: `Note updated.` });
  });

// Delete note endpoint
noteRouter.delete('/', async(req: Request, res: Response) => {
  const { title, username } = req.query;

  // Validate query parameters
  if (typeof title !== 'string' || typeof username !== 'string') {
    return res
      .status(400)
      .json({ error: 'Invalid query parameters. Both title and username are required.' });
  }

  try {
    const db = await connectToDatabase(); // Connect to the database
    const deleteRequest = new MSSQLRequest(db); // Create a new request object

    // Set up the SQL query to delete the note from the "notes" table with parameters
    deleteRequest.input('title', title);
    deleteRequest.input('username', username);
    const deleteQuery = `DELETE FROM notes WHERE title = @title AND username = @username;`;

    // Execute the delete query
    await deleteRequest.query(deleteQuery);

    res.status(200).json({ message: 'Note deleted.' });
  } catch (error) {
    console.error('Failed to delete the note:', error);
    res.status(500).json({ error: 'Failed to delete the note.' });
  }
  });
  