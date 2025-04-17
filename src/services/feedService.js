import { supabase } from './supabase';

export const feedService = {
  // Créer une nouvelle publication
  async createPost(userId, content, imageUrl = null) {
    const { data, error } = await supabase
      .from('posts')
      .insert({
        user_id: userId,
        content: content,
        image_url: imageUrl,
        created_at: new Date().toISOString()
      })
      .select('*, author:profiles(username, avatar_url)')
      .single();

    if (error) throw error;
    return data;
  },

  // Récupérer les publications du feed
  async getFeedPosts(userId, page = 0, limit = 10) {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        author:profiles(username, avatar_url),
        likes(user_id),
        comments_count:comments(count)
      `)
      .order('created_at', { ascending: false })
      .range(page * limit, (page + 1) * limit - 1);

    if (error) throw error;
    return data;
  },

  // Liker/Unliker une publication
  async toggleLike(postId, userId) {
    const { data: existingLike, error: likeError } = await supabase
      .from('likes')
      .select()
      .eq('post_id', postId)
      .eq('user_id', userId)
      .single();

    if (likeError && likeError.code !== 'PGRST116') throw likeError;

    if (existingLike) {
      // Unliker
      const { error } = await supabase
        .from('likes')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', userId);

      if (error) throw error;
      return false;
    } else {
      // Liker
      const { error } = await supabase
        .from('likes')
        .insert({ post_id: postId, user_id: userId });

      if (error) throw error;
      return true;
    }
  },

  // Ajouter un commentaire
  async addComment(postId, userId, content) {
    const { data, error } = await supabase
      .from('comments')
      .insert({
        post_id: postId,
        user_id: userId,
        content: content,
        created_at: new Date().toISOString()
      })
      .select('*, author:profiles(username, avatar_url)')
      .single();

    if (error) throw error;
    return data;
  },

  // Récupérer les commentaires d'une publication
  async getPostComments(postId) {
    const { data, error } = await supabase
      .from('comments')
      .select('*, author:profiles(username, avatar_url)')
      .eq('post_id', postId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data;
  },

  // Récupérer les publications recommandées
  async getRecommendedPosts(viewedPostIds, category = 'all', limit = 10) {
    try {
      let query = supabase
        .from('posts')
        .select(`
          *,
          author:profiles(username, avatar_url),
          likes(count),
          comments(count)
        `)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (viewedPostIds?.length > 0) {
        query = query.not('id', 'in', `(${viewedPostIds.join(',')})`);
      }

      if (category !== 'all') {
        query = query.eq('category', category);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting recommended posts:', error);
      return [];
    }
  },

  // Récupérer les publications par catégorie
  async getPostsByCategory(category, page = 0, limit = 10) {
    try {
      const response = await supabase
        .from('posts')
        .select('*, author:profiles(username, avatar_url)')
        .eq('category', category)
        .range(page * limit, (page + 1) * limit - 1);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des posts par catégorie:', error);
      return [];
    }
  },

  // Mettre à jour les statistiques de vue d'une publication
  async updatePostViewStats(postId, userId) {
    try {
      await supabase
        .from('post_views')
        .insert({ post_id: postId, user_id: userId });
    } catch (error) {
      console.error('Erreur lors de la mise à jour des statistiques de vue:', error);
    }
  },

  // Récupérer les tendances
  async getTrendingPosts(timeRange = 'day', limit = 10) {
    try {
      const response = await supabase
        .from('posts')
        .select('*, author:profiles(username, avatar_url)')
        .order('views', { ascending: false })
        .limit(limit);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des tendances:', error);
      return [];
    }
  }
};

export default feedService;