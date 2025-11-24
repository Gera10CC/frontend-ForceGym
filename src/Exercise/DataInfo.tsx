import useExerciseStore from "./Store";

function DataInfo() {
    const { exercises, activeEditingId } = useExerciseStore();
    if (!activeEditingId) return <></>;

    const exercise = exercises.find(ex => ex.idExercise === activeEditingId);
    if (!exercise) return <></>;

    return (
        <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-yellow font-black text-2xl uppercase mb-8 underline">Ejercicio</h1>

                <div className="flex flex-col gap-2 text-lg">
                    <p><strong>Nombre</strong></p>
                    <p>{exercise.name}</p>

                    <p><strong>Descripción</strong></p>
                    <p>{exercise.description}</p>

                </div>
            </div>

            <div className="flex flex-col gap-2">
                <h1 className="text-yellow font-black text-2xl uppercase mb-8 underline">Detalles</h1>

                <div className="flex flex-col gap-2 text-lg">
                    <p><strong>Dificultad</strong></p>
                    <p>{exercise.exerciseDifficulty.difficulty}</p>

                    <p><strong>Categoria</strong></p>
                    <p>{exercise.exerciseCategory.name}</p>
                </div>
            </div>
        </div>
    );
}

export default DataInfo;
