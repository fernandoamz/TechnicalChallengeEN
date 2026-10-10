import axios from 'axios';

// Every JSONPlaceholder call goes through this client.
export const api = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
  timeout: 15000,
});
