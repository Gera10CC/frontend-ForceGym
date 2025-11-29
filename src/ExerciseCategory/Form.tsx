import { useForm } from "react-hook-form";
import Swal from 'sweetalert2';
import { ExerciseCategory } from "../shared/types";
import ErrorForm from "../shared/components/ErrorForm";
import useExerciseCategoryStore from "./Store";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { getAuthUser, setAuthHeader, setAuthUser } from "../shared/utils/authentication";

const MAXLENGTH_NAME = 127;

function FormExerciseCategory() {
  const navigate = useNavigate();
  const { register, handleSubmit, setValue, formState: { errors }, reset } = useForm<ExerciseCategory>();
  const {
    categories,
    activeEditingId,
    fetchExerciseCategories,
    addExerciseCategory,
    updateExerciseCategory,
    closeModalForm
  } = useExerciseCategoryStore();

  const submitForm = async (data: ExerciseCategory) => {
    const loggedUser = getAuthUser();

    if (!loggedUser) {
      setAuthHeader(null);
      setAuthUser(null);
      navigate("/login");
      return;
    }

    const reqData = {
      ...data,
      paramLoggedIdUser: loggedUser.idUser,
      idUser: loggedUser.idUser,
    };

    let result;
    const isEditing = activeEditingId !== 0;
    const actionText = isEditing ? "actualizada" : "agregada";

    result = isEditing
      ? await updateExerciseCategory(reqData)
      : await addExerciseCategory(reqData);

    closeModalForm();
    reset();

    if (result.ok) {
      const result2 = await fetchExerciseCategories();

      if (result2.logout) {
        setAuthHeader(null);
        setAuthUser(null);
        navigate('/login');
        return;
      }

      Swal.fire({
        title: `Categoría ${actionText}`,
        text: `Se ha ${actionText} la categoría ${reqData.name}`,
        icon: 'success',
        confirmButtonText: 'OK',
        timer: 3000,
        timerProgressBar: true,
        width: 500,
        confirmButtonColor: '#CFAD04'
      });
    } else if (result.logout) {
      setAuthHeader(null);
      setAuthUser(null);
      navigate("/login");
    }
  };

  useEffect(() => {
    if (activeEditingId !== 0) {
      const category = categories.find(cat => cat.idExerciseCategory === activeEditingId);
      if (category) {
        setValue("idExerciseCategory", category.idExerciseCategory);
        setValue("name", category.name);
        setValue("isDeleted", category.isDeleted)
      }
    }
  }, [activeEditingId]);

  return (
    <form
      className="bg-white rounded-lg px-5 mb-10 overflow-scroll"
      noValidate
      onSubmit={handleSubmit(submitForm)}
    >
      <legend className="uppercase text-center text-yellow text-2xl font-black border-b-2 py-2 border-yellow">
        {activeEditingId ? "Actualizar categoría" : "Registrar categoría"}
      </legend>

      <input type="hidden" {...register("idExerciseCategory")} />
      <input type="hidden" {...register("isDeleted")} />

      <div className="mb-5">
        <label htmlFor="name" className="text-sm uppercase font-bold">
          Nombre
        </label>
        <input
          id="name"
          className="w-full p-3 border border-gray-100"
          type="text"
          placeholder="Ingrese el nombre"
          {...register("name", {
            required: "El nombre es obligatorio",
            maxLength: {
              value: MAXLENGTH_NAME,
              message: `Máximo ${MAXLENGTH_NAME} caracteres`
            }
          })}
        />
        {errors.name && <ErrorForm>{errors.name.message}</ErrorForm>}
      </div>

      <input
        type="submit"
        className="bg-yellow w-full p-3 text-white uppercase font-bold hover:bg-amber-600 cursor-pointer transition-colors"
        value={activeEditingId ? "Actualizar" : "Registrar"}
      />
    </form>
  );
}

export default FormExerciseCategory;
