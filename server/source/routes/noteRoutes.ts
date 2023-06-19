import express, { Request, Response, NextFunction } from 'express';
import Ajv, { JSONSchemaType } from 'ajv';
import { ConnectionPool, Request as MSSQLRequest } from 'mssql';
import { connectToDatabase } from '../db';

// Note JSON schema
// Note JSON schema
const noteSchema: JSONSchemaType<{
  title: string;
  content: string;
  username: string;
  created: string; // Change the type to string for date-time value
  last_modified: string; // Change the type to string for date-time value
}> = {
  type: 'object',
  properties: {
    title: { type: 'string' },
    content: { type: 'string' },
    username: { type: 'string' },
    created: { type: 'string'}, // Add format 'date-time' for date-time value
    last_modified: { type: 'string'}, // Add format 'date-time' for date-time value
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

    const { title, content, username, created, last_modified } = req.body as {
      title?: string;
      content?: string;
      username?: string;
      created?: string;
      last_modified?: string;
    };

    if (!title || !content || !username || !created || !last_modified) {
      return res.status(400).json({ error: 'Invalid request body. All properties must be provided and not empty.' });
    }

    next();
  };
};

// Note router
export const noteRouter = express.Router();

// Create note endpoint
noteRouter.post('/', validateRequest(noteSchema), async (req: Request, res: Response) => {
  // Access the validated request body using req.body
  const { title, content, username, created, last_modified } = req.body;

  try {
    const db = await connectToDatabase(); // Connect to the database
    const insertRequest = new MSSQLRequest(db); // Create a new request object

    // Set up the SQL query to insert the note into the "notes" table with parameters
    insertRequest.input('title', title);
    insertRequest.input('content', content);
    insertRequest.input('username', username);
    insertRequest.input('created', created);
    insertRequest.input('last_modified', last_modified);
    const insertQuery = `INSERT INTO Notes (Title, Content, Username_FK, Creation_Date, Last_Modified_Date) VALUES (@title, @content, @username, @created, @last_modified);`;

    // Execute the insert query
    await insertRequest.query(insertQuery);

    res.status(200).json({ message: 'Note created.' });
  } catch (error) {
    console.error('Failed to create the note:', error);
    res.status(500).json({ error: 'Failed to create the note.' });
  }  
});

// Get note information endpoint
noteRouter.get('/', async(req: Request, res: Response) => {
  const { title, username } = req.query;

  // Validate query parameters
  if (!title || !username || typeof title !== 'string' || typeof username !== 'string') {
    return res
      .status(400)
      .json({ error: 'Invalid query parameters. Both title and username are required.' });
  }

  try {
    const db = await connectToDatabase(); // Connect to the database
    const selectRequest = new MSSQLRequest(db); // Create a new request object

    // Set up the SQL query to select the note from the "notes" table
    selectRequest.input('title', title);
    selectRequest.input('username', username);
    const selectQuery = `
      SELECT Title, Content, Creation_Date, Last_Modified_Date
      FROM Notes
      WHERE Title = @title AND Username_FK = @username;
    `;

    // Execute the select query
    const result = await selectRequest.query(selectQuery);

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Note not found.' });
    }

    const note = result.recordset[0];
    res.status(200).json(note);
  } catch (error) {
    console.error('Failed to retrieve the note:', error);
    res.status(500).json({ error: 'Failed to retrieve the note.' });
  }
});

// Update note endpoint
// Update note endpoint
noteRouter.put('/', validateRequest(noteSchema), async (req: Request, res: Response) => {
  const { title, content, username, created, last_modified } = req.body;

  try {
    const db = await connectToDatabase(); // Connect to the database
    const updateRequest = new MSSQLRequest(db); // Create a new request object

    // Set up the SQL query to update the note in the "notes" table with parameters
    updateRequest.input('title', title);
    updateRequest.input('content', content);
    updateRequest.input('username', username);
    updateRequest.input('created', created);
    updateRequest.input('last_modified', last_modified);
    const updateQuery = `
      UPDATE Notes
      SET Title = @title, Content = @content, Last_Modified_Date = @last_modified
      WHERE Username_FK = @username AND Creation_Date = @created;
    `;

    // Execute the update query
    const result = await updateRequest.query(updateQuery);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: 'Note not found.' });
    }

    res.status(200).json({ message: `Note updated.` });
  } catch (error) {
    console.error('Failed to update the note:', error);
    res.status(500).json({ error: 'Failed to update the note.' });
  }
});

// Delete note endpoint
noteRouter.delete('/', async(req: Request, res: Response) => {
  const { title, username } = req.query;

  // Validate query parameters
  if (!title || !username || typeof title !== 'string' || typeof username !== 'string') {
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
    const deleteQuery = `DELETE FROM Notes WHERE Title = @title AND Username_FK = @username;`;

    // Execute the delete query
    await deleteRequest.query(deleteQuery);

    res.status(200).json({ message: 'Note deleted.' });
  } catch (error) {
    console.error('Failed to delete the note:', error);
    res.status(500).json({ error: 'Failed to delete the note.' });
  }
  });
  