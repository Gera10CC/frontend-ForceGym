import { useEffect } from "react";
import useClientTypeStore from "./Store";
import {
  MdOutlineDelete,
  MdModeEdit,
  MdOutlineSettingsBackupRestore,
} from "react-icons/md";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import Pagination from "../shared/components/Pagination";
import { useClientType } from "./useClientType";
import SearchInput from "../shared/components/SearchInput";
import ModalFilter from "../shared/components/ModalFilter";
import { FilterButton, FilterSelect } from "./Filter";
import Modal from "../shared/components/Modal";
import Form from "./Form";
import { mapClientTypeToDataForm } from "../shared/types/mapper";
import { useNavigate } from "react-router";
import NoData from "../shared/components/NoData";
import Layout from "../shared/components/Layout";
import { setAuthHeader, setAuthUser } from "../shared/utils/authentication";

function ClientTypeManagement() {
  const {
    clientTypes,
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
    fetchClientTypes,
    getClientTypeById,
    changePage,
    changeSize,
    changeSearchType,
    showModalForm,
    showModalInfo,
    closeModalForm,
    closeModalFilter,
    closeModalInfo,
  } = useClientTypeStore();

  const { handleDelete, handleSearch, handleOrderByChange, handleRestore } =
    useClientType();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const { logout } = await fetchClientTypes();
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
  ]);

  return (
    <Layout>
      {/* HEADER */}
      <header
        className="
          flex flex-col md:flex-row items-center justify-between gap-4
          bg-yellow text-black px-4 py-4 rounded-md shadow-md
        "
      >
        <h1 className="text-3xl md:text-4xl uppercase tracking-wide">
          Tipos de Cliente
        </h1>

        <SearchInput
          searchTerm={searchTerm}
          handleSearch={handleSearch}
          changeSearchType={changeSearchType}
        >
          <option value={2}>Nombre</option>
        </SearchInput>

        <ModalFilter
          modalFilter={modalFilter}
          closeModalFilter={closeModalFilter}
          FilterButton={FilterButton}
          FilterSelect={FilterSelect}
        />
      </header>

      {/* MAIN */}
      <main className="mt-6">
        <div
          className="
            bg-white rounded-lg shadow-md p-4 sm:p-6
            overflow-hidden
          "
        >
          {/* TOP ACTIONS */}
          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
            <Modal
              Button={() => (
                <button
                  type="button"
                  onClick={showModalForm}
                  className="
                    w-full sm:w-auto
                    px-4 py-2 bg-gray-100 hover:bg-gray-300
                    rounded-full transition flex items-center gap-2
                    justify-center
                  "
                >
                  + Añadir
                </button>
              )}
              modal={modalForm}
              closeModal={closeModalForm}
              getDataById={getClientTypeById}
              Content={Form}
            />
          </div>

          {/* TABLE */}
          {clientTypes?.length > 0 ? (
            <div className="overflow-x-auto w-full">
              <table className="w-full border-t-2 border-slate-200 min-w-[600px]">
                <thead>
                  <tr className="text-center">
                    <th className="px-2 py-2">#</th>

                    <th className="px-2">
                      <button
                        className="inline-flex items-center gap-2 py-0.5 px-2 rounded-full hover:bg-slate-300"
                        onClick={() => {
                          handleOrderByChange("name");
                        }}
                      >
                        NOMBRE
                        {orderBy === "name" && directionOrderBy === "DESC" && (
                          <FaArrowUp className="text-yellow" />
                        )}
                        {orderBy === "name" && directionOrderBy === "ASC" && (
                          <FaArrowDown className="text-yellow" />
                        )}
                      </button>
                    </th>

                    {filterByStatus && <th className="px-2">ESTADO</th>}

                    <th className="px-2">ACCIONES</th>
                  </tr>
                </thead>

                <tbody>
                  {clientTypes?.map((clientType, index) => (
                    <tr key={clientType.idClientType} className="text-center">
                      <td className="py-2">
                        {(page - 1) * size + index + 1}
                      </td>

                      <td className="py-2">{clientType.name}</td>

                      {filterByStatus && (
                        <td className="py-2">
                          {clientType.isDeleted ? (
                            <button className="py-0.5 px-2 rounded-lg bg-red-500 text-white">
                              Inactivo
                            </button>
                          ) : (
                            <button className="py-0.5 px-2 rounded-lg bg-green-500 text-white">
                              Activo
                            </button>
                          )}
                        </td>
                      )}

                      <td className="flex gap-3 justify-center py-3">
                        <button
                          onClick={() => {
                            getClientTypeById(clientType.idClientType);
                            showModalForm();
                          }}
                          className="p-2 bg-black rounded-sm hover:bg-gray-700"
                        >
                          <MdModeEdit className="text-white" />
                        </button>

                        {clientType.isDeleted ? (
                          <button
                            onClick={() =>
                              handleRestore(
                                mapClientTypeToDataForm(clientType)
                              )
                            }
                            className="p-2 bg-black rounded-sm hover:bg-gray-700"
                          >
                            <MdOutlineSettingsBackupRestore className="text-white" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleDelete(clientType)}
                            className="p-2 bg-black rounded-sm hover:bg-gray-700"
                          >
                            <MdOutlineDelete className="text-white" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <NoData module="tipos de cliente" />
          )}

          {/* PAGINATION */}
          {clientTypes?.length > 0 && (
            <div className="mt-6">
              <Pagination
                page={page}
                size={size}
                totalRecords={totalRecords}
                onSizeChange={changeSize}
                onPageChange={changePage}
              />
            </div>
          )}
        </div>
      </main>
    </Layout>
  );
}

export default ClientTypeManagement;
