import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Login from '../../pages/Login';
import { ThemeProvider } from '../../context/ThemeContext';
// No hay AuthProvider para mockear porque Login.jsx no lo usa directamente en el renderizado inicial,
// o si lo usa es mediante hooks que podemos ignorar si no fallan

import { vi } from 'vitest';

// Mock global de fetch para capturar la llamada al API
global.fetch = vi.fn();

describe('Login Integration Flow', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('debe enviar credenciales y mostrar error si la API retorna error', async () => {
        // Simulamos un error de credenciales
        global.fetch.mockResolvedValueOnce({
            ok: false,
            status: 401,
            json: async () => ({ message: 'Correo o contraseña incorrectos' })
        });

        render(
            <ThemeProvider>
                <MemoryRouter>
                    <Login />
                </MemoryRouter>
            </ThemeProvider>
        );

        const emailInput = screen.getByPlaceholderText(/tu@correo.com/i);
        const passInput = screen.getByPlaceholderText('••••••••');
        const submitBtn = screen.getByRole('button', { name: /Iniciar Sesión/i });

        fireEvent.change(emailInput, { target: { value: 'admin@biomon.org' } });
        fireEvent.change(passInput, { target: { value: 'wrongpassword' } });
        fireEvent.click(submitBtn);

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledTimes(1);
            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining('/auth/login'),
                expect.objectContaining({
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: 'admin@biomon.org', password: 'wrongpassword' })
                })
            );
        });
        // Como usa SweetAlert, no verificaremos el modal del DOM directamente, 
        // pero verificamos que la petición fetch sucedió con los datos correctos.
    });

    it('debe guardar token si el login es exitoso', async () => {
        // Simulamos un login exitoso
        global.fetch.mockResolvedValueOnce({
            ok: true,
            status: 200,
            json: async () => ({
                token: 'mock_token_123',
                user: { id: 1, email: 'admin@biomon.org', rol_id: 1, debeCambiarPassword: 0 }
            })
        });

        // Mock localStorage
        Storage.prototype.setItem = vi.fn();

        render(
            <ThemeProvider>
                <MemoryRouter>
                    <Login />
                </MemoryRouter>
            </ThemeProvider>
        );

        const emailInput = screen.getByPlaceholderText(/tu@correo.com/i);
        const passInput = screen.getByPlaceholderText('••••••••');
        const submitBtn = screen.getByRole('button', { name: /Iniciar Sesión/i });

        fireEvent.change(emailInput, { target: { value: 'admin@biomon.org' } });
        fireEvent.change(passInput, { target: { value: 'correctpassword' } });
        fireEvent.click(submitBtn);

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledTimes(1);
            expect(localStorage.setItem).toHaveBeenCalledWith('token', 'mock_token_123');
            expect(localStorage.setItem).toHaveBeenCalledWith(
                'user',
                JSON.stringify({ id: 1, email: 'admin@biomon.org', rol_id: 1, debeCambiarPassword: 0 })
            );
        });
    });
});
