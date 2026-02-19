import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { ExerciseDataForm } from "../shared/types";
import ErrorForm from "../shared/components/ErrorForm";
import useExerciseStore from "./Store";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { getAuthUser, setAuthHeader, setAuthUser } from "../shared/utils/authentication";
import { useCommonDataStore } from "../shared/CommonDataStore";

const MAXLENGTH_NAME = 100;
const MINLENGTH_NAME = 3;
const MAXLENGTH_DESCRIPTION = 255;
const MINLENGTH_DESCRIPTION = 5;

function FormExercise() {
  const navigate = useNavigate();
  const { exerciseCategories, exerciseDifficulty } = useCommonDataStore();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<ExerciseDataForm>();

  const {
    exercises,
    activeEditingId,
    fetchExercises,
    addExercise,
    updateExercise,
    closeModalForm,
  } = useExerciseStore();

  const submitForm = async (data: ExerciseDataForm) => {
    const loggedUser = getAuthUser();

    if (!loggedUser) {
      setAuthHeader(null);
      setAuthUser(null);
      navigate("/login");
      return;
    }

    const request = {
      ...data,
      idUser: loggedUser.idUser,
      paramLoggedIdUser: loggedUser.idUser,
    };

    const isEditing = activeEditingId !== 0;
    const actionText = isEditing ? "actualizado" : "agregado";

    const result = isEditing
      ? await updateExercise(request)
      : await addExercise(request);

    if (result.ok) {
      const res2 = await fetchExercises();

      if (res2.logout) {
        setAuthHeader(null);
        setAuthUser(null);
        navigate("/login");
        return;
      }

      closeModalForm();
      reset();

      Swal.fire({
        title: `Ejercicio ${actionText}`,
        text: `Se ha ${actionText} el ejercicio "${request.name}"`,
        icon: "success",
        timer: 3000,
        confirmButtonColor: "#CFAD04",
      });

    } else if (result.logout) {
      setAuthHeader(null);
      setAuthUser(null);
      navigate("/login");
    } else {
      Swal.fire({
        title: "Error al guardar",
        text: result.error || result.message || "Ocurrió un error al guardar el ejercicio.",
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#CFAD04",
      });
    }
  };

  useEffect(() => {
    if (activeEditingId !== 0) {
      const exercise = exercises.find((x) => x.idExercise === activeEditingId);

      if (exercise) {
        setValue("idExercise", exercise.idExercise);
        setValue("name", exercise.name);
        setValue("description", exercise.description);
        setValue("videoUrl", exercise.videoUrl || "");
        setValue("idExerciseDifficulty", exercise.exerciseDifficulty?.idExerciseDifficulty);
        setValue("idExerciseCategory", exercise.exerciseCategory?.idExerciseCategory);
        setValue("isDeleted", exercise.isDeleted);
      }
    }
  }, [activeEditingId, exercises]);

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
        {activeEditingId ? "Actualizar ejercicio" : "Registrar ejercicio"}
      </legend>

      <input type="hidden" {...register("idExercise")} />
      <input type="hidden" {...register("idUser")} />
      <input type="hidden" {...register("isDeleted")} />

      <div>
        <label className="text-sm uppercase font-bold">Nombre</label>
        <input
          type="text"
          placeholder="Nombre del ejercicio"
          className="w-full p-3 border border-gray-200 rounded-md mt-1"
          {...register("name", {
            required: "El nombre es obligatorio",
            minLength: { value: MINLENGTH_NAME, message: `Mínimo ${MINLENGTH_NAME} caracteres` },
            maxLength: { value: MAXLENGTH_NAME, message: `Máximo ${MAXLENGTH_NAME} caracteres` },
          })}
        />
        {errors.name && <ErrorForm>{errors.name.message}</ErrorForm>}
      </div>

      <div>
        <label className="text-sm uppercase font-bold">Descripción</label>
        <input
          type="text"
          placeholder="Descripción del ejercicio"
          className="w-full p-3 border border-gray-200 rounded-md mt-1"
          {...register("description", {
            required: "La descripción es obligatoria",
            minLength: {
              value: MINLENGTH_DESCRIPTION,
              message: `Mínimo ${MINLENGTH_DESCRIPTION} caracteres`,
            },
            maxLength: {
              value: MAXLENGTH_DESCRIPTION,
              message: `Máximo ${MAXLENGTH_DESCRIPTION} caracteres`,
            },
          })}
        />
        {errors.description && <ErrorForm>{errors.description.message}</ErrorForm>}
      </div>

      <div>
        <label className="text-sm uppercase font-bold">
          URL del Video <span className="text-gray-500 text-xs normal-case">(Opcional)</span>
        </label>
        <input
          type="text"
          placeholder="https://www.youtube.com/watch?v=... o https://vimeo.com/..."
          className="w-full p-3 border border-gray-200 rounded-md mt-1"
          {...register("videoUrl", {
            pattern: {
              value: /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/|vimeo\.com\/|dai\.ly\/|dailymotion\.com\/video\/)[^\s]+$/,
              message: "URL inválida. Use YouTube, Vimeo o Dailymotion"
            },
          })}
        />
        {errors.videoUrl && <ErrorForm>{errors.videoUrl.message}</ErrorForm>}
        <p className="text-xs text-gray-500 mt-1">
          Puedes agregar un enlace a un video tutorial del ejercicio
        </p>
      </div>

      <div>
        <label className="text-sm uppercase font-bold">Dificultad</label>
        <select
          className="w-full p-3 border border-gray-200 rounded-md mt-1"
          {...register("idExerciseDifficulty", {
            required: "La dificultad es obligatoria",
          })}
        >
          <option value="">Seleccione dificultad</option>
          {exerciseDifficulty.map((d) => (
            <option key={d.idExerciseDifficulty} value={d.idExerciseDifficulty}>
              {d.difficulty}
            </option>
          ))}
        </select>
        {errors.idExerciseDifficulty && (
          <ErrorForm>{errors.idExerciseDifficulty.message}</ErrorForm>
        )}
      </div>

      <div>
        <label className="text-sm uppercase font-bold">Categoría</label>
        <select
          className="w-full p-3 border border-gray-200 rounded-md mt-1"
          {...register("idExerciseCategory", {
            required: "La categoría es obligatoria",
          })}
        >
          <option value="">Seleccione categoría</option>
          {exerciseCategories.map((c) => (
            <option key={c.idExerciseCategory} value={c.idExerciseCategory}>
              {c.name}
            </option>
          ))}
        </select>
        {errors.idExerciseCategory && (
          <ErrorForm>{errors.idExerciseCategory.message}</ErrorForm>
        )}
      </div>

      <input
        type="submit"
        value={activeEditingId ? "Actualizar" : "Registrar"}
        className="
          bg-yellow text-black w-full p-3 rounded-md uppercase font-bold 
          hover:bg-amber-500 mt-4 cursor-pointer transition-colors
        "
      />
    </form>
  );
}

export default FormExercise;