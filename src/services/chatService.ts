const ApiConversation = 'http://localhost:3001/conversations';
const ApiMessage = 'http://localhost:3001/messages';

export const chatService = {
  async fetchConversations() {
    try {
      const response = await fetch(ApiConversation);
      if (!response.ok) {
        throw new Error('Erro ao carregar conversas.');
      }
      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar conversas:', error);
      throw new Error('Erro ao buscar conversas.');
    }
  },

  async fetchConversationById(conversationId: string) {
    try {
      const response = await fetch(`${ApiConversation}/${conversationId}`);
      if (!response.ok) {
        throw new Error('Conversa não encontrada.');
      }
      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar conversa por ID:', error);
      throw new Error('Erro ao buscar conversa por ID.');
    }
  },

  async fetchMessagesByConversationId(conversationId: string) {
    try {
      const response = await fetch(`${ApiMessage}?conversationId=${conversationId}&_sort=timestamp&_order=asc`);
      if (!response.ok) {
        throw new Error('Erro ao carregar mensagens.');
      }
      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar mensagens:', error);
      throw new Error('Erro ao buscar mensagens.');
    }
  },

  async createConversation(newConversation: any) {
    try {
      const response = await fetch(ApiConversation, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newConversation),
      });
      if (!response.ok) {
        throw new Error('Erro ao criar conversa.');
      }
      return await response.json();
    } catch (error) {
      console.error('Erro ao criar conversa:', error);
      throw new Error('Erro ao criar conversa.');
    }
  },

  async sendMessage(newMessage: any) {
    try {
      const response = await fetch(ApiMessage, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMessage),
      });
      if (!response.ok) {
        throw new Error('Erro ao enviar mensagem.');
      }
      return await response.json();
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      throw new Error('Erro ao enviar mensagem.');
    }
  },
};