import userModel from "../models/userModel.js"
import asyncHandler from "express-async-handler"

const registerUser =asyncHandler(async(req,res)=>{
    try {
    
        const email =req.body.email;
    
        const existEmail= await userModel.findOne({email});
        if(existEmail){
            res.json("Email already exist")
        }
       const newUser = await userModel.create(req.body)
        res.json("Successfully")

    } catch (error) {
        throw new Error(error)
    }
})

export default {registerUser}