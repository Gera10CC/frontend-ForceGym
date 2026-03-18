import { memo } from 'react';
import { FaDownload, FaPlay, FaVideo } from 'react-icons/fa';
import type { ClientRoutine, RoutineExercise } from '../../shared/types';

interface RoutineCardProps {
    routine: ClientRoutine;
    formatDate: (date: Date | string) => string;
    dayColors: string[];
    onStartTraining: () => void;
    onDownloadPdf: () => void;
}

const RoutineCard = memo(({ routine, formatDate, dayColors, onStartTraining, onDownloadPdf }: RoutineCardProps) => {
    // Agrupar ejercicios por día
    const exercisesByDay = routine.routine.routineExercises.reduce((acc, re) => {
        const day = re.dayNumber || 1;
        if (!acc[day]) acc[day] = [];
        acc[day].push(re);
        return acc;
    }, {} as Record<number, RoutineExercise[]>);

    const days = Object.keys(exercisesByDay).map(Number).sort((a, b) => a - b);

    return (
        <div className="bg-white rounded-lg shadow-md p-4 md:p-6 border-l-4 border-yellow">
            {/* Header de la rutina */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-6">
                <div className="flex-1">
                    <h3 className="text-2xl md:text-3xl font-bold text-yellow mb-2">{routine.routine.name}</h3>
                    <p className="text-sm md:text-base text-gray-600">
                        Asignada el: {formatDate(routine.assignmentDate)}
                    </p>
                    <p className="text-sm md:text-base text-gray-600">
                        Dificultad: {routine.routine.difficultyRoutine?.name || 'N/A'}
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    <button
                        onClick={onStartTraining}
                        className="flex items-center justify-center gap-2 bg-black text-white px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors text-sm font-semibold whitespace-nowrap"
                    >
                        <FaPlay />
                        Entrenar Ahora
                    </button>
                    <button
                        onClick={onDownloadPdf}
                        className="flex items-center justify-center gap-2 bg-yellow text-black px-4 py-3 rounded-lg hover:bg-yellow/80 transition-colors text-sm font-semibold whitespace-nowrap"
                    >
                        <FaDownload />
                        Descargar PDF
                    </button>
                </div>
            </div>

            {/* Días y ejercicios */}
            {routine.routine.routineExercises && routine.routine.routineExercises.length > 0 && (
                <div className="mt-6">
                    <div className="space-y-6">
                        {days.map((day) => {
                            const dayColor = dayColors[(day - 1) % dayColors.length];
                            
                            // Agrupar ejercicios del día por categoría
                            const exercisesByCategory = exercisesByDay[day].reduce((acc, re) => {
                                const category = re.exercise?.exerciseCategory?.name || 'Otros';
                                if (!acc[category]) acc[category] = [];
                                acc[category].push(re);
                                return acc;
                            }, {} as Record<string, RoutineExercise[]>);

                            // Ordenar ejercicios dentro de cada categoría
                            Object.keys(exercisesByCategory).forEach(category => {
                                exercisesByCategory[category].sort((a, b) => {
                                    if (a.categoryOrder !== b.categoryOrder) {
                                        return a.categoryOrder - b.categoryOrder;
                                    }
                                    return (a.idRoutineExercise || 0) - (b.idRoutineExercise || 0);
                                });
                            });

                            // Ordenar categorías por el mínimo categoryOrder de sus ejercicios
                            const categories = Object.keys(exercisesByCategory).sort((a, b) => {
                                const minOrderA = Math.min(...exercisesByCategory[a].map(ex => ex.categoryOrder));
                                const minOrderB = Math.min(...exercisesByCategory[b].map(ex => ex.categoryOrder));
                                return minOrderA - minOrderB;
                            });

                            return (
                                <div key={day} className="border-l-4 rounded-lg p-4 md:p-5 shadow-sm" style={{ borderColor: dayColor, backgroundColor: `${dayColor}15` }}>
                                    {/* Título del día con color */}
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-white font-bold text-xl md:text-2xl shadow-md" style={{ backgroundColor: dayColor }}>
                                            {day}
                                        </div>
                                        <h5 className="font-bold text-xl md:text-2xl" style={{ color: dayColor }}>DÍA {day}</h5>
                                    </div>
                                    <div className="space-y-4">
                                        {categories.map((category) => (
                                            <div key={category}>
                                                <h6 className="font-bold text-sm md:text-base mb-3 px-3 py-2 rounded-md shadow-sm" style={{ backgroundColor: dayColor, color: 'white' }}>
                                                    {category}
                                                </h6>
                                                
                                                {/* Vista móvil (cards) */}
                                                <div className="md:hidden space-y-3">
                                                    {exercisesByCategory[category].map((re, idx) => (
                                                        <div key={idx} className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                                                            <div className="font-semibold text-base mb-3" style={{ color: dayColor }}>
                                                                {re.exercise?.name || 'N/A'}
                                                            </div>
                                                            <div className="grid grid-cols-2 gap-3 text-sm">
                                                                <div className="bg-gray-50 p-2 rounded-md">
                                                                    <span className="text-gray-500 text-xs">Series:</span>
                                                                    <span className="ml-1 font-bold" style={{ color: dayColor }}>{re.series || 'N/A'}</span>
                                                                </div>
                                                                <div className="bg-gray-50 p-2 rounded-md">
                                                                    <span className="text-gray-500 text-xs">Reps:</span>
                                                                    <span className="ml-1 font-bold" style={{ color: dayColor }}>{re.repetitions || 'N/A'}</span>
                                                                </div>
                                                            </div>
                                                            {re.note && re.note !== '-' && (
                                                                <div className="mt-3 text-sm text-gray-700 bg-gray-50 p-2 rounded-md">
                                                                    <span className="font-medium">Notas:</span> {re.note}
                                                                </div>
                                                            )}
                                                            {re.exercise?.videoUrl && (
                                                                <a
                                                                    href={re.exercise.videoUrl}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="mt-3 flex items-center gap-2 text-sm font-medium hover:underline"
                                                                    style={{ color: dayColor }}
                                                                >
                                                                    <FaVideo /> Ver video tutorial
                                                                </a>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                                
                                                {/* Vista escritorio (tabla) */}
                                                <div className="hidden md:block overflow-hidden rounded-lg shadow-sm">
                                                    <table className="min-w-full bg-white">
                                                        <thead style={{ backgroundColor: dayColor }}>
                                                            <tr>
                                                                <th className="px-4 py-3 text-left text-sm font-bold text-white">
                                                                    Ejercicio
                                                                </th>
                                                                <th className="px-4 py-3 text-center text-sm font-bold text-white">
                                                                    Series
                                                                </th>
                                                                <th className="px-4 py-3 text-center text-sm font-bold text-white">
                                                                    Repeticiones
                                                                </th>
                                                                <th className="px-4 py-3 text-left text-sm font-bold text-white">
                                                                    Notas
                                                                </th>
                                                                <th className="px-4 py-3 text-center text-sm font-bold text-white">
                                                                    Video
                                                                </th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-gray-200">
                                                            {exercisesByCategory[category].map((re, idx) => (
                                                                <tr key={idx} className="hover:bg-gray-50 transition-colors">
                                                                    <td className="px-4 py-3 font-medium">{re.exercise?.name || 'N/A'}</td>
                                                                    <td className="px-4 py-3 text-center font-semibold" style={{ color: dayColor }}>{re.series || 'N/A'}</td>
                                                                    <td className="px-4 py-3 text-center font-semibold" style={{ color: dayColor }}>{re.repetitions || 'N/A'}</td>
                                                                    <td className="px-4 py-3 text-sm text-gray-600">{re.note || '-'}</td>
                                                                    <td className="px-4 py-3 text-center">
                                                                        {re.exercise?.videoUrl ? (
                                                                            <a
                                                                                href={re.exercise.videoUrl}
                                                                                target="_blank"
                                                                                rel="noopener noreferrer"
                                                                                className="inline-flex items-center gap-1 font-medium hover:underline transition-colors"
                                                                                style={{ color: dayColor }}
                                                                            >
                                                                                <FaVideo /> Ver
                                                                            </a>
                                                                        ) : (
                                                                            <span className="text-gray-400 text-sm">-</span>
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
});

RoutineCard.displayName = 'RoutineCard';

export default RoutineCard;
