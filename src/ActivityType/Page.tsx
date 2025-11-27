import { useEffect } from "react"
import { MdOutlineDelete, MdModeEdit, MdOutlineSettingsBackupRestore } from "react-icons/md"
import { IoIosMore } from "react-icons/io";
import Modal from "../shared/components/Modal"
import { useNavigate } from "react-router";
import NoData from "../shared/components/NoData";
import { setAuthHeader, setAuthUser } from "../shared/utils/authentication";
import useActivityTypeStore from './Store'
import { useActivityType } from "./useActivityType";
import Form from "./Form";
import DataInfo from "./DataInfo";
import Layout from "../shared/components/Layout";

function ActivityTypeManagement() {
    const {
        activityTypes,
        modalForm,
        modalInfo,
        fetchActivityTypes,
        getActivityTypeById,
        showModalForm,
        showModalInfo,
        closeModalForm,
        closeModalInfo,
    } = useActivityTypeStore();

    const { handleDelete, handleRestore } = useActivityType()
    const navigate = useNavigate()

    useEffect(() => {}, [activityTypes])
    
    useEffect(() => {
        const fetchData = async () => {
            const { logout } = await fetchActivityTypes()
            if (logout) {
                setAuthHeader(null)
                setAuthUser(null)
                navigate('/login')
            }

        }

        fetchData()
    }, [])

    return (
        <Layout>
            {/* HEADER */}
            <header className="
                flex flex-col md:flex-row items-center justify-between gap-4
                bg-yellow text-black px-4 py-4 rounded-md shadow-md
            ">
                <h1 className="text-3xl md:text-4xl uppercase tracking-wide">
                    Tipos de Actividad
                </h1>
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
                            getDataById={getActivityTypeById}
                            closeModal={closeModalForm}
                            Content={Form}
                        />
                    </div>

                    {/* TABLE */}
                    {activityTypes?.length > 0 ? (
                        <div className="overflow-x-auto w-full">
                            <table className="w-full border-t-2 border-slate-200 min-w-[600px]">
                                <thead>
                                    <tr className="text-center">
                                        <th className="px-2 py-2">#</th>
                                        <th className="px-2 py-2">NOMBRE</th>
                                        <th className="px-2 py-2">ACCIONES</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {activityTypes?.map((activityType, index) => (
                                        <tr key={activityType.idActivityType} className="text-center">
                                            <td className="py-2">{index + 1}</td>
                                            <td className="py-2">{activityType.name}</td>
                                            <td className="flex gap-3 justify-center py-3">
                                                <Modal
                                                    Button={() => (
                                                        <button
                                                            onClick={() => {
                                                                getActivityTypeById(activityType.idActivityType);
                                                                showModalInfo();
                                                            }}
                                                            className="p-2 bg-black rounded-sm hover:bg-gray-700"
                                                            title="Ver detalles"
                                                        >
                                                            <IoIosMore className="text-white" />
                                                        </button>
                                                    )}
                                                    modal={modalInfo}
                                                    getDataById={getActivityTypeById}
                                                    closeModal={closeModalInfo}
                                                    Content={DataInfo}
                                                />
                                                <button
                                                    onClick={() => {
                                                        getActivityTypeById(activityType.idActivityType);
                                                        showModalForm();
                                                    }}
                                                    className="p-2 bg-black rounded-sm hover:bg-gray-700"
                                                    title="Editar"
                                                >
                                                    <MdModeEdit className="text-white" />
                                                </button>
                                                {activityType.isDeleted ? (
                                                    <button onClick={() => handleRestore(activityType)} className="p-2 bg-black rounded-sm hover:bg-slate-700">
                                                        <MdOutlineSettingsBackupRestore className="text-white" />
                                                    </button>
                                                ) : (
                                                    <button onClick={() => handleDelete(activityType)} className="p-2 bg-black rounded-sm hover:bg-gray-700"
                                                        title="Eliminar">
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
                        <NoData module="tipos de actividad" />
                    )}
                </div>
            </main>
        </Layout>
    );
}

export default ActivityTypeManagement;