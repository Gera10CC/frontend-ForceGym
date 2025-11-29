import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { Plus, Download } from "lucide-react";

import Modal from "../shared/components/Modal";
import ModalFilter from "../shared/components/ModalFilter";
import FileTypeDecision from "../shared/components/ModalFileType";

import { useMeasurementStore } from "./Store";
import { useMeasurement } from "./useMeasurement";

import Form from "./Form";
import MeasurementTable from "./MeasurementTable";
import { FilterButton, FilterSelect } from "./Filter";

import { exportToPDFMedidas } from "../shared/utils/pdfMedidas";
import { exportToExcelMedidas } from "../shared/utils/excelMedidas";
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

      <main className="mt-6">
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 overflow-hidden">

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
              getDataById={getMeasurementById}
              Content={Form}
            />

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
                      exportToPDFMedidas("Medidas", tableColumn, tableRows,clientData)
                    }
                    exportToExcel={() =>
                      exportToExcelMedidas(
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
    </>
  );
}