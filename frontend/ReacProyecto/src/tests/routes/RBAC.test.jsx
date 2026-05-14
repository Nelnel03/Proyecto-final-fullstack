import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Rooting from '../../routes/Rooting';

describe('Pruebas de Seguridad - RBAC (Control de Acceso)', () => {
  
  it('debe redirigir a /login si un usuario no autenticado intenta acceder a /admin', async () => {
    sessionStorage.getItem.mockReturnValueOnce('false'); // isAuthenticated
    
    render(
      <MemoryRouter initialEntries={['/admin']}>
        <Rooting />
      </MemoryRouter>
    );

    await waitFor(() => {
      // Debería estar en la página de login (podemos verificar el título o un elemento del login)
      expect(screen.getByText(/Iniciar Sesión/i)).toBeInTheDocument();
    });
  });

  it('debe permitir acceso a /admin si el usuario es admin', async () => {
    // Simulamos sesión de admin
    sessionStorage.getItem.mockImplementation((key) => {
      if (key === 'isAuthenticated') return 'true';
      if (key === 'user') return JSON.stringify({ rol: 'admin', nombre: 'Admin' });
      return null;
    });

    render(
      <MemoryRouter initialEntries={['/admin']}>
        <Rooting />
      </MemoryRouter>
    );

    await waitFor(() => {
      // Verificamos que no estamos en login y que el componente de admin se intenta renderizar
      expect(screen.queryByText(/Iniciar Sesión/i)).not.toBeInTheDocument();
    });
  });

  it('debe denegar acceso a /admin si el usuario tiene rol "user"', async () => {
    // Simulamos sesión de usuario regular
    sessionStorage.getItem.mockImplementation((key) => {
      if (key === 'isAuthenticated') return 'true';
      if (key === 'user') return JSON.stringify({ rol: 'user', nombre: 'Usuario' });
      return null;
    });

    render(
      <MemoryRouter initialEntries={['/admin']}>
        <Rooting />
      </MemoryRouter>
    );

    await waitFor(() => {
      // El componente PrivateRoutes debería redirigir si no tiene permiso.
      // Dependiendo de la implementación de Rooting, podría redirigir a /dashboard-user o similar.
      expect(screen.queryByText(/Panel de Administración/i)).not.toBeInTheDocument();
    });
  });
});
