import { supabase } from './supabaseClient';

class SupabaseChatService {
  // Fetch Conversation Messages
  async fetchMessages(conversationId) {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (err) {
      console.warn('[SupabaseChat] Fetch messages error fallback:', err.message);
      return [];
    }
  }

  // Insert & Send Message in Supabase Database
  async sendMessage({ conversationId, senderId, textContent, encryptedCipher, mediaUrl, replyToId }) {
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert([
          {
            conversation_id: conversationId,
            sender_id: senderId,
            text_content: textContent,
            encrypted_ciphertext: encryptedCipher,
            media_url: mediaUrl,
            reply_to_id: replyToId,
            status: 'sent',
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return { success: true, message: data };
    } catch (err) {
      console.warn('[SupabaseChat] Send message fallback:', err.message);
      return { success: false, error: err.message };
    }
  }

  // Supabase Realtime Listener for Instant Messages
  subscribeToMessages(conversationId, onMessageReceived) {
    const channel = supabase
      .channel(`chat_${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          if (onMessageReceived) onMessageReceived(payload.new);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }

  // Add Emoji Reaction
  async addReaction(messageId, userId, emoji) {
    try {
      const { data, error } = await supabase
        .from('message_reactions')
        .insert([{ message_id: messageId, user_id: userId, emoji }]);
      if (error) throw error;
      return { success: true, reaction: data };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  // Delete Message (for_me / for_everyone)
  async deleteMessage(messageId, userId, mode = 'for_everyone') {
    try {
      if (mode === 'for_everyone') {
        await supabase.from('messages').delete().eq('id', messageId);
      } else {
        await supabase.from('deleted_messages').insert([{ message_id: messageId, user_id: userId, delete_mode: 'for_me' }]);
      }
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }
}

export const supabaseChatService = new SupabaseChatService();
