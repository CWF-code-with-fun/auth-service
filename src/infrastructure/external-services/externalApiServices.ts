import axios from 'axios';

export class ExternalApiService {
    async fetchData(endpoint: string): Promise<unknown> {
        const response = await axios.get(endpoint);
        return response.data;
    }
}
