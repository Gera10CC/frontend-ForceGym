import { useEffect } from "react"
import useClientTypeStore from "./Store"
import { MdOutlineDelete, MdModeEdit, MdOutlineSettingsBackupRestore } from "react-icons/md"
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import Pagination from "../shared/components/Pagination"
import { useClientType } from "./useClientType"
import SearchInput from "../shared/components/SearchInput"
import ModalFilter from "../shared/components/ModalFilter"
import { FilterButton, FilterSelect } from "./Filter"
import Modal from "../shared/components/Modal"
import Form from "./Form"
import { mapClientTypeToDataForm } from "../shared/types/mapper";
import { useNavigate } from "react-router";
import NoData from "../shared/components/NoData";
import { setAuthHeader, setAuthUser } from "../shared/utils/authentication";

function ClientTypeManagement() {
    const {
        clientTypes,
        modalForm,
        modalFilter,
        modalInfo,
        page,
        size,
        totalRecords,
        orderBy,
        directionOrderBy,
        searchType,
        searchTerm,
        filterByStatus,
        fetchClientTypes,
        getClientTypeById,
        changePage,
        changeSize,
        changeSearchType,
        showModalForm,
        showModalInfo,
        closeModalForm,
        closeModalFilter,
        closeModalInfo,
    } = useClientTypeStore();

    const { handleDelete, handleSearch, handleOrderByChange, handleRestore } = useClientType()
    const navigate = useNavigate()
    
    useEffect(() => {
        const fetchData = async () => {
            const { logout } = await fetchClientTypes()
            if (logout) {
                setAuthHeader(null)
                setAuthUser(null)
                navigate('/login')
            }
        }
        fetchData()
    }, [page, size, searchType, searchTerm, orderBy, directionOrderBy, filterByStatus])

    return (
        <div className="bg-black min-h-screen">
            
            {/* HEADER RESPONSIVE */}
            <header className="flex flex-col gap-4 md:flex-row md:justify-between items-center h-auto md:h-20 w-full text-black bg-yellow px-4 py-4">
                <h1 className="text-3xl md:text-4xl uppercase text-center md:text-left">
                    Tipos de Cliente
                </h1>

                <div className="w-full md:w-auto">
                    <SearchInput searchTerm={searchTerm} handleSearch={handleSearch} changeSearchType={changeSearchType} >
                        <option className="checked:bg-yellow hover:cursor-pointer hover:bg-slate-400" value={2} defaultChecked={searchType === 1}>
                            Nombre
                        </option>
                    </SearchInput>
                </div>

                <ModalFilter 
                    modalFilter={modalFilter} 
                    closeModalFilter={closeModalFilter} 
                    FilterButton={FilterButton} 
                    FilterSelect={FilterSelect} 
                />
            </header>

            {/* MAIN RESPONSIVE */}
            <main className="p-4 md:ml-12 flex justify-center">
                <div className="flex flex-col mt-4 bg-white text-lg w-full max-w-[1300px] max-h-full overflow-hidden rounded-md shadow-md">

                    <div className="flex justify-between px-4">
                        <Modal
                            Button={() => (
                                <button
                                    className="mt-4 px-3 py-1 hover:bg-gray-300 hover:rounded-full hover:cursor-pointer"
                                    type="button"
                                    onClick={showModalForm}
                                >
                                    + Añadir
                                </button>
                            )}
                            modal={modalForm}
                            getDataById={getClientTypeById}
                            closeModal={closeModalForm}
                            Content={Form}
                        />
                    </div>

                    {/* TABLA RESPONSIVE */}
                    {clientTypes?.length > 0 ? (
                        <div className="overflow-x-auto w-full">
                            <table className="w-full mt-8 border-t-2 border-slate-200">
                                <thead>
                                    <tr className="text-center">
                                        <th className="px-2">#</th>
                                        <th className="px-2">
                                            <button
                                                className="inline-flex items-center gap-2 py-0.5 px-2 rounded-full hover:bg-slate-300 hover:cursor-pointer"
                                                onClick={() => { handleOrderByChange('name') }}
                                            >
                                                NOMBRE
                                                {(orderBy === 'name' && directionOrderBy === 'DESC') && <FaArrowUp className="text-yellow" />}
                                                {(orderBy === 'name' && directionOrderBy === 'ASC') && <FaArrowDown className="text-yellow" />}
                                            </button>
                                        </th>

                                        {filterByStatus && <th className="px-2">ESTADO</th>}

                                        <th className="px-2">ACCIONES</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {clientTypes?.map((clientType, index) => (
                                        <tr key={clientType.idClientType} className="text-center py-8">
                                            <td className="py-2">{(page - 1) * size + index + 1}</td>
                                            <td className="py-2">{clientType.name}</td>

                                            {filterByStatus && (
                                                <td>
                                                    {clientType.isDeleted ? (
                                                        <button className="py-0.5 px-2 rounded-lg bg-red-500 text-white">Inactivo</button>
                                                    ) : (
                                                        <button className="py-0.5 px-2 rounded-lg bg-green-500 text-white">Activo</button>
                                                    )}
                                                </td>
                                            )}

                                            <td className="flex gap-4 justify-center py-2">
                                                <button
                                                    onClick={() => {
                                                        getClientTypeById(clientType.idClientType);
                                                        showModalForm();
                                                    }}
                                                    className="p-2 bg-black rounded-sm hover:bg-gray-700 hover:cursor-pointer"
                                                    title="Editar"
                                                >
                                                    <MdModeEdit className="text-white" />
                                                </button>

                                                {clientType.isDeleted ? (
                                                    <button 
                                                        onClick={() => handleRestore(mapClientTypeToDataForm(clientType))} 
                                                        className="p-2 bg-black rounded-sm hover:bg-slate-700 hover:cursor-pointer"
                                                        title="Restaurar"
                                                    >
                                                        <MdOutlineSettingsBackupRestore className="text-white" />
                                                    </button>
                                                ) : (
                                                    <button 
                                                        onClick={() => handleDelete(clientType)} 
                                                        className="p-2 bg-black rounded-sm hover:bg-gray-700 hover:cursor-pointer"
                                                        title="Eliminar"
                                                    >
                                                        <MdOutlineDelete className="text-white" />
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <NoData module="tipos de cliente" />
                    )}
                    
                    {clientTypes?.length > 0 && (
                        <div className="mt-6 px-4 pb-4">
                            <Pagination 
                                page={page} 
                                size={size} 
                                totalRecords={totalRecords} 
                                onSizeChange={changeSize} 
                                onPageChange={changePage} 
                            />
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

export default ClientTypeManagement;