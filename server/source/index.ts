import express from 'express';
import bodyParser from 'body-parser';
import { userRouter } from './routes/userRoutes';
import { noteRouter } from './routes/noteRoutes';
import { connectToDatabase } from './db';

// Express app setup
const app = express();

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  next();
});

app.use(bodyParser.json());
// Routes
app.use('/users', userRouter);
app.use('/notes', noteRouter);

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`) });
