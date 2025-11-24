import { useEffect } from "react";
import { MdOutlineDelete, MdModeEdit, MdOutlineSettingsBackupRestore, MdOutlineFileDownload } from "react-icons/md";
import { IoIosMore } from "react-icons/io";
import Modal from "../shared/components/Modal";
import { useNavigate } from "react-router";
import NoData from "../shared/components/NoData";
import { setAuthHeader, setAuthUser } from "../shared/utils/authentication";
import { useRoutineStore } from "./Store";
import { useRoutine } from "./useRoutine";
import Form from "./Form";
import DataInfo from "./DataInfo";
import FileTypeDecision from "../shared/components/ModalFileType";

function RoutineManagement() {
    const {
        routines,
        modalForm,
        modalInfo,
        modalFileTypeDecision,
        fetchRoutines,
        getRoutineById,
        showModalForm,
        showModalInfo,
        closeModalForm,
        closeModalInfo,
        showModalFileType,
        closeModalFileType
    } = useRoutineStore();

    const { handleDelete, handleRestore, handleExportRoutine } = useRoutine();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetchRoutines();
                if (response?.logout) {
                    setAuthHeader(null);
                    setAuthUser(null);
                    navigate("/login", { replace: true });
                }
            } catch (error) {
                console.error("Error fetching routines:", error);
            }
        };

        fetchData();
    }, [fetchRoutines, navigate]);

    return (
        <div className="bg-black min-h-screen">
            <header className="flex ml-12 h-20 w-0.90 items-center text-black bg-yellow justify-between px-4">
                <h1 className="text-4xl uppercase">Rutinas</h1>
            </header>

            <main className="justify-items-center ml-12 p-4">
                <div className="flex flex-col mx-12 mt-4 bg-white text-lg w-full max-h-full overflow-scroll">
                    <div className="flex justify-between">
                        <Modal
                            Button={() => (
                                <button
                                    className="mt-4 ml-2 px-2 py-1 hover:bg-gray-300 hover:rounded-full hover:cursor-pointer"
                                    type="button"
                                    onClick={() => {
                                        getRoutineById(0);
                                        showModalForm();
                                    }}
                                >
                                    + Añadir
                                </button>
                            )}
                            modal={modalForm}
                            getDataById={getRoutineById}
                            closeModal={closeModalForm}
                            Content={Form}
                        />
                    </div>

                    {routines?.length > 0 ? (
                        <table className="w-full mt-8 border-t-2 border-slate-200 overflow-scroll">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>NOMBRE</th>
                                    <th>DIFICULTAD</th>
                                    <th>ACCIONES</th>
                                </tr>
                            </thead>
                            <tbody>
                                {routines.map((routine, index) => (
                                    <tr key={routine.idRoutine} className="text-center py-8">
                                        <td className="py-2">{index + 1}</td>
                                        <td className="py-2">{routine.name}</td>
                                        <td className="py-2">{routine.difficultyRoutine.name}</td>
                                        <td className="py-2">
                                            <div className="flex gap-2 justify-center flex-wrap">
                                                <Modal
                                                    Button={() => (
                                                        <button
                                                            onClick={() => {
                                                                getRoutineById(routine.idRoutine);
                                                                showModalInfo();
                                                            }}
                                                            className="p-2 bg-black rounded-sm hover:bg-gray-700 hover:cursor-pointer"
                                                            title="Ver detalles"
                                                        >
                                                            <IoIosMore className="text-white" />
                                                        </button>
                                                    )}
                                                    modal={modalInfo}
                                                    getDataById={getRoutineById}
                                                    closeModal={closeModalInfo}
                                                    Content={DataInfo}
                                                />

                                                <button
                                                    onClick={() => {
                                                        getRoutineById(routine.idRoutine);
                                                        showModalForm();
                                                    }}
                                                    className="p-2 bg-black rounded-sm hover:bg-gray-700 hover:cursor-pointer"
                                                    title="Editar"
                                                >
                                                    <MdModeEdit className="text-white" />
                                                </button>

                                                <button
                                                    onClick={() => handleDelete(routine)}
                                                    className="p-2 bg-black rounded-sm hover:bg-gray-700 hover:cursor-pointer"
                                                    title="Eliminar"
                                                >
                                                    <MdOutlineDelete className="text-white" />
                                                </button>

                                                {routine.isDeleted === 1 && (
                                                    <button
                                                        onClick={() => handleRestore(routine)}
                                                        className="p-2 bg-black rounded-sm hover:bg-gray-700 hover:cursor-pointer"
                                                        title="Restaurar"
                                                    >
                                                        <MdOutlineSettingsBackupRestore className="text-white" />
                                                    </button>
                                                )}

                                                <Modal
                                                    Button={() => (
                                                        <button
                                                            onClick={() => {
                                                                getRoutineById(routine.idRoutine);
                                                                showModalFileType();
                                                            }}
                                                            className="p-2 bg-black rounded-sm hover:bg-gray-700 hover:cursor-pointer"
                                                            title="Exportar"
                                                        >
                                                            <MdOutlineFileDownload className="text-white" />
                                                        </button>
                                                    )}
                                                    modal={modalFileTypeDecision}
                                                    getDataById={getRoutineById}
                                                    closeModal={closeModalFileType}
                                                    Content={() => 
                                                        <FileTypeDecision 
                                                            modulo="Rutina" 
                                                            closeModal={closeModalFileType} 
                                                            exportToPDF={async () => {
                                                                const result = await handleExportRoutine();
                                                                result?.exportToPDF();
                                                            }}
                                                            exportToExcel={async () => {
                                                                const result = await handleExportRoutine();
                                                                result?.exportToExcel();
                                                            }}
                                                        />
                                                    }
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <NoData module="rutinas disponibles" />
                    )}
                </div>
            </main>
        </div>
    );
}

export default RoutineManagement;