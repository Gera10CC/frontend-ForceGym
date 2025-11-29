import { IoFilterOutline } from "react-icons/io5";
import { useNotificationTemplateStore } from "./Store";
import { MdOutlineCancel } from "react-icons/md";
import { useCommonDataStore } from "../shared/CommonDataStore";

export function FilterButton() {
    const { filterByStatus, filterByNotificationType, showModalFilter } = useNotificationTemplateStore();
    
    const hasFilters = filterByStatus !== '' || filterByNotificationType !== 0;

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
        filterByNotificationType,
        changeFilterByStatus, 
        changeFilterByNotificationType,
        clearAllFilters
    } = useNotificationTemplateStore();
    
    const { notificationTypes } = useCommonDataStore();

    const filteredStatusSelectStyles = filterByStatus !== '' 
        ? ' px-0.5 rounded-md border-2 border-yellow text-yellow' 
        : '';
    
    const filteredNotificationTypeStyles = filterByNotificationType !== 0 
        ? ' px-0.5 border-2 border-yellow text-yellow' 
        : '';

    return (
        <div className="flex flex-col gap-4">
            <div className="flex justify-end pr-4">
                <button
                    className="text-yellow border border-yellow px-3 py-1 rounded-md hover:bg-yellow hover:text-black transition-all"
                    onClick={clearAllFilters}
                >
                    Limpiar todos los filtros
                </button>
            </div>

            <div className="flex items-center gap-4">
                <label htmlFor="status" className="w-20">Estado</label>
                <select
                    className={`border rounded-md p-2 w-52 text-center${filteredStatusSelectStyles}`}
                    name="status"
                    id="status"
                    value={filterByStatus}
                    onChange={(e) => {
                        if(e.target.value === '0') {
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
                {filterByStatus && 
                    <button
                        className="text-2xl text-yellow"
                        onClick={() => changeFilterByStatus('')}
                    >
                        <MdOutlineCancel className="hover:cursor-pointer" />
                    </button>
                }
            </div>
    
            <div className="flex items-center gap-4">
                <label htmlFor="notificationType" className="w-20">Tipo de Notificación</label>
                <select
                    className={`border rounded-md p-2 w-52 text-center${filteredNotificationTypeStyles}`}
                    name="notificationType"
                    id="notificationType"
                    value={filterByNotificationType}
                    onChange={(e) => changeFilterByNotificationType(Number(e.target.value))}
                >
                    <option value={0}>Todos</option>
                    {notificationTypes.map((noti) => (
                        <option key={noti.idNotificationType} value={noti.idNotificationType}>
                            {noti.name}
                        </option>
                    ))}
                </select>
                {filterByNotificationType !== 0 && (
                    <button
                        className="text-2xl text-yellow"
                        onClick={() => changeFilterByNotificationType(0)}
                    >
                        <MdOutlineCancel className="hover:cursor-pointer" />
                    </button>
                )}
            </div>
        </div>
    );      
}