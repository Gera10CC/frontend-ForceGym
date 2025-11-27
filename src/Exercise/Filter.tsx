import { IoFilterOutline } from "react-icons/io5";
import useExerciseStore from "./Store";

export function FilterButton() {
  const { filterByStatus, filterByDifficulty, filterByCategory, showModalFilter } =
    useExerciseStore();

  const hasFilters =
    filterByStatus !== "" ||
    filterByDifficulty !== "" ||
    filterByCategory !== 0;

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
    filterByDifficulty,
    filterByCategory,
    changeFilterByStatus,
    changeFilterByDifficulty,
    changeFilterByCategory,
    clearAllFilters,
  } = useExerciseStore();

  const { exerciseCategories } = useCommonDataStore();

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
            onChange={(e) => {
              const val = e.target.value;
              changeFilterByStatus(val === "0" ? "" : val);
            }}
          >
            <option value="0">Activos</option>
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

      <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full">
        <label className="w-full sm:w-28 text-sm sm:text-base font-semibold">
          Dificultad
        </label>

        <div className="flex items-center gap-2 w-full">
          <select
            className={`
              border rounded-md p-2 w-full text-center
              ${filterByDifficulty !== "" ? "border-yellow text-yellow" : ""}
            `}
            value={filterByDifficulty}
            onChange={(e) => {
              const val = e.target.value;
              changeFilterByDifficulty(val === "0" ? "" : val);
            }}
          >
            <option value="0">Todas</option>
            <option value="Fácil">Fácil</option>
            <option value="Media">Media</option>
            <option value="Difícil">Difícil</option>
          </select>

          {filterByDifficulty !== "" && (
            <MdOutlineCancel
              className="text-2xl text-yellow hover:cursor-pointer shrink-0"
              onClick={() => changeFilterByDifficulty("")}
            />
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full">
        <label className="w-full sm:w-28 text-sm sm:text-base font-semibold">
          Categoría
        </label>

        <div className="flex items-center gap-2 w-full">
          <select
            className={`
              border rounded-md p-2 w-full text-center
              ${filterByCategory !== 0 ? "border-yellow text-yellow" : ""}
            `}
            value={filterByCategory}
            onChange={(e) => changeFilterByCategory(+e.target.value)}
          >
            <option value={0}>Todas</option>
            {exerciseCategories.map((c) => (
              <option key={c.idExerciseCategory} value={c.idExerciseCategory}>
                {c.name}
              </option>
            ))}
          </select>

          {filterByCategory !== 0 && (
            <MdOutlineCancel
              className="text-2xl text-yellow hover:cursor-pointer shrink-0"
              onClick={() => changeFilterByCategory(0)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
