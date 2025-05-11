const ApiUrl = 'http://localhost:3001/clients';

export const clientService = {
  /**
   * Busca um cliente pelo documentId (CPF ou CNPJ).
   * @param documentId - CPF ou CNPJ do cliente.
   * @returns Cliente correspondente ou null se não encontrado.
   */
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

  /**
   * Busca um cliente pelo ID.
   * @param clientId - ID do cliente.
   * @returns Cliente correspondente ou lança erro se não encontrado.
   */
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