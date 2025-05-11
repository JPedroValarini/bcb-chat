const apiConversations = 'http://localhost:3001/conversations';
const apiMessages = 'http://localhost:3001/messages';

export const chatService = {
  async fetchConversationsByClientId(clientId: string) {
    try {
      const response = await fetch(`${apiConversations}?clientId=${clientId}`);
      if (!response.ok) {
        throw new Error('Erro ao buscar conversas.');
      }
      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar conversas:', error);
      throw new Error('Erro ao buscar conversas.');
    }
  },

  async fetchConversationById(conversationId: string) {
    try {
      const response = await fetch(`${apiConversations}/${conversationId}`);
      if (!response.ok) {
        throw new Error('Erro ao buscar conversa.');
      }
      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar conversa:', error);
      throw new Error('Erro ao buscar conversa.');
    }
  },

  async fetchMessagesByConversationId(conversationId: string) {
    try {
      const response = await fetch(`${apiMessages}?conversationId=${conversationId}`);
      if (!response.ok) {
        throw new Error('Erro ao buscar mensagens.');
      }
      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar mensagens:', error);
      throw new Error('Erro ao buscar mensagens.');
    }
  },

  async updateUnreadCount(conversationId: string, unreadCount: number) {
    try {
      const response = await fetch(`${apiConversations}/${conversationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ unreadCount }),
      });
      if (!response.ok) {
        throw new Error('Erro ao atualizar unreadCount.');
      }
      return await response.json();
    } catch (error) {
      console.error('Erro ao atualizar unreadCount:', error);
      throw new Error('Erro ao atualizar unreadCount.');
    }
  },

  async updateLastMessage(conversationId: string, lastMessageContent: string, lastMessageTime: string) {
    try {
      const response = await fetch(`${apiConversations}/${conversationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lastMessageContent, lastMessageTime }),
      });
      if (!response.ok) {
        throw new Error('Erro ao atualizar a última mensagem da conversa.');
      }
      return await response.json();
    } catch (error) {
      console.error('Erro ao atualizar a última mensagem da conversa:', error);
      throw new Error('Erro ao atualizar a última mensagem da conversa.');
    }
  },

  async sendMessage(message: {
    conversationId: string;
    senderId: string;
    recipientId: string;
    content: string;
    timestamp: string;
    priority: 'normal' | 'urgent';
    status: 'queued' | 'processing' | 'sent' | 'delivered' | 'read' | 'failed';
    cost: number;
  }) {
    try {
      const response = await fetch(apiMessages, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(message),
      });
      if (!response.ok) {
        const errorDetails = await response.text();
        throw new Error(`Erro ao enviar mensagem: ${errorDetails}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      throw new Error('Erro ao enviar mensagem. Verifique os dados e tente novamente.');
    }
  },
};