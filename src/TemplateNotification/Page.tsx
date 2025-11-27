import { useEffect } from "react"
import useNotificationTemplateStore from "./Store"
import { MdOutlineDelete, MdModeEdit, MdOutlineSettingsBackupRestore } from "react-icons/md"
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import { IoIosMore } from "react-icons/io";
import Pagination from "../shared/components/Pagination"
import { useNotificationTemplate } from "./useNotificationTemplate"
import SearchInput from "../shared/components/SearchInput"
import ModalFilter from "../shared/components/ModalFilter"
import { FilterButton, FilterSelect } from "./Filter"
import Modal from "../shared/components/Modal"
import Form from "./Form"
import DataInfo from "./DataInfo";
import { mapNotificationTemplateToDataForm } from "../shared/types/mapper";
import { setAuthHeader, setAuthUser } from "../shared/utils/authentication";
import { useNavigate } from "react-router";
import NoData from "../shared/components/NoData";
import Layout from "../shared/components/Layout";

function NotificationTemplateManagement() {
    const {
        notificationTemplates,
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
        filterByNotificationType,
        fetchNotificationTemplates,
        getNotificationTemplateById,
        changePage,
        changeSize,
        changeSearchType,
        showModalForm,
        showModalInfo,
        closeModalForm,
        closeModalFilter,
        closeModalInfo,
    } = useNotificationTemplateStore();

    const { handleDelete, handleSearch, handleOrderByChange, handleRestore } = useNotificationTemplate()
    const navigate = useNavigate()

    useEffect(() => {}, [notificationTemplates])

    useEffect(() => {
        const fetchData = async () => {
            const { logout } = await fetchNotificationTemplates()

            if(logout){
                setAuthHeader(null)
                setAuthUser(null)
                navigate('/login', {replace: true})
            }    

        }
        
        fetchData()
    }, [page, size, searchType, searchTerm, orderBy, directionOrderBy, filterByStatus, filterByNotificationType])

    return (
        <Layout>
            {/* HEADER */}
            <header className="
                flex flex-col md:flex-row items-center justify-between gap-4
                bg-yellow text-black px-4 py-4 rounded-md shadow-md
            ">
                <h1 className="text-3xl md:text-4xl uppercase tracking-wide">
                    Plantillas
                </h1>
                
                <SearchInput 
                    searchTerm={searchTerm} 
                    handleSearch={handleSearch} 
                    changeSearchType={changeSearchType}
                >
                    <option value={2}>Mensaje</option>
                </SearchInput>
                
                <ModalFilter 
                    modalFilter={modalFilter} 
                    closeModalFilter={closeModalFilter} 
                    FilterButton={FilterButton} 
                    FilterSelect={FilterSelect} 
                />
            </header>

            {/* MAIN */}
            <main className="mt-6">
                <div className="
                    bg-white rounded-lg shadow-md p-4 sm:p-6
                    overflow-hidden
                ">
                    {/* TOP ACTIONS */}
                    <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
                        <Modal
                            Button={() => (
                                <button
                                    type="button"
                                    onClick={showModalForm}
                                    className="
                                        w-full sm:w-auto
                                        px-4 py-2 bg-gray-100 hover:bg-gray-300
                                        rounded-full transition flex items-center gap-2
                                        justify-center
                                    "
                                >
                                    + Añadir
                                </button>
                            )}
                            modal={modalForm}
                            getDataById={getNotificationTemplateById}
                            closeModal={closeModalForm}
                            Content={Form}
                        />
                    </div>

                    {/* TABLE */}
                    {notificationTemplates?.length > 0 ? (
                        <div className="overflow-x-auto w-full">
                            <table className="w-full border-t-2 border-slate-200 min-w-[600px]">
                                <thead>
                                    <tr className="text-center">
                                        <th className="px-2 py-2">#</th>
                                        
                                        <th className="px-2">
                                            <button
                                                className="inline-flex items-center gap-2 py-0.5 px-2 rounded-full hover:bg-slate-300"
                                                onClick={() => {handleOrderByChange('message')}}
                                            >
                                                MENSAJE
                                                {(orderBy === 'message' && directionOrderBy === 'DESC') && <FaArrowUp className="text-yellow" />}
                                                {(orderBy === 'message' && directionOrderBy === 'ASC') && <FaArrowDown className="text-yellow" />}
                                            </button>
                                        </th>

                                        <th className="px-2">
                                            <button
                                                className="inline-flex items-center gap-2 py-0.5 px-2 rounded-full hover:bg-slate-300"
                                                onClick={() => {handleOrderByChange('notificationType')}}
                                            >
                                                TIPO
                                                {(orderBy === 'notificationType' && directionOrderBy === 'DESC') && <FaArrowUp className="text-yellow" />}
                                                {(orderBy === 'notificationType' && directionOrderBy === 'ASC') && <FaArrowDown className="text-yellow" />}
                                            </button>
                                        </th>

                                        {filterByStatus && <th className="px-2">ESTADO</th>}
                                        <th className="px-2">ACCIONES</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {notificationTemplates?.map((notificationTemplate, index) => (
                                        <tr key={notificationTemplate.idNotificationTemplate} className="text-center">
                                            <td className="py-2">{(page - 1) * size + index + 1}</td>
                                            <td className="py-2">{notificationTemplate.message}</td>
                                            <td className="py-2">{notificationTemplate.notificationType.name}</td>

                                            {filterByStatus && (
                                                <td className="py-2">
                                                    {notificationTemplate.isDeleted ? (
                                                        <button className="py-0.5 px-2 rounded-lg bg-red-500 text-white">
                                                            Inactivo
                                                        </button>
                                                    ) : (
                                                        <button className="py-0.5 px-2 rounded-lg bg-green-500 text-white">
                                                            Activo
                                                        </button>
                                                    )}
                                                </td>
                                            )}
                                            
                                            <td className="flex gap-3 justify-center py-3">
                                                <Modal
                                                    Button={() => (
                                                        <button
                                                            onClick={() => {
                                                                getNotificationTemplateById(notificationTemplate.idNotificationTemplate);
                                                                showModalInfo();
                                                            }}
                                                            className="p-2 bg-black rounded-sm hover:bg-gray-700"
                                                            title="Ver detalles"
                                                        >
                                                            <IoIosMore className="text-white" />
                                                        </button>
                                                    )}
                                                    modal={modalInfo}
                                                    getDataById={getNotificationTemplateById}
                                                    closeModal={closeModalInfo}
                                                    Content={DataInfo}
                                                />
                                                <button
                                                    onClick={() => {
                                                        getNotificationTemplateById(notificationTemplate.idNotificationTemplate);
                                                        showModalForm();
                                                    }}
                                                    className="p-2 bg-black rounded-sm hover:bg-gray-700"
                                                    title="Editar"
                                                >
                                                    <MdModeEdit className="text-white" />
                                                </button>
                                                {notificationTemplate.isDeleted ? (
                                                    <button 
                                                        onClick={() => handleRestore(mapNotificationTemplateToDataForm(notificationTemplate))} 
                                                        className="p-2 bg-black rounded-sm hover:bg-gray-700"
                                                    >
                                                        <MdOutlineSettingsBackupRestore className="text-white" />
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => handleDelete(notificationTemplate)}
                                                        className="p-2 bg-black rounded-sm hover:bg-gray-700"
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
                        <NoData module="plantillas de notificación" />
                    )}

                    {/* PAGINATION */}
                    {notificationTemplates?.length > 0 && (
                        <div className="mt-6">
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
        </Layout>
    );
}

export default NotificationTemplateManagement;