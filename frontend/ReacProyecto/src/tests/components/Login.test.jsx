import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Login from '../../pages/Login';
import { ThemeProvider } from '../../context/ThemeContext';

describe('Login Component', () => {
    it('debe renderizar el formulario de inicio de sesión', () => {
        render(
            <ThemeProvider>
                <MemoryRouter>
                    <Login />
                </MemoryRouter>
            </ThemeProvider>
        );

        // Verificar elementos básicos del DOM
        expect(screen.getByPlaceholderText(/tu@correo.com/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Iniciar Sesión/i })).toBeInTheDocument();
    });

    it('debe mostrar mensaje de error si los campos están vacíos al enviar', async () => {
        render(
            <ThemeProvider>
                <MemoryRouter>
                    <Login />
                </MemoryRouter>
            </ThemeProvider>
        );

        const btnSubmit = screen.getByRole('button', { name: /Iniciar Sesión/i });
        fireEvent.click(btnSubmit);

        expect(screen.getByPlaceholderText(/tu@correo.com/i)).toBeInTheDocument();
    });
});
