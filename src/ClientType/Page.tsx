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
    <>
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

          <div className="w-full mt-4">

            <div className="overflow-x-auto rounded-lg">
              {clientTypes?.length > 0 ? (
                <>
                  <table className="w-full min-w-[600px] text-center">

                    <thead className="bg-gray-100 text-gray-700">
                      <tr>
                        <th className="py-3 px-2 font-semibold">#</th>

                        <th className="py-3 px-2">
                          <button
                            className="inline-flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-200"
                            onClick={() => handleOrderByChange("name")}
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

                        {filterByStatus && (
                          <th className="py-3 px-2 font-semibold">ESTADO</th>
                        )}

                        <th className="py-3 px-2 font-semibold">ACCIONES</th>
                      </tr>
                    </thead>

                    <tbody className="text-sm">
                      {clientTypes.map((clientType, index) => (
                        <tr
                          key={clientType.idClientType}
                          className="border-b hover:bg-gray-50 transition"
                        >
                          <td className="py-3">
                            {(page - 1) * size + index + 1}
                          </td>

                          <td className="py-3">{clientType.name}</td>

                          {filterByStatus && (
                            <td className="py-3">
                              {clientType.isDeleted ? (
                                <span className="px-2 py-1 rounded bg-red-500 text-white text-xs">
                                  Inactivo
                                </span>
                              ) : (
                                <span className="px-2 py-1 rounded bg-green-500 text-white text-xs">
                                  Activo
                                </span>
                              )}
                            </td>
                          )}

                          <td className="py-3">
                            <div className="flex justify-center gap-3">

                              <button
                                onClick={() => {
                                  getClientTypeById(clientType.idClientType);
                                  showModalForm();
                                }}
                                className="p-2 bg-black rounded hover:bg-gray-800"
                                title="Editar"
                              >
                                <MdModeEdit className="text-white" />
                              </button>

                              {clientType.isDeleted ? (
                                <button
                                  onClick={() =>
                                    handleRestore(mapClientTypeToDataForm(clientType))
                                  }
                                  className="p-2 bg-black rounded hover:bg-gray-800"
                                  title="Restaurar"
                                >
                                  <MdOutlineSettingsBackupRestore className="text-white" />
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleDelete(clientType)}
                                  className="p-2 bg-black rounded hover:bg-gray-800"
                                  title="Eliminar"
                                >
                                  <MdOutlineDelete className="text-white" />
                                </button>
                              )}

                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              ) : (
                <NoData module="tipos de cliente" />
              )}
            </div>

            {clientTypes?.length > 0 && (
              <Pagination
                page={page}
                size={size}
                totalRecords={totalRecords}
                onSizeChange={changeSize}
                onPageChange={changePage}
              />
            )}

          </div>
        </div>
      </main>
    </>
  );
}

export default ClientTypeManagement;
