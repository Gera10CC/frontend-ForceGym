import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { deleteData, getData, postData, putData } from "../shared/services/gym";
import { Client, ClientDataForm } from "../shared/types";
import { formatDateForParam } from "../shared/utils/format";
import { format } from 'date-fns';
import { isCompleteDate } from "../shared/utils/validation";
import { useCommonDataStore } from "../shared/CommonDataStore";

type ClientStore = {
    clients: Client[];
    modalForm: boolean;
    modalFilter: boolean;
    modalInfo: boolean;
    modalFileTypeDecision: boolean;
    activeEditingId: Client['idClient'];
    size: number;
    page: number;
    totalRecords: number;
    orderBy: string;
    directionOrderBy: string;
    searchType: number;
    searchTerm: string;
    filterByStatus: string;
    filterByDiabetes: boolean | null;
    filterByHypertension: boolean | null;
    filterByMuscleInjuries: boolean | null;
    filterByBoneJointIssues: boolean | null;
    filterByBalanceLoss: boolean | null;
    filterByCardiovascularDisease: boolean | null;
    filterByBreathingIssues: boolean | null;
    filterByBirthDateRangeMax: Date | null;
    filterByBirthDateRangeMin: Date | null;
    filterByClientType: number;

    fetchClients: () => Promise<any>;
    getClientById: (id: number) => void;
    addClient: (data: ClientDataForm) => Promise<any>;
    updateClient: (data: ClientDataForm) => Promise<any>;
    deleteClient: (id: number, loggedIdUser: number) => Promise<any>;

    changeSize: (newSize: number) => void;
    changePage: (newPage: number) => void;
    changeOrderBy: (newOrderBy: string) => void;
    changeDirectionOrderBy: (newDirectionOrderBy: string) => void;
    changeSearchType: (newSearchType: number) => void;
    changeSearchTerm: (newSearchTerm: string) => void;
    changeFilterByStatus: (newFilterByStatus: string) => void;
    changeFilterByDiabetes: (newFilter: boolean | null) => void;
    changeFilterByHypertension: (newFilter: boolean | null) => void;
    changeFilterByMuscleInjuries: (newFilter: boolean | null) => void;
    changeFilterByBoneJointIssues: (newFilter: boolean | null) => void;
    changeFilterByBalanceLoss: (newFilter: boolean | null) => void;
    changeFilterByCardiovascularDisease: (newFilter: boolean | null) => void;
    changeFilterByBreathingIssues: (newFilter: boolean | null) => void;
    changeFilterByBirthDateRangeMax: (newFilter: Date | null) => void;
    changeFilterByBirthDateRangeMin: (newFilter: Date | null) => void;
    changeFilterByClientType: (newFilter : number) => void;

    showModalForm: () => void;
    closeModalForm: () => void;
    showModalFilter: () => void;
    closeModalFilter: () => void;
    showModalInfo: () => void;
    closeModalInfo: () => void;
    showModalFileType: () => void;
    closeModalFileType: () => void;
    resetEditing: () => void;

    
    clearAllFilters: () => void;
};

