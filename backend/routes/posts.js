import express from 'express';
import {
  getPosts,
  getPostById,
  createPost,
  toggleLike,
  addComment,
  deletePost
} from '../controllers/postController.js';
import { protect } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/', protect, getPosts);
router.get('/:id', protect, getPostById);
router.post('/', protect, upload.single('image'), createPost);
router.patch('/:id/like', protect, toggleLike);
router.post('/:id/comment', protect, addComment);
router.delete('/:id', protect, deletePost);

export default router;
