import { useEffect } from "react";
import Modal from "../shared/components/Modal";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router";

import { setAuthHeader, setAuthUser } from "../shared/utils/authentication";
import { useRoutineStore } from "./Store";
import { useRoutine } from "./useRoutine";
import Form from "./Form";
import RoutineTable from "./RoutineTable";

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
    closeModalFileType,
    resetEditing,
  } = useRoutineStore();

  const { handleDelete, handleRestore, handleExportRoutine } = useRoutine();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const result = await fetchRoutines();
      if (result?.logout) {
        setAuthHeader(null);
        setAuthUser(null);
        navigate("/login", { replace: true });
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <header
        className="
          flex flex-col md:flex-row items-center justify-between
          bg-yellow text-black px-4 py-4 rounded-md shadow-md
        "
      >
        <h1 className="text-3xl md:text-4xl uppercase tracking-wide">
          Rutinas
        </h1>
      </header>

      <main className="mt-6">
        <div
          className="
            bg-white rounded-lg shadow-md p-4 sm:p-6
            overflow-hidden
          "
        >
          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">

            <Modal
              Button={() => (
                <button
                  type="button"
                  onClick={() => {
                    resetEditing();
                    showModalForm();
                  }}
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
              closeModal={closeModalForm}
              getDataById={getRoutineById}
              Content={Form}
            />
          </div>

          <RoutineTable
            routines={routines}
            modalInfo={modalInfo}
            modalFileTypeDecision={modalFileTypeDecision}

            getRoutineById={getRoutineById}
            showModalInfo={showModalInfo}
            closeModalInfo={closeModalInfo}

            showModalFileType={showModalFileType}
            closeModalFileType={closeModalFileType}

            handleDelete={handleDelete}
            handleRestore={handleRestore}
            handleExportRoutine={handleExportRoutine}

            showModalForm={showModalForm}
          />
        </div>
      </main>
    </>
  );
}

export default RoutineManagement;