import { supabase } from './supabase';

class ProfileService {
  async getUserProfile(userId) {
    if (!userId) throw new Error('User ID is required');

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching profile:', error.message);
      throw error;
    }
  }

  async updateProfile(userId, profileData) {
    if (!userId) throw new Error('User ID is required');

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          username: profileData.username,
          bio: profileData.bio,
          updated_at: new Date().toISOString(),
          ...profileData
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating profile:', error.message);
      throw error;
    }
  }

  async updateAvatar(userId, avatarUrl) {
    if (!userId) throw new Error('User ID is required');
    if (!avatarUrl) throw new Error('Avatar URL is required');

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating avatar:', error.message);
      throw error;
    }
  }

  async uploadAvatar(file) {
    try {
      const fileExt = file.uri.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading avatar:', error.message);
      throw error;
    }
  }
}

export const profileService = new ProfileService();