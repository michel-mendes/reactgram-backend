import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs"

interface IUser extends mongoose.Document {
    id:            string;
    name:           string;
    email:          string;
    password:       string;
    profileImage:   string;
    bio:            string;
}

interface IUserMethods {
    isPasswordCorrect( password: string ): Promise<boolean>
}

const userSchema = new Schema< IUser >({
    name:           String,
    email:          String,
    password:       String,
    profileImage:   String,
    bio:            String
},
{
    timestamps: true,
    toJSON: {
        virtuals: true,     // This will show an "id" key property
        versionKey: false,  // This will not show the "_v" key property
        transform: ( doc, ret ) => {
            delete ret._id
            delete ret.password
        }
    }
})

userSchema.method( "isPasswordCorrect", async function isPasswordCorrect( password: string ): Promise< boolean > {
    const user: IUser = this

    // Return "true" if the password matches
    return await bcrypt.compare( password, user.password )
} )

userSchema.pre( "save", async function( next ) {
    const user: IUser = this

    // If password isn't changed, there's nothing to do here
    if ( !user.isModified( "password" ) ) {
        return next()
    }

    const salt = await bcrypt.genSalt()
    user.password = await bcrypt.hash( user.password, salt )

    // Password successfully hashed, go ahead
    next()
} )

const User = mongoose.model< IUser & IUserMethods >( "User", userSchema )

export { User }