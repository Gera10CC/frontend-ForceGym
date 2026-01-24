import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { User, UserDataForm } from "../shared/types";
import { deleteData, getData, postData, putData } from "../shared/services/gym";
import { useCommonDataStore } from "../shared/CommonDataStore";

type UserStore = {
  users: User[];
  modalForm: boolean;
  modalFilter: boolean;
  modalInfo: boolean;
  activeEditingId: User["idUser"];

  size: number;
  page: number;
  totalRecords: number;

  orderBy: string;
  directionOrderBy: string;

  searchType: number;
  searchTerm: string;

  filterByStatus: string;
  filterByRole: string;

  fetchUsers: () => Promise<any>;
  getUserById: (id: number) => void;

  addUser: (data: UserDataForm) => Promise<any>;
  updateUser: (data: UserDataForm) => Promise<any>;
  deleteUser: (id: number, loggedIdUser: number) => Promise<any>;

  changeSize: (newSize: number) => void;
  changePage: (newPage: number) => void;
  changeOrderBy: (newOrderBy: string) => void;
  changeDirectionOrderBy: (newDirectionOrderBy: string) => void;
  changeSearchType: (newSearchType: number) => void;
  changeSearchTerm: (newSearchTerm: string) => void;

  changeFilterByStatus: (v: string) => void;
  changeFilterByRole: (v: string) => void;

  showModalForm: () => void;
  closeModalForm: () => void;
  showModalFilter: () => void;
  closeModalFilter: () => void;
  showModalInfo: () => void;
  closeModalInfo: () => void;

  resetEditing: () => void;
  clearAllFilters: () => void;
};

const useUserStore = create<UserStore>()(
  devtools((set) => ({
    users: [],

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
    filterByRole: "",

    clearAllFilters: () =>
      set(() => ({
        searchTerm: "",
        filterByStatus: "",
        filterByRole: "",
      })),

    fetchUsers: async () => {
      const state = useUserStore.getState();

      let newPage = state.page;
      let filters = `&searchType=${state.searchType}`;

      if (state.searchTerm !== "")
        filters += `&searchTerm=${state.searchTerm}`;

      if (state.orderBy !== "")
        filters += `&orderBy=${state.orderBy}&directionOrderBy=${state.directionOrderBy}`;

      if (state.filterByStatus !== "")
        filters += `&filterByStatus=${state.filterByStatus}`;

      if (state.filterByRole !== "")
        filters += `&filterByRole=${state.filterByRole}`;

      const result = await getData(
        `${import.meta.env.VITE_URL_API}user/list?size=${state.size}&page=${
          state.page
        }${filters}`
      );

      const totalRecords = result.data?.totalRecords ?? 0;
      const totalPages = Math.max(1, Math.ceil(totalRecords / state.size));

      if (state.page > totalPages) newPage = state.page - 1;

      set({
        users: result.data?.users ?? [],
        totalRecords,
        page: newPage,
      });

      return result;
    },

    getUserById: (id) => set(() => ({ activeEditingId: id })),
    resetEditing: () => set(() => ({ activeEditingId: 0 })),

    addUser: async (data) => {
      const result = await postData(`${import.meta.env.VITE_URL_API}user/add`, data);
      if (result?.ok) {
        await useCommonDataStore.getState().refreshAllCommonData();
      }
      return result;
    },

    updateUser: async (data) => {
      const result = await putData(`${import.meta.env.VITE_URL_API}user/update`, data);
      if (result?.ok) {
        await useCommonDataStore.getState().refreshAllCommonData();
      }
      return result;
    },

    deleteUser: async (id, loggedIdUser) => {
      const result = await deleteData(
        `${import.meta.env.VITE_URL_API}user/delete/${id}`,
        loggedIdUser
      );
      if (result?.ok) {
        await useCommonDataStore.getState().refreshAllCommonData();
      }
      return result;
    },

    changeSize: (size) => set(() => ({ size })),
    changePage: (page) => set(() => ({ page })),
    changeOrderBy: (orderBy) => set(() => ({ orderBy })),
    changeDirectionOrderBy: (d) => set(() => ({ directionOrderBy: d })),
    changeSearchType: (s) => set(() => ({ searchType: s })),
    changeSearchTerm: (s) => set(() => ({ searchTerm: s })),

    changeFilterByStatus: (v) => set(() => ({ filterByStatus: v })),
    changeFilterByRole: (v) => set(() => ({ filterByRole: v })),

    showModalForm: () => set(() => ({ modalForm: true })),
    closeModalForm: () => set(() => ({ modalForm: false })),

    showModalFilter: () => set(() => ({ modalFilter: true })),
    closeModalFilter: () => set(() => ({ modalFilter: false })),

    showModalInfo: () => set(() => ({ modalInfo: true })),
    closeModalInfo: () => set(() => ({ modalInfo: false })),
  }))
);

export default useUserStore;