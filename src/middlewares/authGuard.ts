import { Request, Response, NextFunction } from "express"
import { User } from "../models/User";
import jwt from "jsonwebtoken"

const secret = process.env.JWT_SECRET!

async function authGuard(req: Request, res: Response, next: NextFunction) {

    const authHeader = req.headers["authorization"]
    const token = ( authHeader && authHeader.split( " " )[1] )

    // Check if token exists on request
    if ( !token ) {
        return res.status(401).json({message: "Unauthorized"})
    }

    // Check if token is valid
    try {

        const verified = jwt.verify( token, secret ) as any;

        (req as any).user = await User.findById( verified.userId ).select("-password")

        next()
        
    } catch (error: any) {
        res.status(401).json({message: "Invalid token"})
    }
}

export { authGuard }