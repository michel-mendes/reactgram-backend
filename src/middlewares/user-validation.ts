import { body } from "express-validator"

function userCreateValidation() {
    
    return [
        body( "name" ).notEmpty().withMessage("'name' must not be empty").isLength({ min: 3 }).withMessage( "'name' must have at least 3 characters" ),
        body( "email" ).notEmpty().withMessage("'email' must not be empty").isEmail().withMessage("'email' must be a valid email address"),
        body( "password" ).notEmpty().withMessage("'password' must not be empty").isLength({min: 6}).withMessage("'password' must have at least 6 characters"),
        body( "confirmPassword" ).notEmpty().withMessage("'confirmPassword' must not be empty").isLength({min: 6}).withMessage("'password' must have at least 6 characters")
    ]

}

function loginValidation() {

    return [
        body( "email" ).notEmpty().withMessage("'email' must be sent in order to continue with login").isEmail().withMessage("'email' must be a valid email address"),
        body( "password" ).notEmpty().withMessage("'password' must be sent in order to continue with login").isLength({min: 6}).withMessage("'password' must have at least 6 characters")
    ]

}

function userUpdateValidation() {

    return [
        body( "name" ).optional().isLength({ min: 3 }).withMessage( "'name' must have at least 3 characters" ),
        body( "password" ).optional().isLength({min: 6}).withMessage("'password' must have at least 6 characters"),
        body( "bio" ).optional()
    ]
}

export { userCreateValidation, loginValidation, userUpdateValidation }