import mongoose from 'mongoose';
import { DB_URL } from '../config/config';

export const connectDB = async () => {
  try {
    await mongoose.connect(DB_URL);
    console.log('Connecté à MongoDB');
  } catch (error) {
    console.error('erreur lors de la connexion:', error);
    process.exit(1);
  }
};
