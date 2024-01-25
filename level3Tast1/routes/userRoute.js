import express  from "express";
import useController from "../controllers/useController.js"


const router = express.Router();

router.post('/register',useController.registerUser)
router.post('/login',useController.loginUser)
router.post('/fogot',useController.forgotPassword)
router.put('/reset-password',useController.resetPassword)
router.get('/refreshtoken',useController.handleRefreshToken)
router.delete('/delete/:id',useController.deleteUser)
router.put('/update',useController.updateuser)
router.get('/getuser/:id',useController.getUser)
router.get('/getall',useController.getAllUsers)
router.put('/update-password',useController.updatePassword)


export default router