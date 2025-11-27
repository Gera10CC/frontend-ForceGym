import { useForm } from "react-hook-form";
import Swal from 'sweetalert2';
import { MeasurementDataForm } from "../shared/types";
import ErrorForm from "../shared/components/ErrorForm";
import useMeasurementStore from "./Store";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { getAuthUser, setAuthHeader, setAuthUser } from "../shared/utils/authentication";

const MAXDATE = new Date().toUTCString()

function Form() {
  const navigate = useNavigate();
  const location = useLocation();
  const idClient = location.state?.idClient;

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
  };

  useEffect(() => {
    if (activeEditingId) {
      const selected = measurements.find(
        (m) => m.idMeasurement === activeEditingId
      );
      if (selected) {
        Object.entries(selected).forEach(([key, value]) => {
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
        px-4 sm:px-8 py-6 w-full space-y-5
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

      <input type="hidden" {...register("idClient")} />
      <input type="hidden" {...register("isDeleted")} />
      <input type="hidden" {...register("idMeasurement")} />

      <div>
        <label className="text-sm uppercase font-bold">Fecha</label>
        <input
          type="date"
          className="w-full p-3 border border-gray-200 rounded-md mt-1"
          {...register("measurementDate", {
            required: "La fecha es obligatoria",
          })}
        />
        {errors.measurementDate && (
          <ErrorForm>{errors.measurementDate.message}</ErrorForm>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

        {[
          ["weight", "Peso (kg)"],
          ["height", "Altura (cm)"],
          ["muscleMass", "Masa muscular (%)"],
          ["bodyFatPercentage", "Grasa corporal (%)"],
          ["visceralFatPercentage", "Grasa visceral (%)"],
          ["chestSize", "Pecho (cm)"],
          ["backSize", "Espalda (cm)"],
          ["hipSize", "Cadera (cm)"],
          ["waistSize", "Cintura (cm)"],
          ["leftLegSize", "Pierna izquierda"],
          ["rightLegSize", "Pierna derecha"],
          ["leftCalfSize", "Pantorrilla izquierda"],
          ["rightCalfSize", "Pantorrilla derecha"],
          ["leftForeArmSize", "Antebrazo izquierdo"],
          ["rightForeArmSize", "Antebrazo derecho"],
          ["leftArmSize", "Brazo izquierdo"],
          ["rightArmSize", "Brazo derecho"],
        ].map(([name, label]) => (
          <div key={name}>
            <label className="text-sm uppercase font-bold">{label}</label>
            <input
              type="number"
              min={1}
              onWheel={(e) => e.currentTarget.blur()}
              className="w-full p-3 border border-gray-200 rounded-md mt-1"
              {...register(name as any, {
                required: `${label} es obligatorio`,
                min: { value: 1, message: "Debe ser mayor a cero" },
              })}
            />
            {errors[name as keyof MeasurementDataForm] && (
              <ErrorForm>
                {
                  errors[name as keyof MeasurementDataForm]
                    ?.message as string
                }
              </ErrorForm>
            )}
          </div>
        ))}
      </div>

      <input
        type="submit"
        value={activeEditingId ? "Actualizar" : "Registrar"}
        className="
          bg-yellow text-black w-full p-3 rounded-md 
          uppercase font-bold hover:bg-amber-500 mt-6 
          transition-colors cursor-pointer
        "
      />
    </form>
  );
}

export default Form;