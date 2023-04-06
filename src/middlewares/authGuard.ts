import { Request, Response, NextFunction } from "express"
import { User as userModel } from "../models/User";
import { GenericMongooseModelCRUD } from "../classes/MongooseModelCRUD";
import jwt from "jsonwebtoken"
import { IAuthenticatedRequest } from "../types/AuthenticatedRequest";

const secret = process.env.JWT_SECRET!
const crud = new GenericMongooseModelCRUD( userModel )

async function authGuard(req: IAuthenticatedRequest, res: Response, next: NextFunction) {

    const authHeader = req.headers["authorization"]
    const token = ( authHeader && authHeader.split( " " )[1] )

    // Check if token exists on request
    if ( !token ) {
        return res.status(401).json({message: "Unauthorized"})
    }

    // Check if token is valid
    try {
        const verified = jwt.verify( token, secret ) as any;
        req.user = await crud.findDocumentById( verified.userId )

        next()
    } catch (error: any) {
        res.status(401).json({message: "Invalid token"})
    }
}

export { authGuard }