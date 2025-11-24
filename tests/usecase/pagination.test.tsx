import { render, screen, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom';
import TestPaginationComponent from "../__mocks__/components/TestPaginationComponent";

describe("Componente Pagination", () => {
  test("Renderiza correctamente y muestra el rango de registros", () => {
    render(<TestPaginationComponent totalRecords={50} />);

    expect(screen.getByTestId("current-page")).toHaveTextContent("Página: 1");
    expect(screen.getByTestId("current-size")).toHaveTextContent("Tamaño: 10");
    expect(screen.getByTestId("range-text")).toHaveTextContent("1-10 de 50 registros");
  });

  test("Navega hacia adelante y hacia atrás correctamente", () => {
    render(<TestPaginationComponent totalRecords={50} />);

    const nextButton = screen.getByRole("button", { name: /siguiente/i });
    const prevButton = screen.getByRole("button", { name: /anterior/i });

    fireEvent.click(nextButton);
    fireEvent.click(nextButton);
    fireEvent.click(nextButton);
    fireEvent.click(nextButton); 

    expect(screen.getByTestId("current-page")).toHaveTextContent("Página: 5");
    expect(nextButton).toBeDisabled();

    fireEvent.click(prevButton);
    expect(screen.getByTestId("current-page")).toHaveTextContent("Página: 4");
  });

  test("Cambia el tamaño de página y reinicia la página actual", () => {
    render(<TestPaginationComponent totalRecords={50} />);

    const select = screen.getByRole("combobox");
    fireEvent.change(select, { target: { value: "20" } });
// Probando 
    expect(screen.getByTestId("current-size")).toHaveTextContent("Tamaño: 20");
    expect(screen.getByTestId("current-page")).toHaveTextContent("Página: 1");
    expect(screen.getByTestId("range-text")).toHaveTextContent("1-20 de 50 registros");
  });

    test("Muestra controles básicos con 0 registros", () => {
    render(<TestPaginationComponent totalRecords={0} />);

    expect(screen.getByTestId("current-page")).toHaveTextContent("Página: 1");
    expect(screen.getByTestId("current-size")).toHaveTextContent("Tamaño: 10");
    expect(screen.queryByTestId("range-text")).toBeNull();

    expect(screen.queryByRole("button", { name: /anterior/i })).toBeNull();
    expect(screen.queryByRole("button", { name: /siguiente/i })).toBeNull();
    });
});