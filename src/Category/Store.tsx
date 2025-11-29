import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { Category, CategoryDataForm } from "../shared/types";
import { deleteData, getData, postData, putData } from "../shared/services/gym";

type CategoryStore = {
    categories: Category[];
    modalForm: boolean;
    modalFilter: boolean;
    modalInfo: boolean;
    modalFileTypeDecision: boolean;
    activeEditingId: Category["idCategory"];
    size: number;
    page: number;
    totalRecords: number;
    orderBy: string;
    directionOrderBy: string;
    searchType: number;
    searchTerm: string;
    filterByStatus: string;
    isLoading: boolean;

    fetchCategories: () => Promise<any>;
    getCategoryById: (id: number) => void;
    addCategory: (data: CategoryDataForm) => Promise<any>;
    updateCategory: (data: CategoryDataForm) => Promise<any>;
    deleteCategory: (id: number, loggedIdUser: number) => Promise<any>;

    changeSize: (newSize: number) => void;
    changePage: (newPage: number) => void;
    changeOrderBy: (newOrderBy: string) => void;
    changeDirectionOrderBy: (newDirectionOrderBy: string) => void;
    setOrder: (newOrderBy: string, newDirectionOrderBy: string) => void;
    changeSearchType: (newSearchType: number) => void;
    changeSearchTerm: (newSearchTerm: string) => void;
    changeFilterByStatus: (newFilterByStatus: string) => void;

    showModalForm: () => void;
    closeModalForm: () => void;
    showModalFilter: () => void;
    closeModalFilter: () => void;
    showModalInfo: () => void;
    closeModalInfo: () => void;
    showModalFileType: () => void;
    closeModalFileType: () => void;
    clearAllFilters: () => void;
    resetEditing: () => void;
};

export const useCategoryStore = create<CategoryStore>()(
    devtools((set, get) => ({
        categories: [],
        modalForm: false,
        modalFilter: false,
        modalInfo: false,
        modalFileTypeDecision: false,
        activeEditingId: 0,
        size: 5,
        page: 1,
        totalRecords: 0,
        orderBy: "",
        directionOrderBy: "DESC",
        searchType: 1,
        searchTerm: "",
        filterByStatus: "",
        fetchCategories: async () => {
            set({ isLoading: true });
            try {
                const state = get();
                let newPage = state.page;
                
                const params = new URLSearchParams({
                    size: state.size.toString(),
                    page: state.page.toString(),
                    searchType: state.searchType.toString(),
                });

                if (state.searchTerm) {
                    params.append('searchTerm', state.searchTerm);
                }
                if (state.orderBy) {
                    params.append('orderBy', state.orderBy);
                    params.append('directionOrderBy', state.directionOrderBy);
                }
                if (state.filterByStatus) {
                    params.append('filterByStatus', state.filterByStatus);
                }

                const result = await getData(
                    `${import.meta.env.VITE_URL_API}category/list?${params.toString()}`
                );

                if (result.ok) {
                    const allCategories = result.data?.categories || [];
                    const totalRecords = result.data?.totalRecords || allCategories.length;
                    const totalPages = Math.max(1, Math.ceil(totalRecords / state.size));
                    
                    if (state.page > totalPages) {
                        newPage = state.page - 1;
                    }
                    
                    let sortedCategories = allCategories.slice();
                    if (state.orderBy) {
                        const key = state.orderBy as keyof typeof allCategories[0];
                        sortedCategories.sort((a: any, b: any) => {
                            const va = a[key];
                            const vb = b[key];
                            if (typeof va === 'string' && typeof vb === 'string') {
                                return state.directionOrderBy === 'DESC' ? vb.localeCompare(va) : va.localeCompare(vb);
                            }
                            if (typeof va === 'number' && typeof vb === 'number') {
                                return state.directionOrderBy === 'DESC' ? vb - va : va - vb;
                            }
                            return state.directionOrderBy === 'DESC'
                                ? String(vb).localeCompare(String(va))
                                : String(va).localeCompare(String(vb));
                        });
                    }

                    const startIndex = (newPage - 1) * state.size;
                    const endIndex = startIndex + state.size;
                    const paginatedCategories = sortedCategories.slice(startIndex, endIndex);
                    
                    set({
                        categories: paginatedCategories,
                        totalRecords: totalRecords,
                        page: newPage,
                        isLoading: false
                    });
                } else {
                    set({ isLoading: false });
                }

                return result;
            } catch (error) {
                console.error('Error fetching categories:', error);
                set({ isLoading: false });
                return { ok: false, logout: false };
            }
        },

        getCategoryById: (id) => {
            set({ activeEditingId: id });
        },

        addCategory: async (data) => {
            const result = await postData(`${import.meta.env.VITE_URL_API}category/add`, data);
            if (result.ok) {
                get().fetchCategories();
            }
            return result;
        },

        updateCategory: async (data) => {
            const result = await putData(`${import.meta.env.VITE_URL_API}category/update`, data);
            if (result.ok) {
                get().fetchCategories();
            }
            return result;
        },

        deleteCategory: async (id, loggedIdUser) => {
            const result = await deleteData(`${import.meta.env.VITE_URL_API}category/delete/${id}`, loggedIdUser);
            if (result.ok) {
                const state = get();
                await state.fetchCategories();
                
                if (state.categories.length === 0 && state.page > 1) {
                    set({ page: state.page - 1 });
                    get().fetchCategories(); 
                }
            }
            return result;
        },

        changeSize: (newSize) => {
            set({ 
                size: newSize, 
                page: 1 
            });
        },
        
        changePage: (newPage) => {
            set({ page: newPage });
        },
        
        changeOrderBy: (newOrderBy) => {
            set({ 
                orderBy: newOrderBy,
                page: 1 
            });
        },
        
        changeDirectionOrderBy: (newDirectionOrderBy) => {
            set({ directionOrderBy: newDirectionOrderBy });
        },
        setOrder: (newOrderBy, newDirectionOrderBy) => {
            set({ orderBy: newOrderBy, directionOrderBy: newDirectionOrderBy, page: 1 });
        },
        
        changeSearchType: (newSearchType) => {
            set({ 
                searchType: newSearchType,
                page: 1 
            });
        },
        
        changeSearchTerm: (newSearchTerm) => {
            set({ 
                searchTerm: newSearchTerm,
                page: 1 
            });
        },
        
        changeFilterByStatus: (newFilterByStatus) => {
            set({ 
                filterByStatus: newFilterByStatus,
                page: 1 
            });
        },

        showModalForm: () => set({ modalForm: true }),
        closeModalForm: () => set({ modalForm: false }),
        showModalFilter: () => set({ modalFilter: true }),
        closeModalFilter: () => set({ modalFilter: false }),
        showModalInfo: () => set({ modalInfo: true }),
        closeModalInfo: () => set({ modalInfo: false }),
        showModalFileType: () => set({ modalFileTypeDecision: true }),
        closeModalFileType: () => set({ modalFileTypeDecision: false }),
        
        resetEditing: () => set({ activeEditingId: 0 }),

        clearAllFilters: () => set({
            searchTerm: "",
            filterByStatus: "",
            page: 1
        }),
    }))
);

export default useCategoryStore;