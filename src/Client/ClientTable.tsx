import {
  MdModeEdit,
  MdOutlineDelete,
  MdOutlineSettingsBackupRestore,
} from "react-icons/md";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import { IoIosMore } from "react-icons/io";
import { LuPencilRuler } from "react-icons/lu";
import { Dumbbell } from "lucide-react";
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
            <table className="w-full text-center">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="py-3 px-2 font-semibold hidden lg:table-cell">#</th>

                  <th className="py-3 px-2 hidden md:table-cell">
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

                  <th className="py-3 px-2 w-1/3 max-w-[120px] sm:max-w-none">
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

                  <th className="py-3 px-2 hidden lg:table-cell">
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

                  <th className="py-3 px-2 font-semibold hidden md:table-cell">TIPO</th>

                  {filterByStatus && (
                    <th className="py-3 px-2 font-semibold hidden lg:table-cell">ESTADO</th>
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
                   <td className="py-3 hidden lg:table-cell">
                      {(page - 1) * size + index + 1}
                    </td>

                    <td className="py-3 hidden md:table-cell">
                      {client.person.identificationNumber}
                    </td>

                    <td className="py-3 max-w-[120px] sm:max-w-none truncate px-2">
                      <span className="truncate inline-block max-w-full">
                        {client.person.name} {client.person.firstLastName}{" "}
                        {client.person.secondLastName}
                      </span>
                    </td>

                    <td className="py-3 hidden lg:table-cell">
                      {formatDate(new Date(client.registrationDate))}
                    </td>

                    <td className="py-3 hidden md:table-cell">{client.clientType.name}</td>

                    {filterByStatus && (
                      <td className="py-3 hidden lg:table-cell">
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
                      <div className="flex justify-center gap-1 sm:gap-2 lg:gap-3 flex-wrap">

                        <button
                          onClick={() => {
                            getClientById(client.idClient);
                            showModalInfo();
                          }}
                          className="p-1.5 sm:p-2 bg-black rounded hover:bg-gray-800"
                          title="Ver detalles"
                        >
                          <IoIosMore className="text-white text-sm sm:text-base" />
                        </button>

                        <button
                          onClick={() => {
                            getClientById(client.idClient);
                            showModalForm();
                          }}
                          className="p-1.5 sm:p-2 bg-black rounded hover:bg-gray-800"
                          title="Editar"
                        >
                          <MdModeEdit className="text-white text-sm sm:text-base" />
                        </button>

                        <Link
                          to="/gestion/medidas"
                          state={{ idClient: client.idClient }}
                          className="p-1.5 sm:p-2 bg-black rounded hover:bg-gray-800 hidden sm:flex"
                          title="Ver medidas"
                        >
                          <LuPencilRuler className="text-white text-sm sm:text-base" />
                        </Link>

                        <Link
                          to="/gestion/rutinas-asignadas"
                          state={{ idClient: client.idClient }}
                          className="p-1.5 sm:p-2 bg-black rounded hover:bg-gray-800 hidden sm:flex"
                          title="Ver rutinas asignadas"
                        >
                          <Dumbbell className="text-white" size={16} />
                        </Link>

                        {client.isDeleted ? (
                          <button
                            onClick={() =>
                              handleRestore(mapClientToDataForm(client))
                            }
                            className="p-1.5 sm:p-2 bg-black rounded hover:bg-gray-800"
                            title="Restaurar"
                          >
                            <MdOutlineSettingsBackupRestore className="text-white text-sm sm:text-base" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleDelete(client)}
                            className="p-1.5 sm:p-2 bg-black rounded hover:bg-gray-800"
                            title="Eliminar"
                          >
                            <MdOutlineDelete className="text-white text-sm sm:text-base" />
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