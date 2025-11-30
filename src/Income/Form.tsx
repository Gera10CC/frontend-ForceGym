import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import Select from "react-select";
import { EconomicIncomeDataForm } from "../shared/types";
import ErrorForm from "../shared/components/ErrorForm";
import useEconomicIncomeStore from "./Store";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { formatDate } from "../shared/utils/format";
import {
  getAuthUser,
  setAuthHeader,
  setAuthUser,
} from "../shared/utils/authentication";
import { useCommonDataStore } from "../shared/CommonDataStore";
import SearchSelect from "../shared/components/SearchSelect";

const MAXLENGTH_VOUCHER = 100;
const MINLENGTH_VOUCHER = 5;
const MAXLENGTH_DETAIL = 100;
const MINLENGTH_DETAIL = 5;
const CASH_PAYMENT_ID = 2;
const MAXDATE = new Date().toUTCString();

function Form() {
  const navigate = useNavigate();
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
  const hasDelay = watch("hasDelay");
  const idClient = watch("idClient");
  const idActivityType = watch("idActivityType");

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

    if (data.amount <= 0) {
      return Swal.fire({
        title: "Error",
        text: "El monto debe ser mayor a cero",
        icon: "error",
      });
    }

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

      <div>
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
      )}

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
        <label className="text-sm uppercase font-bold">Voucher</label>
        <input
          type="text"
          placeholder={
            isCashPayment ? "No aplica para efectivo" : "Ingrese el voucher"
          }
          disabled={isCashPayment}
          className={`
            w-full p-3 border rounded-md mt-1
            ${isCashPayment ? "bg-gray-100 border-gray-300" : "border-gray-200"}
          `}
          {...register("voucherNumber", {
            required:
              idMeanOfPayment === 1 ? "El voucher es obligatorio" : false,
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
        <label className="text-sm uppercase font-bold">Detalle</label>
        <input
          type="text"
          placeholder="Ingrese el detalle"
          className="w-full p-3 border border-gray-200 rounded-md mt-1"
          {...register("detail", {
            required: "El detalle es obligatorio",
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

      <div>
        <label className="text-sm uppercase font-bold">Monto</label>
        <input
          type="number"
          min="0"
          placeholder="Ingrese el monto"
          className="w-full p-3 border border-gray-200 rounded-md mt-1"
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
      </div>

      <input
        type="submit"
        value={activeEditingId ? "Actualizar" : "Registrar"}
        className="
          bg-yellow text-black w-full p-3 rounded-md uppercase 
          font-bold hover:bg-amber-500 mt-4 cursor-pointer transition-colors
        "
      />
    </form>
  );
}

export default Form;