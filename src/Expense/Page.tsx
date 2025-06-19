import { MdOutlineFileDownload } from "react-icons/md";
import Modal from "../shared/components/Modal";
import ModalFilter from "../shared/components/ModalFilter";
import SearchInput from "../shared/components/SearchInput";
import NoData from "../shared/components/NoData";
import { useEconomicExpenseStore } from './Store'
import { useNavigate } from "react-router";
import { useEconomicExpense } from "./useExpense";
import Form from "./Form";
import FileTypeDecision from "../shared/components/ModalFileType";
import ExpenseDashboard from './ExpenseDashboard';
import { exportToPDF } from "../shared/utils/pdf";
import { exportToExcel } from "../shared/utils/excel";
import ExpenseTable from './ExpenseTable';
import { useEffect, useState } from "react";
import { FilterButton, FilterSelect } from "./Filter";
import { setAuthHeader, setAuthUser } from "../shared/utils/authentication";

function EconomicExpenseManagement() {
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
        closeModalFileType
    } = useEconomicExpenseStore()

    const { handleDelete, handleSearch, handleOrderByChange, handleRestore, pdfTableHeaders, pdfTableRows } = useEconomicExpense()
    const navigate = useNavigate()
    const [showDashboard, setShowDashboard] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const { logout } = await fetchEconomicExpenses()

            if(logout){
                setAuthHeader(null)
                setAuthUser(null)
                navigate('/login', {replace: true})
            }    
        }
        
        fetchData()
    }, [page, size, searchType, searchTerm, orderBy, directionOrderBy, filterByStatus, filterByAmountRangeMax, filterByAmountRangeMin, filterByMeanOfPayment, filterByDateRangeMax, filterByDateRangeMin, filterByCategory])

    return ( 
        <div className="bg-black min-h-screen">
            <header className="flex ml-12 h-20 w-0.90 items-center text-black bg-yellow justify-between px-4">
                <h1 className="text-4xl uppercase">GASTOS</h1>
                <SearchInput searchTerm={searchTerm} handleSearch={handleSearch} changeSearchType={changeSearchType} >
                    <option className="checked:bg-yellow hover:cursor-pointer hover:bg-slate-400" value={1} defaultChecked={searchType===1}>Voucher</option>
                    <option className="checked:bg-yellow hover:cursor-pointer hover:bg-slate-400" value={2} defaultChecked={searchType===2}>Detalle</option>
                </SearchInput>
                <div className="flex gap-4">
                    <button 
                        onClick={() => setShowDashboard(!showDashboard)}
                        className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 hover:cursor-pointer"
                    >
                        {showDashboard ? 'Ver Tabla' : 'Ver Dashboard'}
                    </button>
                    <ModalFilter modalFilter={modalFilter} closeModalFilter={closeModalFilter} FilterButton={FilterButton} FilterSelect={FilterSelect} />
                </div>
            </header>

            <main className="justify-items-center ml-12 p-4">
                <div className="flex flex-col mx-12 mt-4 bg-white text-lg w-full max-h-full overflow-scroll">
                    <div className="flex justify-between">
                        <Modal
                            Button={() => (
                                <button
                                    className="mt-4 ml-2 px-2 py-1 hover:bg-gray-300 hover:rounded-full hover:cursor-pointer"
                                    type="button"
                                    onClick={showModalForm}
                                >
                                    + Añadir
                                </button>
                            )}
                            modal={modalForm}
                            getDataById={getEconomicExpenseById}
                            closeModal={closeModalForm}
                            Content={Form}
                        />
                        
                        {economicExpenses?.length > 0 && (
                            <div className="flex gap-2">
                                <Modal
                                    Button={() => (
                                        <button 
                                            onClick={showModalFileType}
                                            className="flex gap-2 items-center text-end mt-4 mr-2 px-2 py-1 hover:bg-gray-300 hover:rounded-full hover:cursor-pointer">
                                            <MdOutlineFileDownload /> Descargar
                                        </button>
                                    )}
                                    modal={modalFileTypeDecision}
                                    getDataById={getEconomicExpenseById}
                                    closeModal={closeModalFileType}
                                    Content={() => 
                                        <FileTypeDecision 
                                            modulo="Gastos económicos" 
                                            closeModal={closeModalFileType} 
                                            exportToPDF={() => exportToPDF('Gastos', pdfTableHeaders, pdfTableRows)}
                                            exportToExcel={() => exportToExcel('Gastos', pdfTableHeaders, pdfTableRows)}
                                        />
                                    }
                                />  
                            </div>
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
        </div>
    );
}

export default EconomicExpenseManagement;