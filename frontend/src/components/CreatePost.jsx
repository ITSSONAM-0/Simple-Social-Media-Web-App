import { useState } from 'react';
import { Box, TextField, Button, Paper } from '@mui/material';
import api from '../services/api.js';

const CreatePost = ({ onPostCreated, triggerToast }) => {
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!text.trim() && !image) {
      triggerToast('Enter a caption or choose an image', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('text', text.trim());
    if (image) {
      formData.append('image', image);
    }

    try {
      setSubmitting(true);
      const { data } = await api.post('/api/posts', formData);
      onPostCreated(data);
      setText('');
      setImage(null);
      triggerToast('Post created successfully', 'success');
    } catch (error) {
      triggerToast(error.response?.data?.message || 'Unable to create post', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Paper sx={{ p: 3, mb: 4 }}>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'grid', gap: 2 }}>
        <TextField
          label="What are you thinking?"
          multiline
          minRows={3}
          value={text}
          onChange={(e) => setText(e.target.value)}
          fullWidth
        />
        <Button component="label" variant="outlined">
          {image ? 'Image selected' : 'Upload image'}
          <input type="file" hidden accept="image/*" onChange={(e) => setImage(e.target.files[0] || null)} />
        </Button>
        <Button type="submit" variant="contained" disabled={submitting}>
          {submitting ? 'Posting...' : 'Post'}
        </Button>
      </Box>
    </Paper>
  );
};

export default CreatePost;
