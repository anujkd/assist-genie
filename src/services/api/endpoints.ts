export const API_ENDPOINTS = {
  CREATE_SESSION: 'http://localhost:3000/api/chat/session',
  SEND_MESSAGE: (sessionId: string) => `http://localhost:3000/api/chat/${sessionId}/message`,
  GET_HISTORY: 'http://localhost:3000/api/chat/history',
  GET_CHAT_HISTORY: (chatId: string) => `http://localhost:3000/api/chat/${chatId}/history`,
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
};
