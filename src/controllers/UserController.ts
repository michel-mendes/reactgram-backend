import { NextFunction, Request, Response } from "express";
import { User } from "../models/User";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import mongoose from "mongoose";

const jwtSecret = process.env.JWT_SECRET!

// Helper functions
function generateToken( userId: string ) {
    return jwt.sign( { userId }, jwtSecret, { expiresIn: "7d" })
}

// Register and sign in the User
async function register(req: Request, res: Response, next: NextFunction) {
    const { name, email, password } = req.body

    const user = await User.findOne( {email} )

    // Check if email already exists
    if ( user ) {
        res.status(422).json({message: "Email already registered"})
        return
    }

    // Hashes the password
    const salt = await bcrypt.genSalt()
    const passwordHash = await bcrypt.hash( password, salt )

    const newUser = await User.create({
        name,
        email,
        password: passwordHash
    })

    if ( !newUser ) {
        res.status(422).json({message: "Error while creating new user"})
    }

    res.status(201).json({
        _id: newUser._id,
        token: generateToken( newUser._id.toString() )
    })
}

async function login(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body
    const user = await User.findOne( {email} )

    // Check if user exists
    if ( !user ) {
        res.status(404).json({message: "User not found"})
        return
    }

    // Check if massword matches
    if ( !( await bcrypt.compare( password, user.password! ) ) ) {
        res.status(422).json({message: "Invalid password"})
        return
    }

    // Return user with token
    res.status(201).json({
        _id: user._id,
        profileImage: user.profileImage,
        token: generateToken( user._id.toString() )
    })
}

async function getCurrenUser(req: Request, res: Response, next: NextFunction) {
    const user = (req as any).user

    res.status(200).json( user )
}

async function getUserById(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params

    const user = await User.findById( id ).select("-password")

    // Check if user found
    if ( !user ) {
        return res.status(404).json({message: "User not found"})
    }

    res.status(200).json( user )
}

async function update(req: Request, res: Response, next: NextFunction) {
    const { name, password, bio } = req.body
    const reqUser = (req as any).user
    let profileImage: string | null = null

    // Check if there's an image file in the request
    if ( req.file ) {
        profileImage = req.file.filename
    }

    const user = await User.findById( new mongoose.Types.ObjectId( reqUser._id ) ).select("-password")

    if ( !user ) {
        return res.status(404).json({ message: "User not found" })
    }
    
    if ( name ) {
        user.name = name
    }

    if ( password ) {
        // Hashes the password
        const salt = await bcrypt.genSalt()
        const passwordHash = await bcrypt.hash(password, salt)

        user.password = passwordHash
    }

    if ( profileImage ) {
        user.profileImage = profileImage
    }

    if ( bio ) {
        user.bio = bio
    }

    await user.save()

    res.status(200).json( user )
}

export {
    register, login, getCurrenUser, update, getUserById
}