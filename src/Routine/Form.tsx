import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import Select from "react-select";
import clsx from "clsx";

import {
  ExerciseCategory,
  RoutineDataForm,
  RoutineWithExercisesDTO,
} from "../shared/types";
import ErrorForm from "../shared/components/ErrorForm";
import {
  getAuthUser,
  setAuthHeader,
  setAuthUser,
} from "../shared/utils/authentication";
import useRoutineStore from "./Store";
import { useCommonDataStore } from "../shared/CommonDataStore";

type SelectedExercise = {
  idExercise: number;
  name: string;
  series: number;
  repetitions: number;
  note: string;
  category: string;
  categoryId: number;
};

type ClientOption = {
  value: number;
  label: string;
};

function Form() {
  const navigate = useNavigate();

  const {
    difficultyRoutines,
    exercise,
    exerciseCategories,
    fetchExerciseCategories,
    allClients,
    fetchAllClients,
  } = useCommonDataStore();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<RoutineDataForm>();

  const {
    activeEditingId,
    routineToEdit,
    fetchRoutines,
    addRoutine,
    updateRoutine,
    closeModalForm,
  } = useRoutineStore();

  const [selectedExercises, setSelectedExercises] = useState<SelectedExercise[]>([]);
  const [selectedClients, setSelectedClients] = useState<ClientOption[]>([]);
  const [loading, setLoading] = useState(true);

  const [draggedCategoryId, setDraggedCategoryId] = useState<number | null>(null);
  const [dragOverCategoryId, setDragOverCategoryId] = useState<number | null>(null);
  const [orderedCategories, setOrderedCategories] = useState(exerciseCategories);


  const handleDragStart = (categoryId: number) => setDraggedCategoryId(categoryId);

  const handleDragOver = (
    e: React.DragEvent<HTMLDivElement>,
    categoryId: number
  ) => {
    e.preventDefault();
    if (categoryId !== dragOverCategoryId) {
      setDragOverCategoryId(categoryId);
    }
  };

  const handleDragLeave = () => setDragOverCategoryId(null);

  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>,
    targetCategoryId: number
  ) => {
    e.preventDefault();

    if (!draggedCategoryId || draggedCategoryId === targetCategoryId) {
      setDragOverCategoryId(null);
      setDraggedCategoryId(null);
      return;
    }

    setOrderedCategories((prev) => {
      const draggedIndex = prev.findIndex(
        (c) => c.idExerciseCategory === draggedCategoryId
      );
      const targetIndex = prev.findIndex(
        (c) => c.idExerciseCategory === targetCategoryId
      );

      if (draggedIndex === -1 || targetIndex === -1) return prev;

      const newCategories = [...prev];
      const [removed] = newCategories.splice(draggedIndex, 1);
      newCategories.splice(targetIndex, 0, removed);

      return newCategories;
    });

    setDragOverCategoryId(null);
    setDraggedCategoryId(null);
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        await Promise.all([
          fetchExerciseCategories(),
          fetchAllClients(),
          fetchRoutines(),
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    if (exerciseCategories.length > 0) {
      const initialExercises = exerciseCategories.map((category) => ({
        idExercise: 0,
        name: "",
        series: 0,
        repetitions: 0,
        note: "",
        category: category.name,
        categoryId: category.idExerciseCategory,
      }));
      setSelectedExercises(initialExercises);
      setOrderedCategories(exerciseCategories);
    }
  }, [exerciseCategories]);

  useEffect(() => {
    if (activeEditingId && !loading && routineToEdit && exercise.length > 0) {

      setValue("idRoutine", routineToEdit.idRoutine);
      setValue("name", routineToEdit.name);
      setValue(
        "idDifficultyRoutine",
        routineToEdit.difficultyRoutine?.idDifficultyRoutine || 0
      );
      setValue("idUser", getAuthUser()?.idUser || 0);
      setValue("isDeleted", routineToEdit.isDeleted ?? 0);

      if (routineToEdit.assignments?.length > 0) {
        const clientOptions = routineToEdit.assignments.map((assignment) => {
          const client = allClients.find(c => c.value === assignment.idClient);
          return {
            value: assignment.idClient,
            label: client ? `${client.label}` : `Cliente ${assignment.idClient}`
          };
        });
        setSelectedClients(clientOptions);
      }


      if (routineToEdit.exercises?.length > 0) {

        const usedCategories = routineToEdit.exercises.reduce((acc, ex) => {
          const exData = exercise.find(e => e.idExercise === ex.idExercise);
          const category = exData?.exerciseCategory;
          if (
            category &&
            !acc.some(c => c.idExerciseCategory === category.idExerciseCategory)
          ) {
            acc.push(category);
          }
          return acc;
        }, [] as ExerciseCategory[]);

        const sortedUsedCategories = [...usedCategories].sort((a, b) => {
          const minA = Math.min(
            ...routineToEdit.exercises
              .filter(ex => {
                const exData = exercise.find(e => e.idExercise === ex.idExercise);
                return exData?.exerciseCategory?.idExerciseCategory === a.idExerciseCategory;
              })
              .map(ex => ex.categoryOrder)
          );

          const minB = Math.min(
            ...routineToEdit.exercises
              .filter(ex => {
                const exData = exercise.find(e => e.idExercise === ex.idExercise);
                return exData?.exerciseCategory?.idExerciseCategory === b.idExerciseCategory;
              })
              .map(ex => ex.categoryOrder)
          );

          return minA - minB;
        });

        const unusedCategories = exerciseCategories.filter(
          cat => !usedCategories.some(used => used.idExerciseCategory === cat.idExerciseCategory)
        );

        setOrderedCategories([...sortedUsedCategories, ...unusedCategories]);

        const loadedExercises = routineToEdit.exercises.map(ex => {
          const exData = exercise.find(e => e.idExercise === ex.idExercise);
          const category = exData?.exerciseCategory;

          return {
            idExercise: ex.idExercise,
            name: exData?.name || `Ejercicio ${ex.idExercise}`,
            series: ex.series || 0,
            repetitions: ex.repetitions || 0,
            note: ex.note || "",
            category: category?.name || "",
            categoryId: category?.idExerciseCategory || 0
          };
        });

        const emptyCategories = unusedCategories.map(cat => ({
          idExercise: 0,
          name: "",
          series: 0,
          repetitions: 0,
          note: "",
          category: cat.name,
          categoryId: cat.idExerciseCategory
        }));

        setSelectedExercises([...loadedExercises, ...emptyCategories]);
      }

    } else if (!activeEditingId && !loading) {
      resetForm();
    }
  }, [
    activeEditingId,
    loading,
    routineToEdit,
    setValue,
    exercise,
    exerciseCategories,
    allClients
  ]);


  const resetForm = () => {
    reset({
      idRoutine: 0,
      name: "",
      idDifficultyRoutine: 0,
      idUser: getAuthUser()?.idUser || 0,
      isDeleted: 0,
    });
    setSelectedClients([]);
  };


  const submitForm = async (data: RoutineDataForm) => {
    const loggedUser = getAuthUser();

    if (selectedClients.length === 0) {
      return Swal.fire("Error", "Debe seleccionar al menos un cliente", "error");
    }

    const validExercises = selectedExercises.filter(
      (ex) => ex.idExercise > 0
    );

    if (validExercises.length === 0) {
      return Swal.fire(
        "Error",
        "Debe agregar al menos un ejercicio válido",
        "error"
      );
    }

    const invalidExercises = validExercises.filter(
      (ex) => ex.series <= 0 || ex.repetitions <= 0
    );

    if (invalidExercises.length > 0) {
      return Swal.fire({
        title: "Error en ejercicios",
        text: "Todos los ejercicios deben tener series y repeticiones mayores a 0",
        icon: "error",
        confirmButtonColor: "#CFAD04",
      });
    }

    const reqRoutine: RoutineWithExercisesDTO = {
      name: data.name,
      date: new Date().toISOString(),
      idUser: loggedUser?.idUser || 0,
      difficultyRoutine: {
        idDifficultyRoutine: data.idDifficultyRoutine,
      },
      exercises: orderedCategories.flatMap((category, index) => {
        return selectedExercises
          .filter(
            (ex) =>
              ex.categoryId === category.idExerciseCategory &&
              ex.idExercise > 0
          )
          .map((ex) => ({
            idExercise: ex.idExercise,
            series: ex.series,
            repetitions: ex.repetitions,
            note: ex.note,
            categoryOrder: index,
          }));
      }),
      assignments: selectedClients.map((client) => ({
        idClient: client.value,
        assignmentDate: new Date().toISOString(),
      })),
      isDeleted: 0,
      paramLoggedIdUser: loggedUser?.idUser,
    };

    try {
      const isEditing = activeEditingId !== null && activeEditingId !== 0;
      const result = isEditing
        ? await updateRoutine({ ...reqRoutine, idRoutine: activeEditingId })
        : await addRoutine(reqRoutine);

      if (result?.ok) {
        await fetchRoutines();
        await Swal.fire("Éxito", "Rutina guardada correctamente", "success");
        closeModalForm();
        resetForm();
      } else if (result?.logout) {
        handleLogout();
      }
    } catch (error) {
      Swal.fire("Error", "Ocurrió un error al guardar la rutina", "error");
    }
  };

  const handleLogout = () => {
    setAuthHeader(null);
    setAuthUser(null);
    navigate("/login", { replace: true });
  };

  const handleExerciseChange = (index: number, value: number) => {
    setSelectedExercises((prev) => {
      const copy = [...prev];
      copy[index].idExercise = value;
      return copy;
    });
  };

  const updateExerciseField = (
    index: number,
    field: "series" | "repetitions" | "note",
    value: number | string
  ) => {
    setSelectedExercises((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const getExercisesForCategory = (categoryId: number) => {
    return selectedExercises
      .map((ex, i) => ({ ...ex, index: i }))
      .filter((ex) => ex.categoryId === categoryId);
  };

  return (
    <form
      onSubmit={handleSubmit(submitForm)}
      noValidate
      className="
        bg-white rounded-lg 
        max-h-[80vh] overflow-y-auto
        px-4 sm:px-8 py-6 
        w-full space-y-6
      "
    >
      <legend
        className="
          uppercase text-center text-yellow 
          text-xl sm:text-2xl font-black 
          border-b-2 border-yellow pb-2
        "
      >
        {activeEditingId ? "Actualizar Rutina" : "Crear Rutina"}
      </legend>

      <input type="hidden" {...register("idRoutine")} />
      <input type="hidden" {...register("idUser")} />
      <input type="hidden" {...register("isDeleted")} />

      <div>
        <label className="text-sm uppercase font-bold">Clientes</label>
        <Select
          className="mt-1"
          options={allClients}
          value={selectedClients}
          onChange={(v) => setSelectedClients(v as ClientOption[])}
          isMulti
          placeholder="Seleccione los clientes"
          isDisabled={loading}
        />
      </div>

      <div>
        <label className="text-sm uppercase font-bold">Dificultad</label>
        <select
          className="w-full p-3 border border-gray-200 rounded-md mt-1"
          {...register("idDifficultyRoutine", {
            required: "Debe seleccionar dificultad",
          })}
        >
          <option value={0}>Seleccione</option>
          {difficultyRoutines.map((d) => (
            <option key={d.idDifficultyRoutine} value={d.idDifficultyRoutine}>
              {d.name}
            </option>
          ))}
        </select>
        {errors.idDifficultyRoutine && (
          <ErrorForm>{errors.idDifficultyRoutine.message}</ErrorForm>
        )}
      </div>


      <div>
        <label className="text-sm uppercase font-bold">Nombre</label>
        <input
          className="w-full p-3 border border-gray-200 rounded-md mt-1"
          {...register("name", { required: "El nombre es obligatorio" })}
        />
        {errors.name && <ErrorForm>{errors.name.message}</ErrorForm>}
      </div>


      <div className="mb-8 w-full">
        <h2 className="text-lg font-bold mb-4 text-yellow">Ejercicios</h2>

        {orderedCategories.map((category) => {
          const categoryExercises = getExercisesForCategory(
            category.idExerciseCategory
          );
          const isDragged =
            draggedCategoryId === category.idExerciseCategory;
          const isDragOver =
            dragOverCategoryId === category.idExerciseCategory;

          return (
            <div
              key={category.idExerciseCategory}
              draggable
              onDragStart={() =>
                handleDragStart(category.idExerciseCategory)
              }
              onDragOver={(e) =>
                handleDragOver(e, category.idExerciseCategory)
              }
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, category.idExerciseCategory)}
              className={clsx(
                "mb-8 border rounded-lg p-3 sm:p-4 w-full transition-all duration-200",
                isDragged
                  ? "opacity-20 bg-gray-200"
                  : isDragOver
                    ? "border-yellow-500 border-2 bg-yellow-50"
                    : "border-gray-300 bg-gray-50"
              )}
            >
              <h3 className="text-md font-bold mb-3">{category.name}</h3>

              {categoryExercises.map(({ index, ...ex }) => (
                <div key={index} className="mb-4">
                  <div className="flex flex-col sm:flex-row sm:items-end gap-4">
                    <div className="flex-1">
                      <select
                        className="w-full p-2 border rounded"
                        value={ex.idExercise}
                        onChange={(e) =>
                          handleExerciseChange(
                            index,
                            Number(e.target.value)
                          )
                        }
                      >
                        <option value="0">Seleccione ejercicio</option>
                        {exercise
                          .filter(
                            (e) =>
                              e.exerciseCategory?.idExerciseCategory ===
                              category.idExerciseCategory
                          )
                          .map((opt) => (
                            <option
                              key={opt.idExercise}
                              value={opt.idExercise}
                            >
                              {opt.name}
                            </option>
                          ))}
                      </select>
                    </div>

                    <div className="flex gap-3 w-full sm:w-auto">

                      <input
                        type="number"
                        inputMode="numeric"
                        min="1"
                        className="
                        w-[70px] sm:w-[80px] p-2 border rounded text-center
                        appearance-none"
                        placeholder="1"
                        value={ex.series === 0 ? "" : ex.series}
                        onWheel={(e) => e.currentTarget.blur()} 
                        onKeyDown={(e) => {
                          if (e.key === "-" || e.key === "e" || e.key === "E") e.preventDefault(); 
                        }}
                        onChange={(e) => {
                          const value = Number(e.target.value);
                          updateExerciseField(
                            index,
                            "series",
                            isNaN(value) ? 0 : Math.max(1, value) 
                          );
                        }}
                      />

                      <input
                        type="number"
                        inputMode="numeric"
                        min="1"
                        className="
                          w-[70px] sm:w-[80px] p-2 border rounded text-center
                          appearance-none"
                        placeholder="1"
                        value={ex.repetitions === 0 ? "" : ex.repetitions}
                        onWheel={(e) => e.currentTarget.blur()}
                        onKeyDown={(e) => {
                          if (e.key === "-" || e.key === "e" || e.key === "E") e.preventDefault();
                        }}
                        onChange={(e) => {
                          const value = Number(e.target.value);
                          updateExerciseField(
                            index,
                            "repetitions",
                            isNaN(value) ? 0 : Math.max(1, value)
                          );
                        }}
                      />

                      <input
                        type="text"
                        className="w-full sm:w-[120px] p-2 border rounded text-center"
                        value={ex.note}
                        onChange={(e) =>
                          updateExerciseField(
                            index,
                            "note",
                            e.target.value
                          )
                        }
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>

      <input
        type="submit"
        value={activeEditingId ? "Actualizar" : "Crear"}
        className="
          bg-yellow text-black w-full p-3 rounded-md 
          uppercase font-bold hover:bg-amber-500 mt-4 
          transition-colors cursor-pointer disabled:opacity-50
        "
        disabled={loading}
      />
    </form>
  );
}

export default Form;