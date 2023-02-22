import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";

function validate( req: Request, res: Response, next: NextFunction) {

    const errors = validationResult( req )

    // Continue the route flow case there are no errors
    if ( errors.isEmpty() ) {
        return next()
    }

    const errorsList: Array< string > = []

    errors.array().map( (error) => errorsList.push( error.msg ) )

    // Send only the first error instead of sending the array itself
    return res.status(422).json({
        message: errorsList[0]
    })

}

export { validate }