import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ModernUserDashboard from '../../components/user/ModernUserDashboard';
import { ThemeProvider } from '../../context/ThemeContext';
import { vi } from 'vitest';

// Mock dependencies
vi.mock('../../services/services', () => ({
    default: {
        getArboles: vi.fn().mockResolvedValue([{ id: 1, nombre: 'Mangle Rojo', familia: 'Rhizophoraceae' }]),
        getReportes: vi.fn().mockResolvedValue([])
    }
}));

// Mock leaflet y react-leaflet (suelen romper tests de JSDOM si no se mockean)
vi.mock('react-leaflet', () => ({
    MapContainer: () => <div data-testid="map-container" />,
    TileLayer: () => <div />,
    Marker: () => <div />,
    Popup: () => <div />
}));

describe('User Dashboard Integration', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Simular que un usuario inició sesión
        sessionStorage.setItem('user', JSON.stringify({
            id: 1,
            email: 'test@biomon.org',
            rol: 'usuario',
            nombre: 'Juan'
        }));
    });

    afterEach(() => {
        sessionStorage.clear();
    });

    it('debe renderizar el dashboard cargando datos desde la API', async () => {
        render(
            <ThemeProvider>
                <MemoryRouter>
                    <ModernUserDashboard />
                </MemoryRouter>
            </ThemeProvider>
        );

        // Debería mostrar "Cargando..." o pasar directo si es rápido
        // Luego debería verse el sidebar y topbar
        await waitFor(() => {
            // El componente UserTopbar debería mostrar el nombre
            expect(screen.getByText(/Juan/i)).toBeInTheDocument();
        });
    });
});
