import { MdModeEdit, MdOutlineDelete, MdOutlineSettingsBackupRestore } from "react-icons/md";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import { IoIosMore } from "react-icons/io";
import Modal from "../shared/components/Modal";
import NoData from "../shared/components/NoData";
import Pagination from "../shared/components/Pagination";
import { formatDate } from "../shared/utils/format";
import DataInfo from "./DataInfo";
import { mapMeasurementToDataForm } from "../shared/types/mapper";
import { Measurement } from "../shared/types";

interface MeasurementTableProps {
  measurements: Measurement[];
  modalInfo: boolean;
  modalForm: boolean;
  orderBy: string;
  directionOrderBy: string;
  filterByStatus: boolean;
  page: number;
  size: number;
  totalRecords: number;
  handleOrderByChange: (field: string) => void;
  getMeasurementById: (id: number) => void;
  showModalInfo: () => void;
  closeModalInfo: () => void;
  showModalForm: () => void;
  handleDelete: (measurement: Measurement) => void;
  handleRestore: (measurement: any) => void;
  changePage: (page: number) => void;
  changeSize: (size: number) => void;
}

function MeasurementTable({
  measurements,
  modalInfo,
  orderBy,
  directionOrderBy,
  filterByStatus,
  page,
  size,
  totalRecords,
  handleOrderByChange,
  getMeasurementById,
  showModalInfo,
  closeModalInfo,
  showModalForm,
  handleDelete,
  handleRestore,
  changePage,
  changeSize,
}: MeasurementTableProps) {

  return (
    <div className="w-full mt-4">

      <div className="overflow-x-auto rounded-lg">
        {measurements?.length > 0 ? (
          <>
            <table className="w-full min-w-[900px] text-center">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="py-3 px-2 font-semibold">#</th>

                  <th className="py-3 px-2">
                    <button
                      className="inline-flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-200"
                      onClick={() => handleOrderByChange("measurementDate")}
                    >
                      FECHA
                      {orderBy === "measurementDate" && directionOrderBy === "DESC" && (
                        <FaArrowUp className="text-yellow" />
                      )}
                      {orderBy === "measurementDate" && directionOrderBy === "ASC" && (
                        <FaArrowDown className="text-yellow" />
                      )}
                    </button>
                  </th>

                  <th className="py-3 px-2 font-semibold">PESO (kg)</th>
                  <th className="py-3 px-2 font-semibold">ALTURA (cm)</th>
                  <th className="py-3 px-2 font-semibold">MÚSCULO (%)</th>
                  <th className="py-3 px-2 font-semibold">GRASA (%)</th>
                  <th className="py-3 px-2 font-semibold">VISCERAL (%)</th>

                  {filterByStatus && <th className="py-3 px-2 font-semibold">ESTADO</th>}

                  <th className="py-3 px-2 font-semibold">ACCIONES</th>
                </tr>
              </thead>

              <tbody className="text-sm">
                {measurements.map((measurement, index) => (
                  <tr
                    key={measurement.idMeasurement}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="py-3">{index + 1}</td>

                    <td className="py-3">
                      {formatDate(new Date(measurement.measurementDate))}
                    </td>

                    <td className="py-3">{measurement.weight}</td>
                    <td className="py-3">{measurement.height}</td>
                    <td className="py-3">{measurement.muscleMass}</td>
                    <td className="py-3">{measurement.bodyFatPercentage}</td>
                    <td className="py-3">{measurement.visceralFatPercentage}</td>

                    {filterByStatus && (
                      <td className="py-3">
                        {measurement.isDeleted ? (
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
                            getMeasurementById(measurement.idMeasurement);
                            showModalInfo();
                          }}
                          className="p-2 bg-black rounded hover:bg-gray-800"
                        >
                          <IoIosMore className="text-white" />
                        </button>

                        <button
                          onClick={() => {
                            getMeasurementById(measurement.idMeasurement);
                            showModalForm();
                          }}
                          className="p-2 bg-black rounded hover:bg-gray-800"
                        >
                          <MdModeEdit className="text-white" />
                        </button>

                        {measurement.isDeleted ? (
                          <button
                            onClick={() =>
                              handleRestore(mapMeasurementToDataForm(measurement))
                            }
                            className="p-2 bg-black rounded hover:bg-gray-800"
                          >
                            <MdOutlineSettingsBackupRestore className="text-white" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleDelete(measurement)}
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
          <NoData module="mediciones" />
        )}
      </div>

      {measurements?.length > 0 && (
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
        getDataById={getMeasurementById}
        Content={DataInfo}
      />
    </div>
  );
}

export default MeasurementTable;