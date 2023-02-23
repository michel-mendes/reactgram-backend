import { Request } from "express";
import multer from "multer";
import path from "path"

// Where image will be saved
const imageStorage = multer.diskStorage({
    destination: setFilePath,
    filename: setFileName
})

function setFilePath(req: Request, file: Express.Multer.File, callback: (error: Error | null, destination: string) => void) {
    let folder = ""

    if ( req.baseUrl.includes( "user" ) ) {
        folder = "user"
    } else if ( req.baseUrl.includes( "photo" ) ) {
        folder = "photos"
    }

    callback( null, `src/uploads/${ folder }/` )
}

function setFileName(req: Request, file: Express.Multer.File, callback: (error: Error | null, filename: string) => void) {
    // Gives to the uploaded file the following name: $timestamp.$fileExtension
    callback( null, `${ Date.now().toString() }${ path.extname( file.originalname ) }` )
}

function extensionFilter(req: Request, file: Express.Multer.File, callback: multer.FileFilterCallback) {
    // Check if the file extension is PNG or JPG
    if ( !file.originalname.match( /\.(png|jpg)$/ ) ) {

        // Not PNG neither JPG
        return callback( new Error( "Only .PNG or .JPG files are supported" ) )

    }

    // Accept the received file
    callback( null, true )
}

const imageUpload = multer({
    storage: imageStorage,
    fileFilter: extensionFilter
})

export { imageUpload }