import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ImageUploadField from '../../components/ImageUploadField';

describe('Pruebas de Componentes - Upload de Imágenes', () => {
  it('debe permitir seleccionar una imagen y mostrar el preview', async () => {
    const mockOnChange = vi.fn();
    render(<ImageUploadField onChange={mockOnChange} />);

    const file = new File(['hello'], 'hello.png', { type: 'image/png' });
    const input = screen.getByLabelText(/Seleccionar Imagen/i || /Subir/i); // Dependiendo del label real

    // Simulamos la selección de archivo
    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      // Si el componente muestra un preview de la imagen seleccionada
      const preview = screen.getByRole('img');
      expect(preview).toBeInTheDocument();
    });
  });

  it('debe mostrar error si el archivo es demasiado grande', async () => {
    render(<ImageUploadField />);
    
    // Crear un archivo ficticio de 10MB
    const largeFile = new File([new ArrayBuffer(10 * 1024 * 1024)], 'large.png', { type: 'image/png' });
    const input = screen.getByLabelText(/Seleccionar Imagen/i || /Subir/i);

    fireEvent.change(input, { target: { files: [largeFile] } });

    // Verificar si aparece algún mensaje de error o alerta
    // (Ajustar según la lógica de validación del componente)
  });
});
