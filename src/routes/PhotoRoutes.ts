import express from "express"

const photoRouter = express.Router()

// Controller
import { insertPhoto } from "../controllers/PhotoController"

// Middlewares
import { authGuard } from "../middlewares/authGuard"
import { validate } from "../middlewares/handle-validation"
import { photoInsertValidation } from "../middlewares/photoValidation"
import { imageUpload } from "../middlewares/imageUpload"

// Routes
photoRouter.post("/", authGuard, imageUpload.single( "image" ), photoInsertValidation(), validate, insertPhoto)

export { photoRouter }