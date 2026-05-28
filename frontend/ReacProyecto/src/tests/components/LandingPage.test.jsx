import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LandingPage from '../../pages/LandingPage';
import { ThemeProvider } from '../../context/ThemeContext';

describe('LandingPage Component', () => {
    it('debe renderizar la página de inicio sin crashear', () => {
        render(
            <ThemeProvider>
                <MemoryRouter>
                    <LandingPage />
                </MemoryRouter>
            </ThemeProvider>
        );

        // Verificar la presencia del título o marca principal
        expect(screen.getByText(/BioMon/i)).toBeInTheDocument();
        expect(screen.getByText(/Inteligencia Ambiental/i)).toBeInTheDocument();
    });
});
