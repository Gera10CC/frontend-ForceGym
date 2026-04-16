import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import Select from "react-select";
import { EconomicIncomeDataForm } from "../shared/types";
import ErrorForm from "../shared/components/ErrorForm";
import useEconomicIncomeStore from "./Store";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { formatDate } from "../shared/utils/format";
import {
  getAuthUser,
  setAuthHeader,
  setAuthUser,
} from "../shared/utils/authentication";
import { useCommonDataStore } from "../shared/CommonDataStore";
import SearchSelect from "../shared/components/SearchSelect";
import { FaSpinner } from 'react-icons/fa';

const MAXLENGTH_VOUCHER = 100;
const MINLENGTH_VOUCHER = 5;
const MAXLENGTH_DETAIL = 100;
const MINLENGTH_DETAIL = 5;
const CASH_PAYMENT_ID = 2;
const MIXED_PAYMENT_ID = 3;
const MAXDATE = new Date().toUTCString();

function Form() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
    watch,
  } = useForm<EconomicIncomeDataForm>();

  const { meansOfPayment, activityTypes, allClients, fetchAllClients } =
    useCommonDataStore();

  const {
    economicIncomes,
    activeEditingId,
    fetchEconomicIncomes,
    addEconomicIncome,
    updateEconomicIncome,
    closeModalForm,
  } = useEconomicIncomeStore();

  const idMeanOfPayment = watch("idMeanOfPayment")
    ? Number(watch("idMeanOfPayment"))
    : null;
  const voucherNumber = watch("voucherNumber");
  const amount = watch("amount");
  const isCashPayment = idMeanOfPayment === CASH_PAYMENT_ID;
  const isMixedPayment = idMeanOfPayment === MIXED_PAYMENT_ID;
  const hasDelay = watch("hasDelay");
  const idClient = watch("idClient");
  const idActivityType = watch("idActivityType");

  // Estados para pago mixto
  const [sinpeAmount, setSinpeAmount] = useState<number>(0);
  const [cashAmount, setCashAmount] = useState<number>(0);

  // Calcular el monto total cuando es pago mixto
  useEffect(() => {
    if (isMixedPayment) {
      const total = (sinpeAmount || 0) + (cashAmount || 0);
      setValue("amount", total);
    }
  }, [sinpeAmount, cashAmount, isMixedPayment, setValue]);

  // Resetear montos cuando cambia el medio de pago
  useEffect(() => {
    if (!isMixedPayment) {
      setSinpeAmount(0);
      setCashAmount(0);
    }
  }, [isMixedPayment]);

  const submitForm = async (data: EconomicIncomeDataForm) => {
    if (!data.idClient) {
      return Swal.fire({
        title: "Error",
        text: "Debe seleccionar un cliente",
        icon: "error",
      });
    }

    if (isCashPayment && data.voucherNumber) {
      return Swal.fire({
        title: "Error",
        text: "No se puede ingresar número de comprobante cuando el medio de pago es efectivo",
        icon: "error",
      });
    }

    if (isMixedPayment) {
      if (sinpeAmount <= 0 || cashAmount <= 0) {
        return Swal.fire({
          title: "Error",
          text: "Para pago mixto, ambos montos (Sinpe y Efectivo) deben ser mayores a cero",
          icon: "error",
        });
      }
    }

    if (data.amount <= 0) {
      return Swal.fire({
        title: "Error",
        text: "El monto debe ser mayor a cero",
        icon: "error",
      });
    }

    setIsSubmitting(true);
    try {
      let action = "";
      let result;

      const loggedUser = getAuthUser();
      const reqUser = {
        ...data,
        delayDays: data.hasDelay ? data.delayDays : null,
        paramLoggedIdUser: loggedUser?.idUser,
      };

      if (activeEditingId === 0) {
        result = await addEconomicIncome(reqUser);
        action = "agregado";
      } else {
        result = await updateEconomicIncome(reqUser);
        action = "editado";
      }

    if (result.ok) {
      const result2 = await fetchEconomicIncomes();

      if (result2.logout) {
        setAuthHeader(null);
        setAuthUser(null);
        navigate("/login", { replace: true });
      } else {
        closeModalForm();
        reset();

        await Swal.fire({
          title: `Ingreso económico ${action}`,
          text: `Se ha ${action} el ingreso`,
          icon: "success",
          timer: 3000,
          confirmButtonColor: "#CFAD04",
        });
      }
    } else if (result.logout) {
      setAuthHeader(null);
      setAuthUser(null);
      navigate("/login");
    } else {
      // Mostrar mensaje de error
      await Swal.fire({
        title: "Error",
        text: result.error || result.message || "Ocurrió un error al procesar la solicitud",
        icon: "error",
        confirmButtonColor: "#CFAD04",
      });
    }
    } finally {
      setIsSubmitting(false);
    }
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    fetchAllClients();

    if (activeEditingId) {
      const activeIncome = economicIncomes.find(
        (inc) => inc.idEconomicIncome === activeEditingId
      );

      if (activeIncome) {
        setValue("idEconomicIncome", activeIncome.idEconomicIncome);
        setValue("isDeleted", activeIncome.isDeleted);
        setValue("registrationDate", activeIncome.registrationDate);
        setValue("amount", activeIncome.amount);
        setValue("detail", activeIncome.detail);
        setValue("voucherNumber", activeIncome.voucherNumber);
        setValue(
          "idMeanOfPayment",
          activeIncome.meanOfPayment.idMeanOfPayment
        );
        setValue("idClient", activeIncome.client.idClient);
        setValue(
          "idActivityType",
          activeIncome.activityType.idActivityType
        );
        setValue("hasDelay", activeIncome.delayDays != null);
        setValue("delayDays", activeIncome.delayDays || null);
      }
    } else {
      setValue("hasDelay", false);
      setValue("delayDays", null);
    }
  }, [activeEditingId]);

  useEffect(() => {
    if (idClient && idActivityType) {
      const selectedClient = allClients.find((c) => c.value === idClient);
      const clientTypeId = selectedClient?.idClientType;
      const selectedActivity = activityTypes.find(
        (a) => a.idActivityType === Number(idActivityType)
      );

      if (clientTypeId && selectedActivity) {
        const matchingFee = selectedActivity.fees.find((fee) =>
          fee.idClientType.includes(clientTypeId)
        );
        setValue("amount", matchingFee ? matchingFee.amount : 0);
      }
    }
  }, [idClient, idActivityType, allClients, activityTypes]);

  useEffect(() => {
    if (isCashPayment && voucherNumber) {
      setValue("voucherNumber", "");
    }
  }, [isCashPayment, voucherNumber]);

  useEffect(() => {
    if (amount !== undefined && amount < 0) {
      setValue("amount", 0);
    }
  }, [amount]);

  return (
    <form
      onSubmit={handleSubmit(submitForm)}
      noValidate
      className="
        bg-white rounded-lg max-h-[80vh] overflow-y-auto 
        px-4 sm:px-8 py-6 w-full space-y-5
      "
    >
      <legend
        className="
        uppercase text-center text-yellow text-xl sm:text-2xl font-black 
        border-b-2 border-yellow pb-2
      "
      >
        {activeEditingId ? "Actualizar ingreso" : "Registrar ingreso"}
      </legend>

      <input type="hidden" {...register("idEconomicIncome")} />
      <input type="hidden" {...register("isDeleted")} />

      <div>
        <label className="text-sm uppercase font-bold">Cliente</label>
          <SearchSelect
            id="idClient"
            label="Seleccione un cliente"
            options={allClients}
            value={allClients.find(c => c.value === watch("idClient")) || null}
            onChange={(opt) => {
              if (opt) {
                setValue("idClient", opt.value, { shouldValidate: true });
              }
            }}
          />
        {errors.idClient && <ErrorForm>{errors.idClient.message}</ErrorForm>}
      </div>

      <div>
        <label className="text-sm uppercase font-bold">Actividad</label>
        <select
          className="w-full p-3 border border-gray-200 rounded-md mt-1"
          {...register("idActivityType", {
            required: "La actividad es obligatoria",
          })}
        >
          <option value="">Seleccione una actividad</option>
          {activityTypes.map((at) => (
            <option key={at.idActivityType} value={at.idActivityType}>
              {at.name}
            </option>
          ))}
        </select>
        {errors.idActivityType && (
          <ErrorForm>{errors.idActivityType.message}</ErrorForm>
        )}
      </div>

      <div>
        <label className="text-sm uppercase font-bold">Fecha</label>
        <input
          type="date"
          className="w-full p-3 border border-gray-200 rounded-md mt-1"
          {...register("registrationDate", {
            required: "La fecha es obligatoria",
            max: {
              value: MAXDATE,
              message: `Debe ingresar una fecha máxima ${formatDate(
                new Date()
              )}`,
            },
          })}
        />
        {errors.registrationDate && (
          <ErrorForm>{errors.registrationDate.message as string}</ErrorForm>
        )}
      </div>

      {/* CAMPO OCULTO - Días de atraso */}
      {/* <div>
        <label className="text-sm uppercase font-bold">Días de atraso</label>
        <div className="flex items-center mt-2 gap-2">
          <span>¿Hubo atraso?</span>
          <input type="checkbox" {...register("hasDelay")} />
        </div>
      </div>

      {hasDelay && (
        <div>
          <label className="text-sm uppercase font-bold">
            Cantidad de días de atraso
          </label>
          <input
            type="number"
            min="1"
            className="w-full p-3 border border-gray-200 rounded-md mt-1"
            {...register("delayDays", {
              required: "Debe especificar los días de atraso",
              min: { value: 1, message: "Debe ser positivo" },
              valueAsNumber: true,
            })}
          />
          {errors.delayDays && (
            <ErrorForm>{errors.delayDays.message}</ErrorForm>
          )}
        </div>
      )} */}

      <div>
        <label className="text-sm uppercase font-bold">Medio de pago</label>
        <select
          className="w-full p-3 border border-gray-200 rounded-md mt-1"
          {...register("idMeanOfPayment", {
            required: "El medio de pago es obligatorio",
          })}
        >
          <option value="">Seleccione un medio de pago</option>
          {meansOfPayment.map((mp) => (
            <option key={mp.idMeanOfPayment} value={mp.idMeanOfPayment}>
              {mp.name}
            </option>
          ))}
        </select>
        {errors.idMeanOfPayment && (
          <ErrorForm>{errors.idMeanOfPayment.message}</ErrorForm>
        )}
      </div>

      <div>
        <label className="text-sm uppercase font-bold">Voucher (Opcional)</label>
        <input
          type="text"
          placeholder={
            isCashPayment 
              ? "No aplica para efectivo" 
              : isMixedPayment
              ? "Voucher de Sinpe (opcional)"
              : "Voucher (opcional)"
          }
          disabled={isCashPayment}
          className={`
            w-full p-3 border rounded-md mt-1
            ${isCashPayment ? "bg-gray-100 border-gray-300" : "border-gray-200"}
          `}
          {...register("voucherNumber", {
            required: false,
            minLength: {
              value: MINLENGTH_VOUCHER,
              message: `Mínimo ${MINLENGTH_VOUCHER} caracteres`,
            },
            maxLength: {
              value: MAXLENGTH_VOUCHER,
              message: `Máximo ${MAXLENGTH_VOUCHER} caracteres`,
            },
            validate: (value) =>
              isCashPayment && value
                ? "No se puede ingresar voucher con efectivo"
                : true,
          })}
        />
        {errors.voucherNumber && (
          <ErrorForm>{errors.voucherNumber.message}</ErrorForm>
        )}
      </div>

      <div>
        <label className="text-sm uppercase font-bold">Detalle (Opcional)</label>
        <input
          type="text"
          placeholder="Ingrese el detalle (opcional)"
          className="w-full p-3 border border-gray-200 rounded-md mt-1"
          {...register("detail", {
            required: false,
            minLength: {
              value: MINLENGTH_DETAIL,
              message: `Mínimo ${MINLENGTH_DETAIL} caracteres`,
            },
            maxLength: {
              value: MAXLENGTH_DETAIL,
              message: `Máximo ${MAXLENGTH_DETAIL} caracteres`,
            },
          })}
        />
        {errors.detail && <ErrorForm>{errors.detail.message}</ErrorForm>}
      </div>

      {/* Campos para Pago Mixto */}
      {isMixedPayment && (
        <>
          <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
            <h3 className="text-sm uppercase font-bold text-blue-800 mb-3">
              Desglose de Pago Mixto
            </h3>
            
            <div className="space-y-3">
              <div>
                <label className="text-sm font-semibold text-gray-700">
                  Monto Sinpe Móvil
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="₡0.00"
                  value={sinpeAmount || ""}
                  onChange={(e) => setSinpeAmount(parseFloat(e.target.value) || 0)}
                  className="w-full p-3 border border-blue-300 rounded-md mt-1 focus:ring-2 focus:ring-blue-500"
                  onWheel={(e) => e.currentTarget.blur()}
                  onKeyDown={(e) => {
                    if (["-", "e", "E"].includes(e.key)) e.preventDefault();
                  }}
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700">
                  Monto Efectivo
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="₡0.00"
                  value={cashAmount || ""}
                  onChange={(e) => setCashAmount(parseFloat(e.target.value) || 0)}
                  className="w-full p-3 border border-blue-300 rounded-md mt-1 focus:ring-2 focus:ring-blue-500"
                  onWheel={(e) => e.currentTarget.blur()}
                  onKeyDown={(e) => {
                    if (["-", "e", "E"].includes(e.key)) e.preventDefault();
                  }}
                />
              </div>
            </div>
          </div>
        </>
      )}

      <div>
        <label className="text-sm uppercase font-bold">
          Monto {isMixedPayment && "Total"}
        </label>
        <input
          type="number"
          min="0"
          placeholder="Ingrese el monto"
          readOnly={isMixedPayment}
          className={`w-full p-3 border rounded-md mt-1 ${
            isMixedPayment 
              ? "bg-gray-100 border-gray-300 font-bold text-lg" 
              : "border-gray-200"
          }`}
          onWheel={(e) => e.currentTarget.blur()}
          onKeyDown={(e) => {
            if (["-", "e", "E"].includes(e.key)) e.preventDefault();
          }}
          {...register("amount", {
            required: "El monto es obligatorio",
            min: { value: 0, message: "Debe ser mayor a cero" },
            valueAsNumber: true,
          })}
        />
        {errors.amount && <ErrorForm>{errors.amount.message}</ErrorForm>}
        {isMixedPayment && (
          <p className="text-xs text-gray-600 mt-1">
            Calculado automáticamente: ₡{sinpeAmount.toLocaleString("es-CR")} (Sinpe) + ₡{cashAmount.toLocaleString("es-CR")} (Efectivo)
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full p-3 rounded-md uppercase font-bold mt-4 transition-colors flex items-center justify-center gap-2 ${
          isSubmitting
            ? 'bg-gray-400 cursor-not-allowed text-gray-700'
            : 'bg-yellow text-black hover:bg-amber-500 cursor-pointer'
        }`}
      >
        {isSubmitting ? (
          <>
            <FaSpinner className="animate-spin" />
            {activeEditingId ? "Actualizando..." : "Registrando..."}
          </>
        ) : (
          activeEditingId ? "Actualizar" : "Registrar"
        )}
      </button>
    </form>
  );
}

export default Form;