import jwt from "jsonwebtoken";


const generateToken = (id)=>{
    return jwt.sign({id},process.env.SECRET_TOKEN,{expiresIn:"1d"})
}

export default generateToken