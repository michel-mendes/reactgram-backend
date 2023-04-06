import { Request, Response, NextFunction } from "express"

// Interfaces
import { IComment } from "../models/Photo"
import { IAuthenticatedRequest } from "../types/AuthenticatedRequest"

// Database management
import { Photo as photoModel } from "../models/Photo"
import { User as userModel } from "../models/User"
import { GenericMongooseModelCRUD } from "../classes/MongooseModelCRUD"

const photoCrud = new GenericMongooseModelCRUD( photoModel )
const userCrud  = new GenericMongooseModelCRUD( userModel )

export const photoController = {
    insertPhoto, deletePhoto, getAllPhotos, getUserPhotos, getPhotoById, updatePhoto, likePhoto, commentPhoto, searchPhotos
}

// Insert photo with user related
async function insertPhoto(req: IAuthenticatedRequest, res: Response, next: NextFunction) {
    try {
        const { title } = req.body
        const image = req.file!.filename
    
        const photoData: any = {
            title,
            image,
            userId: req.user?.id,
            userName: req.user?.name
        }
        
        const newPhoto = await photoCrud.insertDocument( photoData )
    
        res.status(200).json( newPhoto )
    } catch (error: any) {
        next( error )        
    }
}

// Delete photo
async function deletePhoto(req: IAuthenticatedRequest, res: Response, next: NextFunction) {
    const { id } = req.params

    const photo = await photoCrud.findDocumentById( id )

    // Check if photo belongs to the user that is trying to delete it
    if ( !photo.userId.equals( req.user!.id ) ) {
        return res.status(401).json({message: "Unauthorized access, this operation is limited to the owner of the photo only"})
    }

    await photoCrud.deleteDocument( id )

    res.status(200).json({
        id,
        message: "Photo successfully deleted"
    })
}

// get all photos
async function getAllPhotos(req: Request, res: Response, next: NextFunction) {
    // Get the photos and ordem them by the most recent (-1) or older (1)
    const photos = await photoCrud.findDocuments({}, [], { sort: "-createdAt" })
    // const photos = await Photo.find({}).sort([ ["createdAt", -1] ]).exec()

    res.status(200).json( photos )
}

//  get user photos
async function getUserPhotos(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params

    const photos = await photoCrud.findDocuments({ userId: id }, [], { sort: "-createdAt" })
    // const photos = await Photo.find( { userId: id } ).sort([["createdAt", -1]]).exec()

    res.status(200).json( photos )
}

// Get photo by id
async function getPhotoById(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params
    const photo = await photoCrud.findDocumentById( id )

    res.status(200).json( photo )
}

// Update photo
async function updatePhoto(req: IAuthenticatedRequest, res: Response, next: NextFunction) {
    const { id } = req.params

    const photo = await photoCrud.findDocumentById( id )

    // Check if photo belongs to the user
    if ( !photo.userId.equals( req.user!.id ) ) {
        return res.status(401).json({message: "Unauthorized access, this operation is limited to the owner of the photo only"})
    }

    await photoCrud.editDocument( id, req.body )

    res.status(200).json({message: "Photo successfully updated"})
}

// Like functionality
async function likePhoto(req: IAuthenticatedRequest, res: Response, next: NextFunction) {
    try {
        const { id } = req.params
    
        const photo = await photoCrud.findDocumentById( id )
    
        // check if user already liked
        if ( photo.likes.includes( req.user!.id ) ) {
            return res.status(422).json({message: "User already liked this photo"})
        }
    
        photo.likes.push( req.user!.id )
        await photo.save()
    
        res.status(200).json({
            photoId: photo.id,
            userId: req.user?.id,
            message: "Photo successfully liked"
        })
    } catch (error: any) {
        next( error )
    }
}

// Comment a photo
async function commentPhoto(req: IAuthenticatedRequest, res: Response, next: NextFunction) {
    const { id } = req.params
    const { comment } = req.body

    // const user = await userCrud.findDocumentById( req.user.id.toString() )
    const photo = await photoCrud.findDocumentById( id )

    const userComment: IComment = {
        comment,
        userName:   req.user!.name,
        userImage:  req.user!.profileImage,
        userId:     req.user!.id
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
    const photos = await photoCrud.findDocuments({ title: new RegExp(q as string, "i") })
    // const photos = await Photo.find({ title: new RegExp(q as string, "i") }).exec()

    res.status(200).json( photos )
}