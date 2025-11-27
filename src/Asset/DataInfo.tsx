import { formatAmountToCRC } from "../shared/utils/format";
import useAssetStore from "./Store";

function DataInfo() {
  const { assets, activeEditingId } = useAssetStore();

  if (!activeEditingId) {
    return (
      <section className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 min-h-[260px] flex items-center justify-center">
        <p className="text-gray-500 text-sm sm:text-base text-center">
          No hay un activo seleccionado para mostrar.
        </p>
      </section>
    );
  }

  const asset = assets.find((a) => a.idAsset === activeEditingId);

  if (!asset) {
    return (
      <section className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 min-h-[260px] flex items-center justify-center">
        <p className="text-gray-500 text-sm sm:text-base text-center">
          No se encontró la información del activo seleccionado.
        </p>
      </section>
    );
  }

  const yearsSincePurchase =
    new Date().getFullYear() - new Date(asset.boughtDate).getFullYear();
  const currentValue =
    asset.initialCost - asset.deprecationPerYear * yearsSincePurchase;
  const totalValue = currentValue * asset.quantity;

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
            Activo
          </h1>

          <div className="flex flex-col text-sm sm:text-base">
            <p className="font-semibold uppercase text-gray-600 text-xs">
              Código
            </p>
            <p>{asset.code}</p>
          </div>

          <div className="flex flex-col text-sm sm:text-base">
            <p className="font-semibold uppercase text-gray-600 text-xs">
              Nombre
            </p>
            <p className="break-words">{asset.name}</p>
          </div>

          <div className="flex flex-col text-sm sm:text-base">
            <p className="font-semibold uppercase text-gray-600 text-xs">
              Vida útil
            </p>
            <p>{asset.serviceLifeYears} años</p>
          </div>

          <div className="flex flex-col text-sm sm:text-base">
            <p className="font-semibold uppercase text-gray-600 text-xs">
              Depreciación anual por unidad
            </p>
            <p>{formatAmountToCRC(asset.deprecationPerYear)}</p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <h1 className="text-yellow font-black text-2xl uppercase underline">
            Detalles
          </h1>

          <div className="flex flex-col text-sm sm:text-base">
            <p className="font-semibold uppercase text-gray-600 text-xs">
              Cantidad
            </p>
            <p>{asset.quantity}</p>
          </div>

          <div className="flex flex-col text-sm sm:text-base">
            <p className="font-semibold uppercase text-gray-600 text-xs">
              Precio unitario
            </p>
            <p>{formatAmountToCRC(asset.initialCost)}</p>
          </div>

          <div className="flex flex-col text-sm sm:text-base">
            <p className="font-semibold uppercase text-gray-600 text-xs">
              Valor actual por unidad
            </p>
            <p>{formatAmountToCRC(currentValue)}</p>
          </div>

          <div className="flex flex-col text-sm sm:text-base">
            <p className="font-semibold uppercase text-gray-600 text-xs">
              Valor actual total
            </p>
            <p>{formatAmountToCRC(totalValue)}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default DataInfo;