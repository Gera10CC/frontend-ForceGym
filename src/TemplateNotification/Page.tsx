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

    useEffect(() => { }, [notificationTemplates])

    useEffect(() => {
        const fetchData = async () => {
            const { logout } = await fetchNotificationTemplates()

            if (logout) {
                setAuthHeader(null)
                setAuthUser(null)
                navigate('/login', { replace: true })
            }

        }

        fetchData()
    }, [page, size, searchType, searchTerm, orderBy, directionOrderBy, filterByStatus, filterByNotificationType])

    return (
        <>
            <header className="
                flex flex-col md:flex-row items-center justify-between gap-4
                bg-yellow text-black px-4 py-4 rounded-md shadow-md
            ">
                <h1 className="text-3xl md:text-4xl uppercase tracking-wide">
                    Plantillas de Notificación
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

            <main className="mt-6">
                <div className="
                    bg-white rounded-lg shadow-md p-4 sm:p-6
                    overflow-hidden
                ">
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

                    <div className="w-full mt-4">

                        <div className="overflow-x-auto rounded-lg">
                            {notificationTemplates?.length > 0 ? (
                                <>
                                    <table className="w-full min-w-[700px] text-center">
                                        <thead className="bg-gray-100 text-gray-700">
                                            <tr>
                                                <th className="py-3 px-2 font-semibold">#</th>

                                                <th className="py-3 px-2">
                                                    <button
                                                        className="inline-flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-200"
                                                        onClick={() => handleOrderByChange("message")}
                                                    >
                                                        MENSAJE
                                                        {orderBy === "message" && directionOrderBy === "DESC" && (
                                                            <FaArrowUp className="text-yellow" />
                                                        )}
                                                        {orderBy === "message" && directionOrderBy === "ASC" && (
                                                            <FaArrowDown className="text-yellow" />
                                                        )}
                                                    </button>
                                                </th>

                                                <th className="py-3 px-2">
                                                    <button
                                                        className="inline-flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-200"
                                                        onClick={() => handleOrderByChange("notificationType")}
                                                    >
                                                        TIPO
                                                        {orderBy === "notificationType" && directionOrderBy === "DESC" && (
                                                            <FaArrowUp className="text-yellow" />
                                                        )}
                                                        {orderBy === "notificationType" && directionOrderBy === "ASC" && (
                                                            <FaArrowDown className="text-yellow" />
                                                        )}
                                                    </button>
                                                </th>

                                                {filterByStatus && (
                                                    <th className="py-3 px-2 font-semibold">ESTADO</th>
                                                )}

                                                <th className="py-3 px-2 font-semibold">ACCIONES</th>
                                            </tr>
                                        </thead>

                                        <tbody className="text-sm">
                                            {notificationTemplates.map((notificationTemplate, index) => (
                                                <tr
                                                    key={notificationTemplate.idNotificationTemplate}
                                                    className="border-b hover:bg-gray-50 transition"
                                                >
                                                    <td className="py-3">
                                                        {(page - 1) * size + index + 1}
                                                    </td>

                                                    <td className="py-3">
                                                        {notificationTemplate.message}
                                                    </td>

                                                    <td className="py-3">
                                                        {notificationTemplate.notificationType.name}
                                                    </td>

                                                    {filterByStatus && (
                                                        <td className="py-3">
                                                            {notificationTemplate.isDeleted ? (
                                                                <span className="px-2 py-1 rounded bg-red-500 text-white text-xs">
                                                                    Inactivo
                                                                </span>
                                                            ) : (
                                                                <span className="px-2 py-1 rounded bg-green-500 text-white text-xs">
                                                                    Activo
                                                                </span>
                                                            )}
                                                        </td>
                                                    )}

                                                    <td className="py-3">
                                                        <div className="flex justify-center gap-3">

                                                            <Modal
                                                                Button={() => (
                                                                    <button
                                                                        onClick={() => {
                                                                            getNotificationTemplateById(
                                                                                notificationTemplate.idNotificationTemplate
                                                                            );
                                                                            showModalInfo();
                                                                        }}
                                                                        className="p-2 bg-black rounded hover:bg-gray-800"
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
                                                                    getNotificationTemplateById(
                                                                        notificationTemplate.idNotificationTemplate
                                                                    );
                                                                    showModalForm();
                                                                }}
                                                                className="p-2 bg-black rounded hover:bg-gray-800"
                                                                title="Editar"
                                                            >
                                                                <MdModeEdit className="text-white" />
                                                            </button>

                                                            {notificationTemplate.isDeleted ? (
                                                                <button
                                                                    onClick={() =>
                                                                        handleRestore(
                                                                            mapNotificationTemplateToDataForm(notificationTemplate)
                                                                        )
                                                                    }
                                                                    className="p-2 bg-black rounded hover:bg-gray-800"
                                                                    title="Restaurar"
                                                                >
                                                                    <MdOutlineSettingsBackupRestore className="text-white" />
                                                                </button>
                                                            ) : (
                                                                <button
                                                                    onClick={() => handleDelete(notificationTemplate)}
                                                                    className="p-2 bg-black rounded hover:bg-gray-800"
                                                                    title="Eliminar"
                                                                >
                                                                    <MdOutlineDelete className="text-white" />
                                                                </button>
                                                            )}

                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </>
                            ) : (
                                <NoData module="plantillas de notificación" />
                            )}
                        </div>
                        {notificationTemplates?.length > 0 && (
                            <Pagination
                                page={page}
                                size={size}
                                totalRecords={totalRecords}
                                onSizeChange={changeSize}
                                onPageChange={changePage}
                            />
                        )}

                    </div>

                </div>
            </main>
        </>
    );
}

export default NotificationTemplateManagement;