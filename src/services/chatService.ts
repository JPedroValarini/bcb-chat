const ApiUrl = 'http://localhost:3001/conversations';

export const chatService = {
  /**
   * Busca todas as conversas de um cliente pelo clientId.
   * @param clientId - ID do cliente.
   * @returns Lista de conversas do cliente.
   */
  async fetchConversationsByClientId(clientId: string) {
    try {
      const response = await fetch(`${ApiUrl}?clientId=${clientId}`);
      if (!response.ok) {
        throw new Error('Erro ao buscar conversas.');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar conversas:', error);
      throw new Error('Erro ao buscar conversas.');
    }
  },


  /**
  * Busca uma conversa pelo ID.
  * @param conversationId - ID da conversa.
  * @returns Dados da conversa.
  */
  async fetchConversationById(conversationId: string) {
    try {
      const response = await fetch(`${ApiUrl}/${conversationId}`); // Corrigido para evitar duplicação
      if (!response.ok) {
        throw new Error('Erro ao buscar conversa.');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar conversa:', error);
      throw new Error('Erro ao buscar conversa.');
    }
  },

  /**
   * Busca todas as mensagens de uma conversa pelo ID.
   * @param conversationId - ID da conversa.
   * @returns Lista de mensagens da conversa.
   */
  async fetchMessagesByConversationId(conversationId: string) {
    try {
      // Busca todas as mensagens e filtra pelo conversationId
      const response = await fetch(`http://localhost:3001/messages?conversationId=${conversationId}`);
      if (!response.ok) {
        throw new Error('Erro ao buscar mensagens.');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar mensagens:', error);
      throw new Error('Erro ao buscar mensagens.');
    }
  },

  /**
   * Envia uma nova mensagem.
   * @param message - Dados da mensagem a ser enviada.
   * @returns Mensagem criada.
   */
  async sendMessage(message: any) {
    try {
      const response = await fetch(`${ApiUrl}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(message),
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