import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import { IoIosMore } from "react-icons/io";
import { MdModeEdit, MdOutlineDelete, MdOutlineSettingsBackupRestore } from "react-icons/md";
import { formatAmountToCRC } from "../shared/utils/format";
import { mapAssetToDataForm } from "../shared/types/mapper";
import NoData from "../shared/components/NoData";
import Pagination from "../shared/components/Pagination";
import Modal from "../shared/components/Modal";
import DataInfo from "./DataInfo";
import { Asset } from "../shared/types";

interface AssetTableProps {
  assets: Asset[];
  modalInfo: boolean;
  orderBy: string;
  directionOrderBy: string;
  filterByStatus: boolean;
  page: number;
  size: number;
  totalRecords: number;

  handleOrderByChange: (field: string) => void;
  getAssetById: (id: number) => void;
  showModalInfo: () => void;
  closeModalInfo: () => void;
  showModalForm: () => void;
  handleDelete: (asset: Asset) => void;
  handleRestore: (asset: any) => void;
  changePage: (page: number) => void;
  changeSize: (size: number) => void;
}

export default function AssetTable({
  assets,
  modalInfo,
  orderBy,
  directionOrderBy,
  filterByStatus,
  page,
  size,
  totalRecords,
  handleOrderByChange,
  getAssetById,
  showModalInfo,
  closeModalInfo,
  showModalForm,
  handleDelete,
  handleRestore,
  changePage,
  changeSize,
}: AssetTableProps) {
  return (
    <div className="w-full mt-4">

      <div className="overflow-x-auto rounded-lg">
        {assets?.length > 0 ? (
          <>
            <table className="w-full min-w-[900px] text-center">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="py-3 px-2 font-semibold">#</th>

                  <th className="py-3 px-2">
                    <button
                      className="inline-flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-200"
                      onClick={() => handleOrderByChange("code")}
                    >
                      CÓDIGO
                      {orderBy === "code" && directionOrderBy === "DESC" && (
                        <FaArrowUp className="text-yellow" />
                      )}
                      {orderBy === "code" && directionOrderBy === "ASC" && (
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
                      {orderBy === "name" && directionOrderBy === "DESC" && (
                        <FaArrowUp className="text-yellow" />
                      )}
                      {orderBy === "name" && directionOrderBy === "ASC" && (
                        <FaArrowDown className="text-yellow" />
                      )}
                    </button>
                  </th>

                  <th className="py-3 px-2">
                    <button
                      className="inline-flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-200"
                      onClick={() => handleOrderByChange("quantity")}
                    >
                      CANTIDAD
                      {orderBy === "quantity" && directionOrderBy === "DESC" && (
                        <FaArrowUp className="text-yellow" />
                      )}
                      {orderBy === "quantity" && directionOrderBy === "ASC" && (
                        <FaArrowDown className="text-yellow" />
                      )}
                    </button>
                  </th>

                  <th className="py-3 px-2">
                    <button
                      className="inline-flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-200"
                      onClick={() => handleOrderByChange("initialCost")}
                    >
                      COSTO UNITARIO
                      {orderBy === "initialCost" && directionOrderBy === "DESC" && (
                        <FaArrowUp className="text-yellow" />
                      )}
                      {orderBy === "initialCost" && directionOrderBy === "ASC" && (
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
                {assets.map((asset, index) => (
                  <tr
                    key={asset.idAsset}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="py-3">{index + 1}</td>
                    <td className="py-3">{asset.code}</td>
                    <td className="py-3">{asset.name}</td>
                    <td className="py-3">{asset.quantity}</td>
                    <td className="py-3">{formatAmountToCRC(asset.initialCost)}</td>

                    {filterByStatus && (
                      <td className="py-3">
                        {asset.isDeleted ? (
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
                            getAssetById(asset.idAsset);
                            showModalInfo();
                          }}
                          className="p-2 bg-black rounded hover:bg-gray-800"
                        >
                          <IoIosMore className="text-white" />
                        </button>

                        <button
                          onClick={() => {
                            getAssetById(asset.idAsset);
                            showModalForm();
                          }}
                          className="p-2 bg-black rounded hover:bg-gray-800"
                        >
                          <MdModeEdit className="text-white" />
                        </button>

                        {asset.isDeleted ? (
                          <button
                            onClick={() =>
                              handleRestore(mapAssetToDataForm(asset))
                            }
                            className="p-2 bg-black rounded hover:bg-gray-800"
                          >
                            <MdOutlineSettingsBackupRestore className="text-white" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleDelete(asset)}
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
          <NoData module="activos" />
        )}
      </div>

      {assets?.length > 0 && (
        <>

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
        getDataById={getAssetById}
        Content={DataInfo}
      />
    </div>
  );
}