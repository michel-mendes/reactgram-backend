import express from "express"
import { register, login, getCurrenUser } from "../controllers/UserController"

// Authorization
import { authGuard } from "../middlewares/authGuard"

// Validation middleware
import { validate } from "../middlewares/handle-validation"
import { userCreateValidation, loginValidation } from "../middlewares/user-validation"

const userRouter = express.Router()

userRouter.post( "/register", userCreateValidation(), validate, register )
userRouter.post( "/login", loginValidation(), validate, login )
userRouter.get ( "/profile", authGuard, getCurrenUser )

export { userRouter }