import express, { Request } from "express";
import { Types } from "mongoose";

export interface IAuthenticatedRequest extends Request {
    user?: {
        id:             Types.ObjectId;
        name:           string;
        email:          string;
        profileImage:   string;
        bio:            string;
    }
}