import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import BuzonTab from '../../components/admin/BuzonTab';
import { server } from '../mocks/server';
import { http, HttpResponse } from 'msw';

describe('Pruebas de Administración - Buzón', () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  it('debe cargar y mostrar la lista de mensajes', async () => {
    // Mock específico para este test
    server.use(
      http.get('/api/mensajes', () => {
        return HttpResponse.json([
          { id: 1, remitente: 'Juan', asunto: 'Consulta Árbol', fecha: '2023-10-01' },
          { id: 2, remitente: 'Maria', asunto: 'Voluntariado', fecha: '2023-10-02' }
        ]);
      })
    );

    render(<BuzonTab />);

    // Esperamos a que los mensajes se rendericen
    await waitFor(() => {
      expect(screen.getByText(/Consulta Árbol/i)).toBeInTheDocument();
      expect(screen.getByText(/Maria/i)).toBeInTheDocument();
    });
  });

  it('debe mostrar un estado vacío si no hay mensajes', async () => {
    server.use(
      http.get('/api/mensajes', () => {
        return HttpResponse.json([]);
      })
    );

    render(<BuzonTab />);

    await waitFor(() => {
      expect(screen.getByText(/No hay mensajes/i || /Bandeja vacía/i)).toBeInTheDocument();
    });
  });
});
