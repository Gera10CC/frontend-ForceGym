import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { ClientType, ClientTypeDataForm } from "../shared/types";
import { deleteData, getData, postData, putData } from "../shared/services/gym";
import { useCommonDataStore } from "../shared/CommonDataStore";

type ClientTypeStore = {
    clientTypes: ClientType[]
    modalForm: boolean
    modalFilter: boolean
    modalInfo: boolean
    activeEditingId: ClientType['idClientType']
    size: number
    page: number
    totalRecords: number
    orderBy: string
    directionOrderBy: string
    searchType: number
    searchTerm: string
    filterByStatus: string

    fetchClientTypes: () => Promise<any>
    getClientTypeById: (id: number) => void
    addClientType: (data: ClientTypeDataForm) => Promise<any>
    updateClientType: (data: ClientTypeDataForm) => Promise<any>
    deleteClientType: (id: number, loggedIdUser: number) => Promise<any>;

    changeSize: (newSize: number) => void
    changePage: (newPage: number) => void
    changeOrderBy: (newOrderBy: string) => void
    changeDirectionOrderBy: (newDirectionOrderBy: string) => void
    changeSearchType: (newSearchType: number) => void
    changeSearchTerm: (newSearchTerm: string) => void
    changeFilterByStatus: (newFilterByStatus: string) => void

    showModalForm: () => void
    closeModalForm: () => void
    showModalFilter: () => void
    closeModalFilter: () => void
    showModalInfo: () => void
    closeModalInfo: () => void
}

const useClientTypeStore = create<ClientTypeStore>()(
    devtools((set) => ({
        clientTypes: [],
        modalForm: false,
        modalFilter: false,
        modalInfo: false,
        activeEditingId: 0,
        size: 5,
        page: 1,
        totalRecords: 0,
        orderBy: '',
        directionOrderBy: 'DESC',
        searchType: 1,
        searchTerm: '',
        filterByStatus: '',

        fetchClientTypes: async () => {
            const state = useClientTypeStore.getState()
            let newPage = state.page;
            let filters = `&searchType=${state.searchType}`
        
            if (state.searchTerm !== '') {
                filters += `&searchTerm=${state.searchTerm}`
            }
            if (state.orderBy !== '') {
                filters += `&orderBy=${state.orderBy}&directionOrderBy=${state.directionOrderBy}`
            }
            if (state.filterByStatus !== '') {
                filters += `&filterByStatus=${state.filterByStatus}`
            }
            const result = await getData(
                `${import.meta.env.VITE_URL_API}clientType/list?size=${state.size}&page=${state.page}${filters}`
            )
    
            const totalPages = Math.max(1, Math.ceil(result.data.totalRecords / state.size));
            if (state.page > totalPages) {
                newPage = state.page-1; 
            }

            const clientTypes = result.data?.clientTypes ?? []
            const totalRecords = result.data?.totalRecords ?? 0

            set({ clientTypes: [...clientTypes], totalRecords: totalRecords, page: newPage })
            return result
        },        

        getClientTypeById: (id) => {
            set(() => ({ activeEditingId: id }))
        },

        addClientType: async (data) => {
            const result = await postData(`${import.meta.env.VITE_URL_API}clientType/add`, data)
            if (result?.ok) {
                await useCommonDataStore.getState().refreshAllCommonData();
            }
            return result
        },

        updateClientType: async (data) => {
            const result = await putData(`${import.meta.env.VITE_URL_API}clientType/update`, data)
            if (result?.ok) {
                await useCommonDataStore.getState().refreshAllCommonData();
            }
            return result
        },

        deleteClientType: async (id, loggedIdUser) => {
            const result = await deleteData(`${import.meta.env.VITE_URL_API}clientType/delete/${id}`, loggedIdUser)
            if (result?.ok) {
                await useCommonDataStore.getState().refreshAllCommonData();
            }
            return result
        },

        changeSize: (newSize) => {
            set(() => ({ size: newSize }))
        },
        changePage: (newPage) => {
            set(() => ({ page: newPage }))
        },
        changeOrderBy: (newOrderBy) => {
            set(() => ({ orderBy: newOrderBy }))
        },
        changeDirectionOrderBy: (newDirectionOrderBy) => {
            set(() => ({ directionOrderBy: newDirectionOrderBy }))
        },
        changeSearchType: (newSearchType) => {
            set(() => ({ searchType: newSearchType }))
        },
        changeSearchTerm: (newSearchTerm) => {
            set(() => ({ searchTerm: newSearchTerm }))
        },
        changeFilterByStatus: (newFilterByStatus) => {
            set(() => ({ filterByStatus: newFilterByStatus }))
        },

        showModalForm: () => {
            set(() => ({ modalForm: true }))
        },
        closeModalForm: () => {
            set(() => ({ modalForm: false }))
        },
        showModalFilter: () => {
            set(() => ({ modalFilter: true }))
        },
        closeModalFilter: () => {
            set(() => ({ modalFilter: false }))
        },
        showModalInfo: () => {
            set(() => ({ modalInfo: true }))
        },
        closeModalInfo: () => {
            set(() => ({ modalInfo: false }))
        }
    }))
)

export default useClientTypeStore;