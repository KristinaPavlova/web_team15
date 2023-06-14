import express from 'express';
import bodyParser from 'body-parser';
import { userRouter } from './routes/user';
import { connectToDatabase } from './db'; // Update the import statement

// Express app setup
const app = express();
app.use(bodyParser.json());

// Connect to the database
// connectToDatabase();

// Routes
app.use('/users', userRouter);

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
