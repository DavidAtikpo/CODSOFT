import mongoose from "mongoose"
import bcrypt from "bcrypt"
import crypto from "crypto"


const userSchema = new mongoose.Schema({
    firstname:{
        type:String,
        required:true,
    },
    lastname:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    phonenumber:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    refreshToken:{
        type:String
         },
         passwordChangeAt:Date,
         passwordResetToken:String,
         passwordResetExpires:Date,
         
       },
       {
         timestamps:true
       }
       );
       
       userSchema.pre("save", async function(next){
         if(!this.isModified("password")){
           next();
         }
         const salt = bcrypt.genSaltSync(10);
         this.password = await bcrypt.hash(this.password, salt)
       });
       userSchema.methods.isPasswordMatched = async function(enteredPassword){
         return await bcrypt.compare(enteredPassword,this.password)
       };
       userSchema.methods.createPasswordResetToken= async function() {
         const resettoken =crypto.randomBytes(32).toString("hex");
         this.passwordResetToken = crypto.createHash("sha256").update(resettoken).digest("hex");
         this.passwordResetExpires = Date.now() + 30*60*1000; //10 minutes
         return resettoken
       }
  
 

export default mongoose.model("userModel",userSchema);