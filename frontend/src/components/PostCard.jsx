import { useState } from 'react';
import { Card, CardHeader, CardContent, CardActions, Button, Typography, Avatar, Box, IconButton } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import DeleteIcon from '@mui/icons-material/Delete';
import api from '../services/api.js';

const PostCard = ({ post, currentUser, onPostUpdated, triggerToast }) => {
  const [loading, setLoading] = useState(false);

  const hasLiked = post.likes?.some((like) => like.userId === currentUser?._id);

  const handleLike = async () => {
    try {
      setLoading(true);
      const { data } = await api.patch(`/api/posts/${post._id}/like`);
      onPostUpdated(data);
    } catch (error) {
      triggerToast(error.response?.data?.message || 'Unable to update like', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      await api.delete(`/api/posts/${post._id}`);
      triggerToast('Post deleted', 'success');
      onPostUpdated({ ...post, deleted: true });
    } catch (error) {
      triggerToast(error.response?.data?.message || 'Unable to delete post', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (post.deleted) return null;

  return (
    <Card sx={{ mb: 3 }}>
      <CardHeader
        avatar={<Avatar>{post.username?.charAt(0) || 'U'}</Avatar>}
        title={post.username}
        subheader={new Date(post.createdAt).toLocaleString()}
      />
      <CardContent>
        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', mb: 2 }}>
          {post.text || 'No caption provided.'}
        </Typography>
        {post.image && (
          <Box component="img" src={post.image} alt="Post media" sx={{ width: '100%', borderRadius: 2, mt: 1 }} />
        )}
      </CardContent>
      <CardActions disableSpacing>
        <IconButton onClick={handleLike} disabled={loading} color={hasLiked ? 'primary' : 'default'}>
          <ThumbUpIcon />
        </IconButton>
        <Typography>{post.likes?.length || 0}</Typography>
        {currentUser?._id === post.userId && (
          <Button
            startIcon={<DeleteIcon />}
            color="error"
            onClick={handleDelete}
            disabled={loading}
          >
            Delete
          </Button>
        )}
      </CardActions>
    </Card>
  );
};

export default PostCard;
