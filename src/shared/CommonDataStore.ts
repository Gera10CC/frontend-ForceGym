import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { ActivityType, MeanOfPayment, Role, Gender, ClientOptions, Category, NotificationType, ExerciseCategory, ExerciseDifficulty, Exercise, DifficultyRoutine, ClientType} from "./types";
import { getData } from "./services/gym";

type CommonDataStore = {
    roles: Role[]
    activityTypes: ActivityType[]
    meansOfPayment: MeanOfPayment[]
    clientTypes: ClientType[]
    genders: Gender[]
    allClients: ClientOptions[]
    categories: Category[]
    notificationTypes: NotificationType[]
    exerciseCategories: ExerciseCategory[]
    exercise: Exercise[]
    difficultyRoutines: DifficultyRoutine[]
    exerciseDifficulty: ExerciseDifficulty[]
    fetchRoles: () => Promise<any>
    fetchMeansOfPayment: () => Promise<any>
    fetchActivityTypes: () => Promise<any>
    fetchClientTypes: () => Promise<any>
    fetchGenders: () => Promise<any>
    fetchAllClients: () => Promise<any>
    fetchCategories: () => Promise<any>
    fetchNotificationTypes: () => Promise<any>
    fetchExerciseCategories: () => Promise<any>
    fetchExercise: () => Promise<any>
    fetchDifficultyRoutines: () => Promise<any>
    fetchExerciseDifficulty: () => Promise<any>
    refreshAllCommonData: () => Promise<void>
}

export const useCommonDataStore = create<CommonDataStore>()(
    devtools((set) => ({
        roles: [],
        meansOfPayment: [],
        activityTypes: [],
        clientTypes: [],
        genders: [],
        allClients: [],
        categories: [],
        notificationTypes: [],
        exerciseCategories: [],
        exercise: [],
        difficultyRoutines: [],
        exerciseDifficulty: [],

        fetchRoles: async () => {
            const result = await getData(`${import.meta.env.VITE_URL_API}role/list`) 
            set(() => ({ roles: result.data }))
            return result
        },
        
        fetchMeansOfPayment: async () => {
            const result = await getData(`${import.meta.env.VITE_URL_API}meanOfPayment/list`) 
            set(() => ({ meansOfPayment: result.data }))
            return result
        },

        fetchActivityTypes: async () => {
            const result = await getData(`${import.meta.env.VITE_URL_API}activityType/listFees`)
            set(() => ({ activityTypes: result.data }))
            return result
        },
        fetchClientTypes: async () => {
            const result = await getData(`${import.meta.env.VITE_URL_API}clientType/list`)
            set(() => ({ clientTypes: result.data.clientTypes }))
            return result
        },

        fetchGenders: async () => {
            const result = await getData(`${import.meta.env.VITE_URL_API}gender/list`)
            set(() => ({ genders: result.data }))
            return result
        },

        fetchAllClients: async () => {
            const result = await getData(`${import.meta.env.VITE_URL_API}client/listAll`)
            set(() => ({ allClients: result.data }))
            return result
        },

        fetchCategories: async () => {
            const result = await getData(`${import.meta.env.VITE_URL_API}category/listAll`)
            set(() => ({ categories: result.data }))
            return result
        },
        
        fetchNotificationTypes: async() => {
            const result = await getData(`${import.meta.env.VITE_URL_API}notificationType/list`)
            set(() => ({ notificationTypes: result.data.notificationTypes }))
            return result
        },

        fetchExerciseCategories: async() => {
            const result = await getData(`${import.meta.env.VITE_URL_API}exerciseCategory/listAll`);
            set(() => ({ exerciseCategories: result.data }));
            return result;
        },
        fetchExercise: async() => {
            const result = await getData(`${import.meta.env.VITE_URL_API}exercise/listAll`);
            set(() => ({ exercise: result.data }));
            return result;
        },
        fetchDifficultyRoutines: async() => {
            const result = await getData(`${import.meta.env.VITE_URL_API}difficultyRoutine/list`)
            set(() => ({ difficultyRoutines: result.data }))
            return result;
        }
        ,
        fetchExerciseDifficulty: async() => {
            const result = await getData(`${import.meta.env.VITE_URL_API}exercisedifficulty/list`);
            set(() => ({ exerciseDifficulty: result.data }));
            return result;
        },

        refreshAllCommonData: async () => {
            const state = useCommonDataStore.getState();
            await Promise.all([
                state.fetchRoles(),
                state.fetchMeansOfPayment(),
                state.fetchActivityTypes(),
                state.fetchClientTypes(),
                state.fetchGenders(),
                state.fetchAllClients(),
                state.fetchCategories(),
                state.fetchNotificationTypes(),
                state.fetchExerciseCategories(),
                state.fetchExercise(),
                state.fetchDifficultyRoutines(),
                state.fetchExerciseDifficulty()
            ]);
        },
    })
))