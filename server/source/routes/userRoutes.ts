import express, { Request, Response, NextFunction } from 'express';
import Ajv, { JSONSchemaType } from 'ajv';

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
  additionalProperties: true,
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
userRouter.post('/', validateRequest(userSchema), (req: Request, res: Response) => {
  // Handle user creation logic
  // Access the validated request body using req.body
  const { username, password, email } = req.body;
  // Perform necessary operations to create a user

  // Return success response
  res.json({ message: 'User created successfully.' });
});

// Check if user exists endpoint
userRouter.get('/exists', (req: Request, res: Response) => {
  const { username, password } = req.query;

  if (typeof username !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ error: 'Invalid query parameters. Both username and password are required.' });
  }

  // Perform user existence check logic
  // Here you can check if the user with the provided username and password exists in your data store or database

  // For demonstration purposes, we assume the user exists
  const userExists = true;

  if (userExists) {
    res.json({ message: 'User exists.' });
  } else {
    res.json({ message: 'User does not exist.' });
  }
});
