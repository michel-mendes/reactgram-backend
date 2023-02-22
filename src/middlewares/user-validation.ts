import { body } from "express-validator"

function userCreateValidation() {
    
    return [
        body( "name" ).notEmpty().withMessage("'name' must not be empty"),
        body( "email" ).notEmpty().withMessage("'email' must not be empty").isEmail().withMessage("'email' must be a valid email address"),
        body( "password" ).notEmpty().withMessage("'password' must not be empty").isLength({min: 6}).withMessage("'password' must have at least 6 characters")
    ]

}

function loginValidation() {

    return [
        body( "email" ).notEmpty().withMessage("'email' must be sent in order to continue with login").isEmail().withMessage("'email' must be a valid email address"),
        body( "password" ).notEmpty().withMessage("'password' must be sent in order to continue with login").isLength({min: 6}).withMessage("'password' must have at least 6 characters")
    ]

}

export { userCreateValidation, loginValidation }