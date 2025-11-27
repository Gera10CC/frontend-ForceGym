import { Plus, Download } from "lucide-react";
import Modal from "../shared/components/Modal";
import ModalFilter from "../shared/components/ModalFilter";
import SearchInput from "../shared/components/SearchInput";
import Layout from "../shared/components/Layout";

import { useEconomicIncomeStore } from "./Store";
import { useNavigate } from "react-router";
import { useEconomicIncome } from "./useIncome";

import Form from "./Form";
import FileTypeDecision from "../shared/components/ModalFileType";
import IncomeDashboard from "./IncomeDashboard";
import IncomeTable from "./IncomeTable";

import { exportToPDF } from "../shared/utils/pdf";
import { exportToExcel } from "../shared/utils/excel";

import { useEffect, useState } from "react";
import { FilterButton, FilterSelect } from "./Filter";
import { setAuthHeader, setAuthUser } from "../shared/utils/authentication";

export default function EconomicIncomeManagement() {
  const {
    economicIncomes,
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
    filterByAmountRangeMax,
    filterByAmountRangeMin,
    filterByMeanOfPayment,
    filterByDateRangeMax,
    filterByDateRangeMin,
    filterByClientType,

    fetchEconomicIncomes,
    getEconomicIncomeById,
    changePage,
    changeSize,
    changeSearchType,

    showModalForm,
    showModalInfo,
    closeModalForm,
    closeModalFilter,
    closeModalInfo,
    showModalFileType,
    closeModalFileType,
    resetEditing
  } = useEconomicIncomeStore();

  const {
    handleDelete,
    handleSearch,
    handleOrderByChange,
    handleRestore,
    pdfTableHeaders,
    pdfTableRows,
  } = useEconomicIncome();

  const navigate = useNavigate();
  const [showDashboard, setShowDashboard] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const { logout } = await fetchEconomicIncomes();
      if (logout) {
        setAuthHeader(null);
        setAuthUser(null);
        navigate("/login", { replace: true });
      }
    };
    fetchData();
  }, [
    page, size, searchType, searchTerm,
    orderBy, directionOrderBy,
    filterByStatus, filterByAmountRangeMax, filterByAmountRangeMin,
    filterByMeanOfPayment, filterByDateRangeMax, filterByDateRangeMin, filterByClientType
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
          Ingresos
        </h1>

        <SearchInput
          searchTerm={searchTerm}
          handleSearch={handleSearch}
          changeSearchType={changeSearchType}
        >
          <option value={1}>Voucher</option>
          <option value={2}>Detalle</option>
          <option value={3}>Cliente</option>
        </SearchInput>

        <div className="flex gap-3 mt-4 md:mt-0">
          <button
            onClick={() => setShowDashboard(!showDashboard)}
            className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition"
          >
            {showDashboard ? "Ver Tabla" : "Ver Dashboard"}
          </button>

          <ModalFilter
            modalFilter={modalFilter}
            closeModalFilter={closeModalFilter}
            FilterButton={FilterButton}
            FilterSelect={FilterSelect}
          />
        </div>
      </header>

      <main className="mt-6">
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">

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
              getDataById={getEconomicIncomeById}
              Content={Form}
            />

            {economicIncomes?.length > 0 && (
              <Modal
                Button={() => (
                  <button
                    onClick={showModalFileType}
                    className="
                      w-full sm:w-auto
                      px-4 py-2 bg-gray-100 hover:bg-gray-300
                      rounded-full transition flex items-center gap-2
                      justify-center sm:justify-start
                    "
                  >
                    <Download size={18} />
                    Descargar
                  </button>
                )}
                modal={modalFileTypeDecision}
                closeModal={closeModalFileType}
                getDataById={getEconomicIncomeById}
                Content={() => (
                  <FileTypeDecision
                    modulo="Ingresos económicos"
                    closeModal={closeModalFileType}
                    exportToPDF={() =>
                      exportToPDF("Ingresos", pdfTableHeaders, pdfTableRows)
                    }
                    exportToExcel={() =>
                      exportToExcel("Ingresos", pdfTableHeaders, pdfTableRows)
                    }
                  />
                )}
              />
            )}
          </div>

          {showDashboard ? (
            <IncomeDashboard economicIncomes={economicIncomes} />
          ) : (
            <IncomeTable
              economicIncomes={economicIncomes}
              modalInfo={modalInfo}
              modalForm={modalForm}
              orderBy={orderBy}
              directionOrderBy={directionOrderBy}
              filterByStatus={Boolean(filterByStatus)}
              page={page}
              size={size}
              totalRecords={totalRecords}
              handleOrderByChange={handleOrderByChange}
              getEconomicIncomeById={getEconomicIncomeById}
              showModalInfo={showModalInfo}
              closeModalInfo={closeModalInfo}
              showModalForm={showModalForm}
              handleDelete={handleDelete}
              handleRestore={handleRestore}
              changePage={changePage}
              changeSize={changeSize}
            />
          )}
        </div>
      </main>
    </>
  );
}