import useExerciseStore from "./Store";
import { FaVideo } from "react-icons/fa";

function DataInfo() {
  const { exercises, activeEditingId } = useExerciseStore();

  if (!activeEditingId) {
    return (
      <section className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 min-h-[260px] flex items-center justify-center">
        <p className="text-gray-500 text-sm sm:text-base text-center">
          No hay un ejercicio seleccionado para mostrar.
        </p>
      </section>
    );
  }

  const exercise = exercises.find(
    (ex) => ex.idExercise === activeEditingId
  );

  if (!exercise) {
    return (
      <section className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 min-h-[260px] flex items-center justify-center">
        <p className="text-gray-500 text-sm sm:text-base text-center">
          No se encontró la información del ejercicio seleccionado.
        </p>
      </section>
    );
  }

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
            Ejercicio
          </h1>

          <div className="flex flex-col text-sm sm:text-base">
            <p className="font-semibold uppercase text-gray-600 text-xs">
              Nombre
            </p>
            <p className="break-words">{exercise.name}</p>
          </div>

          <div className="flex flex-col text-sm sm:text-base">
            <p className="font-semibold uppercase text-gray-600 text-xs">
              Descripción
            </p>
            <p className="break-words">{exercise.description}</p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <h1 className="text-yellow font-black text-2xl uppercase underline">
            Detalles
          </h1>

          <div className="flex flex-col text-sm sm:text-base">
            <p className="font-semibold uppercase text-gray-600 text-xs">
              Dificultad
            </p>
            <p>{exercise.difficulty}</p>
          </div>

          <div className="flex flex-col text-sm sm:text-base">
            <p className="font-semibold uppercase text-gray-600 text-xs">
              Categoría
            </p>
            <p>{exercise.exerciseCategory.name}</p>
          </div>

          {exercise.videoUrl && (
            <div className="flex flex-col text-sm sm:text-base">
              <p className="font-semibold uppercase text-gray-600 text-xs mb-2">
                Video Tutorial
              </p>
              <a
                href={exercise.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-yellow text-black px-4 py-2 rounded-lg hover:bg-amber-500 transition-colors w-fit"
              >
                <FaVideo />
                Ver Video
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default DataInfo;