import { useEffect } from "react";
import { useNavigate } from "react-router";
import { MdOutlineDelete, MdModeEdit, MdOutlineSettingsBackupRestore } from "react-icons/md";

import useExerciseCategoryStore from "./Store";
import { setAuthHeader, setAuthUser } from "../shared/utils/authentication";

import Modal from "../shared/components/Modal";
import Form from "./Form";
import NoData from "../shared/components/NoData";
import { useExerciseCategory } from "./useExerciseCategory";
import Pagination from "../shared/components/Pagination";
import ModalFilter from "../shared/components/ModalFilter";
import { FilterButton, FilterSelect } from "./Filter";
import Layout from "../shared/components/Layout";

function ExerciseCategoryManagement() {
    const navigate = useNavigate();
    const {
        categories,
        page,
        size,
        totalRecords,
        filterByStatus,
        modalForm,
        modalFilter,
        fetchExerciseCategories,
        getExerciseCategoryById,
        changePage,
        changeSize,
        showModalForm,
        closeModalForm,
        closeModalFilter,
    } = useExerciseCategoryStore();

    const { handleDelete, handleRestore } = useExerciseCategory();

    useEffect(() => {
        const fetchData = async () => {
            const { logout } = await fetchExerciseCategories();
            if (logout) {
                setAuthHeader(null);
                setAuthUser(null);
                navigate("/login", { replace: true });
            }
        };
        fetchData();
    }, [size, page, filterByStatus]);

    return (
        <Layout>
            {/* HEADER */}
            <header className="
                flex flex-col md:flex-row items-center justify-between gap-4
                bg-yellow text-black px-4 py-4 rounded-md shadow-md
            ">
                <h1 className="text-3xl md:text-4xl uppercase tracking-wide text-center md:text-left w-full md:w-auto">
                    Categorías de Ejercicios
                </h1>
                
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
                            getDataById={getExerciseCategoryById}
                            closeModal={closeModalForm}
                            Content={Form}
                        />
                    </div>

                    {/* TABLE */}
                    {categories?.length > 0 ? (
                        <div className="overflow-x-auto w-full">
                            <table className="w-full border-t-2 border-slate-200 min-w-[600px]">
                                <thead>
                                    <tr className="text-center">
                                        <th className="px-2 py-2">#</th>
                                        <th className="px-2 py-2">
                                            <button className="inline-flex items-center gap-2 py-0.5 px-2 rounded-full hover:bg-slate-300">
                                                NOMBRE
                                            </button>
                                        </th>
                                        {filterByStatus && <th className="px-2 py-2">ESTADO</th>}
                                        <th className="px-2 py-2">ACCIONES</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {categories.map((category, index) => (
                                        <tr key={category.idExerciseCategory} className="text-center">
                                            <td className="py-2">{(page - 1) * size + index + 1}</td>
                                            <td className="py-2">{category.name}</td>
                                            {filterByStatus && (
                                                <td className="py-2">
                                                    {category.isDeleted ? (
                                                        <button className="py-0.5 px-2 rounded-lg bg-red-500 text-white">
                                                            Inactiva
                                                        </button>
                                                    ) : (
                                                        <button className="py-0.5 px-2 rounded-lg bg-green-500 text-white">
                                                            Activa
                                                        </button>
                                                    )}
                                                </td>
                                            )}
                                            <td className="flex gap-3 justify-center py-3">
                                                <button
                                                    onClick={() => {
                                                        getExerciseCategoryById(category.idExerciseCategory);
                                                        showModalForm();
                                                    }}
                                                    className="p-2 bg-black rounded-sm hover:bg-gray-700"
                                                    title="Editar"
                                                >
                                                    <MdModeEdit className="text-white" />
                                                </button>
                                                {category.isDeleted ? (
                                                    <button 
                                                        onClick={() => handleRestore(category)} 
                                                        className="p-2 bg-black rounded-sm hover:bg-gray-700"
                                                    >
                                                        <MdOutlineSettingsBackupRestore className="text-white" />
                                                    </button>
                                                ) : (
                                                    <button 
                                                        onClick={() => handleDelete(category)} 
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
                        <NoData module="categorías de ejercicios" />
                    )}

                    {/* PAGINATION */}
                    {categories?.length > 0 && (
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

export default ExerciseCategoryManagement;
