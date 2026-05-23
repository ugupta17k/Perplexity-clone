import type { NextFunction, Request, Response } from "express";
import { createSupabaseClient } from "./client";

const client = createSupabaseClient()

export async function middleware(req:Request, res:Response, next:NextFunction){
    const token = req.headers.authorization;
    const data = await client.auth.getUser(token)
    const userId = data.data.user?.id
    if(userId){
        req.body = userId
    }else{
        res.status(403).json({
            message:"user not found in middleware"
        })
    }
}