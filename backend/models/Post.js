import mongoose from 'mongoose';

const likeSchema = mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    username: String
  },
  { _id: false }
);

const commentSchema = mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    username: String,
    comment: String
  },
  { timestamps: true }
);

const postSchema = mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    username: { type: String, required: true },
    text: { type: String, default: '' },
    image: { type: String, default: '' },
    likes: [likeSchema],
    comments: [commentSchema]
  },
  { timestamps: true }
);

const Post = mongoose.model('Post', postSchema);
export default Post;
