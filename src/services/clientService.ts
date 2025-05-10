const ApiUrl = 'http://localhost:3001/clients';

export const clientService = {
  async fetchClientByDocumentId(documentId: string) {
    try {
      const response = await fetch(ApiUrl);
      const clients = await response.json();

      return clients.find((client: any) => client.documentId === documentId) || null;
    } catch (error) {
      console.error('Erro ao buscar cliente:', error);
      throw new Error('Erro ao buscar cliente.');
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

  async createClient(newClient: any) {
    try {
      const response = await fetch(ApiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newClient),
      });
      return response;
    } catch (error) {
      console.error('Erro ao criar cliente:', error);
      throw new Error('Erro ao criar cliente.');
    }
  },
};