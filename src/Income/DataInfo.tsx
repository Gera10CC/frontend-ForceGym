import { formatAmountToCRC, formatDate } from "../shared/utils/format";
import useEconomicIncomeStore from "./Store";

function DataInfo() {
  const { economicIncomes, activeEditingId } = useEconomicIncomeStore();

  if (!activeEditingId) {
    return (
      <section className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 min-h-[260px] flex items-center justify-center">
        <p className="text-gray-500 text-sm sm:text-base text-center">
          No hay un ingreso seleccionado para mostrar.
        </p>
      </section>
    );
  }

  const economicIncome = economicIncomes.find(
    (income) => income.idEconomicIncome === activeEditingId
  );

  if (!economicIncome) {
    return (
      <section className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 min-h-[260px] flex items-center justify-center">
        <p className="text-gray-500 text-sm sm:text-base text-center">
          No se encontró la información del ingreso seleccionado.
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

        <div className="flex flex-col gap-3">
          <h1 className="text-yellow font-black text-2xl uppercase underline">
            Ingreso
          </h1>

          <div className="flex flex-col text-sm sm:text-base">
            <p className="font-semibold uppercase text-gray-600 text-xs">
              Número de Voucher
            </p>
            <p>{economicIncome.voucherNumber || "No adjunto"}</p>
          </div>

          <div className="flex flex-col text-sm sm:text-base">
            <p className="font-semibold uppercase text-gray-600 text-xs">
              Detalle
            </p>
            <p className="break-words">{economicIncome.detail}</p>
          </div>

          <div className="flex flex-col text-sm sm:text-base">
            <p className="font-semibold uppercase text-gray-600 text-xs">
              Medio de Pago
            </p>
            <p>{economicIncome.meanOfPayment.name}</p>
          </div>

          <div className="flex flex-col text-sm sm:text-base">
            <p className="font-semibold uppercase text-gray-600 text-xs">
              Fecha de Registro
            </p>
            <p>{formatDate(new Date(economicIncome.registrationDate))}</p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <h1 className="text-yellow font-black text-2xl uppercase underline">
            Cliente
          </h1>

          <div className="flex flex-col text-sm sm:text-base">
            <p className="font-semibold uppercase text-gray-600 text-xs">
              Cédula
            </p>
            <p>{economicIncome.client.person.identificationNumber}</p>
          </div>

          <div className="flex flex-col text-sm sm:text-base">
            <p className="font-semibold uppercase text-gray-600 text-xs">
              Nombre
            </p>
            <p>
              {economicIncome.client.person.name +
                " " +
                economicIncome.client.person.firstLastName +
                " " +
                economicIncome.client.person.secondLastName}
            </p>
          </div>

          <div className="flex flex-col text-sm sm:text-base">
            <p className="font-semibold uppercase text-gray-600 text-xs">
              Tipo
            </p>
            <p>{economicIncome.client.clientType.name}</p>
          </div>

          <div className="flex flex-col text-sm sm:text-base">
            <p className="font-semibold uppercase text-gray-600 text-xs">
              Número
            </p>
            <p>{economicIncome.client.person.phoneNumber}</p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <h1 className="text-yellow font-black text-2xl uppercase underline">
            Actividad
          </h1>

          <div className="flex flex-col text-sm sm:text-base">
            <p className="font-semibold uppercase text-gray-600 text-xs">
              Tipo de Actividad
            </p>
            <p>{economicIncome.activityType.name}</p>
          </div>

          <div className="flex flex-col text-sm sm:text-base">
            <p className="font-semibold uppercase text-gray-600 text-xs">
              Monto
            </p>
            <p>{formatAmountToCRC(economicIncome.amount)}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default DataInfo;