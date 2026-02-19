import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { clientPortalService } from './clientPortalService';
import type { ClientExerciseNote, ClientRoutine, RoutineExercise } from '../shared/types';
import { FaArrowLeft, FaChevronLeft, FaChevronRight, FaCheckCircle, FaList, FaStickyNote, FaSave } from 'react-icons/fa';
import Swal from 'sweetalert2';

function TrainingMode() {
    const navigate = useNavigate();
    const { idRoutineAssignment } = useParams<{ idRoutineAssignment: string }>();
    const [routine, setRoutine] = useState<ClientRoutine | null>(null);
    const [selectedDay, setSelectedDay] = useState<number | null>(null);
    const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
    const [showPlaylist, setShowPlaylist] = useState(false);
    const [completedExercises, setCompletedExercises] = useState<Set<number>>(new Set());
    const [loading, setLoading] = useState(true);
    
    // Estados para notas personales
    const [personalNotes, setPersonalNotes] = useState<Map<number, string>>(new Map());
    const [currentPersonalNote, setCurrentPersonalNote] = useState<string>('');
    const [savingNote, setSavingNote] = useState(false);
    const [showNoteInput, setShowNoteInput] = useState(false);

    useEffect(() => {
        loadRoutine();
    }, [idRoutineAssignment]);

    // Cargar nota personal cuando cambia el ejercicio actual
    useEffect(() => {
        const currentExercise = getCurrentExercise();
        if (currentExercise?.idRoutineExercise) {
            const savedNote = personalNotes.get(currentExercise.idRoutineExercise) || '';
            setCurrentPersonalNote(savedNote);
        } else {
            setCurrentPersonalNote('');
        }
        setShowNoteInput(false);
    }, [currentExerciseIndex, selectedDay, personalNotes]);

    const loadRoutine = async () => {
        try {
            setLoading(true);
            const routines = await clientPortalService.getMyRoutines();
            const foundRoutine = routines.find(r => r.idRoutineAssignment === Number(idRoutineAssignment));
            
            if (foundRoutine) {
                setRoutine(foundRoutine);
                
                // Cargar notas personales para esta rutina
                try {
                    const notes = await clientPortalService.getExerciseNotes(foundRoutine.routine.idRoutine);
                    const notesMap = new Map<number, string>();
                    notes.forEach((note: ClientExerciseNote) => {
                        notesMap.set(note.idRoutineExercise, note.personalNote);
                    });
                    setPersonalNotes(notesMap);
                } catch (noteError) {
                    console.error('Error cargando notas personales:', noteError);
                    // No mostrar error al usuario, simplemente no habrá notas
                }
            } else {
                await Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Rutina no encontrada'
                });
                navigate('/portal-cliente/dashboard');
            }
        } catch (error) {
            console.error('Error cargando rutina:', error);
            await Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error al cargar la rutina'
            });
            navigate('/portal-cliente/dashboard');
        } finally {
            setLoading(false);
        }
    };

    const getDaysAvailable = (): number[] => {
        if (!routine?.routine.routineExercises) return [];
        const days = [...new Set(routine.routine.routineExercises.map(re => re.dayNumber || 1))];
        return days.sort((a, b) => a - b);
    };

    const getExercisesForDay = (day: number): RoutineExercise[] => {
        if (!routine?.routine.routineExercises) return [];
        return routine.routine.routineExercises
            .filter(re => (re.dayNumber || 1) === day)
            .sort((a, b) => {
                // Primero ordenar por categoryOrder
                if (a.categoryOrder !== b.categoryOrder) {
                    return a.categoryOrder - b.categoryOrder;
                }
                // Si tienen el mismo categoryOrder, ordenar por idRoutineExercise para mantener orden de inserción
                return (a.idRoutineExercise || 0) - (b.idRoutineExercise || 0);
            });
    };

    const getCurrentExercise = (): RoutineExercise | null => {
        if (selectedDay === null) return null;
        const exercises = getExercisesForDay(selectedDay);
        return exercises[currentExerciseIndex] || null;
    };

    const handleDaySelect = (day: number) => {
        setSelectedDay(day);
        setCurrentExerciseIndex(0);
        setShowPlaylist(false);
    };

    const handleNext = () => {
        if (selectedDay === null) return;
        const exercises = getExercisesForDay(selectedDay);
        if (currentExerciseIndex < exercises.length - 1) {
            setCurrentExerciseIndex(prev => prev + 1);
        } else {
            Swal.fire({
                icon: 'success',
                title: '¡Entrenamiento completado!',
                text: 'Has terminado todos los ejercicios de este día',
                confirmButtonColor: '#000000'
            });
        }
    };

    const handlePrevious = () => {
        if (currentExerciseIndex > 0) {
            setCurrentExerciseIndex(prev => prev - 1);
        }
    };

    const handleExerciseClick = (index: number) => {
        setCurrentExerciseIndex(index);
        setShowPlaylist(false);
    };

    const toggleCompleted = () => {
        const newCompleted = new Set(completedExercises);
        if (newCompleted.has(currentExerciseIndex)) {
            newCompleted.delete(currentExerciseIndex);
        } else {
            newCompleted.add(currentExerciseIndex);
        }
        setCompletedExercises(newCompleted);
    };

    const handleSavePersonalNote = async () => {
        const currentExercise = getCurrentExercise();
        if (!currentExercise?.idRoutineExercise) return;

        setSavingNote(true);
        try {
            await clientPortalService.saveExerciseNote(
                currentExercise.idRoutineExercise,
                currentPersonalNote
            );
            
            // Actualizar el mapa de notas localmente
            const newNotes = new Map(personalNotes);
            if (currentPersonalNote.trim()) {
                newNotes.set(currentExercise.idRoutineExercise, currentPersonalNote);
            } else {
                newNotes.delete(currentExercise.idRoutineExercise);
            }
            setPersonalNotes(newNotes);
            setShowNoteInput(false);
            
            Swal.fire({
                icon: 'success',
                title: 'Nota guardada',
                text: 'Tu nota personal ha sido guardada exitosamente',
                timer: 1500,
                showConfirmButton: false
            });
        } catch (error) {
            console.error('Error guardando nota:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo guardar la nota'
            });
        } finally {
            setSavingNote(false);
        }
    };

    const getVideoEmbedUrl = (url: string): string | null => {
        if (!url) return null;
        
        // YouTube patterns
        const youtubePatterns = [
            /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
            /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/
        ];
        
        for (const pattern of youtubePatterns) {
            const match = url.match(pattern);
            if (match) {
                // Usar youtube-nocookie.com para evitar restricciones y agregar parámetros
                return `https://www.youtube-nocookie.com/embed/${match[1]}?rel=0&modestbranding=1`;
            }
        }
        
        // Vimeo pattern
        const vimeoPattern = /vimeo\.com\/(\d+)/;
        const vimeoMatch = url.match(vimeoPattern);
        if (vimeoMatch) {
            return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
        }
        
        // Dailymotion patterns
        const dailymotionPatterns = [
            /dailymotion\.com\/video\/([a-zA-Z0-9]+)/,
            /dai\.ly\/([a-zA-Z0-9]+)/
        ];
        
        for (const pattern of dailymotionPatterns) {
            const match = url.match(pattern);
            if (match) {
                // Agregar parámetros para reducir tracking y mejorar privacidad
                return `https://www.dailymotion.com/embed/video/${match[1]}?autoplay=0&mute=0&queue-enable=false`;
            }
        }
        
        return null;
    };

    const getOriginalVideoUrl = (url: string): string => {
        return url;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-900">
                <div className="text-xl text-white">Cargando entrenamiento...</div>
            </div>
        );
    }

    if (!routine) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-900">
                <div className="text-xl text-white">Rutina no encontrada</div>
            </div>
        );
    }

    const days = getDaysAvailable();
    const currentExercise = getCurrentExercise();
    const exercises = selectedDay ? getExercisesForDay(selectedDay) : [];
    const isFirstExercise = currentExerciseIndex === 0;
    const isLastExercise = currentExerciseIndex === exercises.length - 1;

    // Pantalla de selección de día
    if (selectedDay === null) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
                <div className="container mx-auto p-4 md:p-8">
                    <button
                        onClick={() => navigate('/portal-cliente/dashboard')}
                        className="flex items-center gap-2 text-yellow hover:text-yellow/80 mb-6 transition-colors"
                    >
                        <FaArrowLeft /> Volver al Dashboard
                    </button>

                    <div className="text-center mb-8">
                        <h1 className="text-3xl md:text-4xl font-bold mb-2">{routine.routine.name}</h1>
                        <p className="text-gray-400">Selecciona el día para comenzar tu entrenamiento</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
                        {days.map(day => {
                            const dayExercises = getExercisesForDay(day);
                            return (
                                <button
                                    key={day}
                                    onClick={() => handleDaySelect(day)}
                                    className="bg-gradient-to-br from-yellow to-yellow/80 text-black p-6 rounded-xl hover:scale-105 transition-transform shadow-xl"
                                >
                                    <div className="text-4xl font-bold mb-2">Día {day}</div>
                                    <div className="text-sm">{dayExercises.length} ejercicios</div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    }

    // Pantalla de entrenamiento
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
            {/* Header */}
            <div className="bg-black/50 backdrop-blur-sm p-4 shadow-lg sticky top-0 z-40">
                <div className="container mx-auto flex justify-between items-center">
                    <button
                        onClick={() => setSelectedDay(null)}
                        className="flex items-center gap-2 text-yellow hover:text-yellow/80 transition-colors"
                    >
                        <FaArrowLeft /> Cambiar día
                    </button>
                    <div className="text-center">
                        <h2 className="text-xl md:text-2xl font-bold">{routine.routine.name}</h2>
                        <p className="text-sm text-gray-400">Día {selectedDay} - Ejercicio {currentExerciseIndex + 1} de {exercises.length}</p>
                    </div>
                    <button
                        onClick={() => setShowPlaylist(!showPlaylist)}
                        className="flex items-center gap-2 bg-yellow text-black px-4 py-2 rounded-lg hover:bg-yellow/80 transition-colors"
                    >
                        <FaList /> <span className="hidden md:inline">Lista</span>
                    </button>
                </div>
            </div>

            <div className="container mx-auto p-4 md:p-8">
                <div className="flex gap-6">
                    {/* Contenido principal */}
                    <div className={`flex-1 ${showPlaylist ? 'hidden md:block' : ''}`}>
                        {currentExercise && (
                            <div className="bg-gray-800 rounded-xl shadow-2xl overflow-hidden">
                                {/* Nombre del ejercicio */}
                                <div className="bg-gradient-to-r from-yellow to-yellow/80 p-6">
                                    <h3 className="text-2xl md:text-3xl font-bold text-black">
                                        {currentExercise.exercise?.name || 'Sin nombre'}
                                    </h3>
                                    <p className="text-sm text-black/70 mt-1">
                                        {currentExercise.exercise?.exerciseCategory?.name || 'Sin categoría'}
                                    </p>
                                </div>

                                <div className="p-6 space-y-6">
                                    {/* Video */}
                                    {currentExercise.exercise?.videoUrl && getVideoEmbedUrl(currentExercise.exercise.videoUrl) && (
                                        <div className="aspect-video w-full bg-black rounded-lg overflow-hidden shadow-lg">
                                            <iframe
                                                src={getVideoEmbedUrl(currentExercise.exercise.videoUrl) || ''}
                                                title="Video del ejercicio"
                                                className="w-full h-full"
                                                allowFullScreen
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            />
                                        </div>
                                    )}

                                    {/* Descripción */}
                                    {currentExercise.exercise?.description && (
                                        <div className="bg-gray-700 p-4 rounded-lg">
                                            <h4 className="font-semibold mb-2 text-yellow">Descripción:</h4>
                                            <p className="text-gray-300">{currentExercise.exercise.description}</p>
                                        </div>
                                    )}

                                    {/* Series y Repeticiones */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-gradient-to-br from-yellow/20 to-yellow/5 border-2 border-yellow p-6 rounded-lg text-center">
                                            <div className="text-4xl font-bold text-yellow mb-2">
                                                {currentExercise.series || 'N/A'}
                                            </div>
                                            <div className="text-gray-400">Series</div>
                                        </div>
                                        <div className="bg-gradient-to-br from-yellow/20 to-yellow/5 border-2 border-yellow p-6 rounded-lg text-center">
                                            <div className="text-4xl font-bold text-yellow mb-2">
                                                {currentExercise.repetitions || 'N/A'}
                                            </div>
                                            <div className="text-gray-400">Repeticiones</div>
                                        </div>
                                    </div>

                                    {/* Notas del entrenador */}
                                    {currentExercise.note && currentExercise.note !== '-' && (
                                        <div className="bg-gray-700 border-l-4 border-yellow p-4 rounded">
                                            <h4 className="font-semibold mb-2 text-yellow">Indicaciones del entrenador:</h4>
                                            <p className="text-gray-300">{currentExercise.note}</p>
                                        </div>
                                    )}

                                    {/* Notas personales del cliente */}
                                    <div className="bg-gray-700 border-l-4 border-blue-500 p-4 rounded">
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className="font-semibold text-blue-400 flex items-center gap-2">
                                                <FaStickyNote /> Mis notas personales:
                                            </h4>
                                            {!showNoteInput && (
                                                <button
                                                    onClick={() => setShowNoteInput(true)}
                                                    className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                                                >
                                                    {currentPersonalNote ? 'Editar' : 'Agregar nota'}
                                                </button>
                                            )}
                                        </div>
                                        
                                        {showNoteInput ? (
                                            <div className="space-y-3">
                                                <textarea
                                                    value={currentPersonalNote}
                                                    onChange={(e) => setCurrentPersonalNote(e.target.value)}
                                                    placeholder="Ej: Usé 20kg en mancuernas, próxima vez subir a 22.5kg..."
                                                    className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:border-blue-500 focus:outline-none resize-none"
                                                    rows={3}
                                                />
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={handleSavePersonalNote}
                                                        disabled={savingNote}
                                                        className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50"
                                                    >
                                                        <FaSave /> {savingNote ? 'Guardando...' : 'Guardar nota'}
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setShowNoteInput(false);
                                                            const currentEx = getCurrentExercise();
                                                            if (currentEx?.idRoutineExercise) {
                                                                setCurrentPersonalNote(personalNotes.get(currentEx.idRoutineExercise) || '');
                                                            }
                                                        }}
                                                        className="px-4 py-2 rounded-lg bg-gray-600 text-white hover:bg-gray-500 transition-colors"
                                                    >
                                                        Cancelar
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <p className="text-gray-300">
                                                {currentPersonalNote || (
                                                    <span className="text-gray-500 italic">
                                                        Sin notas. Agrega una nota para recordar el peso, observaciones, etc.
                                                    </span>
                                                )}
                                            </p>
                                        )}
                                    </div>

                                    {/* Botón completar */}
                                    <button
                                        onClick={toggleCompleted}
                                        className={`w-full py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                                            completedExercises.has(currentExerciseIndex)
                                                ? 'bg-green-600 text-white'
                                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                        }`}
                                    >
                                        <FaCheckCircle />
                                        {completedExercises.has(currentExerciseIndex) ? '¡Completado!' : 'Marcar como completado'}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Navegación */}
                        <div className="flex gap-4 mt-6">
                            <button
                                onClick={handlePrevious}
                                disabled={isFirstExercise}
                                className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-lg font-semibold transition-all ${
                                    isFirstExercise
                                        ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                        : 'bg-yellow text-black hover:bg-yellow/80'
                                }`}
                            >
                                <FaChevronLeft /> Anterior
                            </button>
                            <button
                                onClick={handleNext}
                                className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-lg font-semibold transition-all ${
                                    isLastExercise
                                        ? 'bg-green-600 text-white hover:bg-green-700'
                                        : 'bg-yellow text-black hover:bg-yellow/80'
                                }`}
                            >
                                {isLastExercise ? '¡Finalizar!' : 'Siguiente'} <FaChevronRight />
                            </button>
                        </div>
                    </div>

                    {/* Playlist lateral */}
                    {showPlaylist && (
                        <div className="w-full md:w-80 bg-gray-800 rounded-xl shadow-2xl p-4 max-h-[calc(100vh-200px)] overflow-y-auto">
                            <h3 className="text-xl font-bold mb-4 text-yellow sticky top-0 bg-gray-800 pb-2">
                                Ejercicios del Día {selectedDay}
                            </h3>
                            <div className="space-y-2">
                                {exercises.map((ex, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleExerciseClick(index)}
                                        className={`w-full text-left p-3 rounded-lg transition-all ${
                                            index === currentExerciseIndex
                                                ? 'bg-yellow text-black font-semibold'
                                                : 'bg-gray-700 text-white hover:bg-gray-600'
                                        }`}
                                    >
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm opacity-70">{index + 1}.</span>
                                            <div className="flex-1">
                                                <div className="font-medium">{ex.exercise?.name || 'Sin nombre'}</div>
                                                <div className="text-xs opacity-70">
                                                    {ex.series}x{ex.repetitions}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                {ex.idRoutineExercise && personalNotes.has(ex.idRoutineExercise) && (
                                                    <FaStickyNote className={`text-blue-400 ${index === currentExerciseIndex ? 'text-blue-600' : ''}`} title="Tiene nota personal" />
                                                )}
                                                {completedExercises.has(index) && (
                                                    <FaCheckCircle className="text-green-400" />
                                                )}
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default TrainingMode;
