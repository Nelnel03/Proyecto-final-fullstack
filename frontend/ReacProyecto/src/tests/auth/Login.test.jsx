import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import MainPagesLogin from '../../components/MainPagesLogin';
import { server } from '../mocks/server';
import Swal from 'sweetalert2';

describe('Pruebas de Autenticación - Login', () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  it('debe renderizar los campos de correo y contraseña', () => {
    render(
      <MemoryRouter>
        <MainPagesLogin />
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/Correo Electrónico/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Contraseña/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Entrar/i })).toBeInTheDocument();
  });

  it('debe mostrar error de validación si el correo no es válido', async () => {
    render(
      <MemoryRouter>
        <MainPagesLogin />
      </MemoryRouter>
    );

    const emailInput = screen.getByLabelText(/Correo Electrónico/i);
    const submitBtn = screen.getByRole('button', { name: /Entrar/i });

    fireEvent.change(emailInput, { target: { value: 'correo-invalido' } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith('Error', expect.stringContaining('correo electrónico válido'), 'error');
    });
  });

  it('debe iniciar sesión correctamente con credenciales válidas y guardar en sessionStorage', async () => {
    render(
      <MemoryRouter>
        <MainPagesLogin />
      </MemoryRouter>
    );

    const emailInput = screen.getByLabelText(/Correo Electrónico/i);
    const passwordInput = screen.getByLabelText(/Contraseña/i);
    const submitBtn = screen.getByRole('button', { name: /Entrar/i });

    fireEvent.change(emailInput, { target: { value: 'admin@reforestacion.com' } });
    fireEvent.change(passwordInput, { target: { value: 'admin123' } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(sessionStorage.setItem).toHaveBeenCalledWith('isAuthenticated', 'true');
      expect(sessionStorage.setItem).toHaveBeenCalledWith('token', expect.any(String));
      expect(Swal.fire).toHaveBeenCalledWith(expect.objectContaining({ title: '¡Bienvenido!' }));
    });
  });
});
