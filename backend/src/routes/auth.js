import express from 'express';
import { signUp, logIn ,logout, sessionCheck} from '../controller/storeUser.js';

const router = express.Router();

router.post('/signup', signUp); // Use the updated `signUp` here
router.post('/login', logIn); // Use the updated `logIn` here
router.post('/logout', logout);
router.get('/session', sessionCheck);


export default router;
