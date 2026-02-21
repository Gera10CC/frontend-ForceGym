import { useEffect } from "react"
import { useNavigate } from "react-router";
import { Plus } from "lucide-react";
import useNotificationTemplateStore from "./Store"
import { useNotificationTemplate } from "./useNotificationTemplate"
import { setAuthHeader, setAuthUser } from "../shared/utils/authentication";
import SearchInput from "../shared/components/SearchInput"
import ModalFilter from "../shared/components/ModalFilter"
import { FilterButton, FilterSelect } from "./Filter"
import Modal from "../shared/components/Modal"
import Form from "./Form"
import TemplateNotificationTable from "./TemplateNotificationTable";
import NoData from "../shared/components/NoData";

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
                bg-yellow text-black px-4 py-4 rounded-md shadow-md
            ">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl uppercase tracking-wide text-center lg:text-left">
                        Plantillas de Notificación
                    </h1>

                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto sm:justify-center lg:justify-end">
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
                    </div>
                </div>
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
                                        justify-center sm:justify-start
                                    "
                                >
                                    <Plus size={18} />
                                    Añadir
                                </button>
                            )}
                            modal={modalForm}
                            getDataById={getNotificationTemplateById}
                            closeModal={closeModalForm}
                            Content={Form}
                        />
                    </div>

                    {/* TABLA */}
                    {notificationTemplates?.length > 0 ? (
                        <TemplateNotificationTable
                            notificationTemplates={notificationTemplates}
                            modalInfo={modalInfo}
                            orderBy={orderBy}
                            directionOrderBy={directionOrderBy}
                            filterByStatus={Boolean(filterByStatus)}
                            page={page}
                            size={size}
                            totalRecords={totalRecords}
                            handleOrderByChange={handleOrderByChange}
                            getNotificationTemplateById={getNotificationTemplateById}
                            showModalInfo={showModalInfo}
                            closeModalInfo={closeModalInfo}
                            showModalForm={showModalForm}
                            handleDelete={handleDelete}
                            handleRestore={handleRestore}
                            changePage={changePage}
                            changeSize={changeSize}
                        />
                    ) : (
                        <NoData module="plantillas de notificación" />
                    )}

                </div>
            </main>
        </>
    );
}

export default NotificationTemplateManagement;