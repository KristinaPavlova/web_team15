import express from 'express';
import bodyParser from 'body-parser';
import { userRouter } from './routes/userRoutes';
import { noteRouter } from './routes/noteRoutes';
import { connectToDatabase } from './db';

// Express app setup
const app = express();
app.use(bodyParser.json());

// Connect to the database
//connectToDatabase();

// Routes
app.use('/users', userRouter);
app.use('/notes', noteRouter);

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`) });
