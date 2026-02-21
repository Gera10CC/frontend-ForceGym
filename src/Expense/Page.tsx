import { Plus, Download } from "lucide-react";
import Modal from "../shared/components/Modal";
import ModalFilter from "../shared/components/ModalFilter";
import SearchInput from "../shared/components/SearchInput";

import { useEconomicExpenseStore } from "./Store";
import { useNavigate } from "react-router";
import { useEconomicExpense } from "./useExpense";

import Form from "./Form";
import FileTypeDecision from "../shared/components/ModalFileType";
import ExpenseDashboard from "./ExpenseDashboard";
import ExpenseTable from "./ExpenseTable";

import { exportToPDFGeneral } from "../shared/utils/pdfGeneral";
import { exportToExcel } from "../shared/utils/excelGeneral";

import { useEffect, useState } from "react";
import { FilterButton, FilterSelect } from "./Filter";
import { setAuthHeader, setAuthUser } from "../shared/utils/authentication";
import { EconomicExpense } from "../shared/types";

export default function EconomicExpenseManagement() {
  const {
    economicExpenses,
    modalForm,
    modalFilter,
    modalInfo,

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
    resetEditing
  } = useEconomicExpenseStore();

  const {
    handleDelete,
    handleSearch,
    handleOrderByChange,
    handleRestore,
    pdfTableHeaders,
    pdfTableRows,
    mapExpenseToRow,
    fetchEconomicExpenseByActiveFilters
  } = useEconomicExpense();

  const navigate = useNavigate();
  const [showDashboard, setShowDashboard] = useState(false);

  // Estados de exportación
  const [fileTypeModalOpen, setFileTypeModalOpen] = useState(false);
  const [filteredData, setFilteredData] = useState<EconomicExpense[]>([]);
  const [filteredRows, setFilteredRows] = useState<(string | number)[][]>([]);

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
    page, size, searchType, searchTerm,
    orderBy, directionOrderBy,
    filterByStatus, filterByAmountRangeMax, filterByAmountRangeMin,
    filterByMeanOfPayment, filterByDateRangeMax, filterByDateRangeMin,
    filterByCategory
  ]);

  // Export using active filters
  const handleExport = async () => {
    const data = await fetchEconomicExpenseByActiveFilters();

    // Datos crudos
    setFilteredData(data);

    // Filas exportables
    setFilteredRows(
      data.length ? data.map(mapExpenseToRow) : pdfTableRows
    );

    setFileTypeModalOpen(true);
  };

  return (
    <>
      <header className="bg-yellow text-black px-4 py-4 rounded-md shadow-md">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Título */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl uppercase tracking-wide text-center lg:text-left">
            Gastos
          </h1>

          {/* SearchInput */}
          <div className="w-full lg:w-auto lg:flex-1 lg:max-w-md">
            <SearchInput
              searchTerm={searchTerm}
              handleSearch={handleSearch}
              changeSearchType={changeSearchType}
            >
              <option value={1}>Voucher</option>
              <option value={2}>Detalle</option>
            </SearchInput>
          </div>

          {/* Botones */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto sm:justify-center lg:justify-end">
            <button
              onClick={() => setShowDashboard(!showDashboard)}
              className="w-full sm:w-auto px-3 sm:px-4 py-2 bg-black text-white text-sm rounded hover:bg-gray-800 transition whitespace-nowrap"
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
        </div>
      </header>

      {/* Export Modal */}
      <Modal
        Button={() => <div />}
        getDataById={() => {}}
        modal={fileTypeModalOpen}
        closeModal={() => {
          setFileTypeModalOpen(false);
          setFilteredData([]);
          setFilteredRows([]);
        }}
        Content={() => (
          <FileTypeDecision
            modulo="Gastos económicos"
            closeModal={() => {
              setFileTypeModalOpen(false);
              setFilteredData([]);
              setFilteredRows([]);
            }}
            exportToPDF={() =>
              exportToPDFGeneral(
                "Gastos",
                pdfTableHeaders,
                filteredRows
              )
            }
            exportToExcel={() =>
              exportToExcel(
                "Gastos",
                pdfTableHeaders,
                filteredRows
              )
            }
          />
        )}
      />

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
                  className="w-full sm:w-auto px-4 py-2 bg-gray-100 hover:bg-gray-300 rounded-full transition flex items-center gap-2 justify-center sm:justify-start"
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

            {economicExpenses.length > 0 && (
              <button
                onClick={handleExport}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-300 rounded-full transition flex items-center gap-2"
              >
                <Download size={18} />
                Descargar
              </button>
            )}
          </div>

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
    </>
  );
}
