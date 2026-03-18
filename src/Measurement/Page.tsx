import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { Plus, Download, Upload } from "lucide-react";

import Modal from "../shared/components/Modal";
import ModalFilter from "../shared/components/ModalFilter";
import FileTypeDecision from "../shared/components/ModalFileType";
import ImportModal from "./ImportModal";

import { useMeasurementStore } from "./Store";
import { useMeasurement } from "./useMeasurement";

import Form from "./Form";
import MeasurementTable from "./MeasurementTable";
import { FilterButton, FilterSelect } from "./Filter";

import { exportToPDFMedidasLazy, exportToExcelMedidasLazy } from "../shared/utils/lazyExports";
import { setAuthHeader, setAuthUser } from "../shared/utils/authentication";

export default function MeasurementManagement() {
  const location = useLocation();
  const navigate = useNavigate();
  const idClient = location.state?.idClient;

  const {
    measurements,
    modalForm,
    modalFilter,
    modalInfo,
    modalFileTypeDecision,
    page,
    size,
    totalRecords,
    orderBy,
    directionOrderBy,
    searchTerm,
    filterByStatus,
    filterByDateRangeMin,
    filterByDateRangeMax,

    fetchMeasurements,
    getMeasurementById,
    changePage,
    changeSize,
    showModalForm,
    showModalInfo,
    closeModalForm,
    closeModalFilter,
    closeModalInfo,
    setIdClient,
    showModalFileType,
    closeModalFileType,
    resetEditing,
  } = useMeasurementStore();

  const {
    handleDelete,
    handleOrderByChange,
    handleRestore,
    tableColumn,
    tableRows,
    clientData,
  } = useMeasurement();

  // Estado para modal de importación
  const [showImportModal, setShowImportModal] = useState(false);

  useEffect(() => {
    if (idClient) setIdClient(idClient);
  }, [idClient]);

  useEffect(() => {
    const fetchData = async () => {
      const { logout } = await fetchMeasurements();
      if (logout) {
        setAuthHeader(null);
        setAuthUser(null);
        navigate("/login", { replace: true });
      }
    };

    if (idClient) fetchData();
  }, [
    idClient,
    page,
    size,
    searchTerm,
    orderBy,
    directionOrderBy,
    filterByStatus,
    filterByDateRangeMin,
    filterByDateRangeMax,
  ]);

  return (
    <>
      <header
        className="
          flex flex-col md:flex-row items-center justify-between
          bg-yellow text-black px-4 py-4 rounded-md shadow-md
        "
      >
        <h1 className="text-3xl md:text-4xl uppercase tracking-wide">
          Medidas Corporales
        </h1>

        <ModalFilter
          modalFilter={modalFilter}
          closeModalFilter={closeModalFilter}
          FilterButton={FilterButton}
          FilterSelect={FilterSelect}
        />
      </header>

      {/* Información del Cliente */}
      {clientData && (
        <div className="mt-4 bg-white rounded-lg shadow-md p-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
              <div>
                <span className="text-xs text-gray-500 uppercase font-semibold">Cliente</span>
                <p className="text-lg font-bold text-gray-800">{clientData.name}</p>
              </div>
              <div className="h-8 w-px bg-gray-300 hidden sm:block"></div>
              <div className="bg-yellow/20 px-4 py-2 rounded-full">
                <span className="text-xs text-gray-600 font-semibold">Edad actual: </span>
                <span className="text-lg font-bold text-yellow">{clientData.age} años</span>
              </div>
              <div className="bg-blue-50 px-4 py-2 rounded-full">
                <span className="text-xs text-gray-600 font-semibold">Altura: </span>
                <span className="text-lg font-bold text-blue-600">{clientData.height} cm</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <main className="mt-6">
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 overflow-hidden">

          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">

            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
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
                getDataById={getMeasurementById}
              Content={Form}
            />

            <button
              type="button"
              onClick={() => setShowImportModal(true)}
              className="
                w-full sm:w-auto
                px-4 py-2 bg-green-500 hover:bg-green-600 text-white
                rounded-full transition flex items-center gap-2
                justify-center sm:justify-start
              "
            >
              <Upload size={18} />
              Importar Excel
            </button>
            </div>

            {measurements?.length > 0 && (
              <Modal
                Button={() => (
                  <button
                    className="
                      w-full sm:w-auto
                      px-4 py-2 bg-gray-100 hover:bg-gray-300
                      rounded-full transition flex items-center gap-2
                      justify-center sm:justify-start
                    "
                    onClick={showModalFileType}
                  >
                    <Download size={18} />
                    Descargar
                  </button>
                )}
                modal={modalFileTypeDecision}
                closeModal={closeModalFileType}
                getDataById={getMeasurementById}
                Content={() => (
                  <FileTypeDecision
                    modulo="Medidas Corporales"
                    closeModal={closeModalFileType}
                    exportToPDF={() =>
                      exportToPDFMedidasLazy("Medidas", tableColumn, tableRows,clientData)
                    }
                    exportToExcel={() =>
                      exportToExcelMedidasLazy(
                        "Medidas",
                        tableColumn,
                        tableRows,
                        clientData,
                      )
                    }
                  />
                )}
              />
            )}
          </div>

          <MeasurementTable
            measurements={measurements}
            modalInfo={modalInfo}
            modalForm={modalForm}
            orderBy={orderBy}
            directionOrderBy={directionOrderBy}
            filterByStatus={Boolean(filterByStatus)}
            page={page}
            size={size}
            totalRecords={totalRecords}
            handleOrderByChange={handleOrderByChange}
            getMeasurementById={getMeasurementById}
            showModalInfo={showModalInfo}
            closeModalInfo={closeModalInfo}
            showModalForm={showModalForm}
            handleDelete={handleDelete}
            handleRestore={handleRestore}
            changePage={changePage}
            changeSize={changeSize}
          />
        </div>
      </main>

      {/* Modal de importación de Excel */}
      <ImportModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        idClient={idClient}
      />
    </>
  );
}