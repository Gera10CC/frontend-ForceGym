import { MdOutlineFileDownload } from "react-icons/md";
import Modal from "../shared/components/Modal";
import ModalFilter from "../shared/components/ModalFilter";
import SearchInput from "../shared/components/SearchInput";
import { useEconomicIncomeStore } from './Store'
import { useNavigate } from "react-router";
import { useEconomicIncome } from "./useIncome";
import Form from "./Form";
import FileTypeDecision from "../shared/components/ModalFileType";
import IncomeDashboard from './IncomeDashboard';
import { exportToPDF } from "../shared/utils/pdf";
import { exportToExcel } from "../shared/utils/excel";
import IncomeTable from './IncomeTable';
import { useEffect, useState } from "react";
import { FilterButton, FilterSelect } from "./Filter";
import { setAuthHeader, setAuthUser } from "../shared/utils/authentication";

function EconomicIncomeManagement() {
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
        closeModalFileType
    } = useEconomicIncomeStore()
    
    const { handleDelete, handleSearch, handleOrderByChange, handleRestore, pdfTableHeaders, pdfTableRows } = useEconomicIncome()
    const navigate = useNavigate()
    const [showDashboard, setShowDashboard] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const { logout } = await fetchEconomicIncomes()

            if(logout){
                setAuthHeader(null)
                setAuthUser(null)
                navigate('/login')
            }    
        }
        
        fetchData()
    }, [page, size, searchType, searchTerm, orderBy, directionOrderBy, filterByStatus, filterByAmountRangeMax, filterByAmountRangeMin, filterByMeanOfPayment, filterByDateRangeMax, filterByDateRangeMin, filterByClientType])

    return ( 
        <div className="bg-black min-h-screen">
            <header className="flex ml-12 h-20 w-0.90 items-center text-black bg-yellow justify-between px-4">
                <h1 className="text-4xl uppercase">INGRESOS</h1>
                <SearchInput searchTerm={searchTerm} handleSearch={handleSearch} changeSearchType={changeSearchType} >
                    <option className="checked:bg-yellow hover:cursor-pointer hover:bg-slate-400" value={1} defaultChecked={searchType===1}>Voucher</option>
                    <option className="checked:bg-yellow hover:cursor-pointer hover:bg-slate-400" value={2} defaultChecked={searchType===2}>Detalle</option>
                    <option className="checked:bg-yellow hover:cursor-pointer hover:bg-slate-400" value={3} defaultChecked={searchType===3}>Cliente</option>
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
                            getDataById={getEconomicIncomeById}
                            closeModal={closeModalForm}
                            Content={Form}
                        />
                        
                        {economicIncomes?.length > 0 && (
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
                                    getDataById={getEconomicIncomeById}
                                    closeModal={closeModalFileType}
                                    Content={() => 
                                        <FileTypeDecision 
                                            modulo="Ingresos económicos" 
                                            closeModal={closeModalFileType} 
                                            exportToPDF={() => exportToPDF('Ingresos', pdfTableHeaders, pdfTableRows)}
                                            exportToExcel={() => exportToExcel('Ingresos', pdfTableHeaders, pdfTableRows)}
                                        />
                                    }
                                />  
                            </div>
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
        </div>
    );
}

export default EconomicIncomeManagement;