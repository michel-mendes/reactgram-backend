import dotenv from "dotenv"
dotenv.config()

import { logger } from "../config/logger"
import { connectDatabase } from "../config/database"
import express, { NextFunction, Request, Response } from "express"
import path from "path"
import cors from "cors"

// App routes
import { apiRouter } from "./routes/ApiRoutes"

const port = process.env.PORT

const app = express()

// CORS issues
app.use( cors( { credentials: true, origin: "http://localhost:3000" } ) )

// App middlewares
app.use( express.json() )
app.use( express.urlencoded( {extended: false} ) )
app.use( "/uploads", express.static( path.join( __dirname, "/uploads" ) ) )


// App routes
app.use( "/api", apiRouter )

app.listen( port, async () => {

    // Database connection
    await connectDatabase()
    
    logger.info( `Server running on port ${ port }` )
} )