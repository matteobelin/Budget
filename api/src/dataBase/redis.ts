import { createClient } from 'redis';
import { REDIS_URL } from '../config/config';

export const client = createClient({ url: REDIS_URL });

export const connectRedis = async () => {
    try {
        await client.connect();
        console.log("Connecté à Redis");
    } catch (error) {
        console.error('erreur lors de la connexion:', error);
        process.exit(1);
    }
};