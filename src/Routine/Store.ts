import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { Routine, RoutineWithExercisesDTO } from "../shared/types";
import { deleteData, getData, postData, putData } from "../shared/services/gym";
import { getAuthUser } from "../shared/utils/authentication";
import { useCommonDataStore } from "../shared/CommonDataStore";

type RoutineStore = {
    routines: Routine[];
    modalForm: boolean;
    modalInfo: boolean;
    activeEditingId: number | null;
    routineToEdit: RoutineWithExercisesDTO | null;
    isLoading: boolean;
    error: string | null;
    currentRoutine: RoutineWithExercisesDTO  | null;
    deletingId: number | null;
    restoringId: number | null;

    fetchRoutines: () => Promise<any>;
    getRoutineById: (id: number) => Promise<void>;
    addRoutine: (data: RoutineWithExercisesDTO) => Promise<any>;
    updateRoutine: (data: RoutineWithExercisesDTO) => Promise<any>;
    deleteRoutine: (id: number) => Promise<any>;
    restoreRoutine: (id: number) => Promise<any>;
    duplicateRoutine: (id: number) => Promise<any>;

    showModalForm: (id?: number) => void;
    closeModalForm: () => void;
    showModalInfo: () => void;
    closeModalInfo: () => void;
    resetEditing: () => void;
};

