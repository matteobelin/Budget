import express from 'express';
import { connectDB } from './dataBase/db';
import { connectRedis } from './dataBase/redis';
import authRoutes from './routes/auth';
import getMe from './routes/getMe';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import {authMiddleware} from "./middleware/authMiddleWare"
import categoryRoutes from "./routes/category"
import depenseRoutes from "./routes/depense"


const app = express();
const port = 3000;

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true 
}));

app.use(cookieParser());
app.use(express.json());

app.use('/auth', authRoutes);
app.use("/category",authMiddleware,categoryRoutes)
app.use("/depense",authMiddleware,depenseRoutes)
app.use(getMe);


(async () => {
  try {
    await connectDB();
    await connectRedis()
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  } catch (err) {
    console.error("Failed to connect to DB", err);
    process.exit(1);
  }
})();
