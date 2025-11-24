import { useMemo, useCallback, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type PaginationProps = {
  page: number;
  size: number;
  totalRecords: number;
  onSizeChange: (newSize: number) => void;
  onPageChange: (newPage: number) => void;
  isLoading?: boolean;
};

export default function Pagination({
  page,
  size,
  totalRecords,
  onSizeChange,
  onPageChange,
  isLoading = false,
}: PaginationProps) {
  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(totalRecords / size)),
    [totalRecords, size]
  );

  const currentPage = useMemo(
    () => Math.min(Math.max(1, page), totalPages),
    [page, totalPages]
  );

  // Validar página fuera de rango
  useEffect(() => {
    if (!isLoading && page !== currentPage) {
      onPageChange(currentPage);
    }
  }, [page, currentPage, onPageChange, isLoading]);

  const handlePageChange = useCallback(
    (newPage: number) => {
      if (isLoading) return;
      const validPage = Math.min(Math.max(newPage, 1), totalPages);
      if (validPage !== currentPage) onPageChange(validPage);
    },
    [currentPage, totalPages, onPageChange, isLoading]
  );

  const handleSizeChange = useCallback(
    (newSize: number) => {
      if (!isLoading) onSizeChange(newSize);
    },
    [onSizeChange, isLoading]
  );

  if (totalRecords === 0) return null;

  const start = size * (currentPage - 1) + 1;
  const end = Math.min(size * currentPage, totalRecords);

  return (
    <div className="flex flex-wrap items-center justify-between mt-4 border-t border-slate-300 py-4 px-4 text-yellow text-[15px]">

      {/* Info */}
      <div className="mb-2 sm:mb-0">
        {totalRecords === 1
          ? "1 registro"
          : `${start}-${end} de ${totalRecords} registros`}
      </div>

      {/* Controles */}
      <div className="flex items-center gap-6">

        {/* Filas por página */}
        <div className="flex items-center gap-2">
          <span className="whitespace-nowrap">Filas: </span>

          <select
            className="px-2 py-1 border border-slate-300 rounded-md text-black focus:outline-none hover:bg-slate-100 disabled:opacity-50"
            value={size}
            onChange={(e) => handleSizeChange(Number(e.target.value))}
            disabled={isLoading}
            aria-label="Cantidad de filas por página"
          >
            {[5, 10, 15, 20, 50].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>

        {/* Navegación */}
        <div className="flex items-center gap-3">
          <button
            className="p-1 rounded-md border border-slate-300 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1 || isLoading}
            aria-label="Página anterior"
          >
            <ChevronLeft size={18} />
          </button>

          <span className="min-w-[80px] text-center">
            {isLoading ? "..." : `${currentPage} / ${totalPages}`}
          </span>

          <button
            className="p-1 rounded-md border border-slate-300 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages || isLoading}
            aria-label="Página siguiente"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}