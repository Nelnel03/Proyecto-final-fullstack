import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import CorridorMap from '../../components/CorridorMap';

describe('Pruebas de Componentes - Mapas', () => {
  it('debe renderizar el contenedor del mapa correctamente', () => {
    render(<CorridorMap />);
    
    // Verificamos que el mock del MapContainer se renderizó
    expect(screen.getByTestId('map-container')).toBeInTheDocument();
    expect(screen.getByTestId('tile-layer')).toBeInTheDocument();
  });
});
