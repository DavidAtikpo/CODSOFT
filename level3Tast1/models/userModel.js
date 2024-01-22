import mongoose from "mongoose"
import bcrypt from "bcrypt"


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

},{timestamps:true});

userSchema.pre("save", async function(next){
    if(!this.isModified("password")){
        next();
    }
    const salt = bcrypt.genSaltSync(10);
    this.password =await bcrypt.hash(this.password,salt)
})
 

export default mongoose.model("userModel",userSchema);