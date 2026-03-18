import { formatDateFromString } from "../shared/utils/format";
import useMeasurementStore from "./Store";

function DataInfo() {
  const { measurements, activeEditingId } = useMeasurementStore();

  if (!activeEditingId) {
    return (
      <section className="w-full max-w-5xl mx-auto px-4 py-10 flex items-center justify-center">
        <p className="text-gray-500 text-sm sm:text-base text-center">
          No hay una medición seleccionada para mostrar.
        </p>
      </section>
    );
  }

  const measurement = measurements.find(
    (m) => m.idMeasurement === activeEditingId
  );

  if (!measurement) {
    return (
      <section className="w-full max-w-5xl mx-auto px-4 py-10 flex items-center justify-center">
        <p className="text-gray-500 text-sm sm:text-base text-center">
          No se encontró la información de la medición seleccionada.
        </p>
      </section>
    );
  }

  return (
    <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-6">
      {/* Encabezado con Fecha */}
      <div className="bg-white rounded-xl shadow-sm border p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-yellow font-black text-lg uppercase">
            Medición del {formatDateFromString(measurement.measurementDate)}
          </h2>
        </div>
      </div>

      {/* Medidas Básicas y Composición */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-sm font-bold uppercase text-gray-700 mb-4 border-b pb-2">
          Medidas Básicas y Composición
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            ["Peso", `${measurement.weight} kg`],
            ["Altura", `${measurement.height} cm`],
            ["IMC", `${measurement.bmi}`],
            ["Músculo", `${measurement.muscleMass} %`],
            ["Grasa Corp.", `${measurement.bodyFatPercentage} %`],
            ["Grasa Visc.", `${measurement.visceralFatPercentage} %`],
          ].map(([label, value]) => (
            <div
              key={label}
              className="border rounded-lg p-3 flex flex-col bg-gradient-to-br from-gray-50 to-white hover:shadow-md transition-shadow duration-200"
            >
              <span className="text-[10px] uppercase font-bold text-gray-600 tracking-wide">
                {label}
              </span>
              <span className="text-base font-semibold text-gray-900 mt-2">
                {value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Medidas del Torso */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-sm font-bold uppercase text-gray-700 mb-4 border-b pb-2">
          Medidas del Torso
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            ["Pecho", `${measurement.chestSize} cm`],
            ["Espalda", `${measurement.backSize} cm`],
            ["Cintura", `${measurement.waistSize} cm`],
            ["Cadera", `${measurement.hipSize} cm`],
          ].map(([label, value]) => (
            <div
              key={label}
              className="border rounded-lg p-3 flex flex-col bg-gradient-to-br from-gray-50 to-white hover:shadow-md transition-shadow duration-200"
            >
              <span className="text-[10px] uppercase font-bold text-gray-600 tracking-wide">
                {label}
              </span>
              <span className="text-base font-semibold text-gray-900 mt-2">
                {value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Brazos */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-sm font-bold uppercase text-gray-700 mb-4 border-b pb-2">
          Brazos
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            ["Brazo Der.", `${measurement.rightArmSize} cm`],
            ["Brazo Izq.", `${measurement.leftArmSize} cm`],
            ["Antebrazo Der.", `${measurement.rightForeArmSize} cm`],
            ["Antebrazo Izq.", `${measurement.leftForeArmSize} cm`],
          ].map(([label, value]) => (
            <div
              key={label}
              className="border rounded-lg p-3 flex flex-col bg-gradient-to-br from-gray-50 to-white hover:shadow-md transition-shadow duration-200"
            >
              <span className="text-[10px] uppercase font-bold text-gray-600 tracking-wide">
                {label}
              </span>
              <span className="text-base font-semibold text-gray-900 mt-2">
                {value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Piernas */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-sm font-bold uppercase text-gray-700 mb-4 border-b pb-2">
          Piernas
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            ["Pierna Der.", `${measurement.rightLegSize} cm`],
            ["Pierna Izq.", `${measurement.leftLegSize} cm`],
            ["Pantorrilla Der.", `${measurement.rightCalfSize} cm`],
            ["Pantorrilla Izq.", `${measurement.leftCalfSize} cm`],
          ].map(([label, value]) => (
            <div
              key={label}
              className="border rounded-lg p-3 flex flex-col bg-gradient-to-br from-gray-50 to-white hover:shadow-md transition-shadow duration-200"
            >
              <span className="text-[10px] uppercase font-bold text-gray-600 tracking-wide">
                {label}
              </span>
              <span className="text-base font-semibold text-gray-900 mt-2">
                {value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default DataInfo;