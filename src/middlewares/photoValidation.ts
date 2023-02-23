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

export { photoInsertValidation }