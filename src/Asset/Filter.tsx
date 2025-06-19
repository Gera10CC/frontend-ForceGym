import { IoFilterOutline } from "react-icons/io5";
import { MdOutlineCancel } from "react-icons/md";
import useAssetStore from "./Store";

export function FilterButton() {
    const { filterByStatus, filterByCostRangeMin, filterByCostRangeMax, filterByQuantityRangeMin, filterByQuantityRangeMax, showModalFilter } = useAssetStore();
    const filteringStyles = (
        filterByStatus !== '' || filterByCostRangeMin !== 0 || filterByCostRangeMax !== 0 || filterByQuantityRangeMin !== 0 || filterByQuantityRangeMax !== 0
    ) ? ' bg-white outline-none' : '';

    return (
        <button
            className={"flex items-center gap-4 text-lg uppercase outline-2 py-2 px-4 rounded-lg hover:cursor-pointer hover:bg-slate-300" + filteringStyles}
            onClick={() => showModalFilter()}
        >
            <IoFilterOutline />
            <span>Filtrar</span>
        </button>
    );
}

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
        clearAllFilters
    } = useAssetStore();
    const filteredStatusSelectStyles = filterByStatus !== '' ? ' px-0.5 rounded-md border-2 border-yellow text-yellow' : '';
    const filteredCostRangeStyles = (filterByCostRangeMin !== 0 || filterByCostRangeMax !== 0) ? ' px-0.5 border-2 border-yellow text-yellow' : '';
    const filteredQuantityRangeStyles = (filterByQuantityRangeMin !== 0 || filterByQuantityRangeMax !== 0) ? ' px-0.5 border-2 border-yellow text-yellow' : '';

    return (
        <div className="flex flex-col gap-4">
            {/* Botón de limpiar todos */}
            <div className="flex justify-end pr-4">
                <button
                    className="text-yellow border border-yellow px-3 py-1 rounded-md hover:bg-yellow hover:text-black transition-all"
                    onClick={clearAllFilters}
                >
                    Limpiar todos los filtros
                </button>
            </div>

            {/* Filtro por Estado */}
            <div className="flex items-center gap-4">
                <label htmlFor="status" className="w-20">Estado</label>
                <select
                    className={'border rounded-md p-2 w-52 text-center' + filteredStatusSelectStyles}
                    name="status"
                    id="status"
                    value={filterByStatus}
                    onChange={(e) => {
                        if (e.target.value === '0') {
                            changeFilterByStatus('');
                        } else {
                            changeFilterByStatus(e.target.value);
                        }
                    }}
                >
                    <option value="0">Activos</option>
                    <option value="Inactivos">Inactivos</option>
                    <option value="Todos">Todos</option>
                </select>
                {filterByStatus && (
                    <button
                        className="text-2xl text-yellow"
                        onClick={() => changeFilterByStatus('')}
                    >
                        <MdOutlineCancel className="hover:cursor-pointer" />
                    </button>
                )}
            </div>

            {/* Filtro por Costo */}
            <div className="flex items-center gap-4">
                <label className="w-20">Costo</label>
                <div className="flex items-center gap-2">
                    <div className="flex flex-col">
                        <label htmlFor="costMin" className="text-sm">Mínimo</label>
                        <input
                            className={'border-2 w-24 p-1 text-center' + filteredCostRangeStyles}
                            name="costMin"
                            id="costMin"
                            type="number"
                            min={0}
                            value={filterByCostRangeMin === 0 ? '' : filterByCostRangeMin}
                            onChange={(e) => {
                                const value = e.target.value === '' ? 0 : +e.target.value;
                                changeFilterByCostRangeMin(value);
                            }}
                        />
                    </div>
                    <span>-</span>
                    <div className="flex flex-col">
                        <label htmlFor="costMax" className="text-sm">Máximo</label>
                        <input
                            className={'border-2 w-24 p-1 text-center' + filteredCostRangeStyles}
                            name="costMax"
                            id="costMax"
                            type="number"
                            min={0}
                            value={filterByCostRangeMax === 0 ? '' : filterByCostRangeMax}
                            onChange={(e) => {
                                const value = e.target.value === '' ? 0 : +e.target.value;
                                changeFilterByCostRangeMax(value);
                            }}
                        />
                    </div>
                    {(filterByCostRangeMin !== 0 || filterByCostRangeMax !== 0) && (
                        <button
                            className="text-2xl text-yellow"
                            onClick={() => {
                                changeFilterByCostRangeMin(0);
                                changeFilterByCostRangeMax(0);
                            }}
                        >
                            <MdOutlineCancel className="hover:cursor-pointer" />
                        </button>
                    )}
                </div>
            </div>

            {/* Filtro por Cantidad */}
            <div className="flex items-center gap-4">
                <label className="w-20">Cantidad</label>
                <div className="flex items-center gap-2">
                    <div className="flex flex-col">
                        <label htmlFor="quantityMin" className="text-sm">Mínima</label>
                        <input
                            className={'border-2 w-24 p-1 text-center' + filteredQuantityRangeStyles}
                            name="quantityMin"
                            id="quantityMin"
                            type="number"
                            min={0}
                            value={filterByQuantityRangeMin === 0 ? '' : filterByQuantityRangeMin}
                            onChange={(e) => {
                                const value = e.target.value === '' ? 0 : +e.target.value;
                                changeFilterByQuantityRangeMin(value);
                            }}
                        />
                    </div>
                    <span>-</span>
                    <div className="flex flex-col">
                        <label htmlFor="quantityMax" className="text-sm">Máxima</label>
                        <input
                            className={'border-2 w-24 p-1 text-center' + filteredQuantityRangeStyles}
                            name="quantityMax"
                            id="quantityMax"
                            type="number"
                            min={0}
                            value={filterByQuantityRangeMax === 0 ? '' : filterByQuantityRangeMax}
                            onChange={(e) => {
                                const value = e.target.value === '' ? 0 : +e.target.value;
                                changeFilterByQuantityRangeMax(value);
                            }}
                        />
                    </div>
                    {(filterByQuantityRangeMin !== 0 || filterByQuantityRangeMax !== 0) && (
                        <button
                            className="text-2xl text-yellow"
                            onClick={() => {
                                changeFilterByQuantityRangeMin(0);
                                changeFilterByQuantityRangeMax(0);
                            }}
                        >
                            <MdOutlineCancel className="hover:cursor-pointer" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}