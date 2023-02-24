import express from "express"

const photoRouter = express.Router()

// Controller
import { deletePhoto, insertPhoto, getAllPhotos, getUserPhotos, getPhotoById, updatePhoto, likePhoto, commentPhoto, searchPhotos } from "../controllers/PhotoController"

// Middlewares
import { authGuard } from "../middlewares/authGuard"
import { validate } from "../middlewares/handle-validation"
import { photoInsertValidation, photoUpdateValidation, photoCommentValidation } from "../middlewares/photoValidation"
import { imageUpload } from "../middlewares/imageUpload"

// Routes
photoRouter.get("/search", authGuard, searchPhotos)
photoRouter.get("/user/:id", authGuard, getUserPhotos)
photoRouter.put("/like/:id", authGuard, likePhoto)
photoRouter.put("/comment/:id", authGuard, photoCommentValidation(), validate, commentPhoto)

photoRouter.post("/", authGuard, imageUpload.single( "image" ), photoInsertValidation(), validate, insertPhoto)
photoRouter.get("/", authGuard, getAllPhotos)

photoRouter.get("/:id", authGuard, getPhotoById)
photoRouter.put("/:id", authGuard, photoUpdateValidation(), validate, updatePhoto)
photoRouter.delete("/:id", authGuard, deletePhoto)

export { photoRouter }