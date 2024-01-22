import express  from "express";
import useController from "../controllers/useController.js"


const router = express.Router();

router.post('/register',useController.registerUser)


export default router