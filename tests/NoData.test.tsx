import React from 'react';
import { render, screen } from '@testing-library/react';
import NoData from '../src/shared/components/NoData';
//commit
describe('NoData Component', () => {
  test('muestra el mensaje específico del módulo cuando se proporciona', () => {
    render(<NoData module="ejercicios" />);
    
    expect(screen.getByText('No hay ejercicios para mostrar')).toBeInTheDocument();
    expect(screen.getByText('Intenta agregando')).toBeInTheDocument();

    const icon = document.querySelector('svg');
    expect(icon).toBeTruthy();
  });

  test('muestra mensaje genérico cuando el módulo es string vacío', () => {
    render(<NoData module="" />);
    
    expect(screen.getByText('No hay datos para mostrar')).toBeInTheDocument();
    expect(screen.getByText('Intenta agregando')).toBeInTheDocument();
  });

  test('permite children personalizados cuando se proporcionan', () => {
    render(
      <NoData module="clientes">
        <p>Texto personalizado para clientes</p>
      </NoData>
    );
    
    expect(screen.getByText('Texto personalizado para clientes')).toBeInTheDocument();
  });
});
