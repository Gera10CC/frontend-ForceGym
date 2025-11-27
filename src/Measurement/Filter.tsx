import { IoFilterOutline } from "react-icons/io5";
import useMeasurementStore from "./Store";

export function FilterButton() {
  const {
    filterByStatus,
    filterByDateRangeMin,
    filterByDateRangeMax,
    showModalFilter,
  } = useMeasurementStore();

  const hasFilters =
    filterByStatus !== "" ||
    filterByDateRangeMin !== null ||
    filterByDateRangeMax !== null;

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
import { MdOutlineCancel } from "react-icons/md";

export function FilterSelect() {
  const {
    filterByStatus,
    filterByDateRangeMin,
    filterByDateRangeMax,
    changeFilterByStatus,
    changeFilterByDateRangeMin,
    changeFilterByDateRangeMax,
    clearAllFilters,
  } = useMeasurementStore();

  return (
    <div className="flex flex-col gap-6 w-full max-w-full overflow-hidden">
      
      <div className="flex justify-end w-full">
        <button
          className="text-yellow border border-yellow px-4 py-1 rounded-md 
                     hover:bg-yellow hover:text-black transition-all 
                     text-sm sm:text-base"
          onClick={clearAllFilters}
        >
          Limpiar todos
        </button>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full">
        <label className="w-full sm:w-28 text-sm sm:text-base font-semibold">
          Estado
        </label>

        <div className="flex items-center gap-2 w-full">
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

      <div className="flex flex-col gap-2 w-full">
        <label className="text-sm sm:text-base font-semibold">Fecha</label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
          
          <div className="flex flex-col w-full">
            <label className="text-xs mb-1">Inicio</label>
            <input
              type="date"
              className={`
                border rounded-md p-2 text-center w-full
                ${(filterByDateRangeMin || filterByDateRangeMax)
                  ? "border-yellow text-yellow"
                  : ""}
              `}
              value={
                filterByDateRangeMin
                  ? filterByDateRangeMin.toISOString().split("T")[0]
                  : ""
              }
              onChange={(e) =>
                changeFilterByDateRangeMin(new Date(e.target.value))
              }
            />
          </div>

          <div className="flex flex-col w-full">
            <label className="text-xs mb-1">Final</label>
            <input
              type="date"
              className={`
                border rounded-md p-2 text-center w-full
                ${(filterByDateRangeMin || filterByDateRangeMax)
                  ? "border-yellow text-yellow"
                  : ""}
              `}
              value={
                filterByDateRangeMax
                  ? filterByDateRangeMax.toISOString().split("T")[0]
                  : ""
              }
              onChange={(e) =>
                changeFilterByDateRangeMax(new Date(e.target.value))
              }
            />
          </div>
        </div>

        {(filterByDateRangeMin || filterByDateRangeMax) && (
          <button
            onClick={() => {
              changeFilterByDateRangeMin(null);
              changeFilterByDateRangeMax(null);
            }}
            className="text-yellow text-sm mt-1 self-end hover:underline"
          >
            Limpiar
          </button>
        )}
      </div>
    </div>
  );
}