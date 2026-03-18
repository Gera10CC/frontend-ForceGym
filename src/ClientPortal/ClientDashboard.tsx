import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { clientPortalService } from './clientPortalService';
import type { ClientLogin, ClientRoutine, Measurement } from '../shared/types';
import Swal from 'sweetalert2';
import { FaDownload, FaSignOutAlt, FaDumbbell, FaRulerVertical, FaKey, FaExclamationTriangle, FaVideo, FaPlay, FaCalendarAlt, FaCheckCircle, FaClock, FaFilePdf, FaFileExcel } from 'react-icons/fa';
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
    const [showFileTypeModal, setShowFileTypeModal] = useState(false);
    const [showMoreRoutines, setShowMoreRoutines] = useState(false);

    // Colores para cada día (igual que en el PDF)
    const dayColors = [
        'rgb(207, 173, 4)',   // Día 1 - Amarillo
        'rgb(0, 123, 255)',   // Día 2 - Azul
        'rgb(40, 167, 69)',   // Día 3 - Verde
        'rgb(255, 159, 64)',  // Día 4 - Naranja
        'rgb(111, 66, 193)',  // Día 5 - Púrpura
        'rgb(220, 53, 69)',   // Día 6 - Rojo
        'rgb(23, 162, 184)',  // Día 7 - Cian
    ];

    useEffect(() => {
        const storedClientData = localStorage.getItem('clientData');
        const clientToken = localStorage.getItem('clientToken');
        
        if (!storedClientData || !clientToken) {
            navigate('/cliente');
            return;
        }

        // Cargar datos iniciales del localStorage mientras se obtienen los actualizados
        setClientData(JSON.parse(storedClientData));
        loadData();
        loadUpdatedProfile();
        checkProvisionalPassword();
    }, [navigate]);

    const loadUpdatedProfile = async () => {
        try {
            // Obtener datos actualizados del perfil (incluye fecha de vencimiento actualizada)
            const updatedProfile = await clientPortalService.getMyProfile();
            const clientToken = localStorage.getItem('clientToken');
            
            if (updatedProfile && clientToken) {
                // Mantener el token del localStorage pero actualizar los demás datos
                const updatedClientData: ClientLogin = {
                    ...updatedProfile,
                    token: clientToken
                };
                
                // Actualizar localStorage y estado
                localStorage.setItem('clientData', JSON.stringify(updatedClientData));
                setClientData(updatedClientData);
            }
        } catch (error: any) {
            // Si es error 401 o 403, el interceptor ya manejó la redirección
            // Para otros errores, simplemente usar los datos del localStorage
            if (error?.response?.status !== 401 && error?.response?.status !== 403) {
                console.log('Error al actualizar perfil, usando datos locales');
            }
        }
    };

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
        } catch (error: any) {
            // Si es error 401 o 403, el interceptor ya manejó la redirección
            // Para otros errores, simplemente no afecta la experiencia
            if (error?.response?.status !== 401 && error?.response?.status !== 403) {
                console.log('Error al verificar contraseña provisional');
            }
        }
    };

    const loadData = async () => {
        try {
            setLoading(true);
            const [routinesData, measurementsData] = await Promise.all([
                clientPortalService.getMyRoutines(),
                clientPortalService.getMyMeasurements()
            ]);
            
            // Ordenar rutinas por fecha de asignación (más reciente primero)
            const sortedRoutines = [...routinesData].sort((a, b) => {
                const dateA = new Date(a.assignmentDate).getTime();
                const dateB = new Date(b.assignmentDate).getTime();
                return dateB - dateA; // Descendente: más nueva primero
            });
            
            setRoutines(sortedRoutines);
            setMeasurements(measurementsData);
        } catch (error: any) {
            // Si es error 401 o 403, el interceptor ya manejó la redirección
            // Solo mostrar alerta si NO es un error de autenticación
            if (error?.response?.status !== 401 && error?.response?.status !== 403) {
                await Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error al cargar los datos'
                });
            }
            // Si es 401 o 403, no hacemos nada porque el interceptor ya redirigió
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
            navigate('/cliente');
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
        } catch (error: any) {
            // Si es error 401 o 403, el interceptor ya manejó la redirección
            if (error?.response?.status !== 401 && error?.response?.status !== 403) {
                await Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error al descargar el PDF'
                });
            }
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
        } catch (error: any) {
            // Si es error 401 o 403, el interceptor ya manejó la redirección
            if (error?.response?.status !== 401 && error?.response?.status !== 403) {
                await Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error al descargar el PDF'
                });
            }
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
            setShowFileTypeModal(false);
            await Swal.fire({
                icon: 'success',
                title: 'PDF descargado',
                timer: 1500,
                showConfirmButton: false
            });
        } catch (error: any) {
            // Si es error 401 o 403, el interceptor ya manejó la redirección
            if (error?.response?.status !== 401 && error?.response?.status !== 403) {
                await Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error al descargar el PDF'
                });
            }
        }
    };

    const handleDownloadMeasurementsExcel = async () => {
        try {
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
            // Si es error 401 o 403, el interceptor ya manejó la redirección
            if (error?.response?.status !== 401 && error?.response?.status !== 403) {
                await Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error al descargar el Excel'
                });
            }
        }
    };

    // Formatea fechas sin problemas de zona horaria
    const formatDate = (date: Date | string) => {
        if (!date) return 'Sin fecha';
        
        // Si es string, extraer directamente año-mes-día
        let year: number, month: number, day: number;
        
        if (typeof date === 'string') {
            const dateOnly = date.split('T')[0]; // Toma solo YYYY-MM-DD
            const parts = dateOnly.split('-');
            year = parseInt(parts[0]);
            month = parseInt(parts[1]) - 1; // Los meses en JS van de 0-11
            day = parseInt(parts[2]);
        } else {
            year = date.getFullYear();
            month = date.getMonth();
            day = date.getDate();
        }
        
        // Crear fecha local sin zona horaria
        const localDate = new Date(year, month, day);
        return localDate.toLocaleDateString('es-CR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getMembershipStatus = () => {
        if (!clientData?.expirationMembershipDate) {
            return { status: 'unknown', daysRemaining: 0, lastValidDay: null };
        }
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        // Parsear fecha de vencimiento sin zona horaria
        let expirationDate: Date;
        const dateValue = clientData.expirationMembershipDate;
        
        if (typeof dateValue === 'string') {
            const dateOnly = dateValue.split('T')[0]; // Toma solo YYYY-MM-DD
            const [year, month, day] = dateOnly.split('-').map(Number);
            expirationDate = new Date(year, month - 1, day); // Crear fecha local
        } else {
            expirationDate = new Date(dateValue);
        }
        expirationDate.setHours(0, 0, 0, 0);
        
        // El último día válido de ingreso es el día ANTERIOR a la fecha de vencimiento
        const lastValidDay = new Date(expirationDate);
        lastValidDay.setDate(lastValidDay.getDate() - 1);
        
        const diffTime = lastValidDay.getTime() - today.getTime();
        const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (daysRemaining < 0) {
            return { status: 'expired', daysRemaining: Math.abs(daysRemaining), lastValidDay };
        } else if (daysRemaining === 0) {
            return { status: 'lastDay', daysRemaining: 0, lastValidDay };
        } else if (daysRemaining <= 6) {
            return { status: 'warning', daysRemaining, lastValidDay };
        } else {
            return { status: 'active', daysRemaining, lastValidDay };
        }
    };

    const membershipStatus = getMembershipStatus();

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

            {/* Tarjeta de estado de membresía */}
            {clientData?.expirationMembershipDate && (
                <div className="container mx-auto px-3 md:px-8 pt-3 md:pt-4">
                    <div className={`rounded-lg shadow-lg p-4 md:p-6 ${
                        membershipStatus.status === 'expired' 
                            ? 'bg-red-100 border-l-4 border-red-500' 
                            : membershipStatus.status === 'lastDay'
                                ? 'bg-orange-100 border-l-4 border-orange-500'
                                : membershipStatus.status === 'warning'
                                    ? 'bg-yellow-100 border-l-4 border-yellow-500'
                                    : 'bg-green-100 border-l-4 border-green-500'
                    }`}>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <div className="flex items-start gap-3">
                                {membershipStatus.status === 'expired' ? (
                                    <FaExclamationTriangle className="text-red-500 text-2xl md:text-3xl mt-1 flex-shrink-0" />
                                ) : membershipStatus.status === 'lastDay' ? (
                                    <FaClock className="text-orange-500 text-2xl md:text-3xl mt-1 flex-shrink-0" />
                                ) : membershipStatus.status === 'warning' ? (
                                    <FaClock className="text-yellow-600 text-2xl md:text-3xl mt-1 flex-shrink-0" />
                                ) : (
                                    <FaCheckCircle className="text-green-500 text-2xl md:text-3xl mt-1 flex-shrink-0" />
                                )}
                                <div>
                                    <h3 className={`font-bold text-lg md:text-xl ${
                                        membershipStatus.status === 'expired' 
                                            ? 'text-red-700' 
                                            : membershipStatus.status === 'lastDay'
                                                ? 'text-orange-700'
                                                : membershipStatus.status === 'warning'
                                                    ? 'text-yellow-700'
                                                    : 'text-green-700'
                                    }`}>
                                        {membershipStatus.status === 'expired' 
                                            ? 'Membresía Vencida' 
                                            : membershipStatus.status === 'lastDay'
                                                ? '¡Último Día de Membresía!'
                                                : membershipStatus.status === 'warning'
                                                    ? 'Membresía por Vencer'
                                                    : 'Membresía Activa'}
                                    </h3>
                                    <p className={`text-sm md:text-base ${
                                        membershipStatus.status === 'expired' 
                                            ? 'text-red-600' 
                                            : membershipStatus.status === 'lastDay'
                                                ? 'text-orange-600'
                                                : membershipStatus.status === 'warning'
                                                    ? 'text-yellow-700'
                                                    : 'text-green-600'
                                    }`}>
                                        {membershipStatus.status === 'expired' 
                                            ? `Tu membresía venció hace ${membershipStatus.daysRemaining} día${membershipStatus.daysRemaining !== 1 ? 's' : ''}.` 
                                            : membershipStatus.status === 'lastDay'
                                                ? 'Hoy es tu último día para ingresar al gimnasio.'
                                                : membershipStatus.status === 'warning'
                                                    ? `Te quedan ${membershipStatus.daysRemaining} día${membershipStatus.daysRemaining !== 1 ? 's' : ''} de membresía.`
                                                    : `Te quedan ${membershipStatus.daysRemaining} día${membershipStatus.daysRemaining !== 1 ? 's' : ''} de membresía.`}
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-col items-start sm:items-end">
                                <div className="flex items-center gap-2 text-gray-600">
                                    <FaCalendarAlt />
                                    <span className="text-xs md:text-sm font-medium">Último día de ingreso:</span>
                                </div>
                                <span className="text-base md:text-lg font-bold text-gray-800">
                                    {membershipStatus.lastValidDay && formatDate(membershipStatus.lastValidDay)}
                                </span>
                            </div>
                        </div>
                        {membershipStatus.status === 'expired' && (
                            <p className="mt-3 text-sm text-red-600 bg-red-50 p-2 rounded">
                                Por favor, acércate a recepción para renovar tu membresía y continuar disfrutando de nuestros servicios.
                            </p>
                        )}
                        {membershipStatus.status === 'lastDay' && (
                            <p className="mt-3 text-sm text-orange-600 bg-orange-50 p-2 rounded">
                                ⚠️ Renueva tu membresía mañana para no perder acceso al gimnasio.
                            </p>
                        )}
                        {membershipStatus.status === 'warning' && (
                            <p className="mt-3 text-sm text-yellow-700 bg-yellow-50 p-2 rounded">
                                Recuerda renovar tu membresía pronto para no perder acceso al gimnasio.
                            </p>
                        )}
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
                    <div className="space-y-4 md:space-y-6">
                        {routines.length === 0 ? (
                            <div className="bg-white rounded-lg shadow-lg p-3 md:p-6">
                                <p className="text-gray-500 text-center py-8 text-sm md:text-base">No tienes rutinas asignadas aún.</p>
                            </div>
                        ) : (
                            <>
                                {/* ===== RUTINA MÁS RECIENTE ===== */}
                                <div className="bg-white rounded-lg shadow-lg p-3 md:p-6">
                                    <div className="mb-4 md:mb-6">
                                        <h2 className="text-xl md:text-2xl font-bold">Mi Rutina Actual</h2>
                                    </div>
                                    
                                    {(() => {
                                        const mostRecentRoutine = routines[0];
                                        return (
                                            <div className="border-2 border-yellow rounded-lg p-4 md:p-6">
                                                {/* Header de la rutina */}
                                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-6">
                                                    <div className="flex-1">
                                                        <h3 className="text-2xl md:text-3xl font-bold text-yellow mb-2">{mostRecentRoutine.routine.name}</h3>
                                                        <p className="text-sm md:text-base text-gray-600">
                                                        Asignada el: {formatDate(mostRecentRoutine.assignmentDate)}
                                                        </p>
                                                        <p className="text-sm md:text-base text-gray-600">
                                                        Dificultad: {mostRecentRoutine.routine.difficultyRoutine?.name || 'N/A'}
                                                        </p>
                                                    </div>
                                                    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                                                        <button
                                                            onClick={() => navigate(`/cliente/entrenar/${mostRecentRoutine.idRoutineAssignment}`)}
                                                            className="flex items-center justify-center gap-2 bg-black text-white px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors text-sm font-semibold whitespace-nowrap"
                                                        >
                                                            <FaPlay />
                                                            Entrenar Ahora
                                                        </button>
                                                        <button
                                                            onClick={() => handleDownloadSingleRoutinePdf(mostRecentRoutine.idRoutineAssignment, mostRecentRoutine.routine.name)}
                                                            className="flex items-center justify-center gap-2 bg-yellow text-black px-4 py-3 rounded-lg hover:bg-yellow/80 transition-colors text-sm font-semibold whitespace-nowrap"
                                                        >
                                                            <FaDownload />
                                                            Descargar PDF
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Días y ejercicios con colores */}
                                                {mostRecentRoutine.routine.routineExercises && mostRecentRoutine.routine.routineExercises.length > 0 && (
                                                    <div className="mt-6">
                                                        {(() => {
                                                            // Agrupar ejercicios por día
                                                            const exercisesByDay = mostRecentRoutine.routine.routineExercises.reduce((acc, re) => {
                                                                const day = re.dayNumber || 1;
                                                                if (!acc[day]) acc[day] = [];
                                                                acc[day].push(re);
                                                                return acc;
                                                            }, {} as Record<number, typeof mostRecentRoutine.routine.routineExercises>);

                                                            const days = Object.keys(exercisesByDay).map(Number).sort((a, b) => a - b);

                                                            return (
                                                                <div className="space-y-6">
                                                                    {days.map((day) => {
                                                                        const dayColor = dayColors[(day - 1) % dayColors.length];
                                                                        
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
                                                                            <div key={day} className="border-2 rounded-lg p-4 md:p-5" style={{ borderColor: dayColor, backgroundColor: `${dayColor}10` }}>
                                                                                {/* Título del día con color */}
                                                                                <div className="flex items-center gap-3 mb-4 pb-3 border-b-2" style={{ borderColor: dayColor }}>
                                                                                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-white font-bold text-xl md:text-2xl" style={{ backgroundColor: dayColor }}>
                                                                                        {day}
                                                                                    </div>
                                                                                    <h5 className="font-bold text-xl md:text-2xl" style={{ color: dayColor }}>DÍA {day}</h5>
                                                                                </div>

                                                                                {/* Categorías y ejercicios */}
                                                                                <div className="space-y-4">
                                                                                    {categories.map((category) => (
                                                                                        <div key={category}>
                                                                                            <h6 className="font-bold text-base md:text-lg mb-3 px-3 py-2 rounded" style={{ backgroundColor: dayColor, color: 'white' }}>
                                                                                                {category}
                                                                                            </h6>
                                                                                            
                                                                                            {/* Vista móvil (cards) */}
                                                                                            <div className="md:hidden space-y-3">
                                                                                                {exercisesByCategory[category].map((re, idx) => (
                                                                                                    <div key={idx} className="bg-white p-4 rounded-lg border-2" style={{ borderColor: dayColor }}>
                                                                                                        <div className="font-semibold text-base mb-3" style={{ color: dayColor }}>{re.exercise?.name || 'N/A'}</div>
                                                                                                        <div className="grid grid-cols-2 gap-3 text-sm">
                                                                                                            <div className="bg-gray-50 p-2 rounded">
                                                                                                                <span className="text-gray-500 text-xs">Series:</span>
                                                                                                                <span className="ml-1 font-bold" style={{ color: dayColor }}>{re.series || 'N/A'}</span>
                                                                                                            </div>
                                                                                                            <div className="bg-gray-50 p-2 rounded">
                                                                                                                <span className="text-gray-500 text-xs">Reps:</span>
                                                                                                                <span className="ml-1 font-bold" style={{ color: dayColor }}>{re.repetitions || 'N/A'}</span>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                        {re.note && re.note !== '-' && (
                                                                                                            <div className="mt-3 text-sm text-gray-700 bg-gray-50 p-2 rounded">
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
                                                                                            <div className="hidden md:block overflow-x-auto">
                                                                                                <table className="min-w-full bg-white rounded-lg overflow-hidden">
                                                                                                    <thead style={{ backgroundColor: dayColor }}>
                                                                                                        <tr>
                                                                                                            <th className="px-4 py-3 text-left text-sm font-bold text-white">Ejercicio</th>
                                                                                                            <th className="px-4 py-3 text-center text-sm font-bold text-white">Series</th>
                                                                                                            <th className="px-4 py-3 text-center text-sm font-bold text-white">Repeticiones</th>
                                                                                                            <th className="px-4 py-3 text-left text-sm font-bold text-white">Notas</th>
                                                                                                            <th className="px-4 py-3 text-center text-sm font-bold text-white">Video</th>
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
                                                                                                                            className="inline-flex items-center gap-1 font-medium hover:underline"
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
                                                            );
                                                        })()}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })()}
                                </div>

                                {/* ===== RUTINAS ADICIONALES (COLAPSABLES) ===== */}
                                {routines.length > 1 && (
                                    <div className="bg-white rounded-lg shadow-lg p-3 md:p-6">
                                        <button
                                            onClick={() => setShowMoreRoutines(!showMoreRoutines)}
                                            className="w-full flex items-center justify-between text-left mb-4"
                                        >
                                            <h2 className="text-xl md:text-2xl font-bold">
                                                Rutinas Anteriores ({routines.length - 1})
                                            </h2>
                                            <span className="text-2xl font-bold text-yellow">
                                                {showMoreRoutines ? '−' : '+'}
                                            </span>
                                        </button>

                                        {showMoreRoutines && (
                                            <div className="space-y-4 md:space-y-6">
                                                {routines.slice(1).map((assignment) => (
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
                                                    onClick={() => navigate(`/cliente/entrenar/${assignment.idRoutineAssignment}`)}
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
                                    <div key={measurement.idMeasurement} className="border-2 border-yellow rounded-lg p-4 md:p-5">
                                        <h3 className="text-lg md:text-xl font-bold mb-4 text-yellow flex items-center gap-2">
                                            Medición del: {formatDate(measurement.measurementDate)}
                                        </h3>
                                        
                                        {/* Medidas básicas */}
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                                            <div className="bg-gradient-to-br from-yellow/10 to-yellow/5 border-2 border-yellow p-3 md:p-4 rounded-lg">
                                                <p className="text-xs md:text-sm text-gray-600 font-medium mb-1">Peso</p>
                                                <p className="text-xl md:text-2xl font-bold text-yellow">{measurement.weight} <span className="text-base md:text-lg">kg</span></p>
                                            </div>
                                            <div className="bg-gradient-to-br from-blue-50 to-blue-25 border-2 border-blue-500 p-3 md:p-4 rounded-lg">
                                                <p className="text-xs md:text-sm text-gray-600 font-medium mb-1">Altura</p>
                                                <p className="text-xl md:text-2xl font-bold text-blue-600">{measurement.height} <span className="text-base md:text-lg">cm</span></p>
                                            </div>
                                            <div className="bg-gradient-to-br from-green-50 to-green-25 border-2 border-green-500 p-3 md:p-4 rounded-lg">
                                                <p className="text-xs md:text-sm text-gray-600 font-medium mb-1">Masa Muscular</p>
                                                <p className="text-xl md:text-2xl font-bold text-green-600">{measurement.muscleMass}</p>
                                            </div>
                                            <div className="bg-gradient-to-br from-orange-50 to-orange-25 border-2 border-orange-500 p-3 md:p-4 rounded-lg">
                                                <p className="text-xs md:text-sm text-gray-600 font-medium mb-1">% Grasa Corporal</p>
                                                <p className="text-xl md:text-2xl font-bold text-orange-600">{measurement.bodyFatPercentage}<span className="text-base md:text-lg">%</span></p>
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

            {/* Modal de selección de tipo de archivo */}
            {showFileTypeModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                        <h3 className="text-xl font-bold mb-4 text-center">Seleccionar formato de descarga</h3>
                        <p className="text-gray-600 text-sm mb-6 text-center">
                            Elige el formato en el que deseas descargar tu historial de medidas
                        </p>
                        
                        <div className="space-y-3">
                            <button
                                onClick={handleDownloadMeasurementsPdf}
                                className="w-full flex items-center justify-center gap-3 bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-lg transition-colors"
                            >
                                <FaFilePdf className="text-xl" />
                                <span className="font-semibold">Descargar PDF</span>
                            </button>
                            
                            <button
                                onClick={handleDownloadMeasurementsExcel}
                                className="w-full flex items-center justify-center gap-3 bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg transition-colors"
                            >
                                <FaFileExcel className="text-xl" />
                                <span className="font-semibold">Descargar Excel</span>
                            </button>
                            
                            <button
                                onClick={() => setShowFileTypeModal(false)}
                                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 px-4 rounded-lg transition-colors font-semibold"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
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
