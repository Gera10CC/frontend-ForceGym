import Swal from 'sweetalert2';
import { Routine } from "../shared/types";
import { useRoutineStore } from "./Store";
import { getAuthUser, setAuthHeader, setAuthUser } from "../shared/utils/authentication";
import { useNavigate } from "react-router";
import { mapRoutineToDTO } from '../shared/types/mapper';
import axios from 'axios';

export const useRoutine = () => {
    const navigate = useNavigate();

    const { 
        fetchRoutines, 
        deleteRoutine, 
        updateRoutine,
        getRoutineById,
        duplicateRoutine,
        deletingId,
        restoringId
    } = useRoutineStore();

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

    const handleDuplicate = async ({ idRoutine, name }: Routine) => {
        const result = await Swal.fire({
            title: '¿Desea duplicar la rutina?',
            text: `Se creará una copia de "${name}"`,
            icon: 'question',
            showCancelButton: true,
            cancelButtonText: "Cancelar",
            cancelButtonColor: '#bebdbd',
            confirmButtonText: 'Duplicar',
            confirmButtonColor: '#CFAD04',
            width: 500,
            reverseButtons: true
        });

        if (result.isConfirmed) {
            const response = await duplicateRoutine(idRoutine);
            
            if (response?.ok) {
                await fetchRoutines();
                await Swal.fire({
                    title: 'Rutina duplicada',
                    text: `Se ha creado una copia de "${name}"`,
                    icon: 'success',
                    confirmButtonText: 'OK',
                    timer: 3000,
                    timerProgressBar: true,
                    width: 500,
                    confirmButtonColor: '#CFAD04'
                });
            } else {
                await Swal.fire({
                    title: 'Error',
                    text: 'No se pudo duplicar la rutina',
                    icon: 'error',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#d33'
                });
            }

            if (response?.logout) {
                setAuthHeader(null);
                setAuthUser(null);
                navigate('/login', { replace: true });
            }
        } 
    };

    const handleExportRoutine = async (idRoutine: number, routineName: string) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(
                `${import.meta.env.VITE_URL_API}routine/export-pdf/${idRoutine}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    responseType: "blob",
                }
            );

            const blob = new Blob([response.data], { type: "application/pdf" });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `rutina_${routineName.replace(/\s+/g, "_")}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            await Swal.fire({
                title: 'PDF descargado',
                text: `La rutina "${routineName}" se ha descargado exitosamente`,
                icon: 'success',
                confirmButtonText: 'OK',
                timer: 2000,
                timerProgressBar: true,
                confirmButtonColor: '#CFAD04'
            });
        } catch (error) {
            console.error("Error al exportar PDF:", error);
            Swal.fire({
                title: 'Error',
                text: 'Error al generar el PDF: ' + (error instanceof Error ? error.message : String(error)),
                icon: 'error',
                confirmButtonColor: '#CFAD04'
            });
        }
    };

    return {
        handleDelete,
        handleRestore,
        handleDuplicate,
        handleExportRoutine,
        deletingId,
        restoringId
    };
};