import { Plus, Download } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router";

import { useClientStore } from "./Store";
import { useClient } from "./useClient";

import {
  setAuthHeader,
  setAuthUser,
} from "../shared/utils/authentication";

import SearchInput from "../shared/components/SearchInput";
import ModalFilter from "../shared/components/ModalFilter";
import Modal from "../shared/components/Modal";

import Form from "./Form/MultiStepForm";
import ClientTable from "./ClientTable";
import FileTypeDecision from "../shared/components/ModalFileType";

import { FilterButton, FilterSelect } from "./Filter";
import { exportToPDFGeneral } from "../shared/utils/pdfGeneral";
import { exportToExcel } from "../shared/utils/excelGeneral";

export default function ClientManagement() {
  const {
    clients,
    modalForm,
    modalFilter,
    modalInfo,
    modalFileTypeDecision,

    page,
    size,
    totalRecords,

    orderBy,
    directionOrderBy,

    searchType,
    searchTerm,

    filterByStatus,
    filterByBalanceLoss,
    filterByBirthDateRangeMax,
    filterByBirthDateRangeMin,
    filterByBoneJointIssues,
    filterByBreathingIssues,
    filterByCardiovascularDisease,
    filterByClientType,
    filterByDiabetes,
    filterByHypertension,
    filterByMuscleInjuries,

    fetchClients,
    getClientById,

    changePage,
    changeSize,
    changeSearchType,

    showModalForm,
    showModalInfo,
    closeModalForm,
    closeModalFilter,
    closeModalInfo,
    resetEditing,

    showModalFileType,
    closeModalFileType,
  } = useClientStore();

  const {
    handleDelete,
    handleSearch,
    handleOrderByChange,
    handleRestore,
    pdfTableHeaders,
    pdfTableRows,
  } = useClient();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const { logout } = await fetchClients();

      if (logout) {
        setAuthHeader(null);
        setAuthUser(null);
        navigate("/login", { replace: true });
      }
    };

    fetchData();
  }, [
    page,
    size,
    searchType,
    searchTerm,
    orderBy,
    directionOrderBy,

    filterByStatus,
    filterByBalanceLoss,
    filterByBirthDateRangeMax,
    filterByBirthDateRangeMin,
    filterByBoneJointIssues,
    filterByBreathingIssues,
    filterByCardiovascularDisease,
    filterByClientType,
    filterByDiabetes,
    filterByHypertension,
    filterByMuscleInjuries,
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
          Clientes
        </h1>
        <SearchInput
          searchTerm={searchTerm}
          handleSearch={handleSearch}
          changeSearchType={changeSearchType}
        >
          <option value={1}>Nombre</option>
          <option value={2}>Cédula</option>
          <option value={3}>Teléfono</option>
        </SearchInput>

        <ModalFilter
          modalFilter={modalFilter}
          closeModalFilter={closeModalFilter}
          FilterButton={FilterButton}
          FilterSelect={FilterSelect}
        />
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
              getDataById={getClientById}
              Content={Form}
            />
            {clients?.length > 0 && (
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
                getDataById={getClientById}
                Content={() => (
                  <FileTypeDecision
                    modulo="Clientes"
                    closeModal={closeModalFileType}
                    exportToPDF={() =>
                      exportToPDFGeneral("Clientes", pdfTableHeaders, pdfTableRows)
                    }
                    exportToExcel={() =>
                      exportToExcel("Clientes", pdfTableHeaders, pdfTableRows)
                    }
                  />
                )}
              />
            )}
          </div>

          <ClientTable
            clients={clients}
            modalInfo={modalInfo}
            modalForm={modalForm}
            orderBy={orderBy}
            directionOrderBy={directionOrderBy}
            filterByStatus={Boolean(filterByStatus)}
            page={page}
            size={size}
            totalRecords={totalRecords}
            handleOrderByChange={handleOrderByChange}
            getClientById={getClientById}
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