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
                "Paso",
                "Ejercicio",
                "Grupo Muscular",
                "Series",
                "Repeticiones",
                "Indicaciones"
            ];

            let stepCounter = 1;

            const exerciseRows = currentRoutine.exercises?.map((ex) => {
                const details = getExerciseDetails(ex);

                return [
                    `Paso ${stepCounter++}`,
                    details.name,
                    details.category,
                    `${details.series}`,
                    `${details.repetitions}`,
                    details.note && details.note !== "Sin nota"
                        ? details.note
                        : ""
                ];
            }) || [];

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