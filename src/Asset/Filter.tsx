import { IoFilterOutline } from "react-icons/io5";
import useAssetStore from "./Store";

export function FilterButton() {
  const {
    filterByStatus,
    filterByCostRangeMin,
    filterByCostRangeMax,
    filterByQuantityRangeMin,
    filterByQuantityRangeMax,
    showModalFilter,
  } = useAssetStore();

  const hasFilters =
    filterByStatus !== "" ||
    filterByCostRangeMin !== 0 ||
    filterByCostRangeMax !== 0 ||
    filterByQuantityRangeMin !== 0 ||
    filterByQuantityRangeMax !== 0;

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
    filterByCostRangeMin,
    filterByCostRangeMax,
    filterByQuantityRangeMin,
    filterByQuantityRangeMax,

    changeFilterByStatus,
    changeFilterByCostRangeMin,
    changeFilterByCostRangeMax,
    changeFilterByQuantityRangeMin,
    changeFilterByQuantityRangeMax,

    clearAllFilters,
  } = useAssetStore();

  return (
    <div className="flex flex-col gap-6 w-full max-w-full overflow-hidden">

      <div className="flex justify-end w-full">
        <button
          className="text-yellow border border-yellow px-4 py-1 rounded-md 
                     hover:bg-yellow hover:text-black transition-all text-sm sm:text-base"
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
            onChange={(e) =>
              Number(e.target.value) === 0
                ? changeFilterByStatus("")
                : changeFilterByStatus(e.target.value)
            }
          >
            <option value={0}>Activos</option>
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

        <label className="text-sm sm:text-base font-semibold">Costo</label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">

          <div className="flex flex-col w-full">
            <label className="text-xs mb-1">Mínimo</label>
            <input
              type="number"
              inputMode="numeric"
              min={0}
              className={`border rounded-md p-2 text-center w-full 
                ${(filterByCostRangeMin || filterByCostRangeMax) 
                  ? "border-yellow text-yellow" 
                  : ""}`}
              value={filterByCostRangeMin === 0 ? "" : filterByCostRangeMin}
              onChange={(e) => {
                const value = e.target.value;

                if (value === "") {
                  changeFilterByCostRangeMin(0);
                  return;
                }

                if (+value < 0) return;

                changeFilterByCostRangeMin(+value);
              }}
              style={{ MozAppearance: "textfield" }}
              onWheel={(e) => e.currentTarget.blur()}
            />
          </div>

          <div className="flex flex-col w-full">
            <label className="text-xs mb-1">Máximo</label>
            <input
              type="number"
              inputMode="numeric"
              min={0}
              className={`border rounded-md p-2 text-center w-full 
                ${(filterByCostRangeMin || filterByCostRangeMax) 
                  ? "border-yellow text-yellow" 
                  : ""}`}
              value={filterByCostRangeMax === 0 ? "" : filterByCostRangeMax}
              onChange={(e) => {
                const value = e.target.value;

                if (value === "") {
                  changeFilterByCostRangeMax(0);
                  return;
                }

                if (+value < 0) return;

                changeFilterByCostRangeMax(+value);
              }}
              style={{ MozAppearance: "textfield" }}
              onWheel={(e) => e.currentTarget.blur()}
            />
          </div>
        </div>

        {(filterByCostRangeMin !== 0 || filterByCostRangeMax !== 0) && (
          <button
            onClick={() => {
              changeFilterByCostRangeMin(0);
              changeFilterByCostRangeMax(0);
            }}
            className="text-yellow text-sm mt-1 self-end hover:underline"
          >
            Limpiar
          </button>
        )}
      </div>

      <div className="flex flex-col gap-2 w-full">

        <label className="text-sm sm:text-base font-semibold">Cantidad</label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">

          <div className="flex flex-col w-full">
            <label className="text-xs mb-1">Mínima</label>
            <input
              type="number"
              inputMode="numeric"
              min={0}
              className={`border rounded-md p-2 text-center w-full 
                ${(filterByQuantityRangeMin || filterByQuantityRangeMax) 
                  ? "border-yellow text-yellow" 
                  : ""}`}
              value={filterByQuantityRangeMin === 0 ? "" : filterByQuantityRangeMin}
              onChange={(e) => {
                const value = e.target.value;

                if (value === "") {
                  changeFilterByQuantityRangeMin(0);
                  return;
                }

                if (+value < 0) return;

                changeFilterByQuantityRangeMin(+value);
              }}
              style={{ MozAppearance: "textfield" }}
              onWheel={(e) => e.currentTarget.blur()}
            />
          </div>

          <div className="flex flex-col w-full">
            <label className="text-xs mb-1">Máxima</label>
            <input
              type="number"
              inputMode="numeric"
              min={0}
              className={`border rounded-md p-2 text-center w-full 
                ${(filterByQuantityRangeMin || filterByQuantityRangeMax) 
                  ? "border-yellow text-yellow" 
                  : ""}`}
              value={filterByQuantityRangeMax === 0 ? "" : filterByQuantityRangeMax}
              onChange={(e) => {
                const value = e.target.value;

                if (value === "") {
                  changeFilterByQuantityRangeMax(0);
                  return;
                }

                if (+value < 0) return;

                changeFilterByQuantityRangeMax(+value);
              }}
              style={{ MozAppearance: "textfield" }}
              onWheel={(e) => e.currentTarget.blur()}
            />
          </div>
        </div>

        {(filterByQuantityRangeMin !== 0 || filterByQuantityRangeMax !== 0) && (
          <button
            onClick={() => {
              changeFilterByQuantityRangeMin(0);
              changeFilterByQuantityRangeMax(0);
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