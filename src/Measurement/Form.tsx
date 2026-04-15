import { useForm } from "react-hook-form";
import Swal from 'sweetalert2';
import { MeasurementDataForm } from "../shared/types";
import { mapMeasurementToDataForm } from "../shared/types/mapper";
import ErrorForm from "../shared/components/ErrorForm";
import useMeasurementStore from "./Store";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { getAuthUser, setAuthHeader, setAuthUser } from "../shared/utils/authentication";
import { FaSpinner } from 'react-icons/fa';

const MAXDATE = new Date().toUTCString()

function Form() {
  const navigate = useNavigate();
  const location = useLocation();
  const idClient = location.state?.idClient;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<MeasurementDataForm>({
    defaultValues: {
      idClient: idClient || undefined,
      isDeleted: 0,
    },
  });

  const {
    measurements,
    activeEditingId,
    fetchMeasurements,
    addMeasurement,
    updateMeasurement,
    closeModalForm,
  } = useMeasurementStore();

  const submitForm = async (data: MeasurementDataForm) => {
    setIsSubmitting(true);
    try {
      const loggedUser = getAuthUser();

      const reqUser = {
        ...data,
        idClient: data.idClient || idClient,
        idUser: loggedUser?.idUser,
        paramLoggedIdUser: loggedUser?.idUser,
      };

      let action = "";
      let result;

      if (activeEditingId === 0) {
        result = await addMeasurement(reqUser);
        action = "agregada";
      } else {
        result = await updateMeasurement(reqUser);
        action = "editada";
      }

      closeModalForm();
      reset();

    if (result.ok) {
      const result2 = await fetchMeasurements();

      if (result2.logout) {
        setAuthHeader(null);
        setAuthUser(null);
        navigate("/login", { replace: true });
      } else {
        await Swal.fire({
          title: `Medida ${action}`,
          text: `La medida fue ${action} correctamente`,
          icon: "success",
          confirmButtonText: "OK",
          timer: 3000,
          timerProgressBar: true,
          confirmButtonColor: "#CFAD04",
        });
      }
    }
  } finally {
    setIsSubmitting(false);
  }
  };

  // Función para calcular edad
  const calculateAge = (birthday: Date): number => {
    const today = new Date();
    const birth = new Date(birthday);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }

    return age;
  };

  const clientInfo = measurements.length > 0 
    ? {
        name: `${measurements[0].client.person.name} ${measurements[0].client.person.firstLastName}`,
        age: calculateAge(measurements[0].client.person.birthday),
      }
    : null;

  useEffect(() => {
    if (activeEditingId) {
      const selected = measurements.find(
        (m) => m.idMeasurement === activeEditingId
      );
      if (selected) {
        const formData = mapMeasurementToDataForm(selected);
        // Convertir fecha al formato YYYY-MM-DD sin problemas de zona horaria
        let formattedDate = '';
        if (formData.measurementDate) {
          // Extraer directamente del string sin crear objeto Date para evitar problemas de zona horaria
          const dateString = String(formData.measurementDate);
          formattedDate = dateString.split('T')[0]; // Toma solo YYYY-MM-DD
        }
        
        const formattedData = {
          ...formData,
          measurementDate: formattedDate
        };
        Object.entries(formattedData).forEach(([key, value]) => {
          setValue(key as any, value);
        });
      }
    }
  }, [activeEditingId]);

  return (
    <form
      onSubmit={handleSubmit(submitForm)}
      noValidate
      className="
        bg-white rounded-lg max-h-[80vh] overflow-y-auto 
        px-4 sm:px-8 py-6 w-full space-y-4
      "
    >
      <legend
        className="
          uppercase text-center text-yellow text-xl sm:text-2xl font-black 
          border-b-2 border-yellow pb-2
        "
      >
        {activeEditingId
          ? "Actualizar medida corporal"
          : "Registrar medida corporal"}
      </legend>

      {/* Información del cliente */}
      {clientInfo && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
          <div className="flex flex-wrap justify-between items-center gap-2">
            <div>
              <span className="text-sm font-semibold text-gray-600">Cliente: </span>
              <span className="text-sm font-bold text-gray-800">{clientInfo.name}</span>
            </div>
            <div className="bg-yellow/20 px-4 py-2 rounded-full">
              <span className="text-sm font-semibold text-gray-600">Edad: </span>
              <span className="text-lg font-bold text-yellow">{clientInfo.age} años</span>
            </div>
          </div>
        </div>
      )}

      <input type="hidden" {...register("idClient")} />
      <input type="hidden" {...register("isDeleted")} />
      <input type="hidden" {...register("idMeasurement")} />

      {/* Fecha de medición */}
      <div className="mb-4">
        <label className="text-xs uppercase font-bold text-gray-700">Fecha de medición</label>
        <input
          type="date"
          className="w-full p-2.5 border border-gray-300 rounded-md mt-1 text-sm"
          {...register("measurementDate", {
            required: "La fecha es obligatoria",
          })}
        />
        {errors.measurementDate && (
          <ErrorForm>{errors.measurementDate.message}</ErrorForm>
        )}
      </div>

      {/* SECCIÓN: Medidas Básicas y Composición Corporal */}
      <div className="border-t-2 border-gray-200 pt-4">
        <h3 className="text-sm font-bold uppercase text-gray-700 mb-3">
         Medidas Básicas y Composición
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Peso */}
          <div>
            <label className="text-xs uppercase font-semibold text-gray-600">Peso <span className="text-[10px] text-gray-400">(kg)</span></label>
            <input
              type="number"
              step="0.1"
              min={1}
              onWheel={(e) => e.currentTarget.blur()}
              className="w-full p-2 border border-gray-300 rounded-md mt-1 text-sm"
              {...register("weight", {
                required: "Requerido",
                min: { value: 1, message: "Debe ser mayor a 0" },
              })}
            />
            {errors.weight && (
              <ErrorForm>{errors.weight.message}</ErrorForm>
            )}
          </div>

          {/* Altura */}
          <div>
            <label className="text-xs uppercase font-semibold text-gray-600">Altura <span className="text-[10px] text-gray-400">(cm)</span></label>
            <input
              type="number"
              step="0.1"
              min={1}
              onWheel={(e) => e.currentTarget.blur()}
              className="w-full p-2 border border-gray-300 rounded-md mt-1 text-sm"
              {...register("height", {
                required: "Requerido",
                min: { value: 1, message: "Debe ser mayor a 0" },
              })}
            />
            {errors.height && (
              <ErrorForm>{errors.height.message}</ErrorForm>
            )}
          </div>

          {/* IMC (Manual) */}
          <div>
            <label className="text-xs uppercase font-semibold text-gray-600">IMC</label>
            <input
              type="number"
              step="0.1"
              min={1}
              onWheel={(e) => e.currentTarget.blur()}
              className="w-full p-2 border border-gray-300 rounded-md mt-1 text-sm"
              {...register("bmi", {
                required: "Requerido",
                min: { value: 1, message: "Debe ser mayor a 0" },
              })}
            />
            {errors.bmi && (
              <ErrorForm>{errors.bmi.message}</ErrorForm>
            )}
          </div>

          {/* Masa Muscular */}
          <div>
            <label className="text-xs uppercase font-semibold text-gray-600">Masa Musc. <span className="text-[10px] text-gray-400">(%)</span></label>
            <input
              type="number"
              step="0.1"
              min={1}
              onWheel={(e) => e.currentTarget.blur()}
              className="w-full p-2 border border-gray-300 rounded-md mt-1 text-sm"
              {...register("muscleMass", {
                required: "Requerido",
                min: { value: 1, message: "Debe ser mayor a 0" },
              })}
            />
            {errors.muscleMass && (
              <ErrorForm>{errors.muscleMass.message}</ErrorForm>
            )}
          </div>

          {/* Grasa Corporal */}
          <div>
            <label className="text-xs uppercase font-semibold text-gray-600">Grasa Corp. <span className="text-[10px] text-gray-400">(%)</span></label>
            <input
              type="number"
              step="0.1"
              min={1}
              onWheel={(e) => e.currentTarget.blur()}
              className="w-full p-2 border border-gray-300 rounded-md mt-1 text-sm"
              {...register("bodyFatPercentage", {
                required: "Requerido",
                min: { value: 1, message: "Debe ser mayor a 0" },
              })}
            />
            {errors.bodyFatPercentage && (
              <ErrorForm>{errors.bodyFatPercentage.message}</ErrorForm>
            )}
          </div>

          {/* Grasa Visceral */}
          <div>
            <label className="text-xs uppercase font-semibold text-gray-600">Grasa Visc. <span className="text-[10px] text-gray-400">(%)</span></label>
            <input
              type="number"
              step="0.1"
              min={1}
              onWheel={(e) => e.currentTarget.blur()}
              className="w-full p-2 border border-gray-300 rounded-md mt-1 text-sm"
              {...register("visceralFatPercentage", {
                required: "Requerido",
                min: { value: 1, message: "Debe ser mayor a 0" },
              })}
            />
            {errors.visceralFatPercentage && (
              <ErrorForm>{errors.visceralFatPercentage.message}</ErrorForm>
            )}
          </div>
        </div>
      </div>

      {/* SECCIÓN: Medidas del Torso */}
      <div className="border-t-2 border-gray-200 pt-4">
        <h3 className="text-sm font-bold uppercase text-gray-700 mb-3">
        Medidas del Torso
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            ["chestSize", "Pecho"],
            ["backSize", "Espalda"],
            ["waistSize", "Cintura"],
            ["hipSize", "Cadera"],
          ].map(([name, label]) => (
            <div key={name}>
              <label className="text-xs uppercase font-semibold text-gray-600">{label} <span className="text-[10px] text-gray-400">(cm)</span></label>
              <input
                type="number"
                step="0.1"
                min={1}
                onWheel={(e) => e.currentTarget.blur()}
                className="w-full p-2 border border-gray-300 rounded-md mt-1 text-sm"
                {...register(name as any, {
                  required: "Requerido",
                  min: { value: 1, message: "Debe ser mayor a 0" },
                })}
              />
              {errors[name as keyof MeasurementDataForm] && (
                <ErrorForm>
                  {errors[name as keyof MeasurementDataForm]?.message as string}
                </ErrorForm>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* SECCIÓN: Brazos */}
      <div className="border-t-2 border-gray-200 pt-4">
        <h3 className="text-sm font-bold uppercase text-gray-700 mb-3">
        Brazos
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            ["rightArmSize", "Brazo Der."],
            ["leftArmSize", "Brazo Izq."],
            ["rightForeArmSize", "Antebrazo Der."],
            ["leftForeArmSize", "Antebrazo Izq."],
          ].map(([name, label]) => (
            <div key={name}>
              <label className="text-xs uppercase font-semibold text-gray-600">{label} <span className="text-[10px] text-gray-400">(cm)</span></label>
              <input
                type="number"
                step="0.1"
                min={1}
                onWheel={(e) => e.currentTarget.blur()}
                className="w-full p-2 border border-gray-300 rounded-md mt-1 text-sm"
                {...register(name as any, {
                  required: "Requerido",
                  min: { value: 1, message: "Debe ser mayor a 0" },
                })}
              />
              {errors[name as keyof MeasurementDataForm] && (
                <ErrorForm>
                  {errors[name as keyof MeasurementDataForm]?.message as string}
                </ErrorForm>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* SECCIÓN: Piernas */}
      <div className="border-t-2 border-gray-200 pt-4">
        <h3 className="text-sm font-bold uppercase text-gray-700 mb-3">
        Piernas
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            ["rightLegSize", "Pierna Der."],
            ["leftLegSize", "Pierna Izq."],
            ["rightCalfSize", "Pantorrilla Der."],
            ["leftCalfSize", "Pantorrilla Izq."],
          ].map(([name, label]) => (
            <div key={name}>
              <label className="text-xs uppercase font-semibold text-gray-600">{label} <span className="text-[10px] text-gray-400">(cm)</span></label>
              <input
                type="number"
                step="0.1"
                min={1}
                onWheel={(e) => e.currentTarget.blur()}
                className="w-full p-2 border border-gray-300 rounded-md mt-1 text-sm"
                {...register(name as any, {
                  required: "Requerido",
                  min: { value: 1, message: "Debe ser mayor a 0" },
                })}
              />
              {errors[name as keyof MeasurementDataForm] && (
                <ErrorForm>
                  {errors[name as keyof MeasurementDataForm]?.message as string}
                </ErrorForm>
              )}
            </div>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full p-3 uppercase font-bold transition-colors flex items-center justify-center gap-2 rounded-md mt-6 ${
          isSubmitting
            ? 'bg-gray-400 cursor-not-allowed text-gray-700 opacity-50'
            : 'bg-yellow text-black hover:bg-amber-500 cursor-pointer'
        }`}
      >
        {isSubmitting ? (
          <>
            <FaSpinner className="animate-spin" />
            {activeEditingId ? "Actualizando..." : "Registrando..."}
          </>
        ) : (
          activeEditingId ? 'Actualizar' : 'Registrar'
        )}
      </button>
    </form>
  );
}

export default Form;