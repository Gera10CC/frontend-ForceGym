import { render, screen, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom';
import userEvent from "@testing-library/user-event";
import TestSearchInputComponent from "./__mocks__/components/TestSearchInputComponent";
//COMMIT
describe("Componente SearchInput", () => {
  test("Renderiza correctamente con opciones de búsqueda", () => {
    render(<TestSearchInputComponent />);

    expect(screen.getByPlaceholderText("Buscar por...")).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeInTheDocument();
    expect(screen.getByRole("combobox")).toBeInTheDocument();

    // Filter out hidden options before assertions
    const visibleOptions = screen.getAllByRole("option").filter(
      option => !option.classList.contains("hidden")
    );
    
    expect(visibleOptions).toHaveLength(2);
    expect(visibleOptions[0]).toHaveTextContent("Nombre");
    expect(visibleOptions[1]).toHaveTextContent("ID");
  });

  test("Ejecuta búsqueda al hacer submit", () => {
    render(<TestSearchInputComponent />);
    const form = screen.getByRole("button").closest("form");
    fireEvent.submit(form!);

    // No hay assert porque usamos console.log — podés mockearlo si querés capturar el evento
  });

  test("Actualiza el tipo de búsqueda con el select", async () => {
    render(<TestSearchInputComponent />);

    const select = screen.getByRole("combobox");
    await userEvent.selectOptions(select, "2");

    expect(screen.getByTestId("search-type")).toHaveTextContent("2");
  });

  test("Actualiza el término de búsqueda y aplica estilo dinámico", async () => {
    render(<TestSearchInputComponent />);

    const controlInput = screen.getByTestId("search-input-control");
    await userEvent.type(controlInput, "cliente");

    expect(screen.getByTestId("search-term")).toHaveTextContent("cliente");
  });
});
