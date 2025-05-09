import axios from 'axios';

const BASE_URL = 'http://localhost:3001/clients';

export const clientService = {
  getClientById: (id: string) => axios.get(`${BASE_URL}/${id}`),
  createClient: (client: any) => axios.post(BASE_URL, client),
};
