import useRoutineStore from "./Store";
import { useCommonDataStore } from "../shared/CommonDataStore";
import { RoutineExerciseDTO } from "../shared/types";

function DataInfo() {
  const { routineToEdit } = useRoutineStore();
  const { difficultyRoutines, exercise } = useCommonDataStore();

  if (!routineToEdit) {
    return (
      <section className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 min-h-[260px] flex items-center justify-center">
        <p className="text-gray-500 text-sm sm:text-base text-center">
          No hay una rutina seleccionada para mostrar.
        </p>
      </section>
    );
  }

  const getExerciseDetails = (ex: RoutineExerciseDTO) => {
    const globalExercise = exercise.find(
      (e) => e.idExercise === ex.idExercise
    );

    return {
      name: globalExercise?.name || `Ejercicio #${ex.idExercise}`,
      series: ex.series || 0,
      repetitions: ex.repetitions || 0,
      note: ex.note || "Sin nota",
    };
  };

  const getDifficultyName = (idDifficulty: number) => {
    const difficulty = difficultyRoutines.find(
      (d) => d.idDifficultyRoutine === idDifficulty
    );
    return difficulty?.name || `Dificultad #${idDifficulty}`;
  };

  const exercises = routineToEdit.exercises || [];

  return (
    <section
      className="
        w-full max-w-4xl mx-auto 
        px-4 sm:px-6 py-6 
        min-h-[260px]
        flex flex-col gap-8
      "
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <div className="flex flex-col gap-3">
          <h1 className="text-yellow font-black text-2xl uppercase underline">
            Rutina
          </h1>

          <div className="flex flex-col text-sm sm:text-base">
            <p className="font-semibold uppercase text-gray-600 text-xs">
              Nombre
            </p>
            <p className="break-words">{routineToEdit.name}</p>
          </div>

          <div className="flex flex-col text-sm sm:text-base">
            <p className="font-semibold uppercase text-gray-600 text-xs">
              Dificultad
            </p>
            <p>
              {getDifficultyName(
                routineToEdit.difficultyRoutine.idDifficultyRoutine
              )}
            </p>
          </div>

          <div className="flex flex-col text-sm sm:text-base">
            <p className="font-semibold uppercase text-gray-600 text-xs">
              Fecha
            </p>
            <p>
              {new Date(routineToEdit.date).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <h1 className="text-yellow font-black text-2xl uppercase underline">
            Ejercicios
          </h1>

          {exercises.length > 0 ? (
            <div className="space-y-3 max-h-[260px] overflow-y-auto pr-2">
              {exercises.map((ex, index) => {
                const details = getExerciseDetails(ex);

                return (
                  <div
                    key={`${ex.idExercise}-${index}`}
                    className="bg-gray-50 p-3 rounded-md border flex flex-col gap-2"
                  >
                    <h4 className="font-medium text-sm sm:text-base text-gray-800 break-words">
                      {details.name}
                    </h4>

                    <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm">
                      <div>
                        <span className="font-medium">Series:</span>{" "}
                        {details.series}
                      </div>
                      <div>
                        <span className="font-medium">Repeticiones:</span>{" "}
                        {details.repetitions}
                      </div>
                      <div className="col-span-2">
                        <span className="font-medium">Nota:</span>{" "}
                        {details.note}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-gray-50 p-4 rounded-md border text-center">
              <p className="text-gray-500 text-sm">
                No hay ejercicios en esta rutina
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default DataInfo;