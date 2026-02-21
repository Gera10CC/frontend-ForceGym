import {
  MdModeEdit,
  MdOutlineDelete,
  MdOutlineSettingsBackupRestore,
} from "react-icons/md";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import { IoIosMore } from "react-icons/io";

import Modal from "../shared/components/Modal";
import DataInfo from "./DataInfo";
import NoData from "../shared/components/NoData";
import Pagination from "../shared/components/Pagination";

import { mapUserToDataForm } from "../shared/types/mapper";
import { User } from "../shared/types";

interface UserTableProps {
  users: User[];
  modalInfo: boolean;
  modalForm: boolean; 
  orderBy: string;
  directionOrderBy: string;
  filterByStatus: boolean;
  page: number;
  size: number;
  totalRecords: number;
  handleOrderByChange: (field: string) => void;
  getUserById: (id: number) => void;
  showModalInfo: () => void;
  closeModalInfo: () => void;
  showModalForm: () => void;
  handleDelete: (user: User) => void;
  handleRestore: (user: any) => void;
  changePage: (page: number) => void;
  changeSize: (size: number) => void;
  authUser: User | null; // para deshabilitar eliminarse a sí mismo
}

function UserTable({
  users,
  modalInfo,
  orderBy,
  directionOrderBy,
  filterByStatus,
  page,
  size,
  totalRecords,
  handleOrderByChange,
  getUserById,
  showModalInfo,
  closeModalInfo,
  showModalForm,
  handleDelete,
  handleRestore,
  changePage,
  changeSize,
  authUser,
}: UserTableProps) {
  return (
    <div className="w-full mt-4">
      <div className="overflow-x-auto rounded-lg">
        {users?.length > 0 ? (
          <>
            <table className="w-full text-center">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="py-3 px-2 font-semibold hidden lg:table-cell">#</th>

                  <th className="py-3 px-2 hidden md:table-cell">
                    <button
                      className="inline-flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-200"
                      onClick={() => handleOrderByChange("identificationNumber")}
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
                      {orderBy === "name" && directionOrderBy === "DESC" && (
                        <FaArrowUp className="text-yellow" />
                      )}
                      {orderBy === "name" && directionOrderBy === "ASC" && (
                        <FaArrowDown className="text-yellow" />
                      )}
                    </button>
                  </th>

                  <th className="py-3 px-2 hidden md:table-cell">
                    <button
                      className="inline-flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-200"
                      onClick={() => handleOrderByChange("username")}
                    >
                      USUARIO
                      {orderBy === "username" &&
                        directionOrderBy === "DESC" && (
                          <FaArrowUp className="text-yellow" />
                        )}
                      {orderBy === "username" &&
                        directionOrderBy === "ASC" && (
                          <FaArrowDown className="text-yellow" />
                        )}
                    </button>
                  </th>

                  <th className="py-3 px-2 font-semibold hidden lg:table-cell">ROL</th>

                  {filterByStatus && (
                    <th className="py-3 px-2 font-semibold hidden lg:table-cell">ESTADO</th>
                  )}

                  <th className="py-3 px-2 font-semibold">ACCIONES</th>
                </tr>
              </thead>

              <tbody className="text-sm">
  {users
    ?.filter((user) => user && user.person) // ✅ BLINDAJE TOTAL
    .map((user, index) => (
      <tr
        key={user.idUser}
        className="border-b hover:bg-gray-50 transition"
      >
        <td className="py-3 hidden lg:table-cell">{index + 1}</td>

        <td className="py-3 hidden md:table-cell">
          {user.person?.identificationNumber ?? "—"}
        </td>

        <td className="py-3 max-w-[120px] sm:max-w-none truncate px-2">
          <span className="truncate inline-block max-w-full">
            {`${user.person?.name ?? ""} ${user.person?.firstLastName ?? ""} ${user.person?.secondLastName ?? ""}`}
          </span>
        </td>

        <td className="py-3 hidden md:table-cell">
          {user.username ?? "—"}
        </td>

        <td className="py-3 hidden lg:table-cell">
          {user.role?.name ?? "—"}
        </td>

        {filterByStatus && (
          <td className="py-3 hidden lg:table-cell">
            {user.isDeleted ? (
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
                getUserById(user.idUser);
                showModalInfo();
              }}
              className="p-1.5 sm:p-2 bg-black rounded hover:bg-gray-800"
              title="Ver detalles"
            >
              <IoIosMore className="text-white text-sm sm:text-base" />
            </button>

            <button
              onClick={() => {
                getUserById(user.idUser);
                showModalForm();
              }}
              className="p-1.5 sm:p-2 bg-black rounded hover:bg-gray-800"
              title="Editar"
            >
              <MdModeEdit className="text-white text-sm sm:text-base" />
            </button>

            {user.isDeleted ? (
              <button
                onClick={() => handleRestore(mapUserToDataForm(user))}
                className="p-1.5 sm:p-2 bg-black rounded hover:bg-gray-800"
                title="Restaurar"
              >
                <MdOutlineSettingsBackupRestore className="text-white text-sm sm:text-base" />
              </button>
            ) : (
              <button
                onClick={() => handleDelete(user)}
                disabled={user.idUser === authUser?.idUser}
                className={`p-1.5 sm:p-2 bg-black rounded ${
                  user.idUser === authUser?.idUser
                    ? "opacity-40 cursor-not-allowed"
                    : "hover:bg-gray-800"
                }`}
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
          <NoData module="usuarios" />
        )}
      </div>

      {users?.length > 0 && (
        <Pagination
          page={page}
          size={size}
          totalRecords={totalRecords}
          onSizeChange={changeSize}
          onPageChange={changePage}
        />
      )}

      <Modal
        Button={() => <></>}
        modal={modalInfo}
        closeModal={closeModalInfo}
        getDataById={getUserById}
        Content={DataInfo}
      />
    </div>
  );
}

export default UserTable;