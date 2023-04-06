import mongoose, { Schema, SchemaType, Types } from "mongoose";

export interface IComment {
    comment:    string,
    userName:   string,
    userImage:  string,
    userId:     Types.ObjectId
}

interface IPhoto extends mongoose.Document {
    image:      string,
    title:      string,
    likes:       Array< Types.ObjectId >,
    comments:   Array< IComment >,
    userId:     Types.ObjectId,
    userName:   string
}

const photoSchema = new Schema< IPhoto >({
    image:      String,
    title:      String,
    likes:      Array,
    comments:   Array,
    userId:     mongoose.SchemaTypes.ObjectId,
    userName:   String
},
{
    timestamps: true,
    toJSON: {
        virtuals: true,
        versionKey: false,
        transform: ( doc, ret ) => {
            delete ret._id
        }
    }
})

const Photo = mongoose.model< IPhoto >("Photo", photoSchema)

export { Photo }