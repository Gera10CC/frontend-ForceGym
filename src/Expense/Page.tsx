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

export default function EconomicExpenseManagement() {
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
    resetEditing
  } = useEconomicExpenseStore();

  const {
    handleDelete,
    handleSearch,
    handleOrderByChange,
    handleRestore,
    pdfTableHeaders,
    pdfTableRows,
    fetchEconomicExpenseByDateRange
  } = useEconomicExpense();

  const navigate = useNavigate();
  const [showDashboard, setShowDashboard] = useState(false);

  // --- Estados idénticos a INGRESOS ---
  const [dateModalOpen, setDateModalOpen] = useState(false);
  const [fileTypeModalOpen, setFileTypeModalOpen] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filteredData, setFilteredData] = useState<typeof economicExpenses>([]);

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
    filterByMeanOfPayment, filterByDateRangeMax, filterByDateRangeMin, filterByCategory
  ]);

  const handleDateSubmit = async () => {
    if (!startDate || !endDate || endDate < startDate) {
      return alert("Selecciona un rango válido de fechas");
    }

    const data = await fetchEconomicExpenseByDateRange(startDate, endDate);
    setFilteredData(data);

    setDateModalOpen(false);
    setFileTypeModalOpen(true);
  };

  return (
    <>
      <header className="
        flex flex-col md:flex-row items-center justify-between
        bg-yellow text-black px-4 py-4 rounded-md shadow-md
      ">
        <h1 className="text-3xl md:text-4xl uppercase tracking-wide">
          Gastos
        </h1>

        <SearchInput
          searchTerm={searchTerm}
          handleSearch={handleSearch}
          changeSearchType={changeSearchType}
        >
          <option value={1}>Voucher</option>
          <option value={2}>Detalle</option>
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

      {/* Modal rango de fechas */}
      <Modal
        Button={() => <div />}
        getDataById={() => {}}
        modal={dateModalOpen}
        closeModal={() => setDateModalOpen(false)}
        Content={() => (
          <div className="flex flex-col gap-4 p-4">
            <h2 className="text-xl font-bold">Seleccionar rango de fechas</h2>

            <div className="flex gap-2">
              <input
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className="border rounded px-2 py-1"
                max={endDate || undefined}
              />

              <input
                type="date"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                className="border rounded px-2 py-1"
                min={startDate || undefined}
              />
            </div>

            <button
              className="bg-yellow px-4 py-2 rounded"
              onClick={handleDateSubmit}
            >
              Continuar
            </button>
          </div>
        )}
      />

      {/* Modal selección de tipo de archivo */}
      <Modal
        Button={() => <div />}
        getDataById={() => {}}
        modal={fileTypeModalOpen}
        closeModal={() => { setFileTypeModalOpen(false); setFilteredData([]); }}
        Content={() => (
          <FileTypeDecision
            modulo="Gastos económicos"
            closeModal={() => { setFileTypeModalOpen(false); setFilteredData([]); }}

            exportToPDF={() =>
              exportToPDFGeneral(
                "Gastos",
                pdfTableHeaders,
                filteredData.length
                  ? filteredData.map((x, i) => [
                      i + 1,
                      x.voucherNumber || "No adjunto",
                      x.registrationDate,
                      x.amount,
                      x.meanOfPayment.name,
                      x.category.name,
                      x.detail || "Sin detalle"
                    ])
                  : pdfTableRows
              )
            }

            exportToExcel={() =>
              exportToExcel(
                "Gastos",
                pdfTableHeaders,
                filteredData.length
                  ? filteredData.map((x, i) => [
                      i + 1,
                      x.voucherNumber || "No adjunto",
                      x.registrationDate,
                      x.amount,
                      x.meanOfPayment.name,
                      x.category.name,
                      x.detail || "Sin detalle"
                    ])
                  : pdfTableRows
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
                  onClick={() => { resetEditing(); showModalForm(); }}
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
                onClick={() => setDateModalOpen(true)}
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
