import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AsideBar from '../../src/shared/components/AsideBar'; // Adjust the import path as needed
import * as authUtils from '../../src/shared/utils/authentication';

// Mock the authentication utility
jest.mock('../../src/shared/utils/authentication', () => ({
  getAuthUser: jest.fn(),
}));

// Mock react-router-dom hooks
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
  useLocation: () => ({
    pathname: '/gestion/dashboard',
  }),
}));

describe('AsideBar Component', () => {
  beforeEach(() => {
    // Mock the logged-in user
    (authUtils.getAuthUser as jest.Mock).mockReturnValue({
      username: 'testuser',
      role: { name: 'Administrador' },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('toggles sidebar open and closed when menu button is clicked', async () => {
    render(
      <MemoryRouter>
        <AsideBar />
      </MemoryRouter>
    );

    // Get the sidebar and menu button
    const sidebar = screen.getByTestId('asidebar-comp');
    const menuButton = screen.getByTitle('Menú');

    // Initial state: sidebar is closed (w-14)
    expect(sidebar).toHaveClass('w-14');
    expect(screen.queryByText('Menú')).not.toBeInTheDocument();

    // Click the menu button to open the sidebar
    fireEvent.click(menuButton);

    // Sidebar should be open (w-56) and show "Menú" text
    expect(sidebar).toHaveClass('w-56');
    expect(screen.getByText('Menú')).toBeInTheDocument();

    // Click the menu button again to close the sidebar
    fireEvent.click(menuButton);

    // Sidebar should be closed (w-14) and "Menú" text should be gone
    expect(sidebar).toHaveClass('w-14');
    expect(screen.queryByText('Menú')).not.toBeInTheDocument();
    console.log('Hello CI/CD');
    console.log('Hello CI/CD');
  });
});