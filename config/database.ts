import { logger } from "./logger";
import mongoose from "mongoose";
import config from "config"

export async function connectDatabase() {

    const connectionString  = config.get<string>( "connectionString" )

    try {

        await mongoose.connect( connectionString )
        logger.info(`Successfully connected to MongoDB Atlas"`)
        
    } catch (e) {
        logger.info("Error while connecting to database")
        logger.error(`Error while connecting to database >> ${e}`)
        process.exit(1)
    }

}