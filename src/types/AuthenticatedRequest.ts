import express, { Request } from "express";

export interface IAuthenticatedRequest extends Request {
    user: {
        id:             string;
        name:           string;
        email:          string;
        profileImage:   string;
        bio:            string;
    }
}