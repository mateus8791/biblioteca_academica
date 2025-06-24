// Arquivo: frontend/src/services/api.ts

import axios from 'axios';

// 1. Cria uma instância do axios com a URL base da nossa API
const api = axios.create({
  baseURL: 'http://localhost:3001/api',
});

// 2. Cria o Interceptor de Requisição
// Esta função será executada ANTES de cada requisição ser enviada
api.interceptors.request.use(
  (config) => {
    // Pega o token que guardamos no localStorage do navegador
    const token = localStorage.getItem('bibliotech_token');

    // Se o token existir, adiciona ele no cabeçalho 'Authorization'
    // no formato que o nosso backend espera ("Bearer <token>")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config; // Retorna a configuração da requisição, agora com o token
  },
  (error) => {
    // Caso ocorra um erro na configuração da requisição
    return Promise.reject(error);
  }
);

export default api;