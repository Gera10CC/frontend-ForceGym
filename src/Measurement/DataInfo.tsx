import { formatDate } from "../shared/utils/format";
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
    <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-8">

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          ["Fecha", formatDate(new Date(measurement.measurementDate))],
          ["Peso", `${measurement.weight} kg`],
          ["Altura", `${measurement.height} cm`],
          ["Músculo", `${measurement.muscleMass} %`],
        ].map(([label, value]) => (
          <div
            key={label}
            className="bg-white rounded-xl shadow-sm border p-4 flex flex-col"
          >
            <span className="text-[11px] uppercase font-semibold text-gray-500">
              {label}
            </span>
            <span className="text-lg font-semibold text-gray-900 mt-1">
              {value}
            </span>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-yellow font-black text-xl uppercase mb-4">
          Medidas Corporales
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            ["Grasa corporal", measurement.bodyFatPercentage + " %"],
            ["Grasa visceral", measurement.visceralFatPercentage + " %"],
            ["Pecho", measurement.chestSize + " cm"],
            ["Espalda", measurement.backSize + " cm"],
            ["Cadera", measurement.hipSize + " cm"],
            ["Cintura", measurement.waistSize + " cm"],
            ["Pierna izquierda", measurement.leftLegSize + " cm"],
            ["Pierna derecha", measurement.rightLegSize + " cm"],
            ["Pantorrilla izquierda", measurement.leftCalfSize + " cm"],
            ["Pantorrilla derecha", measurement.rightCalfSize + " cm"],
            ["Antebrazo izquierdo", measurement.leftForeArmSize + " cm"],
            ["Antebrazo derecho", measurement.rightForeArmSize + " cm"],
            ["Brazo izquierdo", measurement.leftArmSize + " cm"],
            ["Brazo derecho", measurement.rightArmSize + " cm"],
          ].map(([label, value]) => (
            <div
              key={label}
              className="border rounded-lg p-3 flex flex-col bg-gray-50"
            >
              <span className="text-[11px] uppercase font-semibold text-gray-500">
                {label}
              </span>
              <span className="text-base font-medium text-gray-900 mt-1">
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