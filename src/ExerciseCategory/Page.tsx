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
        <>
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
                            getDataById={getExerciseCategoryById}
                            closeModal={closeModalForm}
                            Content={Form}
                        />
                    </div>

          <div className="w-full mt-4">
            <div className="overflow-x-auto rounded-lg">
              {categories?.length > 0 ? (
                <>
                  <table className="w-full min-w-[600px] text-center">
                    <thead className="bg-gray-100 text-gray-700">
                      <tr>
                        <th className="py-3 px-2 font-semibold">#</th>
                        <th className="py-3 px-2 font-semibold">NOMBRE</th>

                        {filterByStatus && (
                          <th className="py-3 px-2 font-semibold">ESTADO</th>
                        )}

                        <th className="py-3 px-2 font-semibold">ACCIONES</th>
                      </tr>
                    </thead>

                    <tbody className="text-sm">
                      {categories.map((category, index) => (
                        <tr
                          key={category.idExerciseCategory}
                          className="border-b hover:bg-gray-50 transition"
                        >
                          <td className="py-3">
                            {(page - 1) * size + index + 1}
                          </td>

                          <td className="py-3">{category.name}</td>

                          {filterByStatus && (
                            <td className="py-3">
                              {category.isDeleted ? (
                                <span className="px-2 py-1 rounded bg-red-500 text-white text-xs">
                                  Inactiva
                                </span>
                              ) : (
                                <span className="px-2 py-1 rounded bg-green-500 text-white text-xs">
                                  Activa
                                </span>
                              )}
                            </td>
                          )}

                          <td className="py-3">
                            <div className="flex justify-center gap-3">
                              <button
                                onClick={() => {
                                  getExerciseCategoryById(
                                    category.idExerciseCategory
                                  );
                                  showModalForm();
                                }}
                                className="p-2 bg-black rounded hover:bg-gray-800"
                                title="Editar"
                              >
                                <MdModeEdit className="text-white" />
                              </button>

                              {category.isDeleted ? (
                                <button
                                  onClick={() => handleRestore(category)}
                                  className="p-2 bg-black rounded hover:bg-gray-800"
                                  title="Restaurar"
                                >
                                  <MdOutlineSettingsBackupRestore className="text-white" />
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleDelete(category)}
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
                <NoData module="categorías de ejercicios" />
              )}
            </div>

            {categories?.length > 0 && (
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

export default ExerciseCategoryManagement;