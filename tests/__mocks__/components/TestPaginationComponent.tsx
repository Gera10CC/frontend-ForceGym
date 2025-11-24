import { useState } from "react";
import Pagination from "../../../src/shared/components/Pagination";

type Props = {
  totalRecords?: number;
};

function TestPaginationComponent({ totalRecords = 100 }: Props) {
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);

  const start = (size * (page - 1)) + 1;
  const end = Math.min(size * page, totalRecords);

  return (
    <div>
      <p data-testid="current-page">Página: {page}</p>
      <p data-testid="current-size">Tamaño: {size}</p>
      {totalRecords > 0 && (
        <p data-testid="range-text">{`${start}-${end} de ${totalRecords} registros`}</p>
      )}

      <Pagination
        page={page}
        size={size}
        totalRecords={totalRecords}
        onSizeChange={(newSize) => {
          setSize(newSize);
          setPage(1);
        }}
        onPageChange={(newPage) => setPage(newPage)}
      />
    </div>
  );
}

export default TestPaginationComponent;