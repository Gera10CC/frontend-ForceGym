import { formatAmountToCRC, formatDate } from "../shared/utils/format";
import { useEconomicExpenseStore } from "./Store";

function DataInfo() {
  const { economicExpenses, activeEditingId } = useEconomicExpenseStore();

  if (!activeEditingId) {
    return (
      <section className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 min-h-[260px] flex items-center justify-center">
        <p className="text-gray-500 text-sm sm:text-base text-center">
          No hay un gasto seleccionado para mostrar.
        </p>
      </section>
    );
  }

  const economicExpense = economicExpenses.find(
    (expense) => expense.idEconomicExpense === activeEditingId
  );

  if (!economicExpense) {
    return (
      <section className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 min-h-[260px] flex items-center justify-center">
        <p className="text-gray-500 text-sm sm:text-base text-center">
          No se encontró la información del gasto seleccionado.
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
        {/* GASTO */}
        <div className="flex flex-col gap-3">
          <h1 className="text-yellow font-black text-2xl uppercase underline">
            Gasto
          </h1>

          {/* Número de voucher */}
          <div className="flex flex-col text-sm sm:text-base">
            <p className="font-semibold uppercase text-gray-600 text-xs">
              Número de Voucher
            </p>
            <p className="break-words">
              {economicExpense.voucherNumber || "No adjunto"}
            </p>
          </div>

          {/* Detalle */}
          <div className="flex flex-col text-sm sm:text-base">
            <p className="font-semibold uppercase text-gray-600 text-xs">
              Detalle
            </p>
            <p className="break-words">{economicExpense.detail}</p>
          </div>

          {/* Fecha */}
          <div className="flex flex-col text-sm sm:text-base">
            <p className="font-semibold uppercase text-gray-600 text-xs">
              Fecha de Registro
            </p>
            <p>{formatDate(new Date(economicExpense.registrationDate))}</p>
          </div>
        </div>

        {/* DETALLES */}
        <div className="flex flex-col gap-3">
          <h1 className="text-yellow font-black text-2xl uppercase underline">
            Detalles
          </h1>

          {/* Medio de pago */}
          <div className="flex flex-col text-sm sm:text-base">
            <p className="font-semibold uppercase text-gray-600 text-xs">
              Medio de Pago
            </p>
            <p>{economicExpense.meanOfPayment.name}</p>
          </div>

          {/* Monto */}
          <div className="flex flex-col text-sm sm:text-base">
            <p className="font-semibold uppercase text-gray-600 text-xs">
              Monto
            </p>
            <p>{formatAmountToCRC(economicExpense.amount)}</p>
          </div>

          {/* Categoría */}
          <div className="flex flex-col text-sm sm:text-base">
            <p className="font-semibold uppercase text-gray-600 text-xs">
              Categoría
            </p>
            <p>{economicExpense.category.name}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default DataInfo;