export const useClientStore = create<ClientStore>()(
    devtools((set) => ({
        clients: [],
        modalForm: false,
        modalFilter: false,
        modalInfo: false,
        modalFileTypeDecision: false,
        activeEditingId: 0,
        size: 5,
        page: 1,
        totalRecords: 0,
        orderBy: '',
        directionOrderBy: 'DESC',
        searchType: 1,
        searchTerm: '',
        filterByStatus: '',
        filterByDiabetes: null,
        filterByHypertension: null,
        filterByMuscleInjuries: null,       
        filterByBoneJointIssues: null,
        filterByBalanceLoss: null,
        filterByCardiovascularDisease: null,
        filterByBreathingIssues: null,
        filterByBirthDateRangeMax: null,
        filterByBirthDateRangeMin: null,
        filterByClientType: -1,

        
        clearAllFilters: () => set(() => ({
            searchTerm: '',
            filterByStatus: '',
            filterByDiabetes: null,
            filterByHypertension: null,
            filterByMuscleInjuries: null,       
            filterByBoneJointIssues: null,
            filterByBalanceLoss: null,
            filterByCardiovascularDisease: null,
            filterByBreathingIssues: null,
            filterByBirthDateRangeMax: null,
            filterByBirthDateRangeMin: null,
            filterByClientType: -1,
        })),


        fetchClients: async () => {
            const state = useClientStore.getState();
            let newPage = state.page;
            let filters = `&searchType=${state.searchType}`;

            if (state.searchTerm !== '') {
                filters += `&searchTerm=${state.searchTerm}`;
            }
            if (state.orderBy !== '') {
                filters += `&orderBy=${state.orderBy}&directionOrderBy=${state.directionOrderBy}`;
            }
            if (state.filterByStatus !== '') {
                filters += `&filterByStatus=${state.filterByStatus}`;
            }
            if(state.filterByDiabetes!=null){
                filters += `&filterByDiabetes=${state.filterByDiabetes}`;
            }
            if(state.filterByMuscleInjuries!=null){
                filters += `&filterByMuscleInjuries=${state.filterByMuscleInjuries}`;
            }
            if(state.filterByHypertension!=null){
                filters += `&filterByHypertension=${state.filterByHypertension}`;
            }
            if(state.filterByBoneJointIssues!=null){
                filters += `&filterByBoneJointIssues=${state.filterByBoneJointIssues}`;
            }
            if(state.filterByBalanceLoss!=null){
                filters += `&filterByBalanceLoss=${state.filterByBalanceLoss}`;
            }
            if(state.filterByCardiovascularDisease!=null){
                filters += `&filterByCardiovascularDisease=${state.filterByCardiovascularDisease}`;
            }
            if(state.filterByBreathingIssues!=null){
                filters += `&filterByBreathingIssues=${state.filterByBreathingIssues}`;
            }
            if (
                isCompleteDate(state.filterByBirthDateRangeMax) &&
                isCompleteDate(state.filterByBirthDateRangeMin)
            ) {
                const formattedDateMax = format(state.filterByBirthDateRangeMax!, 'yyyy-MM-dd');
                const formattedDateMin = format(state.filterByBirthDateRangeMin!, 'yyyy-MM-dd');
                filters += `&filterByDateBirthEnd=${formattedDateMax}&filterByDateBirthStart=${formattedDateMin}`;
            }
            if(state.filterByClientType != -1){
                filters += `&filterByClientType=${state.filterByClientType}`;
            }

            const result = await getData(
                `${import.meta.env.VITE_URL_API}client/list?size=${state.size}&page=${state.page}${filters}`
            );

            const totalPages = Math.max(1, Math.ceil(result.data.totalRecords / state.size));
            if (state.page > totalPages) {
                newPage = state.page-1; 
            }

            const clients = result.data?.clients ?? [];
            const totalRecords = result.data?.totalRecords ?? 0;

            set({
                clients,
                totalRecords,
                page: newPage,
            });
            return result;
        },

        getClientById: (id) => {
            set(() => ({ activeEditingId: id }));
        },
        resetEditing: () => set(() => ({ activeEditingId: 0 })),


        addClient: async (data) => {
            const result = await postData(`${import.meta.env.VITE_URL_API}client/add`, data);
            if (result?.ok) {
                await useCommonDataStore.getState().refreshAllCommonData();
            }
            return result;
        },

        updateClient: async (data) => {
            const result = await putData(`${import.meta.env.VITE_URL_API}client/update`, data);
            if (result?.ok) {
                await useCommonDataStore.getState().refreshAllCommonData();
            }
            return result;
        },

        deleteClient: async (id, loggedIdUser) => {
            const result = await deleteData(`${import.meta.env.VITE_URL_API}client/delete/${id}`, loggedIdUser);
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
        changeFilterByDiabetes: (newFilter) => set(() => ({ filterByDiabetes: newFilter })),
        changeFilterByHypertension: (newFilter) => set(() => ({ filterByHypertension: newFilter })),
        changeFilterByMuscleInjuries: (newFilter) => set(() => ({ filterByMuscleInjuries: newFilter })),
        changeFilterByBoneJointIssues: (newFilter) => set(() => ({ filterByBoneJointIssues: newFilter })),
        changeFilterByBalanceLoss: (newFilter) => set(() => ({ filterByBalanceLoss: newFilter })),
        changeFilterByCardiovascularDisease: (newFilter) => set(() => ({ filterByCardiovascularDisease: newFilter })),
        changeFilterByBreathingIssues: (newFilter) => set(() => ({ filterByBreathingIssues: newFilter })),
        changeFilterByBirthDateRangeMax: (newFilter) => set(() => ({ filterByBirthDateRangeMax: newFilter })),
        changeFilterByBirthDateRangeMin: (newFilter) => set(() => ({ filterByBirthDateRangeMin: newFilter })),
        changeFilterByClientType: (newFilter) => set(() => ({ filterByClientType: newFilter })),

        showModalForm: () => set(() => ({ modalForm: true })),
        closeModalForm: () => set(() => ({ modalForm: false })),
        showModalFilter: () => set(() => ({ modalFilter: true })),
        closeModalFilter: () => set(() => ({ modalFilter: false })),
        showModalInfo: () => set(() => ({ modalInfo: true })),
        closeModalInfo: () => set(() => ({ modalInfo: false })),
        showModalFileType: () => set(() => ({ modalFileTypeDecision: true })),
        closeModalFileType: () => set(() => ({ modalFileTypeDecision: false }))
    }))
);

export default useClientStore;