import { MdOutlineFileDownload } from "react-icons/md";
import Modal from "../shared/components/Modal";
import ModalFilter from "../shared/components/ModalFilter";
import SearchInput from "../shared/components/SearchInput";
import { useEconomicExpenseStore } from "./Store";
import { useNavigate } from "react-router";
import { useEconomicExpense } from "./useExpense";
import Form from "./Form";
import FileTypeDecision from "../shared/components/ModalFileType";
import ExpenseDashboard from "./ExpenseDashboard";
import { exportToPDF } from "../shared/utils/pdf";
import { exportToExcel } from "../shared/utils/excel";
import ExpenseTable from "./ExpenseTable";
import { useEffect, useState } from "react";
import { FilterButton, FilterSelect } from "./Filter";
import { setAuthHeader, setAuthUser } from "../shared/utils/authentication";
import Layout from "../shared/components/Layout";
import { Plus, Download } from "lucide-react";

export function EconomicExpenseManagement() {
  const {
    economicExpenses,
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
    filterByCategory,
    fetchEconomicExpenses,
    getEconomicExpenseById,
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
    resetEditing, 
  } = useEconomicExpenseStore();

  const {
    handleDelete,
    handleSearch,
    handleOrderByChange,
    handleRestore,
    pdfTableHeaders,
    pdfTableRows,
  } = useEconomicExpense();

  const navigate = useNavigate();
  const [showDashboard, setShowDashboard] = useState(false);

  // Fetch data when filters or pagination change
  useEffect(() => {
    const fetchData = async () => {
      const { logout } = await fetchEconomicExpenses();
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
    filterByAmountRangeMax, 
    filterByAmountRangeMin, 
    filterByMeanOfPayment, 
    filterByDateRangeMax, 
    filterByDateRangeMin, 
    filterByCategory
  ]);

  return (
    <Layout>
      {/* HEADER */}
      <header
        className="
          flex flex-col md:flex-row items-center justify-between
          bg-yellow text-black px-4 py-4 rounded-md shadow-md
        "
      >
        <h1 className="text-3xl md:text-4xl  uppercase tracking-wide">
          Gastos
        </h1>

        {/* BUSCADOR */}
        <SearchInput
          searchTerm={searchTerm}
          handleSearch={handleSearch}
          changeSearchType={changeSearchType}
        >
          <option value={1}>Voucher</option>
          <option value={2}>Detalle</option>
        </SearchInput>

        {/* BOTONES */}
        <div className="flex gap-3 mt-4 md:mt-0">
          {/* DASHBOARD / TABLE TOGGLE */}
          <button
            onClick={() => setShowDashboard(!showDashboard)}
            className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition"
          >
            {showDashboard ? "Ver Tabla" : "Ver Dashboard"}
          </button>

          {/* FILTRO */}
          <ModalFilter
            modalFilter={modalFilter}
            closeModalFilter={closeModalFilter}
            FilterButton={FilterButton}
            FilterSelect={FilterSelect}
          />
        </div>
      </header>

      {/* CONTENIDO */}
      <main className="mt-6">
        <div
          className="
            bg-white rounded-lg shadow-md p-4 sm:p-6
            overflow-hidden
          "
        >
          {/* TOP BUTTONS */}
          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">

            {/* AÑADIR */}
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
              getDataById={getEconomicExpenseById}
              Content={Form}
            />

            {/* DESCARGAR */}
            {economicExpenses?.length > 0 && (
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
                getDataById={getEconomicExpenseById}
                Content={() => (
                  <FileTypeDecision
                    modulo="Gastos económicos"
                    closeModal={closeModalFileType}
                    exportToPDF={() =>
                      exportToPDF("Gastos", pdfTableHeaders, pdfTableRows)
                    }
                    exportToExcel={() =>
                      exportToExcel("Gastos", pdfTableHeaders, pdfTableRows)
                    }
                  />
                )}
              />
            )}
          </div>

          {/* TABLA O DASHBOARD */}
          {showDashboard ? (
            <ExpenseDashboard economicExpenses={economicExpenses} />
          ) : (
            <ExpenseTable
              economicExpenses={economicExpenses}
              modalInfo={modalInfo}
              modalForm={modalForm}
              orderBy={orderBy}
              directionOrderBy={directionOrderBy}
              filterByStatus={Boolean(filterByStatus)}
              page={page}
              size={size}
              totalRecords={totalRecords}
              handleOrderByChange={handleOrderByChange}
              getEconomicExpenseById={getEconomicExpenseById}
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
    </Layout>
  );
}