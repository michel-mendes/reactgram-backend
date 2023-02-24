import express, { NextFunction, Request, Response } from "express"
import { photoRouter } from "./PhotoRoutes"
import { userRouter } from "./UserRoutes"

const apiRouter = express()

apiRouter.use( "/users", userRouter )
apiRouter.use( "/photos", photoRouter )

apiRouter.get("/", ( req: Request, res: Response, next: NextFunction ) => {
    res.json({message: "API working"})
})

export { apiRouter }