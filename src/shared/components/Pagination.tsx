import { useMemo } from "react";
import { MdArrowForwardIos, MdOutlineArrowBackIos } from "react-icons/md";

type PaginationProps = {
    page: number
    size: number
    totalRecords: number
    onSizeChange: (newSize: number) => void
    onPageChange: (newPage: number) => void
    isLoading?: boolean
}
function Pagination({ page, size, totalRecords, onSizeChange, onPageChange, isLoading = false } : PaginationProps) {
    const totalPages = useMemo(() => Math.ceil(totalRecords/size) , [totalRecords, size])

    return ( 
        (totalRecords > 0) ? 
        (
        <div className="flex mt-4 border-t-2 border-slate-200 text-yellow text-[16px] px-8 py-4">
            <div className="flex-auto">
                <span>
                    {totalRecords === 1 ? (
                        `${totalRecords} registro`
                    ) : (
                        `${size * (page - 1) +1 }-${Math.min(size * page, totalRecords)} de ${totalRecords} registros`
                    )}
                </span>
            </div>

            <div className="flex items-center gap-4">
                <div className="flex gap-2">
                    <span>Filas por página: </span>
                    <select
                        className="text-center hover:cursor-pointer hover:outline hover:text-slate-400"
                        value={size}
                        onChange={(e) => {
                            onSizeChange(Number(e.target.value))
                            onPageChange(1)
                        }}
                        disabled={isLoading}
                    >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={15}>15</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                    </select>
                </div>
                
                <div className="flex gap-2">
                    <button
                        className="rounded-md shadow hover:bg-slate-400 hover:cursor-pointer hover:text-black disabled:opacity-40"
                        onClick={() => { onPageChange(page-1) }}
                        disabled={isLoading || page - 1 <= 0}
                        aria-label="Anterior"
                    >
                        <MdOutlineArrowBackIos />
                    </button>

                    <span>
                        {isLoading ? "..." : `${page} / ${totalPages}`}
                    </span>

                    <button
                        className="rounded-md shadow hover:bg-slate-400 hover:cursor-pointer hover:text-black disabled:opacity-40"
                        onClick={() => { onPageChange(page+1) }}
                        disabled={isLoading || page === totalPages}
                        aria-label="Siguiente"
                    >
                        <MdArrowForwardIos />
                    </button>
                </div>
            </div>
        </div>
        ) :
        ( <> </>)
    );
}

export default Pagination;