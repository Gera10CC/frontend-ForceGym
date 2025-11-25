import { IoFilterOutline } from "react-icons/io5";
import useEconomicExpenseStore from "./Store";

export function FilterButton() {
  const {
    filterByStatus,
    filterByAmountRangeMin,
    filterByAmountRangeMax,
    filterByDateRangeMin,
    filterByDateRangeMax,
    filterByMeanOfPayment,
    filterByCategory,
    showModalFilter,
  } = useEconomicExpenseStore();

  const hasFilters =
    filterByStatus !== "" ||
    filterByAmountRangeMin !== 0 ||
    filterByAmountRangeMax !== 0 ||
    filterByDateRangeMin !== null ||
    filterByDateRangeMax !== null ||
    filterByMeanOfPayment !== 0 ||
    filterByCategory !== -1;

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
import { useCommonDataStore } from "../shared/CommonDataStore";

export function FilterSelect() {
  const {
    filterByStatus,
    filterByAmountRangeMin,
    filterByAmountRangeMax,
    filterByDateRangeMin,
    filterByDateRangeMax,
    filterByMeanOfPayment,
    filterByCategory,
    changeFilterByStatus,
    changeFilterByAmountRangeMin,
    changeFilterByAmountRangeMax,
    changeFilterByDateRangeMin,
    changeFilterByDateRangeMax,
    changeFilterByMeanOfPayment,
    changeFilterByCategory,
    clearAllFilters,
  } = useEconomicExpenseStore();

  const { meansOfPayment, categories } = useCommonDataStore();

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


      <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full max-w-full overflow-hidden">

        <label className="w-full sm:w-28 text-sm sm:text-base font-semibold">
          Medio de pago
        </label>

        <div className="flex items-center gap-2 w-full max-w-full overflow-hidden">
          <select
            className={`
              border rounded-md p-2 w-full text-center
              ${filterByMeanOfPayment !== 0 ? "border-yellow text-yellow" : ""}
            `}
            value={filterByMeanOfPayment}
            onChange={(e) => changeFilterByMeanOfPayment(+e.target.value)}
          >
            <option value={0}>Todos</option>
            {meansOfPayment.map((m) => (
              <option key={m.idMeanOfPayment} value={m.idMeanOfPayment}>
                {m.name}
              </option>
            ))}
          </select>

          {filterByMeanOfPayment !== 0 && (
            <MdOutlineCancel
              className="text-2xl text-yellow hover:cursor-pointer shrink-0"
              onClick={() => changeFilterByMeanOfPayment(0)}
            />
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full max-w-full overflow-hidden">

        <label className="w-full sm:w-28 text-sm sm:text-base font-semibold">
          Categoría
        </label>

        <div className="flex items-center gap-2 w-full max-w-full overflow-hidden">
          <select
            className={`
              border rounded-md p-2 w-full text-center
              ${filterByCategory !== -1 ? "border-yellow text-yellow" : ""}
            `}
            value={filterByCategory}
            onChange={(e) => changeFilterByCategory(+e.target.value)}
          >
            <option value={-1}>Todos</option>
            {categories.map((c) => (
              <option key={c.idCategory} value={c.idCategory}>
                {c.name}
              </option>
            ))}
          </select>

          {filterByCategory !== -1 && (
            <MdOutlineCancel
              className="text-2xl text-yellow hover:cursor-pointer shrink-0"
              onClick={() => changeFilterByCategory(-1)}
            />
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2 w-full">

        <label className="text-sm sm:text-base font-semibold">Monto</label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">

          <div className="flex flex-col w-full">
            <label className="text-xs mb-1">Mínimo</label>
            <input
              type="number"
              inputMode="numeric"
              className={`border rounded-md p-2 text-center w-full ${(filterByAmountRangeMin || filterByAmountRangeMax)
                  ? "border-yellow text-yellow"
                  : ""
                }`}
              value={filterByAmountRangeMin === 0 ? "" : filterByAmountRangeMin}
             
              min={0}
              onChange={(e) => {
                const value = e.target.value;

                if (value === "") {
                  changeFilterByAmountRangeMin(0);
                  return;
                }

                if (+value < 0) return;

                changeFilterByAmountRangeMin(+value);
              }}
              style={{
                MozAppearance: "textfield",
              }}
              onWheel={(e) => e.currentTarget.blur()}
            />
          </div>

          <div className="flex flex-col w-full">
            <label className="text-xs mb-1">Máximo</label>
            <input
              type="number"
              inputMode="numeric"
              className={`border rounded-md p-2 text-center w-full ${(filterByAmountRangeMin || filterByAmountRangeMax)
                  ? "border-yellow text-yellow"
                  : ""
                }`}
              value={filterByAmountRangeMax === 0 ? "" : filterByAmountRangeMax}
           
              min={0}
              onChange={(e) => {
                const value = e.target.value;

                if (value === "") {
                  changeFilterByAmountRangeMax(0);
                  return;
                }

                if (+value < 0) return;

                changeFilterByAmountRangeMax(+value);
              }}
              style={{
                MozAppearance: "textfield",
              }}
              onWheel={(e) => e.currentTarget.blur()}
            />
          </div>
        </div>

        {(filterByAmountRangeMin !== 0 || filterByAmountRangeMax !== 0) && (
          <button
            onClick={() => {
              changeFilterByAmountRangeMin(0);
              changeFilterByAmountRangeMax(0);
            }}
            className="text-yellow text-sm mt-1 self-end hover:underline"
          >
            Limpiar
          </button>
        )}
      </div>

      <div className="flex flex-col gap-2 w-full">

        <label className="text-sm sm:text-base font-semibold">Fecha</label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">

          <div className="flex flex-col w-full">
            <label className="text-xs mb-1">Inicio</label>
            <input
              type="date"
              className={`border rounded-md p-2 text-center w-full ${(filterByDateRangeMin || filterByDateRangeMax)
                ? "border-yellow text-yellow"
                : ""
                }`}
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
              className={`border rounded-md p-2 text-center w-full ${(filterByDateRangeMin || filterByDateRangeMax)
                ? "border-yellow text-yellow"
                : ""
                }`}
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