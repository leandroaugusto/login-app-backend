import 'dotenv/config';

import cookieParser from 'cookie-parser';
import express from 'express';
import cors, { CorsOptions } from 'cors';

import connectDB from './config/db';
import authRoutes from './routes/authRoutes';
import usersRoutes from './routes/usersRoutes';

const whitelist = ['http://localhost:3000', 'http://localhost:5173'];
const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin as string) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
};

const app = express();

connectDB();

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
