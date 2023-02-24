import { body, Meta } from "express-validator"

function photoInsertValidation() {

    return [
        body( "title" ).notEmpty().withMessage("'title' must be sent")
                       .isLength({ min: 3 }).withMessage( "'title' must have at least 3 characters" ),
        
        body( "image" ).custom( (value: any, meta: Meta) => {
            
            // There's no file in the request
            if ( !meta.req.file ) {
                throw new Error( "'image' must be sent as a .PNG or .JPG file" )
            }

            return true
        } )
    ]

}

function photoUpdateValidation() {

    return [
        body( "title" ).optional().notEmpty().withMessage("'title' must not be empty")
                       .isLength({ min: 3 }).withMessage( "'title' must have at least 3 characters" )
    ]

}

function photoCommentValidation() {

    return [
        body( "comment" ).notEmpty().withMessage("'comment' must be sent")
                       .isLength({ min: 3 }).withMessage( "'comment' must have at least 3 characters" )
    ]

}

export { photoInsertValidation, photoUpdateValidation, photoCommentValidation }