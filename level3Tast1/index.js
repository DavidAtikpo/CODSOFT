import express from "express"
import bodyParser from "body-parser"
import dbConnect from "./db/config.js";
import dotenv from "dotenv"
import userRoute from "./routes/userRoute.js"
import errorHandler from "./middleware/errorHandler.js";

const app = express();
const PORT = process.env.PORT || 6000;
dbConnect();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.use("/api/user",userRoute)
app.use(errorHandler.notFound)
app.use(errorHandler.errorHandler)


app.listen(PORT,()=>{
    console.log(`Server is running at PORT ${PORT}`);
})