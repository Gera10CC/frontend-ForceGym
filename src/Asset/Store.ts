import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { Asset, AssetDataForm } from "../shared/types";
import { deleteData, getData, postData, putData } from "../shared/services/gym";

type AssetStore = {
    assets: Asset[];
    modalForm: boolean;
    modalFilter: boolean;
    modalInfo: boolean;
    modalFileTypeDecision: boolean;
    activeEditingId: Asset['idAsset'];
    size: number;
    page: number;
    totalRecords: number;
    orderBy: string;
    directionOrderBy: string;
    searchType: number;
    searchTerm: string;
    filterByStatus: string;
    filterByCostRangeMax: number;
    filterByCostRangeMin: number;
    filterByQuantityRangeMax: number;
    filterByQuantityRangeMin: number;

    fetchAssets: () => Promise<any>;
    getAssetById: (id: number) => void;
    addAsset: (data: AssetDataForm) => Promise<any>;
    updateAsset: (data: AssetDataForm) => Promise<any>;
    deleteAsset: (id: number, loggedIdUser: number) => Promise<any>;

    changeSize: (newSize: number) => void;
    changePage: (newPage: number) => void;
    changeOrderBy: (newOrderBy: string) => void;
    changeDirectionOrderBy: (newDirectionOrderBy: string) => void;
    changeSearchType: (newSearchType: number) => void;
    changeSearchTerm: (newSearchTerm: string) => void;

    changeFilterByStatus: (v: string) => void;
    changeFilterByCostRangeMax: (v: number) => void;
    changeFilterByCostRangeMin: (v: number) => void;
    changeFilterByQuantityRangeMax: (v: number) => void;
    changeFilterByQuantityRangeMin: (v: number) => void;

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

export const useAssetStore = create<AssetStore>()(
    devtools((set) => ({
        assets: [],
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
        filterByCostRangeMax: 0,
        filterByCostRangeMin: 0,
        filterByQuantityRangeMax: 0,
        filterByQuantityRangeMin: 0,

        clearAllFilters: () => {
            set({
                filterByStatus: '',
                filterByCostRangeMin: 0,
                filterByCostRangeMax: 0,
                filterByQuantityRangeMin: 0,
                filterByQuantityRangeMax: 0,
                searchTerm: ''
            });
        },

        fetchAssets: async () => {
            const state = useAssetStore.getState();
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
            if (state.filterByCostRangeMax !== 0 && state.filterByCostRangeMin !== 0) {
                filters += `&filterByCostRangeMax=${state.filterByCostRangeMax}&filterByCostRangeMin=${state.filterByCostRangeMin}`;
            }
            if (state.filterByQuantityRangeMax !== 0 && state.filterByQuantityRangeMin !== 0) {
                filters += `&filterByQuantityRangeMax=${state.filterByQuantityRangeMax}&filterByQuantityRangeMin=${state.filterByQuantityRangeMin}`;
            }

            const result = await getData(
                `${import.meta.env.VITE_URL_API}asset/list?size=${state.size}&page=${state.page}${filters}`
            );

            const totalPages = Math.max(1, Math.ceil(result.data.totalRecords / state.size));
            if (state.page > totalPages) {
                newPage = state.page - 1;
            }

            set({
                assets: [...(result.data?.assets ?? [])],
                totalRecords: result.data?.totalRecords ?? 0,
                page: newPage
            });

            return result;
        },

        getAssetById: (id) => {
            set({ activeEditingId: id });
        },
        resetEditing: () => set(() => ({ activeEditingId: 0 })),


        addAsset: async (data) => {
            return await postData(`${import.meta.env.VITE_URL_API}asset/add`, data);
        },

        updateAsset: async (data) => {
            return await putData(`${import.meta.env.VITE_URL_API}asset/update`, data);
        },

        deleteAsset: async (id, loggedIdUser) => {
            return await deleteData(`${import.meta.env.VITE_URL_API}asset/delete/${id}`, loggedIdUser);
        },

        changeSize: (v) => { set({ size: v }); },
        changePage: (v) => { set({ page: v }); },
        changeOrderBy: (v) => { set({ orderBy: v }); },
        changeDirectionOrderBy: (v) => { set({ directionOrderBy: v }); },
        changeSearchType: (v) => { set({ searchType: v }); },
        changeSearchTerm: (v) => { set({ searchTerm: v }); },

        changeFilterByStatus: (v) => { set({ filterByStatus: v }); },
        changeFilterByCostRangeMax: (v) => { set({ filterByCostRangeMax: v }); },
        changeFilterByCostRangeMin: (v) => { set({ filterByCostRangeMin: v }); },
        changeFilterByQuantityRangeMax: (v) => { set({ filterByQuantityRangeMax: v }); },
        changeFilterByQuantityRangeMin: (v) => { set({ filterByQuantityRangeMin: v }); },

        showModalForm: () => { set({ modalForm: true }); },
        closeModalForm: () => { set({ modalForm: false }); },
        showModalFilter: () => { set({ modalFilter: true }); },
        closeModalFilter: () => { set({ modalFilter: false }); },
        showModalInfo: () => { set({ modalInfo: true }); },
        closeModalInfo: () => { set({ modalInfo: false }); },
        showModalFileType: () => { set({ modalFileTypeDecision: true }); },
        closeModalFileType: () => { set({ modalFileTypeDecision: false }); }
    }))
);

export default useAssetStore;