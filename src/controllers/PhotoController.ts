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

// Delete photo
async function deletePhoto(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params
    const reqUser = (req as any).user

    const photo = await Photo.findById( id )

    // Check if photo exists
    if ( !photo ) {
        return res.status(400).json({message: "Photo not found"})
    }

    // Check if photo belongs to the user that is trying to delete it
    if ( !photo.userId!.equals( reqUser._id ) ) {
        return res.status(422).json({message: "Something went wrong, please try again later"})
    }

    await Photo.findByIdAndDelete( id )

    res.status(200).json({id: photo._id, message: "Photo successfully deleted"})
}

// get all photos
async function getAllPhotos(req: Request, res: Response, next: NextFunction) {
    // Get the photos and ordem them by the most recent (-1) or older (1)
    const photos = await Photo.find({}).sort([ ["createdAt", -1] ]).exec()

    res.status(200).json( photos )
}

//  get user photos
async function getUserPhotos(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params

    const photos = await Photo.find( { userId: id } ).sort([["createdAt", -1]]).exec()

    res.status(200).json( photos )
}

// Get photo by id
async function getPhotoById(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params

    const photo = await Photo.findById( id )

    if ( !photo ) {
        return res.status(404).json({message: "Photo not found"})
    }

    res.status(200).json( photo )
}

// Update photo
async function updatePhoto(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params
    const { title } = req.body
    const reqUser = (req as any).user

    const photo = await Photo.findById( id )

    if ( !photo ) {
        return res.status(404).json({message: "Photo not found"})
    }

    // Check if photo belongs to the user
    if ( !photo.userId!.equals( reqUser._id ) ) {
        return res.status(401).json({message: "Unauthorized to edit other user's photo"})
    }

    if ( title ) {
        photo.title = title
    }

    await photo.save()

    res.status(200).json({message: "Photo successfully updated"})
}

// Like functionality
async function likePhoto(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params
    const reqUser = (req as any).user

    const photo = await Photo.findById( id )

    if ( !photo ) {
        return res.status(404).json({message: "Photo not found"}) 
    }

    // check if user already liked
    if ( photo.likes.includes( reqUser._id ) ) {
        return res.status(422).json({message: "User already liked this photo"})
    }

    photo.likes.push( reqUser._id )
    await photo.save()

    res.status(200).json({
        photoId: photo._id,
        userId: reqUser._id,
        message: "Photo successfully liked"
    })
}

// Comment a photo
async function commentPhoto(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params
    const { comment } = req.body
    const reqUser = (req as any).user

    const user = await User.findById( reqUser._id )
    const photo = await Photo.findById( id )

    if ( !photo ) {
        return res.status(404).json({message: "Photo not found"}) 
    }

    const userComment = {
        comment,
        userName: user?.name,
        userImage: user?.profileImage,
        iserId: user?._id
    }

    photo.comments.push( userComment )
    await photo.save()

    res.status(200).json({
        comment: userComment,
        message: "Photo successfully commented"
    })
}

async function searchPhotos(req: Request, res: Response, next: NextFunction) {
    const { q } = req.query

    // Search on the database for every photo that contains "q" value
    // Note that RegExp can elevate memory costs case the Database is too large
    const photos = await Photo.find({ title: new RegExp(q as string, "i") }).exec()

    res.status(200).json( photos )
}

export { insertPhoto, deletePhoto, getAllPhotos, getUserPhotos, getPhotoById, updatePhoto, likePhoto, commentPhoto, searchPhotos }