export const useRoutineStore = create<RoutineStore>()(
    devtools((set, get) => ({
        routines: [],
        currentRoutine: null,
        modalForm: false,
        modalInfo: false,
        activeEditingId: null,
        routineToEdit: null,
        isLoading: false,
        error: null,
        deletingId: null,
        restoringId: null,

        fetchRoutines: async () => {
            set({ isLoading: true, error: null });
            try {
                const result = await getData(`${import.meta.env.VITE_URL_API}routine/list`);
                
                if (result?.logout) return { logout: true };
                
                set({ 
                    routines: result?.data ?? [],
                    isLoading: false 
                });
                return result;
            } catch (error) {
                set({ error: 'Error al cargar rutinas', isLoading: false });
                return { ok: false };
            }
        },
        resetEditing: () => set(() => ({ activeEditingId: 0 })),

        
        getRoutineById: async (id) => {
            if (!id || id <= 0) {
                set({ 
                    activeEditingId: null,
                    routineToEdit: null,
                    currentRoutine: null,
                    isLoading: false
                });
                return;
            }
        
        
            set({ isLoading: true });
            try {
                const result = await getData(`${import.meta.env.VITE_URL_API}routine/${id}`);
                
                if (result?.logout) {
                    set({ isLoading: false });
                    return;
                }
                
                const routineDTO = result?.data ?? null;

                set({ 
                    activeEditingId: id,
                    routineToEdit: routineDTO,
                    currentRoutine: routineDTO,
                    isLoading: false
                });
            } catch (error) {
                console.error("Error al obtener rutina:", error);
                set({ 
                    error: 'Error al cargar rutina',
                    isLoading: false,
                    routineToEdit: null,
                    currentRoutine: null
                });
            }
        },

        addRoutine: async (data) => {
            set({ isLoading: true });
            try {
                const result = await postData(
                    `${import.meta.env.VITE_URL_API}routine/add`, 
                    data
                );
                
                if (result?.logout) return { logout: true };
                if (result?.ok) {
                    await get().fetchRoutines();
                    await useCommonDataStore.getState().refreshAllCommonData();
                }
                
                return result;
            } catch (error) {
                set({ error: 'Error al agregar rutina', isLoading: false });
                return { ok: false };
            } finally {
                set({ isLoading: false });
            }
        },

        updateRoutine: async (data) => {
            set({ isLoading: true });
            try {
                const result = await putData(
                    `${import.meta.env.VITE_URL_API}routine/update`, 
                    data
                );
                
                if (result?.logout) return { logout: true };
                if (result?.ok) {
                    await get().fetchRoutines();
                    await useCommonDataStore.getState().refreshAllCommonData();
                }
                
                return result;
            } catch (error) {
                set({ error: 'Error al actualizar rutina', isLoading: false });
                return { ok: false };
            } finally {
                set({ isLoading: false });
            }
        },

        deleteRoutine: async (id) => {
            set({ deletingId: id });
            try {
                const loggedUser = getAuthUser();
                if (!loggedUser?.idUser) throw new Error('Usuario no autenticado');
                
                const result = await deleteData(
                    `${import.meta.env.VITE_URL_API}routine/delete/${id}`,
                    { userId: loggedUser.idUser }
                );
                
                if (result?.logout) return { logout: true };
                if (result?.ok) {
                    await get().fetchRoutines();
                    await useCommonDataStore.getState().refreshAllCommonData();
                    return result;
                }
                
                return result;
            } catch (error) {
                set({ error: 'Error al eliminar rutina' });
                return { ok: false };
            } finally {
                set({ deletingId: null });
            }
        },
        
        restoreRoutine: async (id) => {
            set({ restoringId: id });
            try {
                const loggedUser = getAuthUser();
                if (!loggedUser?.idUser) throw new Error('Usuario no autenticado');
                
                const result = await putData(
                    `${import.meta.env.VITE_URL_API}routine/restore/${id}`,
                    { userId: loggedUser.idUser }
                );
                
                if (result?.logout) return { logout: true };
                if (result?.ok) {
                    await get().fetchRoutines();
                    await useCommonDataStore.getState().refreshAllCommonData();
                }
                
                return result;
            } catch (error) {
                set({ error: 'Error al restaurar rutina' });
                return { ok: false };
            } finally {
                set({ restoringId: null });
            }
        },

        duplicateRoutine: async (id) => {
            set({ isLoading: true });
            try {
                const loggedUser = getAuthUser();
                if (!loggedUser?.idUser) throw new Error('Usuario no autenticado');
                
                // Obtener la rutina completa
                const result = await getData(`${import.meta.env.VITE_URL_API}routine/${id}`);
                
                if (result?.logout) return { logout: true };
                
                const originalRoutine = result?.data;
                if (!originalRoutine) {
                    throw new Error('No se pudo obtener la rutina original');
                }

                // Crear una copia de la rutina sin ID y sin asignaciones
                const duplicatedRoutine: RoutineWithExercisesDTO = {
                    name: `${originalRoutine.name} (Copia)`,
                    date: new Date().toISOString().split('T')[0],
                    idUser: loggedUser.idUser,
                    difficultyRoutine: originalRoutine.difficultyRoutine,
                    exercises: originalRoutine.exercises.map((ex: any) => ({
                        idExercise: ex.exercise?.idExercise || ex.idExercise,
                        series: ex.series,
                        repetitions: ex.repetitions,
                        note: ex.note || '',
                        categoryOrder: ex.categoryOrder,
                        dayNumber: ex.dayNumber
                    })),
                    assignments: [], // No copiar asignaciones
                    isDeleted: 0,
                    paramLoggedIdUser: loggedUser.idUser
                };

                // Guardar la rutina duplicada
                const addResult = await postData(
                    `${import.meta.env.VITE_URL_API}routine/add`,
                    duplicatedRoutine
                );
                
                if (addResult?.logout) return { logout: true };
                if (addResult?.ok) {
                    await get().fetchRoutines();
                    await useCommonDataStore.getState().refreshAllCommonData();
                }
                
                return addResult;
            } catch (error) {
                console.error('Error al duplicar rutina:', error);
                set({ error: 'Error al duplicar rutina', isLoading: false });
                return { ok: false };
            } finally {
                set({ isLoading: false });
            }
        },

        showModalForm: (id) => {
            if (id) {
                get().getRoutineById(id);
            }
            set({ modalForm: true });
        },

        closeModalForm: () => {
            set({ 
                modalForm: false,
                activeEditingId: null,
                routineToEdit: null
            });
        },

        showModalInfo: () => {
            set({ modalInfo: true });
        },

        closeModalInfo: () => {
            set({ modalInfo: false });
        }
    }))
);

export default useRoutineStore;