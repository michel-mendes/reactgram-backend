import {Request, Response, NextFunction} from "express"
import jwt from "jsonwebtoken"

// Route types
import { IAuthenticatedRequest } from "../types/AuthenticatedRequest"

// Database management
import { User as userModel } from "../models/User";
import { GenericMongooseModelCRUD } from "../classes/MongooseModelCRUD"

const jwtSecret = process.env.JWT_SECRET!
const crud = new GenericMongooseModelCRUD( userModel )

export const userController = {
    register, login, getCurrenUser, update, getUserById
}

// REGISTER AND SIGN IN THE USER
// async function register( {reque, req, res, next}: IDefaultRoute ) {
async function register( req: Request, res: Response, next: NextFunction ) {
    try {
        const { email } = req.body
    
        const existingUser = await crud.findOneDocument( {email} )
        if ( existingUser ) return res.status(422).json({message: "Email already registered"})
    
        const newUser = await crud.insertDocument( req.body )
    
        res.status(201).json({
            ...newUser.toJSON(),
            token: generateToken( newUser.id.toString() )
        })
    } catch (error: any) {
        next( error )
    }
}

// LOGIN THE USER
async function login( req: Request, res: Response, next: NextFunction ) {
    try {
        const { email, password } = req.body
        const user = await crud.findOneDocument({ email })
        
        if ( !user ) return res.status(404).json({message: "User not found"})
    
        // If incorrect password, return error
        if ( !( await user.isPasswordCorrect( password ) ) ) return res.status(422).json({message: "Invalid password"})
    
        // Return user with authorization token
        res.status(201).json({
            userId: user.id,
            profileImage: user.profileImage,
            token: generateToken( user.id.toString() )
        })
    } catch (error: any) {
        next( error )
    }
}

// GET CURRENT LOGGED IN USER
async function getCurrenUser( req: IAuthenticatedRequest, res: Response, next: NextFunction ) {
    try {
        res.status(200).json( req.user )
    } catch (error: any) {
        next( error )
    }
}

// GET USER BY ID
async function getUserById( req: Request, res: Response, next: NextFunction ) {
    try {
        const { id } = req.params
        const user = await crud.findDocumentById( id )
    
        res.status(200).json( user )
    } catch (error: any) {
        next( error )
    }
}

// UPDATE THE USER
async function update( req: IAuthenticatedRequest, res: Response, next: NextFunction ) {
    try {
        let profileImage: string | null = null
    
        // Check if there's an image file in the request
        if ( req.file ) {
            profileImage = req.file.filename
        }
        
        const updatedUser = await crud.editDocument( req.user!.id.toString(), { ...req.body, profileImage } )
        
        res.status(200).json( updatedUser )
    } catch (error: any) {
        next( error )
    }
}


// HELPER FUNCTIONS
function generateToken( userId: string ) {
    return jwt.sign( { userId }, jwtSecret, { expiresIn: "7d" })
}