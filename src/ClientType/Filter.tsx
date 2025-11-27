import { IoFilterOutline } from "react-icons/io5";
import useClientTypeStore from "./Store";
import { MdOutlineCancel } from "react-icons/md";

export function FilterButton() {
    const { filterByStatus, showModalFilter } = useClientTypeStore();
    
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
        changeFilterByStatus
    } = useClientTypeStore()
    
    const filteredStatusSelectStyles = filterByStatus !== '' && ' px-0.5 rounded-md border-2 border-yellow text-yellow'

    return (
        <div className="flex flex-col gap-4">
            {/* Filtro por Estado */}
            <div className="flex items-center gap-4">
                <label htmlFor="status" className="w-20">Estado</label>
                <select
                    className={'border rounded-md p-2 w-52 text-center' + filteredStatusSelectStyles}
                    name="status"
                    id="status"
                    value={filterByStatus} 
                    onChange={(e) => {
                        if(Number(e.target.value) === 0){
                            changeFilterByStatus('')
                        }else{
                            changeFilterByStatus(e.target.value)
                        }
                    }}
                >
                    <option value={0}> Activos </option>
                    <option value={'Inactivos'}> Inactivos </option>
                    <option value={'Todos'}> Todos </option>
                </select>
                {filterByStatus && 
                    <button
                        className="text-2xl text-yellow"
                        onClick={() => changeFilterByStatus('')}
                    >
                        <MdOutlineCancel className="hover:cursor-pointer" />
                    </button>
                }
            </div>
    
        </div>
    );      
}

