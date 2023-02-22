import express, { NextFunction, Request, Response } from "express"
import { userRouter } from "./UserRoutes"

const apiRouter = express()

apiRouter.use( "/user", userRouter )

apiRouter.get("/", ( req: Request, res: Response, next: NextFunction ) => {
    res.json({message: "API working"})
})

export { apiRouter }