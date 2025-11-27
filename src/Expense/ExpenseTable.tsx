import { MdModeEdit, MdOutlineDelete, MdOutlineSettingsBackupRestore } from "react-icons/md";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import { formatAmountToCRC, formatDate } from "../shared/utils/format";
import { IoIosMore } from "react-icons/io";
import { mapEconomicExpenseToDataForm } from "../shared/types/mapper";
import DataInfo from "./DataInfo";
import Modal from "../shared/components/Modal";
import { EconomicExpense } from "../shared/types";
import NoData from "../shared/components/NoData";
import Pagination from "../shared/components/Pagination";

interface ExpenseTableProps {
  economicExpenses: EconomicExpense[];
  modalInfo: boolean;
  modalForm: boolean;
  orderBy: string;
  directionOrderBy: string;
  filterByStatus: boolean;
  page: number;
  size: number;
  totalRecords: number;
  handleOrderByChange: (field: string) => void;
  getEconomicExpenseById: (id: number) => void;
  showModalInfo: () => void;
  closeModalInfo: () => void;
  showModalForm: () => void;
  handleDelete: (expense: EconomicExpense) => void;
  handleRestore: (expense: any) => void;
  changePage: (page: number) => void;
  changeSize: (size: number) => void;
}

function ExpenseTable({
  economicExpenses,
  modalInfo,
  orderBy,
  directionOrderBy,
  filterByStatus,
  page,
  size,
  totalRecords,
  handleOrderByChange,
  getEconomicExpenseById,
  showModalInfo,
  closeModalInfo,
  showModalForm,
  handleDelete,
  handleRestore,
  changePage,
  changeSize
}: ExpenseTableProps) {
  return (
    <div className="w-full mt-4">

      <div className="overflow-x-auto rounded-lg">
        {economicExpenses?.length > 0 ? (
          <>
            <table className="w-full min-w-[900px] text-center">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="py-3 px-2 font-semibold">#</th>

                  <th className="py-3 px-2">
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

                  <th className="py-3 px-2">
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

                  <th className="py-3 px-2 font-semibold">PAGO</th>
                  <th className="py-3 px-2 font-semibold">CATEGORÍA</th>

                  {filterByStatus && <th className="py-3 px-2 font-semibold">ESTADO</th>}

                  <th className="py-3 px-2 font-semibold">ACCIONES</th>
                </tr>
              </thead>

              <tbody className="text-sm">
                {economicExpenses.map((economicExpense, index) => (
                  <tr
                    key={economicExpense.idEconomicExpense}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="py-3">{index + 1}</td>

                    <td className="py-3">
                      {economicExpense.voucherNumber !== ""
                        ? economicExpense.voucherNumber
                        : "No adjunto"}
                    </td>

                    <td className="py-3">
                      {formatDate(new Date(economicExpense.registrationDate))}
                    </td>

                    <td className="py-3">
                      {formatAmountToCRC(economicExpense.amount)}
                    </td>

                    <td className="py-3">{economicExpense.meanOfPayment.name}</td>

                    <td className="py-3">{economicExpense.category.name}</td>

                    {filterByStatus && (
                      <td className="py-3">
                        {economicExpense.isDeleted ? (
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
                            getEconomicExpenseById(economicExpense.idEconomicExpense);
                            showModalInfo();
                          }}
                          className="p-2 bg-black rounded hover:bg-gray-800"
                        >
                          <IoIosMore className="text-white" />
                        </button>

                        <button
                          onClick={() => {
                            getEconomicExpenseById(economicExpense.idEconomicExpense);
                            showModalForm();
                          }}
                          className="p-2 bg-black rounded hover:bg-gray-800"
                        >
                          <MdModeEdit className="text-white" />
                        </button>

                        {economicExpense.isDeleted ? (
                          <button
                            onClick={() =>
                              handleRestore(mapEconomicExpenseToDataForm(economicExpense))
                            }
                            className="p-2 bg-black rounded hover:bg-gray-800"
                          >
                            <MdOutlineSettingsBackupRestore className="text-white" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleDelete(economicExpense)}
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
          <NoData module="gastos económicos" />
        )}
      </div>

      {economicExpenses?.length > 0 && (
        <>
          <div className="mt-6 p-4 bg-gray-100 rounded-lg">
            <h3 className="text-lg font-bold">
              Total de Gastos:{" "}
              {formatAmountToCRC(
                economicExpenses.reduce((total, item) => total + item.amount, 0)
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
    getDataById={getEconomicExpenseById}
    Content={DataInfo}
  />
    </div>
  );
}

export default ExpenseTable;