import Post from '../models/Post.js';

export const getPosts = async (req, res) => {
  const { page = 1, limit = 10, search = '' } = req.query;
  const query = {};
  if (search.trim()) {
    query.username = { $regex: search.trim(), $options: 'i' };
  }

  const skip = (Number(page) - 1) * Number(limit);
  const [posts, total] = await Promise.all([
    Post.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Post.countDocuments(query)
  ]);

  res.json({
    page: Number(page),
    limit: Number(limit),
    total,
    posts
  });
};

export const getPostById = async (req, res, next) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    res.status(404);
    return next(new Error('Post not found'));
  }
  res.json(post);
};

export const createPost = async (req, res, next) => {
  const text = req.body.text?.trim() || '';
  const image = req.file ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}` : '';

  if (!text && !image) {
    res.status(400);
    return next(new Error('A caption or image is required to create a post'));
  }

  const post = await Post.create({
    userId: req.user._id,
    username: req.user.name,
    text,
    image
  });

  res.status(201).json(post);
};

export const toggleLike = async (req, res, next) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    res.status(404);
    return next(new Error('Post not found'));
  }

  const likedIndex = post.likes.findIndex((like) => like.userId.toString() === req.user._id.toString());
  if (likedIndex >= 0) {
    post.likes.splice(likedIndex, 1);
  } else {
    post.likes.push({ userId: req.user._id, username: req.user.name });
  }

  await post.save();
  res.json(post);
};

export const addComment = async (req, res, next) => {
  const { comment } = req.body;
  if (!comment || !comment.trim()) {
    res.status(400);
    return next(new Error('Comment text is required'));
  }

  const post = await Post.findById(req.params.id);
  if (!post) {
    res.status(404);
    return next(new Error('Post not found'));
  }

  post.comments.push({
    userId: req.user._id,
    username: req.user.name,
    comment: comment.trim()
  });

  await post.save();
  res.status(201).json(post);
};

export const deletePost = async (req, res, next) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    res.status(404);
    return next(new Error('Post not found'));
  }

  if (post.userId.toString() !== req.user._id.toString()) {
    res.status(403);
    return next(new Error('Not authorized to delete this post'));
  }

  await post.deleteOne();
  res.json({ message: 'Post deleted successfully' });
};
