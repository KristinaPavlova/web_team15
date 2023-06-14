import express, { Request, Response, NextFunction } from 'express';
import Ajv, { JSONSchemaType } from 'ajv';
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
    created: { type: 'integer' },
    last_modified: { type: 'integer' },
  },
  required: ['title', 'content', 'username', 'created', 'last_modified'],
  additionalProperties: true,
};

// Request validation middleware
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

    try {
        const connection = connectToDatabase();
        const query = 'INSERT INTO Notes (Title, Content, Username, CreateDate, LastModified) VALUES (?, ?, ?, ?, ?)';
        const values = [title, content, username, created, last_modified];

        connection.query(query, values, (error) => {
            if (error) {
                console.error('Failed to create note:', error);
                return res.status(500).json({ error: 'Failed to create note.' });
            }

            console.log('Note created.');
            return res.status(200).json({ message: 'Note created.' });
        });
    } catch (error) {
        console.error('Failed to connect to the database:', error);
        return res.status(500).json({ error: 'Failed to create note.' });
    }
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
noteRouter.delete('/', (req: Request, res: Response) => {
    const { title, username } = req.query;
  
    // Validate query parameters
    if (typeof title !== 'string' || typeof username !== 'string') {
      return res
        .status(400)
        .json({ error: 'Invalid query parameters. Both title and username are required.' });
    }
  
    // Perform necessary operations to delete the note
    // Here you can delete the note from the database or data store based on the provided title and username
  
    res.status(200).json({ message: 'Note deleted.' });
  });
  