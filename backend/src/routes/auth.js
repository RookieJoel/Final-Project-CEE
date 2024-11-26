import express from 'express';
import { signUp, logIn } from '../controller/storeUser.js';

const router = express.Router();

router.post('/signup', signUp); // Use the updated `signUp` here
router.post('/login', logIn); // Use the updated `logIn` here

export default router;
