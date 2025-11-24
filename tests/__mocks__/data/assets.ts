import { Asset } from "../../../src/shared/types";

export const assets : Asset[] = [
    {
        idAsset: 1,
        boughtDate: new Date('2025-01-02'),
        user: {
            idUser: 1,
            person: {
                idPerson: 1,
                name: 'Carlos',
                firstLastName: 'Pérez',
                secondLastName: 'Gómez',
                birthday: new Date('1985-07-10'),
                identificationNumber: '123456789',
                email: 'carlos.perez@gymfit.com',
                phoneNumber: '1234567890',
                gender: {
                    idGender: 1,
                    name: 'Masculino'
                }
            },
            role: {
                idRole: 1,
                name: 'Administrador'
            },
            username: 'adminCarlos',
            token: '',
            isDeleted: 0
        },
        code: 'MCH-001',
        name: 'Máquina de pesas multifunción',
        quantity: 3,
        initialCost: 180000,
        serviceLifeYears: 5,
        deprecationPerYear: 36000,
        isDeleted: 0
    },
    {
        idAsset: 2,
        boughtDate: new Date('2024-11-15'),
        user: {
            idUser: 1,
            person: {
                idPerson: 1,
                name: 'Carlos',
                firstLastName: 'Pérez',
                secondLastName: 'Gómez',
                birthday: new Date('1985-07-10'),
                identificationNumber: '123456789',
                email: 'carlos.perez@gymfit.com',
                phoneNumber: '1234567890',
                gender: {
                    idGender: 1,
                    name: 'Masculino'
                }
            },
            role: {
                idRole: 1,
                name: 'Administrador'
            },
            username: 'adminCarlos',
            token: '',
            isDeleted: 0
        },
        code: 'TRD-002',
        name: 'Cinta de correr eléctrica',
        quantity: 5,
        initialCost: 120000,
        serviceLifeYears: 4,
        deprecationPerYear: 30000,
        isDeleted: 0
    },
    {
        idAsset: 3,
        boughtDate: new Date('2023-08-10'),
        user: {
            idUser: 1,
            person: {
                idPerson: 1,
                name: 'Carlos',
                firstLastName: 'Pérez',
                secondLastName: 'Gómez',
                birthday: new Date('1985-07-10'),
                identificationNumber: '123456789',
                email: 'carlos.perez@gymfit.com',
                phoneNumber: '1234567890',
                gender: {
                    idGender: 1,
                    name: 'Masculino'
                }
            },
            role: {
                idRole: 1,
                name: 'Administrador'
            },
            username: 'adminCarlos',
            token: '',
            isDeleted: 0
        },
        code: 'BKP-003',
        name: 'Bicicleta de spinning',
        quantity: 7,
        initialCost: 98000,
        serviceLifeYears: 4,
        deprecationPerYear: 24500,
        isDeleted: 0
    },
    {
        idAsset: 4,
        boughtDate: new Date('2025-02-25'),
        user: {
            idUser: 1,
            person: {
                idPerson: 1,
                name: 'Carlos',
                firstLastName: 'Pérez',
                secondLastName: 'Gómez',
                birthday: new Date('1985-07-10'),
                identificationNumber: '123456789',
                email: 'carlos.perez@gymfit.com',
                phoneNumber: '1234567890',
                gender: {
                    idGender: 1,
                    name: 'Masculino'
                }
            },
            role: {
                idRole: 1,
                name: 'Administrador'
            },
            username: 'adminCarlos',
            token: '',
            isDeleted: 0
        },
        code: 'PLT-004',
        name: 'Plataforma vibratoria',
        quantity: 2,
        initialCost: 70000,
        serviceLifeYears: 3,
        deprecationPerYear: 23333,
        isDeleted: 0
    },
    {
        idAsset: 5,
        boughtDate: new Date('2024-06-20'),
        user: {
            idUser: 1,
            person: {
                idPerson: 1,
                name: 'Carlos',
                firstLastName: 'Pérez',
                secondLastName: 'Gómez',
                birthday: new Date('1985-07-10'),
                identificationNumber: '123456789',
                email: 'carlos.perez@gymfit.com',
                phoneNumber: '1234567890',
                gender: {
                    idGender: 1,
                    name: 'Masculino'
                }
            },
            role: {
                idRole: 1,
                name: 'Administrador'
            },
            username: 'adminCarlos',
            token: '',
            isDeleted: 0
        },
        code: 'SRM-005',
        name: 'Sistema de sonido profesional',
        quantity: 1,
        initialCost: 50000,
        serviceLifeYears: 5,
        deprecationPerYear: 10000,
        isDeleted: 0
    },
    {
        idAsset: 6,
        boughtDate: new Date('2024-09-05'),
        user: {
            idUser: 1,
            person: {
                idPerson: 1,
                name: 'Carlos',
                firstLastName: 'Pérez',
                secondLastName: 'Gómez',
                birthday: new Date('1985-07-10'),
                identificationNumber: '123456789',
                email: 'carlos.perez@gymfit.com',
                phoneNumber: '1234567890',
                gender: {
                    idGender: 1,
                    name: 'Masculino'
                }
            },
            role: {
                idRole: 1,
                name: 'Administrador'
            },
            username: 'adminCarlos',
            token: '',
            isDeleted: 0
        },
        code: 'MRR-006',
        name: 'Espejos de pared reforzados',
        quantity: 10,
        initialCost: 30000,
        serviceLifeYears: 8,
        deprecationPerYear: 3750,
        isDeleted: 0
    }
];
