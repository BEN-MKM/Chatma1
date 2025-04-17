import supabase from '../config/supabase';

class PostService {
  async getPosts() {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          user:user_id (
            id,
            username,
            avatar_url,
            full_name
          ),
          likes:post_likes (count),
          comments:post_comments (count),
          saves:post_saves (count),
          shares:post_shares (count),
          views:post_views (count)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erreur lors de la récupération des posts:', error);
      throw error;
    }
  }

  async getStories() {
    try {
      const { data, error } = await supabase
        .from('stories')
        .select(`
          *,
          user:user_id (
            id,
            username,
            avatar_url,
            full_name
          )
        `)
        .gte('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erreur lors de la récupération des stories:', error);
      throw error;
    }
  }

  async createPost(content) {
    try {
      const { data, error } = await supabase
        .from('posts')
        .insert([content])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erreur lors de la création du post:', error);
      throw error;
    }
  }

  async likePost(postId, userId) {
    try {
      const { data, error } = await supabase
        .from('post_likes')
        .upsert([
          {
            post_id: postId,
            user_id: userId,
          }
        ]);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erreur lors du like du post:', error);
      throw error;
    }
  }

  async unlikePost(postId, userId) {
    try {
      const { data, error } = await supabase
        .from('post_likes')
        .delete()
        .match({
          post_id: postId,
          user_id: userId,
        });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erreur lors du unlike du post:', error);
      throw error;
    }
  }

  async savePost(postId, userId) {
    try {
      const { data, error } = await supabase
        .from('post_saves')
        .upsert([
          {
            post_id: postId,
            user_id: userId,
          }
        ]);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du post:', error);
      throw error;
    }
  }

  async unsavePost(postId, userId) {
    try {
      const { data, error } = await supabase
        .from('post_saves')
        .delete()
        .match({
          post_id: postId,
          user_id: userId,
        });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erreur lors de la suppression de la sauvegarde:', error);
      throw error;
    }
  }

  async addComment(postId, userId, content) {
    try {
      const { data, error } = await supabase
        .from('post_comments')
        .insert([
          {
            post_id: postId,
            user_id: userId,
            content,
          }
        ])
        .select(`
          *,
          user:user_id (
            id,
            username,
            avatar_url,
            full_name
          )
        `)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erreur lors de l\'ajout du commentaire:', error);
      throw error;
    }
  }

  async getComments(postId) {
    try {
      const { data, error } = await supabase
        .from('post_comments')
        .select(`
          *,
          user:user_id (
            id,
            username,
            avatar_url,
            full_name
          )
        `)
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erreur lors de la récupération des commentaires:', error);
      throw error;
    }
  }

  async deletePost(postId) {
    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Erreur lors de la suppression du post:', error);
      throw error;
    }
  }

  async reportPost(postId, userId, reason) {
    try {
      const { data, error } = await supabase
        .from('post_reports')
        .insert([
          {
            post_id: postId,
            user_id: userId,
            reason,
          }
        ]);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erreur lors du signalement du post:', error);
      throw error;
    }
  }

  async addView(postId, userId) {
    try {
      const { data, error } = await supabase
        .from('post_views')
        .upsert([
          {
            post_id: postId,
            user_id: userId,
          }
        ]);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la vue:', error);
      throw error;
    }
  }

  async addShare(postId, userId) {
    try {
      const { data, error } = await supabase
        .from('post_shares')
        .insert([
          {
            post_id: postId,
            user_id: userId,
          }
        ]);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erreur lors de l\'ajout du partage:', error);
      throw error;
    }
  }

  subscribeToNewPosts(callback) {
    return supabase
      .channel('public:posts')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'posts'
      }, payload => {
        callback(payload);
      })
      .subscribe();
  }

  subscribeToPostUpdates(postId, callback) {
    return supabase
      .channel(`post:${postId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'posts',
        filter: `id=eq.${postId}`
      }, payload => {
        callback(payload);
      })
      .subscribe();
  }
}

export default new PostService();
