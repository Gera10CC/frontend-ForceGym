import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { EconomicExpense, EconomicIncome } from "../shared/types";
import { getData } from "../shared/services/gym";
import { isCompleteDate } from "../shared/utils/validation";
import { formatDateForParam } from "../shared/utils/format";

type EconomicBalanceStore = {
    economicExpenses: EconomicExpense[];
    economicIncomes: EconomicIncome[];
    modalFilter: boolean;
    filterByStatus: string;
    filterByAmountRangeMax: number;
    filterByAmountRangeMin: number;
    filterByDateRangeMax: Date | null;
    filterByDateRangeMin: Date | null;
    filterByMeanOfPayment: number;

    fetchEconomicExpenses: () => Promise<any>;
    fetchEconomicIncomes: () => Promise<any>;

    changeFilterByStatus: (newFilterByStatus: string) => void;
    changeFilterByAmountRangeMax: (newFilter: number) => void;
    changeFilterByAmountRangeMin: (newFilter: number) => void;
    changeFilterByDateRangeMax: (newFilter: Date | null) => void;
    changeFilterByDateRangeMin: (newFilter: Date | null) => void;
    changeFilterByMeanOfPayment: (newFilter: number) => void;

    showModalFilter: () => void;
    closeModalFilter: () => void;
    clearAllFilters: () => void;
};

export const useEconomicBalanceStore = create<EconomicBalanceStore>()(
    devtools((set, get) => ({
        economicExpenses: [],
        economicIncomes: [],
        modalFilter: false,
        filterByStatus: '',
        filterByAmountRangeMax: 0,
        filterByAmountRangeMin: 0,
        filterByDateRangeMax: null,
        filterByDateRangeMin: null,
        filterByMeanOfPayment: 0,

        clearAllFilters: () => set(() => ({
            filterByStatus: '',
            filterByAmountRangeMax: 0,
            filterByAmountRangeMin: 0,
            filterByDateRangeMax: null,
            filterByDateRangeMin: null,
            filterByMeanOfPayment: 0,
        })),
        fetchEconomicExpenses: async () => {
            const state = get();
            let filters = ``;

            if (state.filterByStatus !== '') {
                filters += `&filterByStatus=${state.filterByStatus}`;
            }
            if (state.filterByAmountRangeMax !== 0 && state.filterByAmountRangeMin !== 0) {
                filters += `&filterByAmountRangeMax=${state.filterByAmountRangeMax}&filterByAmountRangeMin=${state.filterByAmountRangeMin}`;
            }
            if (isCompleteDate(state.filterByDateRangeMax) && isCompleteDate(state.filterByDateRangeMin)) {
                const formattedDateMax = formatDateForParam(state.filterByDateRangeMax!);
                const formattedDateMin = formatDateForParam(state.filterByDateRangeMin!);
                filters += `&filterByDateRangeMax=${formattedDateMax}&filterByDateRangeMin=${formattedDateMin}`;
            }
            if (state.filterByMeanOfPayment != 0) {
                filters += `&filterByMeanOfPayment=${state.filterByMeanOfPayment}`;
            }
        
            const result = await getData(
                `${import.meta.env.VITE_URL_API}economicExpense/listAll?${filters}`
            );

            const expenses = result.data?.economicExpenses ?? [];

            set({ economicExpenses: expenses});
            return result;
        },

        fetchEconomicIncomes: async () => {
            const state = get();
            let filters = ``;

            if (state.filterByStatus !== '') {
                filters += `&filterByStatus=${state.filterByStatus}`;
            }
            if (state.filterByAmountRangeMax !== 0 && state.filterByAmountRangeMin !== 0) {
                filters += `&filterByAmountRangeMax=${state.filterByAmountRangeMax}&filterByAmountRangeMin=${state.filterByAmountRangeMin}`;
            }
            if (isCompleteDate(state.filterByDateRangeMax) && isCompleteDate(state.filterByDateRangeMin)) {
                const formattedDateMax = formatDateForParam(state.filterByDateRangeMax!);
                const formattedDateMin = formatDateForParam(state.filterByDateRangeMin!);
                filters += `&filterByDateRangeMax=${formattedDateMax}&filterByDateRangeMin=${formattedDateMin}`;
            }
            if (state.filterByMeanOfPayment != 0) {
                filters += `&filterByMeanOfPayment=${state.filterByMeanOfPayment}`;
            }

            const result = await getData(
                `${import.meta.env.VITE_URL_API}economicIncome/listAll?${filters}`
            );

            const incomes = result.data?.economicIncomes ?? [];

            set({ economicIncomes: incomes});
            return result;
        },
        changeFilterByStatus: (newFilterByStatus) => set({ filterByStatus: newFilterByStatus }),
        changeFilterByAmountRangeMax: (newFilter) => set({ filterByAmountRangeMax: newFilter }),
        changeFilterByAmountRangeMin: (newFilter) => set({ filterByAmountRangeMin: newFilter }),
        changeFilterByDateRangeMax: (newFilter) => set({ filterByDateRangeMax: newFilter }),
        changeFilterByDateRangeMin: (newFilter) => set({ filterByDateRangeMin: newFilter }),
        changeFilterByMeanOfPayment: (newFilter) => set({ filterByMeanOfPayment: newFilter }),

        showModalFilter: () => set({ modalFilter: true }),
        closeModalFilter: () => set({ modalFilter: false })
    }))
);

export default useEconomicBalanceStore;