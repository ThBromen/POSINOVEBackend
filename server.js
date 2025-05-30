import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import connectDB from './configuration/db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(
  cors({
    origin: 'https://posinovebackend.onrender.com', 
    credentials: true, 
  })
);

app.use(express.json()); 
app.use(cookieParser()); 

app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.listen(PORT, () => {
  console.log(`Server is running on https://posinovebackend.onrender.com:${PORT}`);
});
