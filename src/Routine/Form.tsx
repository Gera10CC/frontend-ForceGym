import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import Select from 'react-select';
import { FaChevronUp, FaChevronDown } from 'react-icons/fa';
import { ExerciseCategory, RoutineDataForm, RoutineWithExercisesDTO } from "../shared/types";
import ErrorForm from "../shared/components/ErrorForm";
import { getAuthUser, setAuthHeader, setAuthUser } from "../shared/utils/authentication";
import useRoutineStore from "./Store";
import { useCommonDataStore } from "../shared/CommonDataStore";
import clsx from "clsx";
import SearchSelect from "../shared/components/SearchSelect";

type SelectedExercise = {
  idExercise: number;
  name: string;
  series: number;
  repetitions: number | string;
  note: string;
  category: string;
  categoryId: number;
  dayNumber: number;
  categoryOrder?: number;
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
    fetchAllClients
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
    closeModalForm
  } = useRoutineStore();

  const [selectedExercises, setSelectedExercises] = useState<SelectedExercise[]>([]);
  const [selectedClients, setSelectedClients] = useState<ClientOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [orderedCategories, setOrderedCategories] = useState<ExerciseCategory[]>([]);
  const [numberOfDays, setNumberOfDays] = useState<number>(1);
  const [activeDay, setActiveDay] = useState<number>(1);
  // Estado para trackear qué categorías están agregadas a cada día
  const [categoriesByDay, setCategoriesByDay] = useState<Record<number, number[]>>({ 1: [] });

  // Agregar categoría a un día específico
  const addCategoryToDay = (dayNumber: number, categoryId: number) => {
    const currentCategories = categoriesByDay[dayNumber] || [];
    
    // Verificar si la categoría ya está agregada
    if (currentCategories.includes(categoryId)) {
      Swal.fire({
        icon: 'info',
        title: 'Categoría ya agregada',
        text: 'Esta categoría ya está en este día',
        confirmButtonColor: '#CFAD04'
      });
      return;
    }

    // Agregar categoría al día
    setCategoriesByDay(prev => ({
      ...prev,
      [dayNumber]: [...currentCategories, categoryId]
    }));

    // Agregar ejercicio vacío para esta categoría en este día
    const category = exerciseCategories.find(c => c.idExerciseCategory === categoryId);
    if (category) {
      const categoryOrder = currentCategories.length; // El nuevo índice es la longitud actual
      const newExercise: SelectedExercise = {
        idExercise: 0,
        name: "",
        series: 0,
        repetitions: 0,
        note: "",
        category: category.name,
        categoryId: category.idExerciseCategory,
        dayNumber: dayNumber,
        categoryOrder: categoryOrder
      };
      
      setSelectedExercises(prev => [...prev, newExercise]);
    }
  };

  // Remover categoría de un día específico
  const removeCategoryFromDay = (dayNumber: number, categoryId: number) => {
    Swal.fire({
      title: '¿Eliminar categoría?',
      text: 'Se eliminarán todos los ejercicios de esta categoría en este día',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#CFAD04'
    }).then((result) => {
      if (result.isConfirmed) {
        // Remover categoría del tracking
        setCategoriesByDay(prev => ({
          ...prev,
          [dayNumber]: (prev[dayNumber] || []).filter(id => id !== categoryId)
        }));

        // Remover ejercicios de esta categoría en este día
        setSelectedExercises(prev =>
          prev.filter(ex => !(ex.categoryId === categoryId && ex.dayNumber === dayNumber))
        );
      }
    });
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        await Promise.all([
          fetchExerciseCategories(),
          fetchAllClients(),
          fetchRoutines()
        ]);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [fetchExerciseCategories, fetchAllClients, fetchRoutines]);

  // Ya no agregamos categorías automáticamente
  useEffect(() => {
    if (activeEditingId && !loading && routineToEdit && exercise.length > 0) {
      setValue('idRoutine', routineToEdit.idRoutine);
      setValue('name', routineToEdit.name);
      setValue('idDifficultyRoutine', routineToEdit.difficultyRoutine?.idDifficultyRoutine || 0);

      if (routineToEdit.assignments?.length > 0) {
        const clientOptions = routineToEdit.assignments.map(assignment => {
          const client = allClients.find(c => c.value === assignment.idClient);
          return {
            value: assignment.idClient,
            label: client ? `${client.label}` : `Cliente ${assignment.idClient}`
          };
        });
        setSelectedClients(clientOptions);
      }

      if (routineToEdit.exercises?.length > 0 && exercise.length > 0) {
        const usedCategories = routineToEdit.exercises.reduce((acc, ex) => {
          const exerciseData = exercise.find(e => e.idExercise === ex.idExercise);
          const category = exerciseData?.exerciseCategory;
          if (category && !acc.some(c => c.idExerciseCategory === category.idExerciseCategory)) {
            acc.push(category);
          }
          return acc;
        }, [] as ExerciseCategory[]);

        // 2. Ordenar categorías usadas según su MIN categoryOrder
        const sortedUsedCategories = [...usedCategories].sort((a, b) => {
          const minOrderA = Math.min(
            ...routineToEdit.exercises
              .filter(ex => {
                const exData = exercise.find(e => e.idExercise === ex.idExercise);
                return exData?.exerciseCategory?.idExerciseCategory === a.idExerciseCategory;
              })
              .map(ex => ex.categoryOrder)
          );

          const minOrderB = Math.min(
            ...routineToEdit.exercises
              .filter(ex => {
                const exData = exercise.find(e => e.idExercise === ex.idExercise);
                return exData?.exerciseCategory?.idExerciseCategory === b.idExerciseCategory;
              })
              .map(ex => ex.categoryOrder)
          );

          return minOrderA - minOrderB;
        });

        const unusedCategories = exerciseCategories.filter(
          cat => !usedCategories.some(used => used.idExerciseCategory === cat.idExerciseCategory)
        );

        setOrderedCategories([...sortedUsedCategories, ...unusedCategories]);

        const loadedExercises = routineToEdit.exercises.map(ex => {
          const exerciseData = exercise.find(e => e.idExercise === ex.idExercise);
          const category = exerciseData?.exerciseCategory;

          return {
            idExercise: ex.idExercise,
            name: exerciseData?.name || `Ejercicio ${ex.idExercise}`,
            series: ex.series || 0,
            repetitions: ex.repetitions || 0,
            note: ex.note || "Sin nota",
            category: category?.name || "Sin categoría",
            categoryId: category?.idExerciseCategory || 0,
            dayNumber: ex.dayNumber || 1,
            categoryOrder: ex.categoryOrder
          };
        });

        // Calcular el número máximo de días
        const maxDay = Math.max(...loadedExercises.map(ex => ex.dayNumber), 1);
        setNumberOfDays(maxDay);

        // Configurar categoriesByDay basado en las categorías usadas por día, ordenadas por categoryOrder
        const categoriesPerDay: Record<number, number[]> = {};
        for (let day = 1; day <= maxDay; day++) {
          const exercisesInDay = loadedExercises.filter(ex => ex.dayNumber === day);
          
          // Obtener las categorías únicas con su categoryOrder mínimo
          const categoryOrderMap = new Map<number, number>();
          exercisesInDay.forEach(ex => {
            const currentMin = categoryOrderMap.get(ex.categoryId);
            if (currentMin === undefined || ex.categoryOrder! < currentMin) {
              categoryOrderMap.set(ex.categoryId, ex.categoryOrder!);
            }
          });
          
          // Ordenar las categorías por su categoryOrder
          const sortedCategories = Array.from(categoryOrderMap.entries())
            .sort((a, b) => a[1] - b[1])
            .map(entry => entry[0]);
          
          categoriesPerDay[day] = sortedCategories;
        }
        setCategoriesByDay(categoriesPerDay);

        // Ordenar las categorías según su uso
        setOrderedCategories(sortedUsedCategories);

        setSelectedExercises(loadedExercises);
      }
    } else if (
      !activeEditingId &&
      !loading &&
      routineToEdit === null
    ) {
      resetForm();
    }
  }, [activeEditingId, loading, routineToEdit, setValue, exercise, allClients]);

  const submitForm = async (data: RoutineDataForm) => {
    const loggedUser = getAuthUser();

    if (selectedClients.length === 0) {
      Swal.fire({
        title: 'Error',
        text: 'Debe seleccionar al menos un cliente',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#CFAD04'
      });
      return;
    }

    const validExercises = selectedExercises.filter(ex => ex.idExercise > 0);
    if (validExercises.length === 0) {
      Swal.fire({
        title: 'Error',
        text: 'Debe agregar al menos un ejercicio válido',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#CFAD04'
      });
      return;
    }

    const invalidExercises = validExercises.filter(ex => {
      const hasInvalidSeries = ex.series <= 0;
      const hasInvalidReps = typeof ex.repetitions === 'number' ? ex.repetitions <= 0 : ex.repetitions.trim() === '';
      return hasInvalidSeries || hasInvalidReps;
    });

    if (invalidExercises.length > 0) {
      const htmlList = invalidExercises.map(ex => {
        const errors = [];
        if (ex.series <= 0) errors.push('Series');
        const hasInvalidReps = typeof ex.repetitions === 'number' ? ex.repetitions <= 0 : ex.repetitions.trim() === '';
        if (hasInvalidReps) errors.push('Repeticiones');
        return `<strong>${ex.name}</strong>: ${errors.join(' y ')}`;
      }).join('<br>');

      await Swal.fire({
        title: 'Error en ejercicios',
        html: `Los siguientes ejercicios tienen valores inválidos:<br><br>${htmlList}`,
        icon: 'error',
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#CFAD04'
      });

      setSelectedExercises(prev => prev.map(ex => ({
        ...ex,
        hasError: invalidExercises.some(ie => ie.idExercise === ex.idExercise)
      })));

      return;
    }

    const reqRoutine: RoutineWithExercisesDTO = {
      name: data.name,
      date: new Date().toISOString(),
      idUser: loggedUser?.idUser || 0,
      difficultyRoutine: {
        idDifficultyRoutine: data.idDifficultyRoutine
      },
      exercises: Object.entries(categoriesByDay).flatMap(([day, categoryIds]) => {
        return categoryIds.flatMap((categoryId, categoryIndex) => {
          return selectedExercises
            .filter(ex => ex.categoryId === categoryId && ex.idExercise > 0 && ex.dayNumber === Number(day))
            .map(ex => ({
              idExercise: ex.idExercise,
              series: ex.series,
              repetitions: ex.repetitions,
              note: ex.note,
              categoryOrder: categoryIndex,
              dayNumber: Number(day)
            }));
        });
      }),
      assignments: selectedClients.map(client => ({
        idClient: client.value,
        assignmentDate: new Date().toISOString()
      })),
      isDeleted: 0,
      paramLoggedIdUser: loggedUser?.idUser
    };

    try {
      let result;
      let action = '';

      const isEditing = activeEditingId !== null && activeEditingId !== 0;

      if (isEditing) {
        console.log('Actualizando rutina con ID:', activeEditingId);
        result = await updateRoutine({
          ...reqRoutine,
          idRoutine: activeEditingId
        });
        action = 'actualizada';
      } else {
        console.log('Creando nueva rutina');
        result = await addRoutine(reqRoutine);
        action = 'creada';
      }

      if (result?.ok) {
        await fetchRoutines();
        Swal.fire({
          title: `Rutina ${action}`,
          text: `La rutina ha sido ${action} correctamente`,
          icon: 'success',
          confirmButtonText: 'OK',
          timer: 3000,
          confirmButtonColor: '#CFAD04'
        });
        closeModalForm();
        resetForm();
      } else if (result?.logout) {
        handleLogout();
      }
    } catch (error) {
      console.error("Error al guardar la rutina:", error);
      Swal.fire({
        title: 'Error',
        text: 'Ocurrió un error al guardar la rutina',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#CFAD04'
      });
    }
  };

  const resetForm = () => {
    reset({
      idRoutine: 0,
      name: '',
      idDifficultyRoutine: 0,
      idUser: getAuthUser()?.idUser || 0,
      isDeleted: 0
    });
    setSelectedClients([]);
    setSelectedExercises([]);
    setNumberOfDays(1);
    setActiveDay(1);
    setCategoriesByDay({ 1: [] });
  };

  const handleLogout = () => {
    setAuthHeader(null);
    setAuthUser(null);
    navigate('/login', { replace: true });
  };

  const getAvailableExercises = (categoryId: number, currentExerciseId: number = 0) => {
    return exercise.filter(ex =>
      ex.exerciseCategory?.idExerciseCategory === categoryId &&
      (currentExerciseId === ex.idExercise ||
        !selectedExercises.some(sel => sel.idExercise === ex.idExercise && sel.idExercise !== 0))
    );
  };

  const handleExerciseChange = (index: number, exerciseId: number) => {
    setSelectedExercises(prev => {
      const newExercises = [...prev];
      const categoryId = newExercises[index].categoryId;

      if (exerciseId > 0) {
        const selectedExercise = exercise.find(ex =>
          ex.idExercise === exerciseId &&
          ex.exerciseCategory?.idExerciseCategory === categoryId
        );

        if (selectedExercise) {
          newExercises[index] = {
            ...newExercises[index],
            idExercise: selectedExercise.idExercise,
            name: selectedExercise.name,
            series: newExercises[index].series || 0,
            repetitions: newExercises[index].repetitions || 0,
            note: newExercises[index].note,
          };
        }
      } else {
        newExercises[index] = {
          ...newExercises[index],
          idExercise: 0,
          name: "",
          series: 0,
          repetitions: 0,
          note: "",
        };
      }

      return newExercises;
    });
  };

  const addNewExercise = (categoryId: number) => {
    const category = exerciseCategories.find(c => c.idExerciseCategory === categoryId);
    if (!category) return;

    const availableExercises = getAvailableExercises(categoryId);
    const currentExercisesInCategory = selectedExercises.filter(
      ex => ex.categoryId === categoryId && ex.idExercise === 0
    );

    if (availableExercises.length <= currentExercisesInCategory.length) {
      Swal.fire({
        title: 'Límite alcanzado',
        text: 'No puedes agregar más ejercicios de esta categoría que los disponibles',
        icon: 'info',
        confirmButtonText: 'OK',
        confirmButtonColor: '#CFAD04'
      });
      return;
    }

    if (availableExercises.length === 0) {
      Swal.fire({
        title: 'No hay ejercicios disponibles',
        text: 'Todos los ejercicios de esta categoría ya han sido seleccionados',
        icon: 'info',
        confirmButtonText: 'OK',
        confirmButtonColor: '#CFAD04'
      });
      return;
    }

    setSelectedExercises(prev => [
      ...prev,
      {
        idExercise: 0,
        name: "",
        series: 0,
        repetitions: 0,
        note: "",
        category: category.name,
        categoryId: category.idExerciseCategory,
        dayNumber: activeDay,
        categoryOrder: (categoriesByDay[activeDay] || []).indexOf(categoryId)
      }
    ]);
  };

  const updateExerciseField = (index: number, field: 'series' | 'repetitions' | 'note', value: number | string) => {
    setSelectedExercises(prev => {
      const newExercises = [...prev];
      newExercises[index] = {
        ...newExercises[index],
        [field]: value
      };
      return newExercises;
    });
  };

  const removeExercise = (index: number) => {
    setSelectedExercises(prev => prev.filter((_, i) => i !== index));
  };

  const getExercisesForCategory = (categoryId: number) => {
    return selectedExercises
      .map((ex, index) => ({ ...ex, index }))
      .filter(ex => ex.categoryId === categoryId && ex.dayNumber === activeDay);
  };

  const addDay = () => {
    const newDayNumber = numberOfDays + 1;
    setNumberOfDays(newDayNumber);
    
    // Inicializar categorías vacías para el nuevo día
    setCategoriesByDay(prev => ({
      ...prev,
      [newDayNumber]: []
    }));
    
    setActiveDay(newDayNumber);
  };

  const removeDay = (dayToRemove: number) => {
    if (numberOfDays <= 1) return;
    
    // Eliminar todos los ejercicios del día
    setSelectedExercises(prev => prev.filter(ex => ex.dayNumber !== dayToRemove));
    
    // Eliminar las categorías del día
    setCategoriesByDay(prev => {
      const newCategoriesByDay = { ...prev };
      delete newCategoriesByDay[dayToRemove];
      return newCategoriesByDay;
    });
    
    // Actualizar el número de días
    setNumberOfDays(numberOfDays - 1);
    
    // Si el día activo era el que se eliminó, cambiar al día 1
    if (activeDay === dayToRemove) {
      setActiveDay(1);
    } else if (activeDay > dayToRemove) {
      setActiveDay(activeDay - 1);
    }
  };

  return (
    <form
      className="bg-white rounded-lg px-5 py-6 mb-10 max-w-[1200px] mx-auto w-full overflow-x-hidden"
      noValidate
      onSubmit={handleSubmit(submitForm)}
    >
      <legend className="uppercase text-center text-yellow text-2xl font-black border-b-2 py-2 border-yellow mb-6">
        {activeEditingId ? 'Actualizar Rutina' : 'Crear Rutina'}
      </legend>

      <input id="idRoutine" type="hidden" {...register('idRoutine')} />
      <input id="idUser" type="hidden" {...register('idUser')} />
      <input id="isDeleted" type="hidden" {...register('isDeleted')} />
      
      <div className="my-5">
        <SearchSelect
          id="clients"
          label="Clientes"
          options={allClients}
          value={selectedClients}
          onChange={(selectedOptions) =>
            setSelectedClients(selectedOptions as ClientOption[])
          }
          isMulti
          placeholder="Seleccione los clientes..."
          isDisabled={loading}
        />

        {selectedClients.length === 0 && (
          <ErrorForm>Debe seleccionar al menos un cliente</ErrorForm>
        )}
      </div>

      <div className="my-5">
        <label htmlFor="idDifficultyRoutine" className="text-sm uppercase font-bold">
          Dificultad
        </label>
        <select
          id="idDifficultyRoutine"
          className="w-full p-3 border border-gray-100"
          {...register('idDifficultyRoutine', {
            required: 'Debe seleccionar una dificultad',
            validate: value => Number(value) !== 0 || 'Debe seleccionar una dificultad'
          })}
          disabled={loading}
        >
          <option value={0}>Seleccione una dificultad</option>
          {difficultyRoutines.map(difficulty => (
            <option
              key={difficulty.idDifficultyRoutine}
              value={difficulty.idDifficultyRoutine}
            >
              {difficulty.name}
            </option>
          ))}
        </select>
        {errors.idDifficultyRoutine && (
          <ErrorForm>{errors.idDifficultyRoutine.message}</ErrorForm>
        )}
      </div>

      <div className="mb-5">
        <label htmlFor="name" className="text-sm uppercase font-bold">
          Nombre
        </label>
        <input
          id="name"
          className="w-full p-3 border border-gray-100"
          type="text"
          placeholder="Nombre de la rutina"
          {...register('name', {
            required: 'El nombre es obligatorio',
          })}
          disabled={loading}
        />
        {errors.name && <ErrorForm>{errors.name.message}</ErrorForm>}
      </div>

      {/* Tabs de días */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-yellow">Días de Entrenamiento</h2>
          <button
            type="button"
            onClick={addDay}
            className="bg-yellow text-black px-4 py-2 rounded hover:bg-amber-600 transition-colors text-sm font-semibold"
            disabled={loading}
          >
            + Agregar Día
          </button>
        </div>
        
        <div className="flex gap-2 flex-wrap">
          {Array.from({ length: numberOfDays }, (_, i) => i + 1).map(day => (
            <div key={day} className="relative group">
              <button
                type="button"
                onClick={() => setActiveDay(day)}
                className={`px-6 py-3 rounded-t-lg font-semibold transition-all ${
                  activeDay === day
                    ? 'bg-yellow text-black'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                disabled={loading}
              >
                Día {day}
              </button>
              {numberOfDays > 1 && (
                <button
                  type="button"
                  onClick={() => {
                    Swal.fire({
                      title: '¿Eliminar día?',
                      text: `Se eliminarán todos los ejercicios del Día ${day}`,
                      icon: 'warning',
                      showCancelButton: true,
                      confirmButtonText: 'Eliminar',
                      cancelButtonText: 'Cancelar',
                      confirmButtonColor: '#CFAD04'
                    }).then((result) => {
                      if (result.isConfirmed) {
                        removeDay(day);
                      }
                    });
                  }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs hover:bg-red-600"
                  disabled={loading}
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-yellow">Ejercicios - Día {activeDay}</h2>
          
          {/* Selector para agregar categorías */}
          <div className="flex gap-2 items-center">
            <select
              className="p-2 border border-gray-300 rounded text-sm bg-white"
              value=""
              onChange={(e) => {
                if (e.target.value) {
                  addCategoryToDay(activeDay, Number(e.target.value));
                  e.target.value = "";
                }
              }}
              disabled={loading}
            >
              <option value="">+ Agregar Categoría</option>
              {exerciseCategories
                .filter(cat => !(categoriesByDay[activeDay] || []).includes(cat.idExerciseCategory))
                .map(cat => (
                  <option key={cat.idExerciseCategory} value={cat.idExerciseCategory}>
                    {cat.name}
                  </option>
                ))}
            </select>
          </div>
        </div>

        {/* Mostrar solo las categorías agregadas a este día */}
        {(categoriesByDay[activeDay] || []).length === 0 ? (
          <div className="text-center py-8 text-gray-500 border border-dashed border-gray-300 rounded-lg">
            <p>No hay categorías agregadas a este día.</p>
            <p className="text-sm mt-2">Usa el selector de arriba para agregar categorías.</p>
          </div>
        ) : (
          (categoriesByDay[activeDay] || []).map((categoryId, index) => {
            const category = exerciseCategories.find(c => c.idExerciseCategory === categoryId);
            if (!category) return null;

            const categoryExercises = getExercisesForCategory(category.idExerciseCategory);
            const isFirst = index === 0;
            const isLast = index === (categoriesByDay[activeDay] || []).length - 1;

            return (
              <div
                key={category.idExerciseCategory}
                className="mb-8 border rounded-lg p-4 w-full max-w-[1000px] mx-auto transition-all duration-200 border-gray-300 bg-gray-50"
              >
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-md font-bold text-gray-700 flex items-center">
                    {category.name}
                  </h3>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const currentCategoriesInDay = categoriesByDay[activeDay] || [];
                        const currentIndex = currentCategoriesInDay.indexOf(categoryId);
                        if (currentIndex > 0) {
                          const newCategories = [...currentCategoriesInDay];
                          [newCategories[currentIndex], newCategories[currentIndex - 1]] = 
                            [newCategories[currentIndex - 1], newCategories[currentIndex]];
                          setCategoriesByDay(prev => ({
                            ...prev,
                            [activeDay]: newCategories
                          }));
                          
                          // Actualizar categoryOrder en los ejercicios de este día
                          setSelectedExercises(currentExercises =>
                            currentExercises.map(ex => {
                              if (ex.dayNumber === activeDay) {
                                const newCategoryOrder = newCategories.indexOf(ex.categoryId);
                                return newCategoryOrder >= 0 ? { ...ex, categoryOrder: newCategoryOrder } : ex;
                              }
                              return ex;
                            })
                          );
                        }
                      }}
                      disabled={isFirst}
                      className={`p-2 rounded transition-colors ${
                        isFirst
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          : 'bg-yellow hover:bg-yellow-600 text-white hover:shadow-md'
                      }`}
                      title="Subir categoría"
                    >
                      <FaChevronUp size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const currentCategoriesInDay = categoriesByDay[activeDay] || [];
                        const currentIndex = currentCategoriesInDay.indexOf(categoryId);
                        if (currentIndex < currentCategoriesInDay.length - 1) {
                          const newCategories = [...currentCategoriesInDay];
                          [newCategories[currentIndex], newCategories[currentIndex + 1]] = 
                            [newCategories[currentIndex + 1], newCategories[currentIndex]];
                          setCategoriesByDay(prev => ({
                            ...prev,
                            [activeDay]: newCategories
                          }));
                          
                          // Actualizar categoryOrder en los ejercicios de este día
                          setSelectedExercises(currentExercises =>
                            currentExercises.map(ex => {
                              if (ex.dayNumber === activeDay) {
                                const newCategoryOrder = newCategories.indexOf(ex.categoryId);
                                return newCategoryOrder >= 0 ? { ...ex, categoryOrder: newCategoryOrder } : ex;
                              }
                              return ex;
                            })
                          );
                        }
                      }}
                      disabled={isLast}
                      className={`p-2 rounded transition-colors ${
                        isLast
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          : 'bg-yellow hover:bg-yellow-600 text-white hover:shadow-md'
                      }`}
                      title="Bajar categoría"
                    >
                      <FaChevronDown size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeCategoryFromDay(activeDay, categoryId)}
                      className="p-2 rounded bg-red-500 hover:bg-red-600 text-white transition-colors hover:shadow-md"
                      title="Eliminar categoría"
                    >
                      ×
                    </button>
                  </div>
                </div>

              {categoryExercises.map(({ index, ...ex }) => {
                const exercisesForSelect = getAvailableExercises(category.idExerciseCategory, ex.idExercise);
                
                // Convertir ejercicios a formato de opciones para SearchSelect
                const exerciseOptions = exercisesForSelect.map(opt => ({
                  value: opt.idExercise,
                  label: opt.name
                }));
                
                // Valor actual del ejercicio seleccionado
                const selectedExerciseOption = ex.idExercise > 0
                  ? exerciseOptions.find(opt => opt.value === ex.idExercise) || null
                  : null;

                return (
                  <div key={index} className="mb-4">
                    <div className="flex flex-wrap items-end gap-4">
                      <div className={clsx(
                        "flex-1 min-w-[200px]",
                        ex.idExercise > 0 && "rounded border-2 border-yellow-400 bg-yellow-50 p-1"
                      )}>
                        <SearchSelect
                          id={`exercise-${index}`}
                          label="Ejercicio *"
                          options={exerciseOptions}
                          value={selectedExerciseOption}
                          onChange={(selectedOption) => {
                            const exerciseId = selectedOption ? (selectedOption as { value: number }).value : 0;
                            handleExerciseChange(index, exerciseId);
                          }}
                          placeholder="Buscar ejercicio..."
                          isDisabled={loading}
                          isClearable={false}
                        />
                      </div>

                      <div className="flex items-end gap-3">
                        <div className="flex flex-col w-[70px]">
                          <label className="text-xs text-gray-500 mb-1">Series</label>
                          <div className="relative">
                            <input
                              type="number"
                              min="1"
                              className="w-full p-2 border border-gray-300 rounded text-center h-[38px]"
                              value={ex.series || ""}
                              onChange={(e) => updateExerciseField(index, 'series', e.target.value === "" ? 0 : Number(e.target.value))}
                              disabled={loading}
                            />
                            {ex.idExercise > 0 && ex.series <= 0 && (
                              <span className="absolute -bottom-5 left-0 right-0 text-xs text-red-500 text-center whitespace-nowrap">
                                Mínimo 1
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col w-[70px]">
                          <label className="text-xs text-gray-500 mb-1">Repeticiones</label>
                          <div className="relative">
                            <input
                              type="text"
                              className="w-full p-2 border border-gray-300 rounded text-center h-[38px]"
                              value={ex.repetitions || ""}
                              onChange={(e) => {
                                const value = e.target.value.trim();
                                // Permitir *, números o vacío
                                if (value === '' || value === '*' || /^\d+$/.test(value)) {
                                  updateExerciseField(index, 'repetitions', value === '' ? 0 : (value === '*' ? '*' : Number(value)));
                                }
                              }}
                              placeholder="# o *"
                              disabled={loading}
                            />
                            {ex.idExercise > 0 && (typeof ex.repetitions === 'number' ? ex.repetitions <= 0 : ex.repetitions === '') && (
                              <span className="absolute -bottom-5 left-0 right-0 text-xs text-red-500 text-center whitespace-nowrap">
                                Requerido
                              </span>
                            )}
                          </div>
                        </div>


                        <div className="flex flex-col w-[100px]">
                          <label className="text-xs text-gray-500 mb-1">Notas</label>
                          <input
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded text-center h-[38px]"
                            value={ex.note}
                            onChange={(e) => updateExerciseField(index, 'note', e.target.value)}
                            disabled={loading}
                          />
                        </div>

                        {categoryExercises.length > 1 && (
                          <button
                            type="button"
                            className={
                              loading
                                ? "h-[38px] w-[38px] flex items-center justify-center rounded-full -mt-2 cursor-not-allowed"
                                : "h-[38px] w-[38px] flex items-center justify-center rounded-full -mt-2 hover:bg-gray-200 transition-colors duration-150"
                            }
                            onClick={() => removeExercise(index)}
                            disabled={loading}
                          >
                            <span
                              className={
                                loading
                                  ? "text-gray-400 text-xl"
                                  : "text-yellow-500 hover:text-yellow-700 text-xl font-bold"
                              }
                              style={{
                                fontFamily: 'Arial, sans-serif',
                                fontSize: '1.5rem',  
                                lineHeight: '1'
                              }}
                            >
                              ×
                            </span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {getAvailableExercises(category.idExerciseCategory).length > 0 &&
                getAvailableExercises(category.idExerciseCategory).length >
                selectedExercises.filter(ex => ex.categoryId === category.idExerciseCategory && ex.idExercise === 0).length && (
                  <div className="flex justify-start mt-2">
                    <button
                      type="button"
                      className="text-gray-500 hover:text-yellow-600 text-sm flex items-center"
                      onClick={() => addNewExercise(category.idExerciseCategory)}
                      disabled={loading}
                    >
                      <span className="mr-1 text-lg">+</span> Agregar ejercicio
                    </button>
                  </div>
                )}
            </div>
          );
        })
        )}
      </div>

      <input
        type="submit"
        className="bg-yellow w-full p-3 text-white uppercase font-bold hover:bg-amber-600 cursor-pointer transition-colors disabled:opacity-50"
        value={activeEditingId ? 'Actualizar' : 'Crear'}
        disabled={
          loading ||
          selectedClients.length === 0 ||
          selectedExercises.filter(ex => ex.idExercise > 0).length === 0
        }
      />
    </form>
  );
}

export default Form;