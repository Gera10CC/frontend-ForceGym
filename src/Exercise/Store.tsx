import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { Exercise, ExerciseDataForm } from "../shared/types";
import { deleteData, getData, postData, putData } from "../shared/services/gym";
import { useCommonDataStore } from "../shared/CommonDataStore";


type ExerciseStore = {
    exercises: Exercise[];
    modalForm: boolean;
    modalFilter: boolean;
    modalInfo: boolean;
    activeEditingId: Exercise["idExercise"];
    size: number;
    page: number;
    totalRecords: number;
    orderBy: string;
    directionOrderBy: string;
    searchType: number;
    searchTerm: string;
    filterByStatus: string;
    filterByDifficulty: string;
    filterByCategory: number;

    fetchExercises: () => Promise<any>;
    getExerciseById: (id: number) => void;
    addExercise: (data: ExerciseDataForm) => Promise<any>;
    updateExercise: (data: ExerciseDataForm) => Promise<any>;
    deleteExercise: (id: number, loggedIdUser: number) => Promise<any>;

    changeSize: (newSize: number) => void;
    changePage: (newPage: number) => void;
    changeOrderBy: (newOrderBy: string) => void;
    changeDirectionOrderBy: (newDirectionOrderBy: string) => void;
    changeSearchType: (newSearchType: number) => void;
    changeSearchTerm: (newSearchTerm: string) => void;
    changeFilterByStatus: (newFilterByStatus: string) => void;
    changeFilterByDifficulty: (difficulty: string) => void;
    changeFilterByCategory: (idCategory: number) => void;

    showModalForm: () => void;
    closeModalForm: () => void;
    showModalFilter: () => void;
    closeModalFilter: () => void;
    showModalInfo: () => void;
    closeModalInfo: () => void;
    clearAllFilters: () => void;
    resetEditing: () => void;
};

export const useExerciseStore = create<ExerciseStore>()(
    devtools((set) => ({
        exercises: [],
        modalForm: false,
        modalFilter: false,
        modalInfo: false,
        activeEditingId: 0,
        size: 5,
        page: 1,
        totalRecords: 0,
        orderBy: "",
        directionOrderBy: "DESC",
        searchType: 1,
        searchTerm: "",
        filterByStatus: "",
        filterByDifficulty: "",
        filterByCategory: 0,

        clearAllFilters: () => set(() => ({
            searchTerm: "",
            filterByStatus: "",
            filterByDifficulty: "",
            filterByCategory: 0,
        })),

        fetchExercises: async () => {
            const state = useExerciseStore.getState();
            let newPage = state.page;
            let filters = `&searchType=${state.searchType}`;

            if (state.searchTerm !== "") {
                filters += `&searchTerm=${state.searchTerm}`;
            }
            if (state.orderBy !== "") {
                filters += `&orderBy=${state.orderBy}&directionOrderBy=${state.directionOrderBy}`;
            }
            if (state.filterByStatus !== "") {
                filters += `&filterByStatus=${state.filterByStatus}`;
            }
            if (state.filterByDifficulty !== "") {
                filters += `&filterByDifficulty=${state.filterByDifficulty}`;
            }
            if (state.filterByCategory !== 0) {
            filters += `&filterByCategory=${state.filterByCategory}`;
            }

            const result = await getData(
                `${import.meta.env.VITE_URL_API}exercise/list?size=${state.size}&page=${state.page}${filters}`
            );

            const totalPages = Math.max(1, Math.ceil(result.data.totalRecords / state.size));
            if (state.page > totalPages) {
                newPage = state.page-1; 
            }

            const exercises = result.data?.exercises ?? [];
            const totalRecords = result.data?.totalRecords ?? 0;

            set({ exercises, totalRecords, page: newPage });
            return result;
        },

        getExerciseById: (id) => {
            set(() => ({ activeEditingId: id }));
        },
        resetEditing: () => set(() => ({ activeEditingId: 0 })),

        addExercise: async (data) => {
            const result = await postData(`${import.meta.env.VITE_URL_API}exercise/add`, data);
            if (result?.ok) {
                await useCommonDataStore.getState().refreshAllCommonData();
            }
            return result;
        },

        updateExercise: async (data) => {
            const result = await putData(`${import.meta.env.VITE_URL_API}exercise/update/${data.idExercise}`, data);
            if (result?.ok) {
                await useCommonDataStore.getState().refreshAllCommonData();
            }
            return result;
        },

        deleteExercise: async (id, loggedIdUser) => {
            const result = await deleteData(`${import.meta.env.VITE_URL_API}exercise/delete/${id}?deletedByUser=${loggedIdUser}`, null);
            if (result?.ok) {
                await useCommonDataStore.getState().refreshAllCommonData();
            }
            return result;
        },
        

        changeSize: (newSize) => set(() => ({ size: newSize })),
        changePage: (newPage) => set(() => ({ page: newPage })),
        changeOrderBy: (newOrderBy) => set(() => ({ orderBy: newOrderBy })),
        changeDirectionOrderBy: (newDirectionOrderBy) => set(() => ({ directionOrderBy: newDirectionOrderBy })),
        changeSearchType: (newSearchType) => set(() => ({ searchType: newSearchType })),
        changeSearchTerm: (newSearchTerm) => set(() => ({ searchTerm: newSearchTerm })),
        changeFilterByStatus: (newFilterByStatus) => set(() => ({ filterByStatus: newFilterByStatus })),
        changeFilterByDifficulty: (difficulty) => set(() => ({ filterByDifficulty: difficulty })),
        changeFilterByCategory: (idCategory) => set(() => ({ filterByCategory: idCategory })),
        
        showModalForm: () => set(() => ({ modalForm: true })),
        closeModalForm: () => set(() => ({ modalForm: false })),
        showModalFilter: () => set(() => ({ modalFilter: true })),
        closeModalFilter: () => set(() => ({ modalFilter: false })),
        showModalInfo: () => set(() => ({ modalInfo: true })),
        closeModalInfo: () => set(() => ({ modalInfo: false })),
    }))
);

export default useExerciseStore;