import { supabase } from './supabase';
import { profileService } from './profileService';

export const authService = {
  async signUp(email, password, username) {
    console.log('authService.signUp - Début:', { email, username });
    
    try {
      // 1. Vérifier si l'email existe déjà
      const { data: existingEmail } = await supabase
        .from('profiles')
        .select('email')
        .eq('email', email)
        .single();

      if (existingEmail) {
        throw new Error('Cet email est déjà utilisé');
      }

      // 2. Vérifier si le nom d'utilisateur existe déjà
      const { data: existingUsername } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', username)
        .single();

      if (existingUsername) {
        throw new Error('Ce nom d\'utilisateur est déjà pris');
      }

      // 3. Créer le compte utilisateur
      console.log('authService.signUp - Création du compte');
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username
          }
        }
      });

      if (authError) throw authError;
      if (!authData?.user) throw new Error('Erreur lors de la création du compte');

      console.log('authService.signUp - Compte créé:', authData.user.id);

      // 4. Créer le profil utilisateur
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: authData.user.id,
            username,
            email,
            avatar_url: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }
        ]);

      if (profileError) {
        console.error('Erreur création profil:', profileError);
        // Supprimer le compte auth si la création du profil échoue
        await supabase.auth.admin.deleteUser(authData.user.id);
        throw profileError;
      }

      console.log('authService.signUp - Profil créé');
      return authData.user;
    } catch (error) {
      console.error('authService.signUp - Erreur:', error);
      throw error;
    }
  },

  async signIn(email, password) {
    console.log('authService.signIn - Début:', { email });
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;
      if (!data?.user) throw new Error('Utilisateur non trouvé');

      // Récupérer le profil complet
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (profileError) throw profileError;
      if (!profile) throw new Error('Profil non trouvé');

      console.log('authService.signIn - Succès');
      return { ...data.user, ...profile };
    } catch (error) {
      console.error('authService.signIn - Erreur:', error);
      throw error;
    }
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      if (!user) return null;

      // Récupérer le profil complet
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;
      if (!profile) throw new Error('Profil non trouvé');

      return { ...user, ...profile };
    } catch (error) {
      console.error('authService.getCurrentUser - Erreur:', error);
      return null;
    }
  }
};