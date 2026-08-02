import { supabase } from './supabaseClient';

class SupabasePresenceService {
  constructor() {
    this.channel = null;
  }

  // Subscribe to Supabase Realtime Presence Channel
  subscribePresence(userId, onPresenceUpdate) {
    this.channel = supabase.channel('user_presence_global', {
      config: {
        presence: {
          key: userId,
        },
      },
    });

    this.channel
      .on('presence', { event: 'sync' }, () => {
        const newState = this.channel.presenceState();
        if (onPresenceUpdate) onPresenceUpdate(newState);
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        console.log('[Presence] User joined:', key, newPresences);
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        console.log('[Presence] User left:', key, leftPresences);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await this.channel.track({
            online_at: new Date().toISOString(),
            is_online: true,
          });
        }
      });

    return () => {
      if (this.channel) supabase.removeChannel(this.channel);
    };
  }

  // Send Typing Indicator
  async sendTypingStatus(conversationId, userId, isTyping) {
    try {
      await supabase
        .from('typing_status')
        .upsert([
          {
            conversation_id: conversationId,
            user_id: userId,
            is_typing: isTyping,
            updated_at: new Date().toISOString(),
          },
        ]);
    } catch (err) {
      console.warn('[Presence] Typing status update warning:', err);
    }
  }
}

export const supabasePresenceService = new SupabasePresenceService();
