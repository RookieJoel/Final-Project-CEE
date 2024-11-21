import express from 'express';
import { signUp, logIn, logOut } from '../controller/storeUser';

const router = express.Router();

router.post('/signup', signUp); // เส้นทางสำหรับสมัครผู้ใช้ใหม่
router.post('/login', logIn);   // เส้นทางสำหรับเข้าสู่ระบบ
router.post('/logout', logOut); // เส้นทางสำหรับออกจากระบบ

export default router;
