import { MdModeEdit, MdOutlineDelete, MdOutlineSettingsBackupRestore } from "react-icons/md";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import { formatAmountToCRC, formatDate } from "../shared/utils/format";
import { IoIosMore } from "react-icons/io";
import { mapEconomicIncomeToDataForm } from "../shared/types/mapper";
import DataInfo from "./DataInfo";
import Modal from "../shared/components/Modal";
import { EconomicIncome } from "../shared/types";
import NoData from "../shared/components/NoData";
import Pagination from "../shared/components/Pagination";

interface IncomeTableProps {
  economicIncomes: EconomicIncome[];
  modalInfo: boolean;
  modalForm: boolean;
  orderBy: string;
  directionOrderBy: string;
  filterByStatus: boolean;
  page: number;
  size: number;
  totalRecords: number;
  handleOrderByChange: (field: string) => void;
  getEconomicIncomeById: (id: number) => void;
  showModalInfo: () => void;
  closeModalInfo: () => void;
  showModalForm: () => void;
  handleDelete: (income: EconomicIncome) => void;
  handleRestore: (income: any) => void;
  changePage: (page: number) => void;
  changeSize: (size: number) => void;
}

function IncomeTable({
  economicIncomes,
  modalInfo,
  orderBy,
  directionOrderBy,
  filterByStatus,
  page,
  size,
  totalRecords,
  handleOrderByChange,
  getEconomicIncomeById,
  showModalInfo,
  closeModalInfo,
  showModalForm,
  handleDelete,
  handleRestore,
  changePage,
  changeSize,
}: IncomeTableProps) {
  return (
    <div className="w-full mt-4">

      <div className="overflow-x-auto rounded-lg">
        {economicIncomes?.length > 0 ? (
          <>
            <table className="w-full text-center">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="py-3 px-2 font-semibold hidden lg:table-cell">#</th>

                  <th className="py-3 px-2 hidden lg:table-cell">
                    <button
                      className="inline-flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-200"
                      onClick={() => handleOrderByChange("voucherNumber")}
                    >
                      VOUCHER
                      {orderBy === "voucherNumber" && directionOrderBy === "DESC" && (
                        <FaArrowUp className="text-yellow" />
                      )}
                      {orderBy === "voucherNumber" && directionOrderBy === "ASC" && (
                        <FaArrowDown className="text-yellow" />
                      )}
                    </button>
                  </th>

                  <th className="py-3 px-2 font-semibold">CLIENTE</th>

                  <th className="py-3 px-2 hidden md:table-cell">
                    <button
                      className="inline-flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-200"
                      onClick={() => handleOrderByChange("registrationDate")}
                    >
                      FECHA
                      {orderBy === "registrationDate" && directionOrderBy === "DESC" && (
                        <FaArrowUp className="text-yellow" />
                      )}
                      {orderBy === "registrationDate" && directionOrderBy === "ASC" && (
                        <FaArrowDown className="text-yellow" />
                      )}
                    </button>
                  </th>

                  <th className="py-3 px-2">
                    <button
                      className="inline-flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-200"
                      onClick={() => handleOrderByChange("amount")}
                    >
                      MONTO
                      {orderBy === "amount" && directionOrderBy === "DESC" && (
                        <FaArrowUp className="text-yellow" />
                      )}
                      {orderBy === "amount" && directionOrderBy === "ASC" && (
                        <FaArrowDown className="text-yellow" />
                      )}
                    </button>
                  </th>

                  <th className="py-3 px-2 font-semibold hidden md:table-cell">PAGO</th>

                  <th className="py-3 px-2 font-semibold hidden lg:table-cell">CLIENTE TIPO</th>

                  {filterByStatus && <th className="py-3 px-2 font-semibold hidden lg:table-cell">ESTADO</th>}

                  <th className="py-3 px-2 font-semibold">ACCIONES</th>
                </tr>
              </thead>

              <tbody className="text-sm">
                {economicIncomes.map((income, index) => (
                  <tr
                    key={income.idEconomicIncome}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="py-3 hidden lg:table-cell">{index + 1}</td>

                    <td className="py-3 hidden lg:table-cell">
                      {income.voucherNumber !== "" ? income.voucherNumber : "No adjunto"}
                    </td>

                    <td className="py-3 truncate px-2">
                      <span className="truncate inline-block max-w-full">
                        {income.client.person.name +
                          " " +
                          income.client.person.firstLastName +
                          " " +
                          income.client.person.secondLastName}
                      </span>
                    </td>

                    <td className="py-3 hidden md:table-cell">
                      {formatDate(new Date(income.registrationDate))}
                    </td>

                    <td className="py-3">{formatAmountToCRC(income.amount)}</td>

                    <td className="py-3 hidden md:table-cell">{income.meanOfPayment.name}</td>

                    <td className="py-3 hidden lg:table-cell">{income.client.clientType.name}</td>

                    {filterByStatus && (
                      <td className="py-3 hidden lg:table-cell">
                        {income.isDeleted ? (
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
                            getEconomicIncomeById(income.idEconomicIncome);
                            showModalInfo();
                          }}
                          className="p-1.5 sm:p-2 bg-black rounded hover:bg-gray-800"
                          title="Ver detalles"
                        >
                          <IoIosMore className="text-white text-sm sm:text-base" />
                        </button>

                        <button
                          onClick={() => {
                            getEconomicIncomeById(income.idEconomicIncome);
                            showModalForm();
                          }}
                          className="p-1.5 sm:p-2 bg-black rounded hover:bg-gray-800"
                          title="Editar"
                        >
                          <MdModeEdit className="text-white text-sm sm:text-base" />
                        </button>

                        {income.isDeleted ? (
                          <button
                            onClick={() =>
                              handleRestore(mapEconomicIncomeToDataForm(income))
                            }
                            className="p-1.5 sm:p-2 bg-black rounded hover:bg-gray-800"
                            title="Restaurar"
                          >
                            <MdOutlineSettingsBackupRestore className="text-white text-sm sm:text-base" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleDelete(income)}
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
          <NoData module="ingresos económicos" />
        )}
      </div>

      {economicIncomes?.length > 0 && (
        <>
          <div className="mt-6 p-4 bg-gray-100 rounded-lg">
            <h3 className="text-lg font-bold">
              Total de Ingresos:{" "}
              {formatAmountToCRC(
                economicIncomes.reduce((total, item) => total + item.amount, 0)
              )}
            </h3>
          </div>

          <Pagination
            page={page}
            size={size}
            totalRecords={totalRecords}
            onSizeChange={changeSize}
            onPageChange={changePage}
          />
        </>
      )}

      <Modal
        Button={() => <></>}
        modal={modalInfo}
        closeModal={closeModalInfo}
        getDataById={getEconomicIncomeById}
        Content={DataInfo}
      />
    </div>
  );
}

export default IncomeTable;