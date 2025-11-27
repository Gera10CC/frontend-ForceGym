import { IoFilterOutline } from "react-icons/io5";
import useClientStore from "./Store";

export function FilterButton() {
  const {
    filterByStatus,
    filterByBalanceLoss,
    filterByBoneJointIssues,
    filterByBreathingIssues,
    filterByCardiovascularDisease,
    filterByDiabetes,
    filterByMuscleInjuries,
    filterByHypertension,
    filterByBirthDateRangeMax,
    filterByBirthDateRangeMin,
    filterByClientType,
    showModalFilter,
  } = useClientStore();

  const hasFilters =
    filterByStatus !== "" ||
    filterByClientType !== -1 ||
    filterByBirthDateRangeMin !== null ||
    filterByBirthDateRangeMax !== null ||
    filterByDiabetes !== null ||
    filterByHypertension !== null ||
    filterByMuscleInjuries !== null ||
    filterByBalanceLoss !== null ||
    filterByBoneJointIssues !== null ||
    filterByBreathingIssues !== null ||
    filterByCardiovascularDisease !== null;

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
    filterByClientType,
    filterByBirthDateRangeMin,
    filterByBirthDateRangeMax,
    filterByBalanceLoss,
    filterByBoneJointIssues,
    filterByBreathingIssues,
    filterByCardiovascularDisease,
    filterByDiabetes,
    filterByMuscleInjuries,
    filterByHypertension,

    changeFilterByStatus,
    changeFilterByClientType,
    changeFilterByBirthDateRangeMin,
    changeFilterByBirthDateRangeMax,
    changeFilterByBalanceLoss,
    changeFilterByBoneJointIssues,
    changeFilterByBreathingIssues,
    changeFilterByCardiovascularDisease,
    changeFilterByDiabetes,
    changeFilterByMuscleInjuries,
    changeFilterByHypertension,

    clearAllFilters,
  } = useClientStore();

  const { clientTypes } = useCommonDataStore();

  const yesNoFilters = [
    { label: "Diabetes", state: filterByDiabetes, change: changeFilterByDiabetes },
    { label: "Hipertensión", state: filterByHypertension, change: changeFilterByHypertension },
    { label: "Lesiones musculares", state: filterByMuscleInjuries, change: changeFilterByMuscleInjuries },
    { label: "Pérdida de equilibrio", state: filterByBalanceLoss, change: changeFilterByBalanceLoss },
    { label: "Problemas óseos/articulares", state: filterByBoneJointIssues, change: changeFilterByBoneJointIssues },
    { label: "Problemas respiratorios", state: filterByBreathingIssues, change: changeFilterByBreathingIssues },
    { label: "Enfermedad cardiovascular", state: filterByCardiovascularDisease, change: changeFilterByCardiovascularDisease },
  ];

  return (
    <div className="flex flex-col gap-6 w-full max-w-full overflow-hidden">

      <div className="flex justify-end w-full">
        <button
          className="
            text-yellow border border-yellow px-4 py-1 rounded-md 
            hover:bg-yellow hover:text-black transition-all
            text-sm sm:text-base
          "
          onClick={clearAllFilters}
        >
          Limpiar todos
        </button>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full">
        <label className="w-full sm:w-40 text-sm sm:text-base font-semibold">Estado</label>

        <div className="flex items-center gap-2 w-full">
          <select
            className={`
              border rounded-md p-2 w-full text-center 
              ${filterByStatus !== "" ? "border-yellow text-yellow" : ""}
            `}
            value={filterByStatus}
            onChange={(e) =>
              e.target.value === "0"
                ? changeFilterByStatus("")
                : changeFilterByStatus(e.target.value)
            }
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
        <label className="w-full sm:w-40 text-sm sm:text-base font-semibold">
          Tipo de Cliente
        </label>

        <div className="flex items-center gap-2 w-full">
          <select
            className={`
              border rounded-md p-2 w-full text-center 
              ${filterByClientType !== -1 ? "border-yellow text-yellow" : ""}
            `}
            value={filterByClientType}
            onChange={(e) => changeFilterByClientType(Number(e.target.value))}
          >
            <option value={-1}>Todos</option>

            {clientTypes.map((type) => (
              <option key={type.idClientType} value={type.idClientType}>
                {type.name}
              </option>
            ))}
          </select>

          {filterByClientType !== -1 && (
            <MdOutlineCancel
              className="text-2xl text-yellow hover:cursor-pointer shrink-0"
              onClick={() => changeFilterByClientType(-1)}
            />
          )}
        </div>
      </div>

      {yesNoFilters.map(({ label, state, change }) => (
        <div key={label} className="flex flex-col sm:flex-row sm:items-center gap-3 w-full">
          <label className="w-full sm:w-40 text-sm sm:text-base font-semibold">
            {label}
          </label>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              Sí
              <input type="radio" checked={state === true} onChange={() => change(true)} />
            </label>

            <label className="flex items-center gap-2">
              No
              <input type="radio" checked={state === false} onChange={() => change(false)} />
            </label>

            {state !== null && (
              <MdOutlineCancel
                className="text-2xl text-yellow hover:cursor-pointer shrink-0"
                onClick={() => change(null)}
              />
            )}
          </div>
        </div>
      ))}

      <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full">
        <label className="w-full sm:w-40 text-sm sm:text-base font-semibold">
          Fecha de nacimiento
        </label>

        <div className="flex items-center gap-2 w-full flex-wrap">
          <div className="flex flex-col">
            <span className="text-xs">Inicio</span>
            <input
              type="date"
              className={`border rounded-md p-2 w-40 text-center ${
                filterByBirthDateRangeMin || filterByBirthDateRangeMax
                  ? "border-yellow text-yellow"
                  : ""
              }`}
              value={
                filterByBirthDateRangeMin
                  ? filterByBirthDateRangeMin.toISOString().split("T")[0]
                  : ""
              }
              onChange={(e) => changeFilterByBirthDateRangeMin(new Date(e.target.value))}
            />
          </div>

          <div className="flex flex-col">
            <span className="text-xs">Final</span>
            <input
              type="date"
              className={`border rounded-md p-2 w-40 text-center ${
                filterByBirthDateRangeMin || filterByBirthDateRangeMax
                  ? "border-yellow text-yellow"
                  : ""
              }`}
              value={
                filterByBirthDateRangeMax
                  ? filterByBirthDateRangeMax.toISOString().split("T")[0]
                  : ""
              }
              onChange={(e) => changeFilterByBirthDateRangeMax(new Date(e.target.value))}
            />
          </div>

          {(filterByBirthDateRangeMin || filterByBirthDateRangeMax) && (
            <MdOutlineCancel
              className="text-2xl text-yellow hover:cursor-pointer shrink-0"
              onClick={() => {
                changeFilterByBirthDateRangeMin(null);
                changeFilterByBirthDateRangeMax(null);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}