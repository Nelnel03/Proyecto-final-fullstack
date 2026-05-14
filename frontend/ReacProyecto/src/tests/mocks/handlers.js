import { http, HttpResponse } from 'msw';
import { mockAdminUser, mockAuthToken } from '../fixtures/userFixtures';

export const handlers = [
  // Mock para Login
  http.post('/api/auth/login', async ({ request }) => {
    const { email, password } = await request.json();

    if (email === 'admin@reforestacion.com' && password === 'admin123') {
      return HttpResponse.json({
        token: mockAuthToken,
        user: mockAdminUser
      });
    }

    return new HttpResponse(null, {
      status: 401,
      statusText: 'Unauthorized',
    });
  }),

  // Mock para obtener perfil
  http.get('/api/users/profile', () => {
    return HttpResponse.json(mockAdminUser);
  }),

  // Mock para lista de árboles
  http.get('/api/arboles', () => {
    return HttpResponse.json([
      { id: 1, especie: 'Pino', lat: 10.1, lng: -84.1 },
      { id: 2, especie: 'Roble', lat: 10.2, lng: -84.2 }
    ]);
  }),
];
