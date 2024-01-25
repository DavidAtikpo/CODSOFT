import userModel from "../models/userModel.js"
import asyncHandler from "express-async-handler"
import generateToken from "../db/jwtToken.js";
import generateRefreshToken from "../db/refreshToken.js";
import sendEmail from "./emailController.js";
import jwt  from "jsonwebtoken";


const registerUser = asyncHandler(async (req, res) => {
    try {
      const email = req.body.email;
      const existEmail = await userModel.findOne({ email });
  
      if (existEmail) {
        // Email already exists, send a proper response
        return res.status(400).json({ error: "Email already exists" });
      }
  
      const newUser = await userModel.create(req.body);
      
  
      // Successfully registered user, send a success response
      res.status(201).json({ message: "User registered successfully", user: newUser });
    } catch (error) {
      // Log the error and send an error response to the client
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
// login user

const loginUser =asyncHandler(async(req,res)=>{
    try {
       const {email,password}= req.body;
       const existEmail= await userModel.findOne({email});
       if(existEmail&& await existEmail.isPasswordMatched(password)){
        const refreshToken = await generateRefreshToken(existEmail?.id)
        const updateuser = await userModel.findByIdAndUpdate(existEmail?.id ,{refreshToken},{new:true})
        res.cookie('refreshToken', refreshToken,{
            httpOnly:true,
            maxAge:72*60*60*1000,
        })
        res.json({
            _id:existEmail._id,
            firstname:existEmail?.firstname,
            lastname:existEmail?.lastname,
            phonumber:existEmail?.phonenumber,
            token:generateToken(existEmail?.id)
        })
       }else{
        throw new Error("Invalid credentials")
       }

    } catch (error) {
        throw new Error(error)
    }
})

// forgot pawword
const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;
  
    // Search for the user by email
    const user = await userModel.findOne({ email });
  
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found with this email' });
      return;
    }
  
    try {
      const token = await user.createPasswordResetToken();
      await user.save();
      const resetURL = `Hi, please follow this link to reset your password. This link is valid until 10 minutes from now. <a href="http://localhost:6000/api/user/reset-password/${token}">Click here</a>`;
  
      const data = {
        to: email, // Ajoutez cette ligne pour spécifier le destinataire
        text: 'Hey User',
        subject: 'Forgot Password Link',
        html: resetURL,
      };
  
      // Pass the 'res' object to the sendEmail function
      await sendEmail(data, res);
  
      return res.status(200).json({ success: true, message: 'Password reset link sent successfully' });
    } catch (error) {
      console.error('Error sending email:', error);
      return res.status(500).json({ success: false, message: 'Failed to send email' });
    }
});

 //reset pssaword 

 const resetPassword = asyncHandler(async(req,res)=>{
    const {password} = req.body;
    const {token} = req.params;
    const hashedToken =crypto.createHash("sha256").update(token).digest("hex");
    const user = await userModel.findOne({
        createPasswordResetToken:hashedToken,
        passwordRestExpires:{$gt:Date.now()},
    });
    if(!user) throw new Error("token expired please try again later")
    user.password.password;
user.createPasswordResetToken= undefined;
user.passwordRestExpires=undefined;
await user.save();
res.json(user);
})
// handle refresh token

const handleRefreshToken = asyncHandler(async(req,res)=>{
    const cookie =req.cookies;
    if(!cookie?.refreshToken) throw new Error('no refresh token in the cookies')
    const refreshToken = cookie.refreshToken;
const user = await userModel.findOne({refreshToken});
if(!user) throw new Error('no refresh token present in the db or not match')
jwt.verify(refreshToken,precess.env.SECRET_TOKEN,(err, decoded)=>{
    if(err|| user.id !== decoded.id){
        throw new Error('there is something wrong with refresh token')
    };
    const accessToken = generateToken(user?.id);
    res.json({accessToken});
});

});

// get user 

const getUser = asyncHandler(async(req,res)=>{
  const token = req.headers;
  try {
    const {id} = req.params;
    const getuser = await userModel.findById(id)
    if(getuser){
      res.json(getuser)
    }else{
    res.json("User not found")
    };

  } catch (error) {
    throw new Error(error)
  }
});

// get all users 

const getAllUsers = asyncHandler(async(req,res)=>{
  const token = req.headers;
  try {
    const Users = req.headers;
    const finUsers = await userModel.find()
    res.json(finUsers)
  } catch (error) {
    throw new Error(error)
  }
});

// update user

const updateuser = asyncHandler(async(req,res)=>{
  const authorizationHeader =req.headers.authorization;
  try {
    const token = authorizationHeader.split(" ")[1]
    const userData = req.body;
    const decoded = jwt.verify(token,process.env.SECRET_TOKEN)
    const userId =decoded.id
    const updateuser = await userModel.findByIdAndUpdate(userId,{
    firstname:userData.firstname,
    lastname:userData.lastname,
    email:userData.email,
    phonenumber:userData.phonenumber,
    },{new:true})

    if(updateuser){
      res.json(updateuser)
    } else{
      res.json("user not found")
    }
    
  } catch (error) {
    throw new Error(error)
  }
});

// delete user 

const deleteUser = asyncHandler(async(req,res)=>{
  const token = req.headers;
  try {

    const {id} = req.params;
    const deleteuser = await userModel.findByIdAndDelete(id)
    if(deleteuser){
      res.json("User deleted successfully")
    }else{
      res.json("user not found")
    }

  } catch (error) {
    throw  new Error(error) 
  }
});

// update password

const updatePassword =asyncHandler(async(req,res)=>{
  const {_id}= req.user;
  try {
    const {password} = req.body;
    const findUser = await userModel.findById(_id)
    if(findUser){
      findUser.password= password;
      const updatePassword = findUser.save()
      res.json(updatePassword)
    }else{
      res.json(findUser)
    }
  } catch (error) {
    throw new Error(error)
  }
})




export default {registerUser,loginUser,forgotPassword,resetPassword ,handleRefreshToken,getUser,getAllUsers,updateuser,deleteUser,updatePassword}