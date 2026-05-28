import { io } from 'socket.io-client';
import { BASE_URL } from './config.jsx';

const SOCKET_URL = BASE_URL.replace('/api', '');

let socket = null;
const listeners = new Set();

/**
 * Notifica a todos los listeners con el summary recibido (puede ser null si es evento legacy).
 * @param {Object|null} summary 
 */
function notifyListeners(summary = null) {
  listeners.forEach((callback) => {
    try {
      callback(summary);
    } catch (err) {
      console.error('Error in socket listener callback:', err);
    }
  });
}

export const connectSocket = () => {
  const token = sessionStorage.getItem('token');
  if (!token) return null;

  if (socket) {
    if (socket.connected) return socket;
    socket.connect();
    return socket;
  }

  console.log('🔌 Inicializando conexión Socket.IO con el servidor...');
  socket = io(SOCKET_URL, {
    auth: { token },
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 2000
  });

  socket.on('connect', () => {
    console.log('🔌 Conectado exitosamente al servidor Socket.IO.');
  });

  socket.on('disconnect', (reason) => {
    console.log('🔌 Desconectado del servidor Socket.IO:', reason);
  });

  socket.on('connect_error', (error) => {
    console.error('❌ Error de conexión Socket.IO:', error.message);
  });

  // Evento enriquecido: lleva el resumen de conteos directamente (sin fetch extra)
  socket.on('notification:summary', (summary) => {
    console.log('🔔 notification:summary recibido:', summary);
    notifyListeners(summary);
  });

  // Evento legacy: los listeners deberán hacer GET /summary por su cuenta
  socket.on('notification:update', () => {
    console.log('🔔 notification:update recibido (legacy)...');
    notifyListeners(null);
  });

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    console.log('🔌 Desconectando Socket.IO...');
    socket.disconnect();
    socket = null;
  }
};

export const subscribeToNotifications = (callback) => {
  listeners.add(callback);
  // Auto-conectar si es necesario
  connectSocket();
};

export const unsubscribeFromNotifications = (callback) => {
  listeners.delete(callback);
  if (listeners.size === 0) {
    disconnectSocket();
  }
};

export const getSocket = () => socket;

