import { IoFilterOutline } from "react-icons/io5";
import { MdOutlineCancel } from "react-icons/md";
import useCategoryStore from "./Store";

export function FilterButton() {
    const { filterByStatus, showModalFilter } = useCategoryStore();
    
    const hasFilters = filterByStatus !== "";

    return (
        <button
            className={`
                flex items-center gap-3 text-base sm:text-lg uppercase py-2 px-4 
                rounded-lg transition-all
                ${hasFilters ? "bg-white border border-yellow text-yellow" : "bg-gray-200"}
                hover:bg-gray-300
            `}
            onClick={showModalFilter}
        >
            <IoFilterOutline />
            <span>Filtrar</span>
        </button>
    );
}

export function FilterSelect() {
    const {
        filterByStatus,
        changeFilterByStatus,
        clearAllFilters
    } = useCategoryStore();

    return (
        <div className="flex flex-col gap-6 w-full max-w-full overflow-hidden">
            
            <div className="flex justify-end w-full">
                <button
                    className="text-yellow border border-yellow px-4 py-1 rounded-md hover:bg-yellow hover:text-black transition-all text-sm sm:text-base"
                    onClick={clearAllFilters}
                >
                    Limpiar todos
                </button>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full max-w-full overflow-hidden">
                <label className="w-full sm:w-28 text-sm sm:text-base font-semibold">
                    Estado
                </label>

                <div className="flex items-center gap-2 w-full max-w-full overflow-hidden">
                    <select
                        className={`
                            border rounded-md p-2 w-full text-center
                            ${filterByStatus !== "" ? "border-yellow text-yellow" : ""}
                        `}
                        value={filterByStatus}
                        onChange={(e) => changeFilterByStatus(e.target.value)}
                    >
                        <option value="">Activos</option>
                        <option value="Inactivos">Inactivos</option>
                        <option value="Todos">Todos</option>
                    </select>

                    {filterByStatus !== "" && (
                        <MdOutlineCancel
                            className="text-2xl text-yellow hover:cursor-pointer shrink-0"
                            onClick={() => changeFilterByStatus("")}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}