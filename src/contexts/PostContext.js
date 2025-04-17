import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import postService from '../services/postService';
import { useAuth } from './AuthContext';

const PostContext = createContext();

export const usePost = () => {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error('usePost must be used within a PostProvider');
  }
  return context;
};

export const PostProvider = ({ children }) => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadPosts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await postService.getPosts();
      setPosts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadStories = useCallback(async () => {
    try {
      const data = await postService.getStories();
      setStories(data);
    } catch (err) {
      console.error('Erreur lors du chargement des stories:', err);
    }
  }, []);

  const createPost = useCallback(async (content) => {
    try {
      const newPost = await postService.createPost({
        ...content,
        user_id: user.id,
      });
      setPosts(prevPosts => [newPost, ...prevPosts]);
      return { success: true, post: newPost };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, [user]);

  const likePost = useCallback(async (postId) => {
    try {
      await postService.likePost(postId, user.id);
      setPosts(prevPosts =>
        prevPosts.map(post =>
          post.id === postId
            ? { ...post, likes: (post.likes || 0) + 1, isLiked: true }
            : post
        )
      );
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, [user]);

  const unlikePost = useCallback(async (postId) => {
    try {
      await postService.unlikePost(postId, user.id);
      setPosts(prevPosts =>
        prevPosts.map(post =>
          post.id === postId
            ? { ...post, likes: Math.max(0, (post.likes || 0) - 1), isLiked: false }
            : post
        )
      );
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, [user]);

  const savePost = useCallback(async (postId) => {
    try {
      await postService.savePost(postId, user.id);
      setPosts(prevPosts =>
        prevPosts.map(post =>
          post.id === postId
            ? { ...post, saves: (post.saves || 0) + 1, isSaved: true }
            : post
        )
      );
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, [user]);

  const unsavePost = useCallback(async (postId) => {
    try {
      await postService.unsavePost(postId, user.id);
      setPosts(prevPosts =>
        prevPosts.map(post =>
          post.id === postId
            ? { ...post, saves: Math.max(0, (post.saves || 0) - 1), isSaved: false }
            : post
        )
      );
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, [user]);

  const addComment = useCallback(async (postId, content) => {
    try {
      const newComment = await postService.addComment(postId, user.id, content);
      setPosts(prevPosts =>
        prevPosts.map(post =>
          post.id === postId
            ? {
                ...post,
                comments: (post.comments || 0) + 1,
                latestComments: [...(post.latestComments || []), newComment],
              }
            : post
        )
      );
      return { success: true, comment: newComment };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, [user]);

  const deletePost = useCallback(async (postId) => {
    try {
      await postService.deletePost(postId);
      setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, []);

  const reportPost = useCallback(async (postId, reason) => {
    try {
      await postService.reportPost(postId, user.id, reason);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, [user]);

  const addView = useCallback(async (postId) => {
    try {
      await postService.addView(postId, user.id);
      setPosts(prevPosts =>
        prevPosts.map(post =>
          post.id === postId
            ? { ...post, views: (post.views || 0) + 1 }
            : post
        )
      );
    } catch (err) {
      console.error('Erreur lors de l\'ajout de la vue:', err);
    }
  }, [user]);

  const addShare = useCallback(async (postId) => {
    try {
      await postService.addShare(postId, user.id);
      setPosts(prevPosts =>
        prevPosts.map(post =>
          post.id === postId
            ? { ...post, shares: (post.shares || 0) + 1 }
            : post
        )
      );
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      loadPosts();
      loadStories();

      const subscription = postService.subscribeToNewPosts(payload => {
        if (payload.eventType === 'INSERT') {
          setPosts(prevPosts => [payload.new, ...prevPosts]);
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [user, loadPosts, loadStories]);

  const value = {
    posts,
    stories,
    loading,
    error,
    loadPosts,
    loadStories,
    createPost,
    likePost,
    unlikePost,
    savePost,
    unsavePost,
    addComment,
    deletePost,
    reportPost,
    addView,
    addShare,
  };

  return <PostContext.Provider value={value}>{children}</PostContext.Provider>;
};

export default PostContext;
