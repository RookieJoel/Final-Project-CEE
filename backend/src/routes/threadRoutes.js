import express from 'express';
import {
  getAllThreads,
  createThread,
  getThreadComments,
  deleteThread,
  likeDislikeThread,
  addComment,
  deleteComment,
} from '../controllers/threadController.js';

const router = express.Router();

router.get('/', getAllThreads);
router.post('/', createThread);
router.get('/:id/comments', getThreadComments);
router.delete('/:id', deleteThread);
router.patch('/:id/likes', likeDislikeThread);
router.post('/:id/comments', addComment);
router.delete('/:threadId/comments/:commentId', deleteComment);

export default router;
