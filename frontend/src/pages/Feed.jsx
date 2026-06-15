import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Container, Typography, Box, CircularProgress, Stack } from '@mui/material';
import api from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import CreatePost from '../components/CreatePost.jsx';
import PostCard from '../components/PostCard.jsx';

const Feed = ({ triggerToast }) => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [moreLoading, setMoreLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [search, setSearch] = useState('');
  const observerRef = useRef(null);

  const fetchPosts = async (pageNumber = 1, currentSearch = '') => {
    if (pageNumber === 1) {
      setLoading(true);
    } else {
      setMoreLoading(true);
    }

    try {
      const { data } = await api.get('/api/posts', {
        params: { page: pageNumber, limit: 10, search: currentSearch }
      });
      if (pageNumber === 1) {
        setPosts(data.posts);
      } else {
        setPosts((prev) => [...prev, ...data.posts]);
      }
      setHasMore(data.page * data.limit < data.total);
      setPage(pageNumber);
    } catch (error) {
      triggerToast(error.response?.data?.message || 'Unable to load posts', 'error');
    } finally {
      setLoading(false);
      setMoreLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(1, search);
  }, [search]);

  useEffect(() => {
    const handleSearchEvent = (event) => {
      setSearch(event.detail || '');
    };
    window.addEventListener('feed-search', handleSearchEvent);
    return () => window.removeEventListener('feed-search', handleSearchEvent);
  }, []);

  const loadMore = useCallback(() => {
    if (!hasMore || moreLoading) return;
    fetchPosts(page + 1, search);
  }, [hasMore, moreLoading, page, search]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          loadMore();
        }
      },
      { rootMargin: '150px' }
    );
    if (observerRef.current) observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [loadMore]);

  const handlePostUpdated = (updatedPost) => {
    setPosts((prev) => prev.map((postItem) => (postItem._id === updatedPost._id ? updatedPost : postItem)));
  };

  const handlePostCreated = (newPost) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  const skeletons = useMemo(
    () => Array.from({ length: 3 }, (_, index) => (
      <Box key={index} sx={{ bgcolor: 'background.paper', p: 3, borderRadius: 2, mb: 3, minHeight: 180 }} />
    )),
    []
  );

  return (
    <Container maxWidth="md" sx={{ pt: 4, pb: 6 }}>
      <Typography variant="h4" mb={2} textAlign="center">
        Social Feed
      </Typography>
      <CreatePost onPostCreated={handlePostCreated} triggerToast={triggerToast} />
      {loading ? (
        <Stack spacing={2}>{skeletons}</Stack>
      ) : posts.length === 0 ? (
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            No posts yet
          </Typography>
          <Typography color="text.secondary">Invite your community to create the first update.</Typography>
        </Box>
      ) : (
        <Stack>
          {posts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              currentUser={user}
              onPostUpdated={handlePostUpdated}
              triggerToast={triggerToast}
            />
          ))}
          <Box ref={observerRef} sx={{ height: 1 }} />
          {moreLoading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
              <CircularProgress />
            </Box>
          )}
          {!hasMore && posts.length > 0 && (
            <Typography color="text.secondary" align="center" sx={{ py: 2 }}>
              No more posts to load
            </Typography>
          )}
        </Stack>
      )}
    </Container>
  );
};

export default Feed;
