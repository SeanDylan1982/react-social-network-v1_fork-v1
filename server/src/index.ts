import cloudinary from 'cloudinary';
import compression from 'compression';
import cors from 'cors';
import dotenv from 'dotenv';
import express, { Express, Request, Response } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import connectDb from './config/db';
import commentRoutes from './routes/commentRoutes';
import postRoutes from './routes/postRoutes';
import userRoutes from './routes/userRoutes';

dotenv.config({
  path: './.env',
});

// define port
const PORT = process.env.PORT || 5000;

const app: Express = express();

// secure cors options
app.use(cors({
  origin: '*',
}));

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());
app.use(morgan('dev'));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);

app.get('/', (req: Request, res: Response) => {
  return res.send("API is running...");
});

// configure cloudinary

cloudinary.v2.config({
  cloud_name: 'dmt1e9ecl',
  api_key: '455724517679442',
  api_secret: 'HWJnw7MdnvHWZAhfu6VCv6f3jaA',
});

// Start server
const startServer = async () => {
  try {
    await connectDb();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
