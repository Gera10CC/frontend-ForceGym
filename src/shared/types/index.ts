export type CredencialUser = {
    username: string
    password: string
    recaptchaToken: string
}

export type Role = {
    idRole: number
    name: string
}

export type DifficultyRoutine = {
    idDifficultyRoutine: number;
    name: string;
};

export type ExerciseOption = {
    value: number;
    label: string;
};

export type MeanOfPayment = {
    idMeanOfPayment: number
    name: string
}

export type Fee = {
    idClientType: ClientType['idClientType'][]
    amount: number
}

export type ActivityType = {
    idActivityType: number
    name: string
    fees: Fee[]
    isDeleted: number
}

export type Gender = {
    idGender: number
    name: string
}

export type Category = {
    idCategory: number
    name: string
    user: User
    isDeleted: number
}
export type CategoryDataForm = Omit<Category, 'user'> & Pick<User, 'idUser'>

export type ClientType = {  
    idClientType: number
    name: string
    isDeleted: number
}
export type TypeClient = {
    idClientType: number
    name: string
    dailyCharge: number
    weeklyCharge: number
    biweeklyCharge: number
    monthlyCharge: number
    isDeleted: number
}

export type NotificationType = {
    idNotificationType: number
    name: string
}

export type ExerciseCategory = {
    idExerciseCategory: number
    name: string
    isDeleted: number
    user: User
}
export type ExerciseCategoryDataForm =
  Omit<ExerciseCategory, 'user'> & Pick<User, 'idUser'>


export type ExerciseDifficulty = {
    idExerciseDifficulty: number
    difficulty: string
}
// -----------------------------------------------------

export type Person = {
    idPerson: number
    name: string
    firstLastName: string
    secondLastName: string
    birthday: Date
    identificationNumber: string
    email: string
    phoneNumber: string
    gender: Gender
}

export type User = {
    idUser: number
    person: Person
    role: Role
    username: string
    isDeleted: number
    token: string
}

export type UserDataForm = Pick<User, 'idUser' | 'username' | 'isDeleted'> & Pick<Role, 'idRole'> & Omit<Person, 'gender'> & {
    idGender: number
    password?: string
    confirmPassword?: string
}

// -----------------------------------------------------

export type EconomicIncome = {
    idEconomicIncome: number
    client: Client
    registrationDate: Date
    voucherNumber: string
    detail: string
    meanOfPayment: MeanOfPayment
    amount: number
    activityType: ActivityType
    hasDelay: boolean
    delayDays: number | null
    isDeleted: number
}

export type EconomicIncomeDataForm = Omit<EconomicIncome, 'user' | 'meanOfPayment' | 'activityType' | "client"> & Pick<Client, 'idClient'> & {
    idMeanOfPayment: MeanOfPayment['idMeanOfPayment']
    idActivityType: ActivityType['idActivityType']
    hasDelay: boolean
}

export type EconomicExpense = Omit<EconomicIncome, "activityType" | "idEconomicIncome" | "client" | "delayDays" | "hasDelay"> & {
    user: User
    idEconomicExpense: number
    category: Category
}

export type EconomicExpenseDataForm = Omit<EconomicIncomeDataForm, 'idActivityType' | "idEconomicIncome" | "idClient" | "delayDays" | "hasDelay"> & Omit<EconomicExpense, "meanOfPayment" | "category" | "user">
    & Pick<EconomicExpense, 'idEconomicExpense'> & {
        idUser: number
        idCategory: number
    }

// -----------------------------------------------------

export type Asset = {
    idAsset: number
    boughtDate: Date
    user: User
    code: string
    name: string
    quantity: number
    initialCost: number
    serviceLifeYears: number
    deprecationPerYear: number
    isDeleted: number
}

export type AssetDataForm = Omit<Asset, "user" | "deprecationPerYear"> & Pick<User, "idUser">
// --------------------------------------------------------
export type HealthQuestionnaire = Pick<Client, 'idClient'> & {
    idHealthQuestionnaire: number
    diabetes: boolean
    hypertension: boolean
    muscleInjuries: boolean
    boneJointIssues: boolean
    balanceLoss: boolean
    cardiovascularDisease: boolean
    breathingIssues: boolean
    isDeleted: number
}

