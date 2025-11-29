import useActivityTypeStore from "./Store";
import { useCommonDataStore } from "../shared/CommonDataStore"; 

function DataInfo() {
  const { activityTypes, activeEditingId } = useActivityTypeStore();
  const { clientTypes } = useCommonDataStore();

  if (!activeEditingId) {
    return (
      <section className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 min-h-[260px] flex items-center justify-center">
        <p className="text-gray-500 text-sm sm:text-base text-center">
          No hay un tipo de actividad seleccionado para mostrar.
        </p>
      </section>
    );
  }

  const activityType = activityTypes.find(
    activity => activity.idActivityType === activeEditingId
  );

  if (!activityType) {
    return (
      <section className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 min-h-[260px] flex items-center justify-center">
        <p className="text-gray-500 text-sm sm:text-base text-center">
          No se encontró la información del tipo de actividad seleccionado.
        </p>
      </section>
    );
  }

  const getClientTypeName = (id: number) => {
    const clientType = clientTypes.find(type => type.idClientType === id);
    return clientType ? clientType.name : `Tipo ${id}`;
  };

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
            Actividad
          </h1>

          <div className="flex flex-col text-sm sm:text-base">
            <p className="font-semibold uppercase text-gray-600 text-xs">
              Nombre
            </p>
            <p className="break-words">
              {activityType.name}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <h1 className="text-yellow font-black text-2xl uppercase underline">
            Tarifas
          </h1>

          {Array.isArray(activityType.fees) && activityType.fees.length > 0 ? (
            <div className="flex flex-col gap-4">
              {activityType.fees.map((fee, index) => (
                <div
                  key={index}
                  className="bg-gray-100 p-4 rounded-lg flex flex-col gap-2"
                >
                  <div className="flex flex-col text-sm sm:text-base">
                    <p className="font-semibold uppercase text-gray-600 text-xs">
                      Tipo de cliente
                    </p>
                    <p className="break-words">
                      {Array.isArray(fee.idClientType)
                        ? fee.idClientType.map(id => getClientTypeName(id)).join(", ")
                        : "No definido"}
                    </p>
                  </div>

                  <div className="flex flex-col text-sm sm:text-base">
                    <p className="font-semibold uppercase text-gray-600 text-xs">
                      Precio
                    </p>
                    <p>{`CRC ${Number(fee.amount || 0).toLocaleString()}`}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm sm:text-base">
              No hay tarifas definidas.
            </p>
          )}
        </div>

      </div>
    </section>
  );
}

export default DataInfo;