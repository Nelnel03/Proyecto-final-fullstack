import apiClient from './apiClient';

/**
 * Envía el historial de mensajes al backend para que Groq (con tool calling)
 * procese la respuesta. Retorna { reply: string, action?: { type, path, section } }.
 */
export async function sendMessageToGroq(messages) {
  const { data } = await apiClient.post('/chat', { messages });
  return data;
}
