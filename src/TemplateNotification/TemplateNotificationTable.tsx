import { MdOutlineDelete, MdModeEdit, MdOutlineSettingsBackupRestore } from "react-icons/md";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import { IoIosMore } from "react-icons/io";
import Modal from "../shared/components/Modal";
import Pagination from "../shared/components/Pagination";
import NoData from "../shared/components/NoData";
import DataInfo from "./DataInfo";
import { mapNotificationTemplateToDataForm } from "../shared/types/mapper";
import { NotificationTemplate } from "../shared/types";

interface TemplateNotificationTableProps {
  notificationTemplates: NotificationTemplate[];
  modalInfo: boolean;
  orderBy: string;
  directionOrderBy: string;
  filterByStatus: boolean;
  page: number;
  size: number;
  totalRecords: number;
  handleOrderByChange: (field: string) => void;
  getNotificationTemplateById: (id: number) => void;
  showModalInfo: () => void;
  closeModalInfo: () => void;
  showModalForm: () => void;
  handleDelete: (template: NotificationTemplate) => void;
  handleRestore: (template: any) => void;
  changePage: (page: number) => void;
  changeSize: (size: number) => void;
}

function TemplateNotificationTable({
  notificationTemplates,
  modalInfo,
  orderBy,
  directionOrderBy,
  filterByStatus,
  page,
  size,
  totalRecords,
  handleOrderByChange,
  getNotificationTemplateById,
  showModalInfo,
  closeModalInfo,
  showModalForm,
  handleDelete,
  handleRestore,
  changePage,
  changeSize,
}: TemplateNotificationTableProps) {
  return (
    <div className="w-full mt-4">

      <div className="overflow-x-auto rounded-lg">
        {notificationTemplates?.length > 0 ? (
          <>
            <table className="w-full text-center">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="py-3 px-2 font-semibold hidden lg:table-cell">#</th>

                  <th className="py-3 px-2">
                    <button
                      className="inline-flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-200"
                      onClick={() => handleOrderByChange("message")}
                    >
                      MENSAJE
                      {orderBy === "message" && directionOrderBy === "DESC" && (
                        <FaArrowUp className="text-yellow" />
                      )}
                      {orderBy === "message" && directionOrderBy === "ASC" && (
                        <FaArrowDown className="text-yellow" />
                      )}
                    </button>
                  </th>

                  <th className="py-3 px-2 hidden md:table-cell">
                    <button
                      className="inline-flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-200"
                      onClick={() => handleOrderByChange("notificationType")}
                    >
                      TIPO
                      {orderBy === "notificationType" && directionOrderBy === "DESC" && (
                        <FaArrowUp className="text-yellow" />
                      )}
                      {orderBy === "notificationType" && directionOrderBy === "ASC" && (
                        <FaArrowDown className="text-yellow" />
                      )}
                    </button>
                  </th>

                  {filterByStatus && (
                    <th className="py-3 px-2 font-semibold hidden md:table-cell">ESTADO</th>
                  )}

                  <th className="py-3 px-2 font-semibold">ACCIONES</th>
                </tr>
              </thead>

              <tbody className="text-sm">
                {notificationTemplates.map((notificationTemplate, index) => (
                  <tr
                    key={notificationTemplate.idNotificationTemplate}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="py-3 hidden lg:table-cell">
                      {(page - 1) * size + index + 1}
                    </td>

                    <td className="py-3 px-2">
                      <span className="truncate inline-block max-w-[200px] sm:max-w-[300px] lg:max-w-[400px]">
                        {notificationTemplate.message}
                      </span>
                    </td>

                    <td className="py-3 hidden md:table-cell">
                      {notificationTemplate.notificationType.name}
                    </td>

                    {filterByStatus && (
                      <td className="py-3 hidden md:table-cell">
                        {notificationTemplate.isDeleted ? (
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
                            getNotificationTemplateById(
                              notificationTemplate.idNotificationTemplate
                            );
                            showModalInfo();
                          }}
                          className="p-1.5 sm:p-2 bg-black rounded hover:bg-gray-800"
                          title="Ver detalles"
                        >
                          <IoIosMore className="text-white text-sm sm:text-base" />
                        </button>

                        <button
                          onClick={() => {
                            getNotificationTemplateById(
                              notificationTemplate.idNotificationTemplate
                            );
                            showModalForm();
                          }}
                          className="p-1.5 sm:p-2 bg-black rounded hover:bg-gray-800"
                          title="Editar"
                        >
                          <MdModeEdit className="text-white text-sm sm:text-base" />
                        </button>

                        {notificationTemplate.isDeleted ? (
                          <button
                            onClick={() =>
                              handleRestore(
                                mapNotificationTemplateToDataForm(notificationTemplate)
                              )
                            }
                            className="p-1.5 sm:p-2 bg-black rounded hover:bg-gray-800"
                            title="Restaurar"
                          >
                            <MdOutlineSettingsBackupRestore className="text-white text-sm sm:text-base" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleDelete(notificationTemplate)}
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
          <NoData module="plantillas de notificación" />
        )}
      </div>

      {notificationTemplates?.length > 0 && (
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
        getDataById={getNotificationTemplateById}
        Content={DataInfo}
      />
    </div>
  );
}

export default TemplateNotificationTable;
