import { MdModeEdit, MdOutlineDelete, MdOutlineSettingsBackupRestore } from "react-icons/md";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import { IoIosMore } from "react-icons/io";
import Modal from "../shared/components/Modal";
import Pagination from "../shared/components/Pagination";
import NoData from "../shared/components/NoData";
import DataInfo from "./DataInfo";
import { mapExerciseToDataForm } from "../shared/types/mapper";
import { Exercise } from "../shared/types";

interface ExerciseTableProps {
  exercises: Exercise[];
  modalInfo: boolean;
  orderBy: string;
  directionOrderBy: string;
  filterByStatus: boolean;
  page: number;
  size: number;
  totalRecords: number;
  handleOrderByChange: (field: string) => void;
  getExerciseById: (id: number) => void;
  showModalInfo: () => void;
  closeModalInfo: () => void;
  showModalForm: () => void;
  handleDelete: (exercise: Exercise) => void;
  handleRestore: (exercise: any) => void;
  changePage: (page: number) => void;
  changeSize: (size: number) => void;
}

function ExerciseTable({
  exercises,
  modalInfo,
  orderBy,
  directionOrderBy,
  filterByStatus,
  page,
  size,
  totalRecords,
  handleOrderByChange,
  getExerciseById,
  showModalInfo,
  closeModalInfo,
  showModalForm,
  handleDelete,
  handleRestore,
  changePage,
  changeSize,
}: ExerciseTableProps) {
  return (
    <div className="w-full mt-4">

      <div className="overflow-x-auto rounded-lg">
        {exercises?.length > 0 ? (
          <>
            <table className="w-full text-center">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="py-3 px-2 font-semibold hidden lg:table-cell">#</th>

                  <th className="py-3 px-2">
                    <button
                      onClick={() => handleOrderByChange("name")}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-200"
                    >
                      NOMBRE
                      {orderBy === "name" && directionOrderBy === "DESC" && (
                        <FaArrowUp className="text-yellow" />
                      )}
                      {orderBy === "name" && directionOrderBy === "ASC" && (
                        <FaArrowDown className="text-yellow" />
                      )}
                    </button>
                  </th>

                  <th className="py-3 px-2 font-semibold hidden lg:table-cell">DESCRIPCIÓN</th>

                  <th className="py-3 px-2 font-semibold hidden md:table-cell">DIFICULTAD</th>

                  <th className="py-3 px-2 font-semibold hidden md:table-cell">CATEGORÍA</th>

                  {filterByStatus && (
                    <th className="py-3 px-2 font-semibold hidden md:table-cell">ESTADO</th>
                  )}

                  <th className="py-3 px-2 font-semibold">ACCIONES</th>
                </tr>
              </thead>

              <tbody className="text-sm">
                {exercises.map((exercise, index) => (
                  <tr
                    key={exercise.idExercise}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="py-3 hidden lg:table-cell">{index + 1}</td>

                    <td className="py-3 truncate px-2">
                      <span className="truncate inline-block max-w-full">
                        {exercise.name}
                      </span>
                    </td>

                    <td className="py-3 hidden lg:table-cell">{exercise.description}</td>

                    <td className="py-3 hidden md:table-cell">{exercise.exerciseDifficulty?.difficulty}</td>

                    <td className="py-3 hidden md:table-cell">{exercise.exerciseCategory?.name}</td>

                    {filterByStatus && (
                      <td className="py-3 hidden md:table-cell">
                        {exercise.isDeleted ? (
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
                      <div className="flex justify-center gap-1 sm:gap-2 lg:gap-3 flex-wrap">
                        <button
                          onClick={() => {
                            getExerciseById(exercise.idExercise);
                            showModalInfo();
                          }}
                          className="p-1.5 sm:p-2 bg-black rounded hover:bg-gray-800"
                        >
                          <IoIosMore className="text-white text-sm sm:text-base" />
                        </button>

                        <button
                          onClick={() => {
                            getExerciseById(exercise.idExercise);
                            showModalForm();
                          }}
                          className="p-1.5 sm:p-2 bg-black rounded hover:bg-gray-800"
                        >
                          <MdModeEdit className="text-white text-sm sm:text-base" />
                        </button>

                        {exercise.isDeleted ? (
                          <button
                            onClick={() =>
                              handleRestore(mapExerciseToDataForm(exercise))
                            }
                            className="p-1.5 sm:p-2 bg-black rounded hover:bg-gray-800"
                          >
                            <MdOutlineSettingsBackupRestore className="text-white text-sm sm:text-base" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleDelete(exercise)}
                            className="p-1.5 sm:p-2 bg-black rounded hover:bg-gray-800"
                          >
                            <MdOutlineDelete className="text-white text-sm sm:text-base" />
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
          <NoData module="ejercicios" />
        )}
      </div>

      {exercises?.length > 0 && (
        <Pagination
          page={page}
          size={size}
          totalRecords={totalRecords}
          onSizeChange={changeSize}
          onPageChange={changePage}
        />
      )}

      <Modal
        Button={() => <></>}
        modal={modalInfo}
        closeModal={closeModalInfo}
        getDataById={getExerciseById}
        Content={DataInfo}
      />
    </div>
  );
}

export default ExerciseTable;