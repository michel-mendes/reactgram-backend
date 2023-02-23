import { Photo } from "../models/Photo"
import { User } from "../models/User"
import { Request, Response, NextFunction } from "express"
import mongoose from "mongoose"

// Insert photo with user related
async function insertPhoto(req: Request, res: Response, next: NextFunction) {
    const { title } = req.body
    const image = req.file!.filename

    const reqUser = (req as any).user
    const user = await User.findById( reqUser._id )

    // Create a photo
    const newPhoto = await Photo.create({
        image,
        title, 
        userId: user?._id,
        userName: user?.name
    })

    // Successfully created photo
    if ( !newPhoto ) {
        return res.status(422).json({message: "Something went wrong, try again later"})
    }

    res.status(200).json( newPhoto )
}

export { insertPhoto }