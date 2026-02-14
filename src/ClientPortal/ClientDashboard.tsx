import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { clientPortalService } from './clientPortalService';
import type { ClientLogin, ClientRoutine, Measurement } from '../shared/types';
import Swal from 'sweetalert2';
import { FaDownload, FaSignOutAlt, FaDumbbell, FaRulerVertical, FaKey, FaExclamationTriangle, FaVideo, FaPlay } from 'react-icons/fa';
import ChangePasswordModal from './ChangePasswordModal';

function ClientDashboard() {
    const navigate = useNavigate();
    const [clientData, setClientData] = useState<ClientLogin | null>(null);
    const [routines, setRoutines] = useState<ClientRoutine[]>([]);
    const [measurements, setMeasurements] = useState<Measurement[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'routines' | 'measurements'>('routines');
    const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
    const [hasProvisionalPassword, setHasProvisionalPassword] = useState(false);

    useEffect(() => {
        const storedClientData = localStorage.getItem('clientData');
        const clientToken = localStorage.getItem('clientToken');
        
        if (!storedClientData || !clientToken) {
            navigate('/portal-cliente');
            return;
        }

        setClientData(JSON.parse(storedClientData));
        loadData();
        checkProvisionalPassword();
    }, [navigate]);

    const checkProvisionalPassword = async () => {
        try {
            const isProvisional = await clientPortalService.hasProvisionalPassword();
            setHasProvisionalPassword(isProvisional);
            
            if (isProvisional) {
                setTimeout(() => {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Contraseña Provisional',
                        html: 'Estás usando una contraseña provisional.<br>Por seguridad, te recomendamos cambiarla.',
                        showCancelButton: true,
                        confirmButtonText: 'Cambiar ahora',
                        cancelButtonText: 'Más tarde',
                        confirmButtonColor: '#000000'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            setShowChangePasswordModal(true);
                        }
                    });
                }, 1500);
            }
        } catch (error) {
            console.error('Error verificando contraseña:', error);
        }
    };

    const loadData = async () => {
        try {
            setLoading(true);
            const [routinesData, measurementsData] = await Promise.all([
                clientPortalService.getMyRoutines(),
                clientPortalService.getMyMeasurements()
            ]);
            console.log('Rutinas recibidas:', routinesData);
            console.log('Medidas recibidas:', measurementsData);
            
            // Ordenar rutinas por fecha de asignación (más reciente primero)
            const sortedRoutines = [...routinesData].sort((a, b) => {
                const dateA = new Date(a.assignmentDate).getTime();
                const dateB = new Date(b.assignmentDate).getTime();
                return dateB - dateA; // Descendente: más nueva primero
            });
            
            setRoutines(sortedRoutines);
            setMeasurements(measurementsData);
        } catch (error) {
            console.error('Error cargando datos:', error);
            await Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error al cargar los datos'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        const result = await Swal.fire({
            icon: 'question',
            title: '¿Cerrar sesión?',
            text: '¿Estás seguro que deseas salir?',
            showCancelButton: true,
            confirmButtonText: 'Sí, salir',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            localStorage.removeItem('clientData');
            localStorage.removeItem('clientToken');
            await Swal.fire({
                icon: 'success',
                title: 'Sesión cerrada',
                timer: 1500,
                showConfirmButton: false
            });
            navigate('/portal-cliente');
        }
    };

    const handleDownloadRoutinesPdf = async () => {
        try {
            const blob = await clientPortalService.downloadRoutinesPdf();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'mis_rutinas.pdf';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            await Swal.fire({
                icon: 'success',
                title: 'PDF descargado',
                timer: 1500,
                showConfirmButton: false
            });
        } catch (error) {
            console.error('Error descargando PDF:', error);
            await Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error al descargar el PDF'
            });
        }
    };

    const handleDownloadSingleRoutinePdf = async (idRoutineAssignment: number, routineName: string) => {
        try {
            const blob = await clientPortalService.downloadSingleRoutinePdf(idRoutineAssignment);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `rutina_${routineName.replace(/\s+/g, '_')}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            await Swal.fire({
                icon: 'success',
                title: 'PDF descargado',
                timer: 1500,
                showConfirmButton: false
            });
        } catch (error) {
            console.error('Error descargando PDF:', error);
            await Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error al descargar el PDF'
            });
        }
    };

    const handleDownloadMeasurementsPdf = async () => {
        try {
            const blob = await clientPortalService.downloadMeasurementsPdf();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'mis_medidas.pdf';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            await Swal.fire({
                icon: 'success',
                title: 'PDF descargado',
                timer: 1500,
                showConfirmButton: false
            });
        } catch (error) {
            console.error('Error descargando PDF:', error);
            await Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error al descargar el PDF'
            });
        }
    };

    const formatDate = (date: Date | string) => {
        return new Date(date).toLocaleDateString('es-CR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-xl">Cargando...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <header className="bg-black text-white p-3 md:p-4 shadow-lg sticky top-0 z-50">
                <div className="container mx-auto">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2 md:gap-4">
                            <img src="/LogoBlack.jpg" alt="Force GYM" className="h-10 md:h-12" />
                            <div>
                                <h1 className="text-base md:text-xl font-bold">
                                    {clientData?.person.name} {clientData?.person.firstLastName}
                                </h1>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button 
                                onClick={() => setShowChangePasswordModal(true)}
                                className="flex items-center gap-1 md:gap-2 bg-gray-700 text-white px-2 md:px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors relative text-sm"
                                title="Cambiar contraseña"
                            >
                                <FaKey className="text-base md:text-lg" />
                                <span className="hidden lg:inline">Cambiar Contraseña</span>
                                {hasProvisionalPassword && (
                                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                                    </span>
                                )}
                            </button>
                            <button 
                                onClick={handleLogout}
                                className="flex items-center gap-1 md:gap-2 bg-yellow text-black px-2 md:px-4 py-2 rounded-lg hover:bg-yellow/80 transition-colors text-sm"
                            >
                                <FaSignOutAlt className="text-base md:text-lg" />
                                <span className="hidden lg:inline">Cerrar Sesión</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Alerta de contraseña provisional */}
            {hasProvisionalPassword && (
                <div className="container mx-auto px-3 md:px-8 pt-3 md:pt-4">
                    <div className="bg-yellow/20 border-l-4 border-yellow p-3 md:p-4 rounded-lg flex items-start gap-2 md:gap-3">
                        <FaExclamationTriangle className="text-yellow text-lg md:text-xl mt-1 flex-shrink-0" />
                        <div className="flex-1">
                            <h3 className="font-bold text-gray-800 text-sm md:text-base">Contraseña Provisional</h3>
                            <p className="text-xs md:text-sm text-gray-700">
                                Por seguridad, te recomendamos cambiar tu contraseña provisional por una personalizada.
                            </p>
                            <button
                                onClick={() => setShowChangePasswordModal(true)}
                                className="mt-2 text-xs md:text-sm font-semibold text-black underline hover:text-gray-700"
                            >
                                Cambiar ahora
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <main className="container mx-auto p-3 md:p-8">
                {/* Tabs */}
                <div className="flex gap-2 md:gap-4 mb-4 md:mb-6 overflow-x-auto pb-2">
                    <button
                        onClick={() => setActiveTab('routines')}
                        className={`flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 rounded-lg font-semibold transition-all text-sm md:text-base whitespace-nowrap ${
                            activeTab === 'routines' 
                                ? 'bg-black text-white shadow-lg' 
                                : 'bg-white text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        <FaDumbbell />
                        Mis Rutinas
                    </button>
                    <button
                        onClick={() => setActiveTab('measurements')}
                        className={`flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 rounded-lg font-semibold transition-all text-sm md:text-base whitespace-nowrap ${
                            activeTab === 'measurements' 
                                ? 'bg-black text-white shadow-lg' 
                                : 'bg-white text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        <FaRulerVertical />
                        Mis Medidas
                    </button>
                </div>

                {/* Content */}
                {activeTab === 'routines' ? (
                    <div className="bg-white rounded-lg shadow-lg p-3 md:p-6">
                        <div className="mb-4 md:mb-6">
                            <h2 className="text-xl md:text-2xl font-bold">Mis Rutinas de Entrenamiento</h2>
                        </div>

                        {routines.length === 0 ? (
                            <p className="text-gray-500 text-center py-8 text-sm md:text-base">No tienes rutinas asignadas aún.</p>
                        ) : (
                            <div className="space-y-4 md:space-y-6">
                                {routines.map((assignment) => (
                                    <div key={assignment.idRoutineAssignment} className="border border-gray-200 rounded-lg p-3 md:p-4">
                                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-4">
                                            <div className="flex-1">
                                                <h3 className="text-lg md:text-xl font-bold">{assignment.routine.name}</h3>
                                                <p className="text-xs md:text-sm text-gray-600">
                                                    Asignada el: {formatDate(assignment.assignmentDate)}
                                                </p>
                                                <p className="text-xs md:text-sm text-gray-600">
                                                    Dificultad: {assignment.routine.difficultyRoutine?.name || 'N/A'}
                                                </p>
                                            </div>
                                            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                                                <button
                                                    onClick={() => navigate(`/portal-cliente/entrenar/${assignment.idRoutineAssignment}`)}
                                                    className="flex items-center justify-center gap-2 bg-black text-white px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors text-sm whitespace-nowrap"
                                                    title="Modo entrenamiento"
                                                >
                                                    <FaPlay />
                                                    Entrenar
                                                </button>
                                                <button
                                                    onClick={() => handleDownloadSingleRoutinePdf(assignment.idRoutineAssignment, assignment.routine.name)}
                                                    className="flex items-center justify-center gap-2 bg-yellow text-black px-3 py-2 rounded-lg hover:bg-yellow/80 transition-colors text-sm whitespace-nowrap"
                                                    title="Descargar esta rutina"
                                                >
                                                    <FaDownload />
                                                    Descargar PDF
                                                </button>
                                            </div>
                                        </div>

                                        {assignment.routine.routineExercises && assignment.routine.routineExercises.length > 0 && (
                                            <div className="mt-4">
                                                <h4 className="font-semibold mb-3 text-sm md:text-base">Ejercicios:</h4>
                                                {(() => {
                                                    // Agrupar ejercicios por día
                                                    const exercisesByDay = assignment.routine.routineExercises.reduce((acc, re) => {
                                                        const day = re.dayNumber || 1;
                                                        if (!acc[day]) acc[day] = [];
                                                        acc[day].push(re);
                                                        return acc;
                                                    }, {} as Record<number, typeof assignment.routine.routineExercises>);

                                                    const days = Object.keys(exercisesByDay).map(Number).sort((a, b) => a - b);

                                                    return (
                                                        <div className="space-y-3 md:space-y-4">
                                                            {days.map((day) => {
                                                                // Agrupar ejercicios del día por categoría
                                                                const exercisesByCategory = exercisesByDay[day].reduce((acc, re) => {
                                                                    const category = re.exercise?.exerciseCategory?.name || 'Otros';
                                                                    if (!acc[category]) acc[category] = [];
                                                                    acc[category].push(re);
                                                                    return acc;
                                                                }, {} as Record<string, typeof exercisesByDay[number]>);

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
                                                                    <div key={day} className="border border-gray-200 rounded-lg p-3 md:p-4 bg-gray-50">
                                                                        <h5 className="font-bold text-lg md:text-xl mb-3 text-yellow border-b-2 border-yellow pb-2">Día {day}</h5>
                                                                        <div className="space-y-3 md:space-y-4">
                                                                            {categories.map((category) => (
                                                                                <div key={category}>
                                                                                    <h6 className="font-semibold text-gray-700 text-xs md:text-sm uppercase mb-2 bg-white p-2 rounded">
                                                                                        {category}
                                                                                    </h6>
                                                                                    
                                                                                    {/* Vista móvil (cards) */}
                                                                                    <div className="md:hidden space-y-2">
                                                                                        {exercisesByCategory[category].map((re, idx) => (
                                                                                            <div key={idx} className="bg-white p-3 rounded border border-gray-200">
                                                                                                <div className="font-medium text-sm mb-2">{re.exercise?.name || 'N/A'}</div>
                                                                                                <div className="grid grid-cols-2 gap-2 text-xs">
                                                                                                    <div>
                                                                                                        <span className="text-gray-500">Series:</span>
                                                                                                        <span className="ml-1 font-semibold">{re.series || 'N/A'}</span>
                                                                                                    </div>
                                                                                                    <div>
                                                                                                        <span className="text-gray-500">Reps:</span>
                                                                                                        <span className="ml-1 font-semibold">{re.repetitions || 'N/A'}</span>
                                                                                                    </div>
                                                                                                </div>
                                                                                                {re.note && re.note !== '-' && (
                                                                                                    <div className="mt-2 text-xs text-gray-600">
                                                                                                        <span className="font-medium">Notas:</span> {re.note}
                                                                                                    </div>
                                                                                                )}
                                                                                                {re.exercise?.videoUrl && (
                                                                                                    <a
                                                                                                        href={re.exercise.videoUrl}
                                                                                                        target="_blank"
                                                                                                        rel="noopener noreferrer"
                                                                                                        className="mt-2 flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800"
                                                                                                    >
                                                                                                        <FaVideo /> Ver video tutorial
                                                                                                    </a>
                                                                                                )}
                                                                                            </div>
                                                                                        ))}
                                                                                    </div>
                                                                                    
                                                                                    {/* Vista escritorio (tabla) */}
                                                                                    <div className="hidden md:block overflow-x-auto">
                                                                                        <table className="min-w-full divide-y divide-gray-200">
                                                                                            <thead className="bg-gray-50">
                                                                                                <tr>
                                                                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Ejercicio</th>
                                                                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Series</th>
                                                                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Repeticiones</th>
                                                                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Notas</th>
                                                                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Video</th>
                                                                                                </tr>
                                                                                            </thead>
                                                                                            <tbody className="bg-white divide-y divide-gray-200">
                                                                                                {exercisesByCategory[category].map((re, idx) => (
                                                                                                    <tr key={idx}>
                                                                                                        <td className="px-4 py-2">{re.exercise?.name || 'N/A'}</td>
                                                                                                        <td className="px-4 py-2">{re.series || 'N/A'}</td>
                                                                                                        <td className="px-4 py-2">{re.repetitions || 'N/A'}</td>
                                                                                                        <td className="px-4 py-2">{re.note || '-'}</td>
                                                                                                        <td className="px-4 py-2">
                                                                                                            {re.exercise?.videoUrl ? (
                                                                                                                <a
                                                                                                                    href={re.exercise.videoUrl}
                                                                                                                    target="_blank"
                                                                                                                    rel="noopener noreferrer"
                                                                                                                    className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
                                                                                                                >
                                                                                                                    <FaVideo /> Ver
                                                                                                                </a>
                                                                                                            ) : (
                                                                                                                <span className="text-gray-400 text-xs">-</span>
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
                                                    );
                                                })()}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow-lg p-3 md:p-6">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4 md:mb-6">
                            <h2 className="text-xl md:text-2xl font-bold">Mi Historial de Medidas</h2>
                            <button
                                onClick={handleDownloadMeasurementsPdf}
                                className="flex items-center justify-center gap-2 bg-yellow text-black px-3 md:px-4 py-2 rounded-lg hover:bg-yellow/80 transition-colors text-sm whitespace-nowrap w-full sm:w-auto"
                            >
                                <FaDownload />
                                Descargar PDF
                            </button>
                        </div>

                        {measurements.length === 0 ? (
                            <p className="text-gray-500 text-center py-8 text-sm md:text-base">No tienes medidas registradas aún.</p>
                        ) : (
                            <div className="space-y-4 md:space-y-6">
                                {measurements.map((measurement) => (
                                    <div key={measurement.idMeasurement} className="border border-gray-200 rounded-lg p-3 md:p-4">
                                        <h3 className="text-base md:text-lg font-bold mb-3 md:mb-4 text-yellow border-b-2 border-yellow pb-2">
                                            Medición del: {formatDate(measurement.measurementDate)}
                                        </h3>
                                        
                                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4">
                                            <div className="bg-gray-50 p-2 md:p-3 rounded">
                                                <p className="text-xs md:text-sm text-gray-600">Peso</p>
                                                <p className="text-sm md:text-lg font-semibold">{measurement.weight} kg</p>
                                            </div>
                                            <div className="bg-gray-50 p-2 md:p-3 rounded">
                                                <p className="text-xs md:text-sm text-gray-600">Altura</p>
                                                <p className="text-sm md:text-lg font-semibold">{measurement.height} cm</p>
                                            </div>
                                            <div className="bg-gray-50 p-2 md:p-3 rounded">
                                                <p className="text-xs md:text-sm text-gray-600">Masa Muscular</p>
                                                <p className="text-sm md:text-lg font-semibold">{measurement.muscleMass}</p>
                                            </div>
                                            <div className="bg-gray-50 p-2 md:p-3 rounded">
                                                <p className="text-xs md:text-sm text-gray-600">% Grasa Corporal</p>
                                                <p className="text-sm md:text-lg font-semibold">{measurement.bodyFatPercentage}%</p>
                                            </div>
                                            <div className="bg-gray-50 p-2 md:p-3 rounded">
                                                <p className="text-xs md:text-sm text-gray-600">% Grasa Visceral</p>
                                                <p className="text-sm md:text-lg font-semibold">{measurement.visceralFatPercentage}%</p>
                                            </div>
                                            <div className="bg-gray-50 p-2 md:p-3 rounded">
                                                <p className="text-xs md:text-sm text-gray-600">Pecho</p>
                                                <p className="text-sm md:text-lg font-semibold">{measurement.chestSize} cm</p>
                                            </div>
                                            <div className="bg-gray-50 p-2 md:p-3 rounded">
                                                <p className="text-xs md:text-sm text-gray-600">Espalda</p>
                                                <p className="text-sm md:text-lg font-semibold">{measurement.backSize} cm</p>
                                            </div>
                                            <div className="bg-gray-50 p-2 md:p-3 rounded">
                                                <p className="text-xs md:text-sm text-gray-600">Cadera</p>
                                                <p className="text-sm md:text-lg font-semibold">{measurement.hipSize} cm</p>
                                            </div>
                                            <div className="bg-gray-50 p-2 md:p-3 rounded">
                                                <p className="text-xs md:text-sm text-gray-600">Cintura</p>
                                                <p className="text-sm md:text-lg font-semibold">{measurement.waistSize} cm</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </main>

            {/* Modal de cambio de contraseña */}
            {showChangePasswordModal && (
                <ChangePasswordModal
                    onClose={() => setShowChangePasswordModal(false)}
                    onSuccess={() => {
                        setHasProvisionalPassword(false);
                        checkProvisionalPassword();
                    }}
                />
            )}
        </div>
    );
}

export default ClientDashboard;
