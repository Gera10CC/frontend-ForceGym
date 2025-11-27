import { Plus, Download } from "lucide-react";
import Modal from "../shared/components/Modal";
import ModalFilter from "../shared/components/ModalFilter";
import SearchInput from "../shared/components/SearchInput";
import { useEffect } from "react";
import { setAuthHeader, setAuthUser } from "../shared/utils/authentication";
import { useNavigate } from "react-router";
import useAssetStore from "./Store";
import Form from "./Form";
import { useAsset } from "./useAsset";
import { FilterButton, FilterSelect } from "./Filter";
import FileTypeDecision from "../shared/components/ModalFileType";
import { exportToPDF } from "../shared/utils/pdf";
import { exportToExcel } from "../shared/utils/excel";
import Layout from "../shared/components/Layout";
import AssetTable from "./AssetTable";
import NoData from "../shared/components/NoData";

export default function AssetManagement() {

  const {
    assets,
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
    filterByCostRangeMin,
    filterByCostRangeMax,
    filterByQuantityRangeMin,
    filterByQuantityRangeMax,
    fetchAssets,
    getAssetById,
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
  } = useAssetStore();

  const {
    handleDelete,
    handleSearch,
    handleOrderByChange,
    handleRestore,
    pdfTableHeaders,
    pdfTableRows
  } = useAsset();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const { logout } = await fetchAssets();
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
    filterByCostRangeMin,
    filterByCostRangeMax,
    filterByQuantityRangeMin,
    filterByQuantityRangeMax
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
          Activos
        </h1>

        <SearchInput
          searchTerm={searchTerm}
          handleSearch={handleSearch}
          changeSearchType={changeSearchType}
        >
          <option value={1}>Código</option>
          <option value={2}>Nombre</option>
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
              getDataById={getAssetById}
              Content={Form}
            />

            {assets?.length > 0 && (
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
                getDataById={getAssetById}
                Content={() => (
                  <FileTypeDecision
                    modulo="Activos"
                    closeModal={closeModalFileType}
                    exportToPDF={() =>
                      exportToPDF("Activos", pdfTableHeaders, pdfTableRows)
                    }
                    exportToExcel={() =>
                      exportToExcel("Activos", pdfTableHeaders, pdfTableRows)
                    }
                  />
                )}
              />
            )}
          </div>

          {assets?.length > 0 ? (
            <AssetTable
              assets={assets}
              modalInfo={modalInfo}
              orderBy={orderBy}
              directionOrderBy={directionOrderBy}
              filterByStatus={Boolean(filterByStatus)}
              page={page}
              size={size}
              totalRecords={totalRecords}
              handleOrderByChange={handleOrderByChange}
              getAssetById={getAssetById}
              showModalInfo={showModalInfo}
              closeModalInfo={closeModalInfo}
              showModalForm={showModalForm}
              handleDelete={handleDelete}
              handleRestore={handleRestore}
              changePage={changePage}
              changeSize={changeSize}
            />
          ) : (
            <NoData module="activos" />
          )}

        </div>
      </main>
    </>
  );
}