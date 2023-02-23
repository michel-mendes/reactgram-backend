import express from "express"
import { register, login, getCurrenUser, update, getUserById } from "../controllers/UserController"

// Authorization
import { authGuard } from "../middlewares/authGuard"

// Validation middleware
import { validate } from "../middlewares/handle-validation"
import { imageUpload } from "../middlewares/imageUpload"
import { userCreateValidation, loginValidation, userUpdateValidation } from "../middlewares/user-validation"

const userRouter = express.Router()

userRouter.post( "/register", userCreateValidation(), validate, register )
userRouter.post( "/login", loginValidation(), validate, login )
userRouter.get ( "/profile", authGuard, getCurrenUser )
userRouter.put ( "/", authGuard, userUpdateValidation(), validate, imageUpload.single( "profileImage" ), update )
userRouter.get ( "/:id", getUserById )

export { userRouter }