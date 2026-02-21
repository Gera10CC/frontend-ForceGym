import Swal from 'sweetalert2';
import { Routine, RoutineExerciseDTO } from "../shared/types";
import { useRoutineStore } from "./Store";
import { useCommonDataStore } from "../shared/CommonDataStore";
import { getAuthUser, setAuthHeader, setAuthUser } from "../shared/utils/authentication";
import { useNavigate } from "react-router";
import { exportToPDFRutinas } from "../shared/utils/pdfRutinas";
import { exportToExcelRutinas } from "../shared/utils/excelRutina";
import { mapRoutineToDTO } from '../shared/types/mapper';
import { useState } from 'react';

export const useRoutine = () => {
    const navigate = useNavigate();
    const [refreshKey, setRefreshKey] = useState(0);

    const { 
        routines,
        currentRoutine,
        fetchRoutines, 
        deleteRoutine, 
        updateRoutine,
        getRoutineById
    } = useRoutineStore();

    const { exercise: allExercises } = useCommonDataStore();

    const handleDelete = async ({ idRoutine, name }: Routine) => {
        const result = await Swal.fire({
            title: '¿Desea eliminar la rutina?',
            text: `Estaría eliminando "${name}"`,
            icon: 'question',
            showCancelButton: true,
            cancelButtonText: "Cancelar",
            cancelButtonColor: '#bebdbd',
            confirmButtonText: 'Eliminar',
            confirmButtonColor: '#CFAD04',
            width: 500,
            reverseButtons: true
        });

        if (result.isConfirmed) {
            const response = await deleteRoutine(idRoutine);
            
            if (response?.ok) {
                await fetchRoutines();
                await Swal.fire({
                    title: 'Rutina eliminada',
                    text: `Ha eliminado "${name}"`,
                    icon: 'success',
                    confirmButtonText: 'OK',
                    timer: 3000,
                    timerProgressBar: true,
                    width: 500,
                    confirmButtonColor: '#CFAD04'
                });
            }

            if (response?.logout) {
                setAuthHeader(null);
                setAuthUser(null);
                navigate('/login', { replace: true });
            }
        } 
    };

    const handleRestore = async (routine: Routine) => {
        const loggedUser = getAuthUser();
        if (!loggedUser?.idUser) return;

        const reqRoutine = {
            ...routine,
            paramLoggedIdUser: loggedUser.idUser
        };

        const mappedReqRoutine = mapRoutineToDTO(reqRoutine as Routine);

        const result = await Swal.fire({
            title: '¿Desea restaurar la rutina?',
            text: `Estaría restaurando "${routine.name}"`,
            icon: 'question',
            showCancelButton: true,
            cancelButtonText: "Cancelar",
            cancelButtonColor: '#bebdbd',
            confirmButtonText: 'Restaurar',
            confirmButtonColor: '#CFAD04',
            width: 500,
            reverseButtons: true
        });

        if (result.isConfirmed) {
            const response = await updateRoutine(mappedReqRoutine);

            if (response?.ok) {
                await fetchRoutines();
                await Swal.fire({
                    title: 'Rutina restaurada',
                    text: `Ha restaurado "${routine.name}"`,
                    icon: 'success',
                    confirmButtonText: 'OK',
                    timer: 3000,
                    timerProgressBar: true,
                    width: 500,
                    confirmButtonColor: '#CFAD04'
                });
            }

            if (response?.logout) {
                setAuthHeader(null);
                setAuthUser(null);
                navigate('/login', { replace: true });
            }
        } 
    };

    const getExerciseDetails = (ex: RoutineExerciseDTO) => {
        const globalExercise = allExercises.find(e => e.idExercise === ex.idExercise);

        return {
            name: globalExercise?.name || `Ejercicio #${ex.idExercise}`,
            series: ex.series || 0,
            repetitions: ex.repetitions || 0,
            note: ex.note || "Sin nota",
            category: globalExercise?.exerciseCategory?.name || "Otros",
        };
    };

    const handleExportRoutine = async () => {
        try {
            if (!currentRoutine) throw new Error("Rutina no encontrada");

            const exerciseHeaders = [
                "Día",
                "Categoría",
                "Paso",
                "Ejercicio",
                "Series",
                "Repeticiones",
                "Indicaciones"
            ];

            // Agrupar ejercicios por día
            const exercisesByDay = currentRoutine.exercises?.reduce((acc, ex) => {
                const day = ex.dayNumber || 1;
                if (!acc[day]) acc[day] = [];
                acc[day].push(ex);
                return acc;
            }, {} as Record<number, RoutineExerciseDTO[]>) || {};

            // Ordenar ejercicios dentro de cada día por categoryOrder
            Object.keys(exercisesByDay).forEach((day) => {
                exercisesByDay[Number(day)].sort((a, b) => {
                    return (a.categoryOrder || 0) - (b.categoryOrder || 0);
                });
            });

            const days = Object.keys(exercisesByDay)
                .map(Number)
                .sort((a, b) => a - b);

            const exerciseRows: string[][] = [];
            
            days.forEach((day) => {
                // Agrupar ejercicios del día por categoría manteniendo el orden de categoryOrder
                const exercisesByCategory = exercisesByDay[day].reduce((acc, ex) => {
                    const details = getExerciseDetails(ex);
                    const category = details.category;
                    if (!acc[category]) acc[category] = [];
                    acc[category].push({ exercise: ex, details });
                    return acc;
                }, {} as Record<string, Array<{ exercise: RoutineExerciseDTO; details: ReturnType<typeof getExerciseDetails> }>>);

                // Mantener el orden de aparición de las categorías según categoryOrder, no alfabético
                const categories = Array.from(new Set(
                    exercisesByDay[day].map(ex => getExerciseDetails(ex).category)
                ));

                categories.forEach((category) => {
                    let stepCounter = 1;
                    exercisesByCategory[category].forEach(({ details }) => {
                        exerciseRows.push([
                            `Día ${day}`,
                            category,
                            `Paso ${stepCounter++}`,
                            details.name,
                            `${details.series}`,
                            `${details.repetitions}`,
                            details.note && details.note !== "Sin nota"
                                ? details.note
                                : ""
                        ]);
                    });
                });
            });

            return {
                exportToPDF: () => exportToPDFRutinas(
                    `Rutina ${currentRoutine.name}`,
                    exerciseHeaders,
                    exerciseRows
                ),
                exportToExcel: () => exportToExcelRutinas(
                    `Rutina ${currentRoutine.name}`,
                    exerciseHeaders,
                    exerciseRows
                )
            };

        } catch (error) {
            Swal.fire({
                title: 'Error',
                text: 'Error al generar el reporte: ' + (error instanceof Error ? error.message : String(error)),
                icon: 'error',
                confirmButtonColor: '#CFAD04'
            });
            return null;
        }
    };

    const pdfTableHeaders = ["#", "Nombre", "Ejercicios", "Series", "Reps", "Nota"];
    
    const pdfTableRows = routines.map((routine) => {
        const totals = routine.routineExercises?.reduce((acc, ex) => ({
            series: acc.series + (ex.series || 0),
            reps: acc.reps + (ex.repetitions || 0),
            nots: acc.nots + (ex.note || "")
        }), { series: 0, reps: 0, nots: "" }) || { series: 0, reps: 0, nots: "" };

        return [
            routine.idRoutine.toString(),
            routine.name,
            routine.routineExercises?.length.toString() || "0",
            totals.series.toString(),
            totals.reps.toString(),
            totals.nots
        ];
    });

    return {
        handleDelete,
        handleRestore,
        handleExportRoutine,
        pdfTableHeaders,
        pdfTableRows
    };
};