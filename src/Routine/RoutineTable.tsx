import { MdModeEdit, MdOutlineDelete, MdOutlineSettingsBackupRestore, MdOutlineFileDownload, MdContentCopy } from "react-icons/md";
import { IoIosMore } from "react-icons/io";
import Modal from "../shared/components/Modal";
import NoData from "../shared/components/NoData";
import DataInfo from "./DataInfo";
import { Routine } from "../shared/types";

interface RoutineTableProps {
  routines: Routine[];
  modalInfo: boolean;

  getRoutineById: (id: number) => void;
  showModalInfo: () => void;
  closeModalInfo: () => void;

  handleDelete: (routine: Routine) => void;
  handleRestore: (routine: Routine) => void;
  handleDuplicate: (routine: Routine) => void;
  handleExportRoutine: (idRoutine: number, routineName: string) => Promise<void>;

  showModalForm: () => void;
}

function RoutineTable({
  routines,
  modalInfo,

  getRoutineById,
  showModalInfo,
  closeModalInfo,

  handleDelete,
  handleDuplicate,
  handleRestore,
  handleExportRoutine,

  showModalForm
}: RoutineTableProps) {

  return (
    <div className="w-full mt-4">

      <div className="overflow-x-auto rounded-lg">
        {routines?.length > 0 ? (
          <>
            <table className="w-full text-center">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="py-3 px-2 font-semibold hidden lg:table-cell">#</th>
                  <th className="py-3 px-2 font-semibold">NOMBRE</th>
                  <th className="py-3 px-2 font-semibold hidden md:table-cell">DIFICULTAD</th>
                  <th className="py-3 px-2 font-semibold">ACCIONES</th>
                </tr>
              </thead>

              <tbody className="text-sm">
                {routines.map((routine, index) => (
                  <tr
                    key={routine.idRoutine}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="py-3 hidden lg:table-cell">{index + 1}</td>
                    <td className="py-3 truncate px-2">
                      <span className="truncate inline-block max-w-full">
                        {routine.name}
                      </span>
                    </td>
                    <td className="py-3 hidden md:table-cell">{routine.difficultyRoutine.name}</td>

                    <td className="py-3">
                      <div className="flex justify-center gap-1 sm:gap-2 lg:gap-3 flex-wrap">

                        <button
                          onClick={() => {
                            getRoutineById(routine.idRoutine);
                            showModalInfo();
                          }}
                          className="p-1.5 sm:p-2 bg-black rounded hover:bg-gray-800"
                          title="Ver detalles"
                        >
                          <IoIosMore className="text-white text-sm sm:text-base" />
                        </button>

                        <button
                          onClick={() => {
                            getRoutineById(routine.idRoutine);
                            showModalForm();
                          }}
                          className="p-1.5 sm:p-2 bg-black rounded hover:bg-gray-800"
                          title="Editar"
                        >
                          <MdModeEdit className="text-white text-sm sm:text-base" />
                        </button>

                        <button
                          onClick={() => handleDuplicate(routine)}
                          className="p-1.5 sm:p-2 bg-black rounded hover:bg-gray-800"
                          title="Duplicar"
                        >
                          <MdContentCopy className="text-white text-sm sm:text-base" />
                        </button>

                        {routine.isDeleted ? (
                          <button
                            onClick={() => handleRestore(routine)}
                            className="p-1.5 sm:p-2 bg-black rounded hover:bg-gray-800"
                            title="Restaurar"
                          >
                            <MdOutlineSettingsBackupRestore className="text-white text-sm sm:text-base" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleDelete(routine)}
                            className="p-1.5 sm:p-2 bg-black rounded hover:bg-gray-800"
                            title="Eliminar"
                          >
                            <MdOutlineDelete className="text-white text-sm sm:text-base" />
                          </button>
                        )}

                        <button
                          onClick={() => handleExportRoutine(routine.idRoutine, routine.name)}
                          className="p-1.5 sm:p-2 bg-black rounded hover:bg-gray-800"
                          title="Exportar PDF"
                        >
                          <MdOutlineFileDownload className="text-white text-sm sm:text-base" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        ) : (
          <NoData module="rutinas" />
        )}
      </div>

      <Modal
        Button={() => <></>}
        modal={modalInfo}
        closeModal={closeModalInfo}
        getDataById={getRoutineById}
        Content={DataInfo}
      />
    </div>
  );
}

export default RoutineTable;