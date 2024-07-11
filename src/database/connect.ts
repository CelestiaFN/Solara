import mongoose from "mongoose";
import { config } from "..";
import logger from "../utils/logger/logger";

mongoose.set('strictQuery', false);
mongoose.connect(config.DB_URL);

mongoose.connection.on('connected', () => {
    logger.startup('Connected to Database');
});

mongoose.connection.on('error', (error) => {
    logger.error('Database connection error:', error);
});
