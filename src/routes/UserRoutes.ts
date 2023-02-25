import express from "express"
import { userController } from "../controllers/UserController"

// Authorization
import { authGuard } from "../middlewares/authGuard"

// Validation middleware
import { validate } from "../middlewares/handle-validation"
import { imageUpload } from "../middlewares/imageUpload"
import { userCreateValidation, loginValidation, userUpdateValidation } from "../middlewares/user-validation"

const userRouter = express.Router()

userRouter.post( "/register",   userCreateValidation(), validate, userController.register )
userRouter.post( "/login",      loginValidation(), validate, userController.login )
userRouter.get ( "/profile",    authGuard, userController.getCurrenUser )
userRouter.put ( "/",           authGuard, userUpdateValidation(), validate, imageUpload.single( "profileImage" ), userController.update )
userRouter.get ( "/:id",        userController.getUserById )

export { userRouter }