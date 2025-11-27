import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { AssetDataForm } from "../shared/types";
import ErrorForm from "../shared/components/ErrorForm";
import useAssetStore from "./Store";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { getAuthUser, setAuthHeader, setAuthUser } from "../shared/utils/authentication";
import { formatDate } from "../shared/utils/format";

const MAXLENGTH_NAME = 100;
const MAXLENGTH_CODE = 10;
const MIN_UNIT_VALUE = 115000;
const MAXDATE = new Date().toUTCString();

function Form() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm<AssetDataForm>();

  const {
    assets,
    activeEditingId,
    fetchAssets,
    addAsset,
    updateAsset,
    closeModalForm,
  } = useAssetStore();

  const quantity = watch("quantity");
  const cost = watch("initialCost");

  const submitForm = async (data: AssetDataForm) => {
    if (data.quantity <= 0) {
      Swal.fire({
        title: "Error",
        text: "La cantidad debe ser mayor a cero",
        icon: "error",
      });
      return;
    }

    if (data.initialCost < MIN_UNIT_VALUE) {
      Swal.fire({
        title: "Error",
        text: `Cada activo debe valer ₡${MIN_UNIT_VALUE.toLocaleString()} o más`,
        icon: "error",
      });
      return;
    }

    if (data.initialCost <= 0) {
      Swal.fire({
        title: "Error",
        text: "El costo debe ser mayor a cero",
        icon: "error",
      });
      return;
    }

    let action = "";
    let result;

    const loggedUser = getAuthUser();
    const reqData = {
      ...data,
      idUser: loggedUser?.idUser,
      paramLoggedIdUser: loggedUser?.idUser,
    };


    if (activeEditingId === 0) {
        result = await addAsset(reqData as AssetDataForm);
        action = 'agregado';
    } else {
        result = await updateAsset(reqData as AssetDataForm);
        action = 'editado';
    }
    

    if (result.ok) {
      const result2 = await fetchAssets();

      if (result2.logout) {
        setAuthHeader(null);
        setAuthUser(null);
        navigate("/login");
      } else {
        closeModalForm();
        reset();

        Swal.fire({
          title: `Activo ${action}`,
          text: `Se ha ${action} el activo ${reqData.name}`,
          icon: "success",
          confirmButtonColor: "#CFAD04",
          timer: 3000,
        });
      }
    } else if (result.logout) {
      setAuthHeader(null);
      setAuthUser(null);
      navigate("/login");
    }
  };

  useEffect(() => {
    if (activeEditingId) {
      const asset = assets.find((a) => a.idAsset === activeEditingId);
      if (asset) {
        setValue("idAsset", asset.idAsset);
        setValue("idUser", asset.user.idUser);
        setValue("boughtDate", asset.boughtDate);
        setValue("isDeleted", asset.isDeleted);
        setValue("name", asset.name);
        setValue("code", asset.code);
        setValue("quantity", asset.quantity);
        setValue("initialCost", asset.initialCost);
        setValue("serviceLifeYears", asset.serviceLifeYears);
      }
    }
  }, [activeEditingId]);


  useEffect(() => {
    if (quantity !== undefined && quantity < 0) setValue("quantity", 0);
    if (cost !== undefined && cost < 0) setValue("initialCost", 0);
  }, [quantity, cost]);

  return (
    <form
      onSubmit={handleSubmit(submitForm)}
      noValidate
      className="
        bg-white rounded-lg max-h-[80vh] overflow-y-auto px-4 sm:px-8 py-6 
        w-full space-y-5
      "
    >
      <legend
        className="
          uppercase text-center text-yellow text-xl sm:text-2xl font-black 
          border-b-2 border-yellow pb-2
        "
      >
        {activeEditingId ? "Actualizar activo" : "Registrar activo"}
      </legend>


      <input type="hidden" {...register("idUser")} />
      <input type="hidden" {...register("idAsset")} />
      <input type="hidden" {...register("isDeleted")} />

      <div>
        <label className="text-sm uppercase font-bold">Fecha de compra</label>
        <input
          type="date"
          className="w-full p-3 border border-gray-200 rounded-md mt-1"
          {...register("boughtDate", {
            required: "La fecha es obligatoria",
            max: {
              value: MAXDATE,
              message: `Debe ser menor o igual a ${formatDate(new Date())}`,
            },
          })}
        />
        {errors.boughtDate && (
          <ErrorForm>{errors.boughtDate.message}</ErrorForm>
        )}
      </div>

      <div>
        <label className="text-sm uppercase font-bold">Código</label>
        <input
          className="w-full p-3 border border-gray-200 rounded-md mt-1"
          type="text"
          placeholder="Ingrese el código"
          {...register("code", {
            required: "El código es obligatorio",
            maxLength: {
              value: MAXLENGTH_CODE,
              message: `Máximo ${MAXLENGTH_CODE} caracteres`,
            },
          })}
        />
        {errors.code && <ErrorForm>{errors.code.message}</ErrorForm>}
      </div>

      <div>
        <label className="text-sm uppercase font-bold">Nombre</label>
        <input
          className="w-full p-3 border border-gray-200 rounded-md mt-1"
          type="text"
          placeholder="Ingrese el nombre"
          {...register("name", {
            required: "El nombre es obligatorio",
            maxLength: {
              value: MAXLENGTH_NAME,
              message: `Máximo ${MAXLENGTH_NAME} caracteres`,
            },
          })}
        />
        {errors.name && <ErrorForm>{errors.name.message}</ErrorForm>}
      </div>

      <div>
        <label className="text-sm uppercase font-bold">Cantidad</label>
        <input
          type="number"
          min="1"
          step="1"
          className="w-full p-3 border border-gray-200 rounded-md mt-1"
          placeholder="Ingrese la cantidad"
          onWheel={(e) => e.currentTarget.blur()}
          onKeyDown={(e) => {
            if (["-", "e", "E"].includes(e.key)) e.preventDefault();
          }}
          {...register("quantity", {
            required: "La cantidad es obligatoria",
            min: { value: 1, message: "Debe ser mayor a cero" },
            valueAsNumber: true,
          })}
        />
        {errors.quantity && <ErrorForm>{errors.quantity.message}</ErrorForm>}
      </div>

      <div>
        <label className="text-sm uppercase font-bold">
          Costo unitario (mínimo ₡{MIN_UNIT_VALUE.toLocaleString()})
        </label>

        <input
          type="number"
          min={MIN_UNIT_VALUE}
          className="w-full p-3 border border-gray-200 rounded-md mt-1"
          placeholder={`Mínimo ₡${MIN_UNIT_VALUE.toLocaleString()}`}
          onWheel={(e) => e.currentTarget.blur()}
          {...register("initialCost", {
            required: "El costo unitario es obligatorio",
            min: {
              value: MIN_UNIT_VALUE,
              message: `Debe ser ≥ ₡${MIN_UNIT_VALUE.toLocaleString()}`,
            },
            valueAsNumber: true,
          })}
        />
        {errors.initialCost &&
          <ErrorForm>{errors.initialCost.message}</ErrorForm>}
      </div>


      <div>
        <label className="text-sm uppercase font-bold">Vida útil (años)</label>
        <input
          type="number"
          min="1"
          step="1"
          className="w-full p-3 border border-gray-200 rounded-md mt-1"
          placeholder="Ingrese los años de vida útil"
          onWheel={(e) => e.currentTarget.blur()}
          onKeyDown={(e) => {
            if (["-", "e", "E"].includes(e.key)) e.preventDefault();
          }}
          {...register("serviceLifeYears", {
            required: "La vida útil es obligatoria",
            min: { value: 1, message: "Debe ser mayor a cero" },
            valueAsNumber: true,
          })}
        />
        {errors.serviceLifeYears && (
          <ErrorForm>{errors.serviceLifeYears.message}</ErrorForm>
        )}
      </div>

      <input
        type="submit"
        value={activeEditingId ? "Actualizar" : "Registrar"}
        className="
          bg-yellow text-black w-full p-3 rounded-md 
          uppercase font-bold hover:bg-amber-500 mt-4 
          transition-colors cursor-pointer
        "
      />
    </form>
  );
}

export default Form;