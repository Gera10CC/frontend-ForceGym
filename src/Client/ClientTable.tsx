import {
  MdModeEdit,
  MdOutlineDelete,
  MdOutlineSettingsBackupRestore,
} from "react-icons/md";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import { IoIosMore } from "react-icons/io";
import { LuPencilRuler } from "react-icons/lu";
import { Link } from "react-router";

import Modal from "../shared/components/Modal";
import DataInfo from "./DataInfo";
import NoData from "../shared/components/NoData";
import Pagination from "../shared/components/Pagination";

import { mapClientToDataForm } from "../shared/types/mapper";
import { formatDate } from "../shared/utils/format";

interface ClientTableProps {
  clients: any[];
  modalInfo: boolean;
  modalForm: boolean;
  orderBy: string;
  directionOrderBy: string;
  filterByStatus: boolean;
  page: number;
  size: number;
  totalRecords: number;
  handleOrderByChange: (field: string) => void;
  getClientById: (id: number) => void;
  showModalInfo: () => void;
  closeModalInfo: () => void;
  showModalForm: () => void;
  handleDelete: (client: any) => void;
  handleRestore: (client: any) => void;
  changePage: (page: number) => void;
  changeSize: (size: number) => void;
}

function ClientTable({
  clients,
  modalInfo,
  orderBy,
  directionOrderBy,
  filterByStatus,
  page,
  size,
  totalRecords,
  handleOrderByChange,
  getClientById,
  showModalInfo,
  closeModalInfo,
  showModalForm,
  handleDelete,
  handleRestore,
  changePage,
  changeSize,
}: ClientTableProps) {
  return (
    <div className="w-full mt-4">
      <div className="overflow-x-auto rounded-lg">
        {clients?.length > 0 ? (
          <>
            <table className="w-full min-w-[900px] text-center">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="py-3 px-2 font-semibold">#</th>

                  <th className="py-3 px-2">
                    <button
                      className="inline-flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-200"
                      onClick={() =>
                        handleOrderByChange("identificationNumber")
                      }
                    >
                      CÉDULA
                      {orderBy === "identificationNumber" &&
                        directionOrderBy === "DESC" && (
                          <FaArrowUp className="text-yellow" />
                        )}
                      {orderBy === "identificationNumber" &&
                        directionOrderBy === "ASC" && (
                          <FaArrowDown className="text-yellow" />
                        )}
                    </button>
                  </th>

                  <th className="py-3 px-2">
                    <button
                      className="inline-flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-200"
                      onClick={() => handleOrderByChange("name")}
                    >
                      NOMBRE
                      {orderBy === "name" &&
                        directionOrderBy === "DESC" && (
                          <FaArrowUp className="text-yellow" />
                        )}
                      {orderBy === "name" &&
                        directionOrderBy === "ASC" && (
                          <FaArrowDown className="text-yellow" />
                        )}
                    </button>
                  </th>

                  <th className="py-3 px-2">
                    <button
                      className="inline-flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-200"
                      onClick={() => handleOrderByChange("registrationDate")}
                    >
                      REGISTRO
                      {orderBy === "registrationDate" &&
                        directionOrderBy === "DESC" && (
                          <FaArrowUp className="text-yellow" />
                        )}
                      {orderBy === "registrationDate" &&
                        directionOrderBy === "ASC" && (
                          <FaArrowDown className="text-yellow" />
                        )}
                    </button>
                  </th>

                  <th className="py-3 px-2 font-semibold">TIPO</th>

                  {filterByStatus && (
                    <th className="py-3 px-2 font-semibold">ESTADO</th>
                  )}

                  <th className="py-3 px-2 font-semibold">ACCIONES</th>
                </tr>
              </thead>

              <tbody className="text-sm">
                {clients.map((client, index) => (
                  <tr
                    key={client.idClient}
                    className="border-b hover:bg-gray-50 transition"
                  >
                   <td className="py-3">
                      {(page - 1) * size + index + 1}
                    </td>

                    <td className="py-3">
                      {client.person.identificationNumber}
                    </td>

                    <td className="py-3">
                      {client.person.name} {client.person.firstLastName}{" "}
                      {client.person.secondLastName}
                    </td>

                    <td className="py-3">
                      {formatDate(new Date(client.registrationDate))}
                    </td>

                    <td className="py-3">{client.clientType.name}</td>

                    {filterByStatus && (
                      <td className="py-3">
                        {client.isDeleted ? (
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
                            getClientById(client.idClient);
                            showModalInfo();
                          }}
                          className="p-2 bg-black rounded hover:bg-gray-800"
                        >
                          <IoIosMore className="text-white" />
                        </button>

                        <button
                          onClick={() => {
                            getClientById(client.idClient);
                            showModalForm();
                          }}
                          className="p-2 bg-black rounded hover:bg-gray-800"
                        >
                          <MdModeEdit className="text-white" />
                        </button>

                        <Link
                          to="/gestion/medidas"
                          state={{ idClient: client.idClient }}
                          className="p-2 bg-black rounded hover:bg-gray-800"
                        >
                          <LuPencilRuler className="text-white" />
                        </Link>

                        {client.isDeleted ? (
                          <button
                            onClick={() =>
                              handleRestore(mapClientToDataForm(client))
                            }
                            className="p-2 bg-black rounded hover:bg-gray-800"
                          >
                            <MdOutlineSettingsBackupRestore className="text-white" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleDelete(client)}
                            className="p-2 bg-black rounded hover:bg-gray-800"
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
          <NoData module="clientes" />
        )}
      </div>

      {/* PAGINACIÓN */}
      {clients?.length > 0 && (
        <Pagination
          page={page}
          size={size}
          totalRecords={totalRecords}
          onSizeChange={changeSize}
          onPageChange={changePage}
        />
      )}

      {/* MODAL INFO */}
      <Modal
        Button={() => <></>}
        modal={modalInfo}
        closeModal={closeModalInfo}
        getDataById={getClientById}
        Content={DataInfo}
      />
    </div>
  );
}

export default ClientTable;