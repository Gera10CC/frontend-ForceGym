import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { ExerciseCategory } from "../shared/types";
import { deleteData, getData, postData, putData } from "../shared/services/gym";
import { useCommonDataStore } from "../shared/CommonDataStore";

type ExerciseCategoryStore = {
    categories: ExerciseCategory[];
    modalForm: boolean;
    modalFilter: boolean;
    activeEditingId: ExerciseCategory["idExerciseCategory"];
    size: number;
    page: number;
    totalRecords: number;
    filterByStatus: string;

    changeSize: (newSize: number) => void;
    changePage: (newPage: number) => void;
    changeFilterByStatus: (newFilterByStatus: string) => void;

    fetchExerciseCategories: () => Promise<any>;
    getExerciseCategoryById: (id: number) => void;
    addExerciseCategory: (data: ExerciseCategory) => Promise<any>;
    updateExerciseCategory: (data: ExerciseCategory) => Promise<any>;
    deleteExerciseCategory: (id: number, loggedIdUser: number) => Promise<any>;

    showModalForm: () => void;
    closeModalForm: () => void;
    showModalFilter: () => void;
    closeModalFilter: () => void;
};

export const useExerciseCategoryStore = create<ExerciseCategoryStore>()(
    devtools((set) => ({
        categories: [],
        modalForm: false,
        modalFilter: false,
        activeEditingId: 0,
        size: 5,
        page: 1,
        totalRecords: 0,
        filterByStatus: "",

        fetchExerciseCategories: async () => {
            const state = useExerciseCategoryStore.getState();
            let filters = ``;
            let newPage = state.page;

            if (state.filterByStatus !== "") {
                filters += `&filterByStatus=${state.filterByStatus}`;
            }
            const result = await getData(
                `${import.meta.env.VITE_URL_API}exerciseCategory/list?size=${state.size}&page=${state.page}${filters}`
            );

            const totalPages = Math.max(1, Math.ceil(result.data.totalRecords / state.size));
            if (state.page > totalPages) {
                newPage = state.page-1; 
            }

            const categories = result.data?.exerciseCategories ?? [];
            const totalRecords = result.data?.totalRecords ?? 0;

            set({ categories, totalRecords, page: newPage });
            return result;
        },

        getExerciseCategoryById: (id) => {
            set(() => ({ activeEditingId: id }));
        },

        addExerciseCategory: async (data) => {
            const result = await postData(`${import.meta.env.VITE_URL_API}exerciseCategory/add`, data);
            if (result?.ok) {
                await useCommonDataStore.getState().refreshAllCommonData();
            }
            return result;
        },

        updateExerciseCategory: async (data) => {
            const result = await putData(`${import.meta.env.VITE_URL_API}exerciseCategory/update`, data);
            if (result?.ok) {
                await useCommonDataStore.getState().refreshAllCommonData();
            }
            return result;
        },

        deleteExerciseCategory: async (id, loggedIdUser) => {
            const result = await deleteData(`${import.meta.env.VITE_URL_API}exerciseCategory/delete/${id}`, loggedIdUser);
            if (result?.ok) {
                await useCommonDataStore.getState().refreshAllCommonData();
            }
            return result;
        },

        changeSize: (newSize) => set(() => ({ size: newSize })),
        changePage: (newPage) => set(() => ({ page: newPage })),
        changeFilterByStatus: (newFilterByStatus) => set(() => ({ filterByStatus: newFilterByStatus })),
        
        showModalForm: () => set(() => ({ modalForm: true })),
        closeModalForm: () => set(() => ({ modalForm: false })),
        showModalFilter: () => set(() => ({ modalFilter: true })),
        closeModalFilter: () => set(() => ({ modalFilter: false }))
    }))
);

export default useExerciseCategoryStore;
