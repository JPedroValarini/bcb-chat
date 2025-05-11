const ApiUrl = 'http://localhost:3001/clients';

export const clientService = {
  async fetchClientByDocumentId(documentId: string) {
    try {
      const response = await fetch(ApiUrl);
      if (!response.ok) {
        throw new Error('Erro ao buscar clientes.');
      }

      const clients = await response.json();
      return clients.find((client: any) => client.documentId === documentId) || null;
    } catch (error) {
      console.error('Erro ao buscar cliente por documentId:', error);
      throw new Error('Erro ao buscar cliente por documentId.');
    }
  },

  async getClientById(clientId: string) {
    try {
      const response = await fetch(`${ApiUrl}/${clientId}`);
      if (!response.ok) {
        throw new Error('Cliente não encontrado.');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar cliente por ID:', error);
      throw new Error('Erro ao buscar cliente por ID.');
    }
  },
};