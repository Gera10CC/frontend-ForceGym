import { formatDate } from "../shared/utils/format";
import useMeasurementStore from "./Store";

function DataInfo() {
  const { measurements, activeEditingId } = useMeasurementStore();

  if (!activeEditingId) {
    return (
      <section className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 min-h-[260px] flex items-center justify-center">
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
      <section className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 min-h-[260px] flex items-center justify-center">
        <p className="text-gray-500 text-sm sm:text-base text-center">
          No se encontró la información de la medición seleccionada.
        </p>
      </section>
    );
  }

  return (
    <section
      className="
        w-full max-w-4xl mx-auto 
        px-4 sm:px-6 py-6 
        min-h-[260px]
        flex flex-col gap-8
      "
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <div className="flex flex-col gap-3">
          <h1 className="text-yellow font-black text-2xl uppercase underline">
            Medición
          </h1>

          <div className="flex flex-col text-sm sm:text-base">
            <p className="font-semibold uppercase text-gray-600 text-xs">
              Fecha de Medición
            </p>
            <p>{formatDate(new Date(measurement.measurementDate))}</p>
          </div>

          <div className="flex flex-col text-sm sm:text-base">
            <p className="font-semibold uppercase text-gray-600 text-xs">Peso</p>
            <p>{measurement.weight} kg</p>
          </div>

          <div className="flex flex-col text-sm sm:text-base">
            <p className="font-semibold uppercase text-gray-600 text-xs">Altura</p>
            <p>{measurement.height} cm</p>
          </div>

          <div className="flex flex-col text-sm sm:text-base">
            <p className="font-semibold uppercase text-gray-600 text-xs">
              Músculo
            </p>
            <p>{measurement.muscleMass} %</p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <h1 className="text-yellow font-black text-2xl uppercase underline">
            Medidas Corporales
          </h1>

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
            <div key={label} className="flex flex-col text-sm sm:text-base">
              <p className="font-semibold uppercase text-gray-600 text-xs">
                {label}
              </p>
              <p>{value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default DataInfo;