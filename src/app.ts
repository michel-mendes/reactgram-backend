import dotenv from "dotenv"
dotenv.config()

import { logger } from "../config/logger"
import { connectDatabase } from "../config/database"
import express, { NextFunction, Request, Response } from "express"
import { handleCustomErrors, handle404Error } from "./middlewares/error-handler"
import path from "path"
import cors from "cors"

// App routes
import { apiRouter } from "./routes/ApiRoutes"

const port = process.env.PORT

const app = express()

// CORS issues
app.use( cors( { credentials: true, origin: "http://localhost:5001" } ) )

// App middlewares
app.use( express.json() )
app.use( express.urlencoded( {extended: false} ) )
app.use( "/uploads", express.static( path.join( __dirname, "/uploads" ) ) )


// App routes
app.use( "/api", apiRouter )

// Error handler
app.use( handleCustomErrors )
app.use( handle404Error )

app.listen( port, async () => {

    // Database connection
    await connectDatabase()
    
    logger.info( `Server running on port ${ port }` )
} )