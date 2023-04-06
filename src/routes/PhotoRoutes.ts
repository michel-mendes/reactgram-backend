import express from "express"

const photoRouter = express.Router()

// Controller
import { photoController } from "../controllers/PhotoController"

// Middlewares
import { authGuard } from "../middlewares/authGuard"
import { validate } from "../middlewares/handle-validation"
import { photoInsertValidation, photoUpdateValidation, photoCommentValidation } from "../middlewares/photoValidation"
import { imageUpload } from "../middlewares/imageUpload"

// Routes
photoRouter.get("/search", authGuard, photoController.searchPhotos)
photoRouter.get("/user/:id", authGuard, photoController.getUserPhotos)
photoRouter.put("/like/:id", authGuard, photoController.likePhoto)
photoRouter.put("/comment/:id", authGuard, photoCommentValidation(), validate, photoController.commentPhoto)

photoRouter.post("/", authGuard, imageUpload.single( "image" ), photoInsertValidation(), validate, photoController.insertPhoto)
photoRouter.get("/", authGuard, photoController.getAllPhotos)

photoRouter.get("/:id", authGuard, photoController.getPhotoById)
photoRouter.put("/:id", authGuard, photoUpdateValidation(), validate, photoController.updatePhoto)
photoRouter.delete("/:id", authGuard, photoController.deletePhoto)

export { photoRouter }