import express from 'express';
import { getAllThreads, createThread, deleteThread } from '../controller/threadController.js';

const router = express.Router();

router.get('/threads', getAllThreads);
router.post('/threads', createThread);
router.delete('/threads/:id', deleteThread);

export default router;
