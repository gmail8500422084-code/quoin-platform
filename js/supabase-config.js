/* Quoin Stage 3 cloud helper. Load Supabase JS v2 and supabase-config.js first. */
(function () {
  const cfg = window.QUOIN_SUPABASE_CONFIG || {};
  const ready = !!(window.supabase && cfg.url && cfg.publishableKey && !cfg.url.includes('YOUR_PROJECT'));
  const client = ready ? window.supabase.createClient(cfg.url, cfg.publishableKey) : null;
  window.QuoinCloud = {
    
    client,
    async signUp(email, password) {
      if (!client) throw new Error('Supabase is not configured.');
      return client.auth.signUp({ email, password });
    },
    async signIn(email, password) {
      if (!client) throw new Error('Supabase is not configured.');
      return client.auth.signInWithPassword({ email, password });
    },
    async signOut() {
      if (!client) return;
      return client.auth.signOut();
    },
    async currentUser() {
      if (!client) return null;
      const { data, error } = await client.auth.getUser();
      if (error) throw error;
      return data.user;
    },
    async listMyNotifications() {
      if (!client) throw new Error('Supabase is not configured.');
      const { data, error } = await client.from('quoin_notifications')
        .select('id,title,message,event_type,read_at,created_at')
        .order('created_at', { ascending: false }).limit(100);
      if (error) throw error;
      return data || [];
    },
    async markNotificationRead(id) {
      if (!client) throw new Error('Supabase is not configured.');
      const { error } = await client.from('quoin_notifications')
        .update({ read_at: new Date().toISOString() }).eq('id', id);
      if (error) throw error;
    }
  };
})();