export type Client = {
    idClient: number
    user: User
    person: Person
    clientType: ClientType
    healthQuestionnaire: HealthQuestionnaire
    registrationDate: Date
    expirationMembershipDate: string | Date
    phoneNumberContactEmergency: string
    nameEmergencyContact: string
    signatureImage: string
    isDeleted: number
}
// --------------------------------------------------------
export type Measurement = {
    idClient: number
    idMeasurement: number
    client: Client
    measurementDate: Date
    weight: number
    height: number
    muscleMass: number
    bodyFatPercentage: number 
    visceralFatPercentage: number
    chestSize: number
    backSize: number
    hipSize: number
    waistSize: number
    leftLegSize: number
    rightLegSize: number
    leftCalfSize: number
    rightCalfSize: number
    leftForeArmSize: number
    rightForeArmSize: number
    leftArmSize: number
    rightArmSize: number
    isDeleted: number
}

export type MeasurementDataForm = Omit<Measurement, 'client'> & {
    idClient: number
}

export type ClientDataForm = Omit<Client, 'user' | 'person' | 'clientType' | 'healthQuestionnaire'| 'registrationDate'> & HealthQuestionnaire & Omit<Person, 'gender'> & Pick<User, 'idUser'>  & Pick<ClientType, 'idClientType'> & {
    idGender: number
    registrationDate: string | Date
}

export type ClientOptions = {
    value: number
    label: string
    idClientType: number
}
// --------------------------------------------------------
export type Exercise = {
    idExercise: number;
    name: string;
    description: string;
    videoUrl?: string;
    difficulty: string;
    series: number;
    repetitions: number;
    exerciseDifficulty: ExerciseDifficulty;
    exerciseCategory: ExerciseCategory;
    paramLoggedIdUser: number;
    user: User;
    isDeleted: number;
};

export type ExerciseDataForm = Omit<Exercise, 'user' | 'exerciseCategory' | 'exerciseDifficulty'> & Pick<ExerciseCategory, 'idExerciseCategory'> & Pick<ExerciseDifficulty, 'idExerciseDifficulty'> & Pick<User, 'idUser'>
// --------------------------------------------------------
export type NotificationTemplate = {
    idNotificationTemplate: number
    user: User
    message: string
    notificationType: NotificationType
    isDeleted: number
}

export type NotificationTemplateDataForm = Omit<NotificationTemplate, 'user' | 'notificationType'> & Pick<NotificationType, 'idNotificationType'> & Pick<User, 'idUser'>

export type ClientTypeDataForm = {
    idClientType: number;
    name: string;
    isDeleted: number; 
}


export type RoutineExercise = {
    idRoutineExercise?: number;
    exercise: Exercise;
    series: number;
    repetitions: number;
    note: string;
    categoryOrder: number;
    dayNumber?: number;
};

export type RoutineAssignment = {
    idRoutineAssignment?: number;
    client: Client;
    assignmentDate: Date;
};

export type Routine = {
    idRoutine: number;
    name: string;
    date: Date;
    user: User;
    difficultyRoutine: DifficultyRoutine;
    isDeleted: number;
    createdAt?: Date;
    createdByUser?: number;
    updatedAt?: Date;
    updatedByUser?: number;
    routineExercises: RoutineExercise[];
    routineAssignments: RoutineAssignment[];
};

export type RoutineExerciseDTO = {
    idExercise: number; 
    series: number;
    repetitions: number;
    note: string;
    categoryOrder: number;
    dayNumber?: number;
};

export type RoutineAssignmentDTO = {
    idClient: number;
    assignmentDate?: string;
};

export type RoutineWithExercisesDTO = {
    idRoutine?: number;
    name: string;
    date: string;
    idUser: number;
    difficultyRoutine: {
        idDifficultyRoutine: number;
    };
    exercises: RoutineExerciseDTO[];
    assignments: RoutineAssignmentDTO[];
    isDeleted: number;
    paramLoggedIdUser?: number;
};

export type RoutineDataForm = {
    idRoutine?: number;
    name: string;
    date: string;
    idDifficultyRoutine: number;
    idUser: number;
    isDeleted: number;
    exercises: {
        idExercise: number;
        series: number;
        repetitions: number;
        note: string;
        categoryOrder: number;
    }[];
    assignments: {
        idClient: number;
        assignmentDate?: string;
    }[];
};

// -----------------------------------------------------
// Client Portal Types
// -----------------------------------------------------

export type ClientCredentials = {
    identificationNumber: string;
    password: string;
    recaptchaToken: string;
};

export type ClientLogin = {
    idClient: number;
    person: Person;
    token: string;
};

export type ClientRoutine = {
    idRoutineAssignment: number;
    routine: Routine;
    assignmentDate: Date;
};