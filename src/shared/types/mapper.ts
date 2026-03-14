import { Client,ClientTypeDataForm,ClientDataForm, EconomicExpense, EconomicExpenseDataForm, EconomicIncome, EconomicIncomeDataForm, NotificationTemplate, NotificationTemplateDataForm, Measurement, MeasurementDataForm, Asset, AssetDataForm, User, UserDataForm, ClientType, Category, CategoryDataForm, Exercise, ExerciseDataForm, Routine, RoutineDataForm, RoutineWithExercisesDTO} from ".";

export function mapUserToDataForm(user: User): UserDataForm {
    return {
        idUser: user.idUser,
        idRole: user.role.idRole,
        idPerson: user.person.idPerson,
        name: user.person.name,
        firstLastName: user.person.firstLastName,
        secondLastName: user.person.secondLastName,
        birthday: user.person.birthday,
        identificationNumber: user.person.identificationNumber,
        email: user.person.email,
        phoneNumber: user.person.phoneNumber,
        idGender: user.person.gender.idGender,
        username: user.username,
        isDeleted: user.isDeleted,
        password: "",
        confirmPassword: ""
    };
}

export function mapEconomicIncomeToDataForm(economicIncome: EconomicIncome): EconomicIncomeDataForm {
    return {
        idEconomicIncome: economicIncome.idEconomicIncome,
        idClient: economicIncome.client.idClient,
        registrationDate: economicIncome.registrationDate,
        voucherNumber: economicIncome.voucherNumber,
        detail: economicIncome.detail,
        idMeanOfPayment: economicIncome.meanOfPayment.idMeanOfPayment,
        amount: economicIncome.amount,
        idActivityType: economicIncome.activityType.idActivityType,
        hasDelay: economicIncome.delayDays!==null,
        delayDays: economicIncome.delayDays,
        isDeleted: economicIncome.isDeleted
    };
}

export function mapEconomicExpenseToDataForm(economicExpense: EconomicExpense): EconomicExpenseDataForm {
    return {
        idEconomicExpense: economicExpense.idEconomicExpense,
        idCategory: economicExpense.category.idCategory,
        idUser: economicExpense.user.idUser,
        registrationDate: economicExpense.registrationDate,
        voucherNumber: economicExpense.voucherNumber,
        detail: economicExpense.detail,
        idMeanOfPayment: economicExpense.meanOfPayment.idMeanOfPayment,
        amount: economicExpense.amount,
        isDeleted: economicExpense.isDeleted
    };
}

export function mapAssetToDataForm(asset: Asset): AssetDataForm {
    return {
        idAsset: asset.idAsset,
        idUser: asset.user.idUser,
        boughtDate: asset.boughtDate,
        code: asset.code,
        name: asset.name,
        initialCost: asset.initialCost,
        serviceLifeYears: asset.serviceLifeYears,
        quantity: asset.quantity,
        isDeleted: asset.isDeleted
    };
}

export function mapClientTypeToDataForm(clientType: ClientType): ClientTypeDataForm {
    return {
        idClientType: clientType.idClientType,
        name: clientType.name,
        isDeleted: clientType.isDeleted
    };
}

export function mapMeasurementToDataForm(measurement: Measurement): MeasurementDataForm {
    return {
        idMeasurement: measurement.idMeasurement,
        idClient: measurement.idClient,
        measurementDate: measurement.measurementDate,
        weight: measurement.weight,
        height: measurement.height,
        bmi: measurement.bmi,
        bodyFatPercentage: measurement.bodyFatPercentage,
        muscleMass: measurement.muscleMass,
        visceralFatPercentage: measurement.visceralFatPercentage,
        chestSize: measurement.chestSize,
        backSize: measurement.backSize,
        hipSize: measurement.hipSize,
        waistSize: measurement.waistSize,
        leftLegSize: measurement.leftLegSize,
        rightLegSize: measurement.rightLegSize,
        leftCalfSize: measurement.leftCalfSize,
        rightCalfSize: measurement.rightCalfSize,
        leftForeArmSize: measurement.leftForeArmSize,
        rightForeArmSize: measurement.rightForeArmSize,
        leftArmSize: measurement.leftArmSize,
        rightArmSize: measurement.rightArmSize,
        isDeleted: measurement.isDeleted
    };
}

