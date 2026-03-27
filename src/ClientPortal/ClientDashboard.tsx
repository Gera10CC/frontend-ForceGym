import { useState, useEffect, useMemo, useCallback, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { clientPortalService } from './clientPortalService';
import type { ClientLogin, ClientRoutine, Measurement } from '../shared/types';
import Swal from 'sweetalert2';
import { FaDownload, FaSignOutAlt, FaDumbbell, FaRulerVertical, FaKey, FaExclamationTriangle, FaSpinner } from 'react-icons/fa';
import { useMembershipStatus, useFormatDate } from './hooks/useClientDashboard';
import MembershipStatusCard from './components/MembershipStatusCard';
import MeasurementCard from './components/MeasurementCard';
import RoutineCard from './components/RoutineCard';
import FileTypeModal from './components/FileTypeModal';
import { RoutineSkeleton, MeasurementSkeleton } from './components/SkeletonLoader';

// Lazy load del modal de cambio de contraseña (solo se carga cuando se necesita)
const ChangePasswordModal = lazy(() => import('./ChangePasswordModal'));

function ClientDashboard() {
    const navigate = useNavigate();
    const [clientData, setClientData] = useState<ClientLogin | null>(null);
    const [routines, setRoutines] = useState<ClientRoutine[]>([]);
    const [measurements, setMeasurements] = useState<Measurement[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'routines' | 'measurements'>('routines');
    const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
    const [hasProvisionalPassword, setHasProvisionalPassword] = useState(false);
    const [showFileTypeModal, setShowFileTypeModal] = useState(false);
    const [downloadingRoutineId, setDownloadingRoutineId] = useState<number | null>(null);
    const [downloadingMeasurementsPdf, setDownloadingMeasurementsPdf] = useState(false);
    const [downloadingMeasurementsExcel, setDownloadingMeasurementsExcel] = useState(false);

    // Colores para cada día (igual que en el PDF) - Memoizado
    const dayColors = useMemo(() => [
        'rgb(207, 173, 4)',   // Día 1 - Amarillo
        'rgb(0, 123, 255)',   // Día 2 - Azul
        'rgb(40, 167, 69)',   // Día 3 - Verde
        'rgb(255, 159, 64)',  // Día 4 - Naranja
        'rgb(111, 66, 193)',  // Día 5 - Púrpura
        'rgb(220, 53, 69)',   // Día 6 - Rojo
        'rgb(23, 162, 184)',  // Día 7 - Cian
    ], []);

    // Hooks personalizados optimizados
    const formatDate = useFormatDate();
    const membershipStatus = useMembershipStatus(clientData?.expirationMembershipDate);

    // Ordenar rutinas memoizado
    const sortedRoutines = useMemo(() => {
        return [...routines].sort((a, b) => {
            const dateA = new Date(a.assignmentDate).getTime();
            const dateB = new Date(b.assignmentDate).getTime();
            return dateB - dateA; // Descendente: más nueva primero
        });
    }, [routines]);

    useEffect(() => {
        const storedClientData = localStorage.getItem('clientData');
        const clientToken = localStorage.getItem('clientToken');
        
        if (!storedClientData || !clientToken) {
            navigate('/cliente');
            return;
        }

        // Cargar datos iniciales del localStorage inmediatamente para mostrar la UI
        const parsedData = JSON.parse(storedClientData);
        setClientData(parsedData);
        
        // Cargar datos en paralelo
        Promise.all([
            loadData(),
            checkProvisionalPassword()
        ]).finally(() => {
            // Cargar perfil actualizado en segundo plano (no bloquea la UI)
            loadUpdatedProfile();
        });
    }, [navigate]);

    const loadUpdatedProfile = useCallback(async () => {
        try {
            const updatedProfile = await clientPortalService.getMyProfile();
            const clientToken = localStorage.getItem('clientToken');
            
            if (updatedProfile && clientToken) {
                const updatedClientData: ClientLogin = {
                    ...updatedProfile,
                    token: clientToken
                };
                
                localStorage.setItem('clientData', JSON.stringify(updatedClientData));
                setClientData(updatedClientData);
            }
        } catch (error: any) {
            if (error?.response?.status !== 401 && error?.response?.status !== 403) {
                console.log('Error al actualizar perfil, usando datos locales');
            }
        }
    }, []);

    const checkProvisionalPassword = useCallback(async () => {
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
        } catch (error: any) {
            if (error?.response?.status !== 401 && error?.response?.status !== 403) {
                console.log('Error al verificar contraseña provisional');
            }
        }
    }, []);

    const loadData = useCallback(async () => {
        try {
            setLoading(true);
            const [routinesData, measurementsData] = await Promise.all([
                clientPortalService.getMyRoutines(),
                clientPortalService.getMyMeasurements()
            ]);
            
            setRoutines(routinesData);
            setMeasurements(measurementsData);
        } catch (error: any) {
            if (error?.response?.status !== 401 && error?.response?.status !== 403) {
                await Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error al cargar los datos'
                });
            }
        } finally {
            setLoading(false);
        }
    }, []);

    const handleLogout = useCallback(async () => {
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
            navigate('/cliente');
        }
    }, [navigate]);

    const handleDownloadSingleRoutinePdf = useCallback(async (idRoutineAssignment: number, routineName: string) => {
        if (downloadingRoutineId) return; // Prevenir múltiples descargas simultáneas
        
        try {
            setDownloadingRoutineId(idRoutineAssignment);
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
        } catch (error: any) {
            if (error?.response?.status !== 401 && error?.response?.status !== 403) {
                await Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error al descargar el PDF'
                });
            }
        } finally {
            setDownloadingRoutineId(null);
        }
    }, [downloadingRoutineId]);

    const handleDownloadMeasurementsPdf = useCallback(async () => {
        if (downloadingMeasurementsPdf) return; // Prevenir múltiples descargas
        
        try {
            setDownloadingMeasurementsPdf(true);
            const blob = await clientPortalService.downloadMeasurementsPdf();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'mis_medidas.pdf';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            setShowFileTypeModal(false);
            await Swal.fire({
                icon: 'success',
                title: 'PDF descargado',
                timer: 1500,
                showConfirmButton: false
            });
        } catch (error: any) {
            if (error?.response?.status !== 401 && error?.response?.status !== 403) {
                await Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error al descargar el PDF'
                });
            }
        } finally {
            setDownloadingMeasurementsPdf(false);
        }
    }, [downloadingMeasurementsPdf]);

    const handleDownloadMeasurementsExcel = useCallback(async () => {
        if (downloadingMeasurementsExcel) return; // Prevenir múltiples descargas
        
        try {
            setDownloadingMeasurementsExcel(true);
            const blob = await clientPortalService.downloadMeasurementsExcel();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'mis_medidas.xlsx';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            setShowFileTypeModal(false);
            await Swal.fire({
                icon: 'success',
                title: 'Excel descargado',
                timer: 1500,
                showConfirmButton: false
            });
        } catch (error: any) {
            if (error?.response?.status !== 401 && error?.response?.status !== 403) {
                await Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error al descargar el Excel'
                });
            }
        } finally {
            setDownloadingMeasurementsExcel(false);
        }
    }, [downloadingMeasurementsExcel]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
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

            {/* Tarjeta de estado de membresía */}
            {clientData?.expirationMembershipDate && (
                <div className="container mx-auto px-3 md:px-8 pt-3 md:pt-4">
                    <MembershipStatusCard 
                        membershipStatus={membershipStatus} 
                        formatDate={formatDate} 
                    />
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
                    <div className="space-y-4 md:space-y-6">
                        {sortedRoutines.length === 0 ? (
                            <div className="bg-white rounded-lg shadow-lg p-3 md:p-6">
                                <p className="text-gray-500 text-center py-8 text-sm md:text-base">No tienes rutinas asignadas aún.</p>
                            </div>
                        ) : (
                            <>
                                {/* Rutina más reciente */}
                                <div className="bg-white rounded-lg shadow-lg p-3 md:p-6">
                                    <div className="mb-4 md:mb-6">
                                        <h2 className="text-xl md:text-2xl font-bold">Mi Rutina Actual</h2>
                                    </div>
                                    
                                    <RoutineCard
                                        routine={sortedRoutines[0]}
                                        formatDate={formatDate}
                                        dayColors={dayColors}
                                        onStartTraining={() => navigate(`/cliente/entrenar/${sortedRoutines[0].idRoutineAssignment}`)}
                                        onDownloadPdf={() => handleDownloadSingleRoutinePdf(sortedRoutines[0].idRoutineAssignment, sortedRoutines[0].routine.name)}
                                        isDownloading={downloadingRoutineId === sortedRoutines[0].idRoutineAssignment}
                                    />
                                </div>

                                {/* Rutinas anteriores (si existen) - simplificadas */}
                                {sortedRoutines.length > 1 && (
                                    <div className="bg-white rounded-lg shadow-lg p-3 md:p-6">
                                        <h2 className="text-xl md:text-2xl font-bold mb-4">Rutinas Anteriores</h2>
                                        <div className="space-y-3">
                                            {sortedRoutines.slice(1).map((routine) => (
                                                <div key={routine.idRoutineAssignment} className="bg-gray-50 rounded-lg p-3 md:p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 hover:bg-gray-100 transition-colors border-l-4 border-gray-300">
                                                    <div>
                                                        <h3 className="font-bold text-base md:text-lg">{routine.routine.name}</h3>
                                                        <p className="text-xs md:text-sm text-gray-600">
                                                            Asignada el: {formatDate(routine.assignmentDate)}
                                                        </p>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => navigate(`/cliente/entrenar/${routine.idRoutineAssignment}`)}
                                                            className="flex items-center gap-1 bg-black text-white px-3 py-2 rounded hover:bg-gray-800 transition-colors text-sm whitespace-nowrap"
                                                        >
                                                            Entrenar
                                                        </button>
                                                        <button
                                                            onClick={() => handleDownloadSingleRoutinePdf(routine.idRoutineAssignment, routine.routine.name)}
                                                            disabled={downloadingRoutineId === routine.idRoutineAssignment}
                                                            className={`flex items-center gap-1 px-3 py-2 rounded transition-colors text-sm whitespace-nowrap ${
                                                                downloadingRoutineId === routine.idRoutineAssignment
                                                                    ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                                                                    : 'bg-yellow text-black hover:bg-yellow/80'
                                                            }`}
                                                        >
                                                            {downloadingRoutineId === routine.idRoutineAssignment ? (
                                                                <>
                                                                    <FaSpinner className="animate-spin" />
                                                                    ...
                                                                </>
                                                            ) : (
                                                                'PDF'
                                                            )}
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow-lg p-3 md:p-6">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4 md:mb-6">
                            <h2 className="text-xl md:text-2xl font-bold">Mi Historial de Medidas</h2>
                            <button
                                onClick={() => setShowFileTypeModal(true)}
                                className="flex items-center justify-center gap-2 bg-yellow text-black px-3 md:px-4 py-2 rounded-lg hover:bg-yellow/80 transition-colors text-sm font-semibold whitespace-nowrap w-full sm:w-auto"
                            >
                                <FaDownload />
                                Descargar Completo
                            </button>
                        </div>

                        {/* Mensaje informativo */}
                        <div className="bg-blue-50 border-l-4 border-blue-500 p-3 md:p-4 mb-4 rounded">
                            <p className="text-xs md:text-sm text-blue-800">
                                <strong>Vista simplificada:</strong> Se muestran solo las medidas básicas. Para ver todas las medidas detalladas (circunferencias, grasa visceral, etc.), descarga el reporte completo.
                            </p>
                        </div>

                        {measurements.length === 0 ? (
                            <p className="text-gray-500 text-center py-8 text-sm md:text-base">No tienes medidas registradas aún.</p>
                        ) : (
                            <div className="space-y-4 md:space-y-6">
                                {measurements.map((measurement) => (
                                    <MeasurementCard
                                        key={measurement.idMeasurement}
                                        measurement={measurement}
                                        formatDate={formatDate}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </main>

            {/* Modal de cambio de contraseña con lazy loading */}
            {showChangePasswordModal && (
                <Suspense fallback={<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"><div className="text-white">Cargando...</div></div>}>
                    <ChangePasswordModal
                        onClose={() => setShowChangePasswordModal(false)}
                        onSuccess={() => {
                            setHasProvisionalPassword(false);
                            checkProvisionalPassword();
                        }}
                    />
                </Suspense>
            )}

            {/* Modal de selección de tipo de archivo */}
            {showFileTypeModal && (
                <FileTypeModal
                    onClose={() => setShowFileTypeModal(false)}
                    onDownloadPdf={handleDownloadMeasurementsPdf}
                    onDownloadExcel={handleDownloadMeasurementsExcel}
                    isDownloadingPdf={downloadingMeasurementsPdf}
                    isDownloadingExcel={downloadingMeasurementsExcel}
                />
            )}
            
            {/* Footer con información del desarrollador */}
            <footer className="mt-8 pb-4 text-center">
                <p className="text-xs text-gray-400">
                    Desarrollado por{' '}
                    <a 
                        href="https://geraldcalderon.site" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="hover:text-gray-600 transition-colors underline"
                    >
                        Gerald Calderón
                    </a>
                </p>
            </footer>
        </div>
    );
}

export default ClientDashboard;