export function mapClientToDataForm(client: Client): ClientDataForm {
    return {
        idClient: client.idClient,
        idUser: client.user.idUser,
        idClientType: client.clientType.idClientType,
        registrationDate: client.registrationDate,
        expirationMembershipDate: client.expirationMembershipDate,
        phoneNumberContactEmergency: client.phoneNumberContactEmergency,
        nameEmergencyContact: client.nameEmergencyContact,
        signatureImage: client.signatureImage,
        idHealthQuestionnaire: client.healthQuestionnaire.idHealthQuestionnaire,
        diabetes: client.healthQuestionnaire.diabetes,
        hypertension: client.healthQuestionnaire.hypertension,
        muscleInjuries: client.healthQuestionnaire.muscleInjuries,
        boneJointIssues: client.healthQuestionnaire.boneJointIssues,
        balanceLoss: client.healthQuestionnaire.balanceLoss,
        cardiovascularDisease: client.healthQuestionnaire.cardiovascularDisease,
        breathingIssues: client.healthQuestionnaire.breathingIssues,
        isDeleted: client.isDeleted,
        idPerson: client.person.idPerson,
        name: client.person.name,
        firstLastName: client.person.firstLastName,
        secondLastName: client.person.secondLastName,
        birthday: client.person.birthday,
        identificationNumber: client.person.identificationNumber,
        email: client.person.email,
        phoneNumber: client.person.phoneNumber,
        idGender: client.person.gender.idGender
    };
}

export function mapNotificationTemplateToDataForm(notificationTemplate: NotificationTemplate): NotificationTemplateDataForm {
    return {
        idNotificationTemplate: notificationTemplate.idNotificationTemplate,
        message: notificationTemplate.message,
        idNotificationType: notificationTemplate.notificationType.idNotificationType,
        idUser: notificationTemplate.user.idUser,
        isDeleted: notificationTemplate.isDeleted
    };
}

export function mapCategoryToDataForm(category: Category): CategoryDataForm {
    return {
        idCategory: category.idCategory,
        name: category.name,
        idUser: category.user.idUser,
        isDeleted: category.isDeleted
    }
}

export function mapExerciseToDataForm(exercise: Exercise): ExerciseDataForm {
    return {
        idExercise: exercise.idExercise,
        name: exercise.name,
        difficulty: exercise.difficulty,
        description: exercise.description,
        series: exercise.series,
        repetitions: exercise.repetitions,
        idExerciseDifficulty: exercise.exerciseDifficulty.idExerciseDifficulty,
        idExerciseCategory: exercise.exerciseCategory.idExerciseCategory,
        paramLoggedIdUser: exercise.paramLoggedIdUser,
        idUser: exercise.user.idUser,
        isDeleted: exercise.isDeleted,
    }

}
export function mapRoutineToDataForm(routine: Routine): RoutineDataForm {
    return {
        idRoutine: routine.idRoutine,
        name: routine.name,
        date: routine.date.toISOString().split('T')[0], 
        idDifficultyRoutine: routine.difficultyRoutine.idDifficultyRoutine,
        idUser: routine.user.idUser,
        isDeleted: routine.isDeleted,
        exercises: routine.routineExercises.map(ex => ({
            idExercise: ex.exercise.idExercise,
            series: ex.series,
            repetitions: ex.repetitions,
            note: ex.note,
            categoryOrder: ex.categoryOrder
        })),
        assignments: routine.routineAssignments.map(assignment => ({
            idClient: assignment.client.idClient,
            assignmentDate: assignment.assignmentDate.toISOString().split('T')[0]
        }))
    };
}

export function mapRoutineToDTO(routine: Routine): RoutineWithExercisesDTO {
    return {
        idRoutine: routine.idRoutine,
        name: routine.name,
        date: routine.date.toISOString(), // Convertir Date a string ISO
        idUser: routine.user.idUser,
        difficultyRoutine: {
            idDifficultyRoutine: routine.difficultyRoutine.idDifficultyRoutine
        },
        exercises: routine.routineExercises.map(re => ({
            idExercise: re.exercise.idExercise,
            series: re.series,
            repetitions: re.repetitions,
            note: re.note,
            categoryOrder: re.categoryOrder
        })),
        assignments: routine.routineAssignments.map(ra => ({
            idClient: ra.client.idClient,
            assignmentDate: ra.assignmentDate.toISOString()
        })),
        isDeleted: routine.isDeleted,
        paramLoggedIdUser: routine.createdByUser
    };
}