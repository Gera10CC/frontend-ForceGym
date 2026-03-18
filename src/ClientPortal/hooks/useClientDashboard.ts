import { useMemo } from 'react';

export const useMembershipStatus = (expirationMembershipDate?: Date | string) => {
    return useMemo(() => {
        if (!expirationMembershipDate) {
            return { status: 'unknown', daysRemaining: 0, lastValidDay: null };
        }
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        // Parsear fecha de vencimiento sin zona horaria
        let expirationDate: Date;
        const dateValue = expirationMembershipDate;
        
        if (typeof dateValue === 'string') {
            const dateOnly = dateValue.split('T')[0]; // Toma solo YYYY-MM-DD
            const [year, month, day] = dateOnly.split('-').map(Number);
            expirationDate = new Date(year, month - 1, day); // Crear fecha local
        } else {
            expirationDate = new Date(dateValue);
        }
        expirationDate.setHours(0, 0, 0, 0);
        
        // El último día válido de ingreso es el día ANTERIOR a la fecha de vencimiento
        const lastValidDay = new Date(expirationDate);
        lastValidDay.setDate(lastValidDay.getDate() - 1);
        
        const diffTime = lastValidDay.getTime() - today.getTime();
        const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (daysRemaining < 0) {
            return { status: 'expired', daysRemaining: Math.abs(daysRemaining), lastValidDay };
        } else if (daysRemaining === 0) {
            return { status: 'lastDay', daysRemaining: 0, lastValidDay };
        } else if (daysRemaining <= 6) {
            return { status: 'warning', daysRemaining, lastValidDay };
        } else {
            return { status: 'active', daysRemaining, lastValidDay };
        }
    }, [expirationMembershipDate]);
};

export const useFormatDate = () => {
    return useMemo(() => {
        return (date: Date | string) => {
            if (!date) return 'Sin fecha';
            
            // Si es string, extraer directamente año-mes-día
            let year: number, month: number, day: number;
            
            if (typeof date === 'string') {
                const dateOnly = date.split('T')[0]; // Toma solo YYYY-MM-DD
                const parts = dateOnly.split('-');
                year = parseInt(parts[0]);
                month = parseInt(parts[1]) - 1; // Los meses en JS van de 0-11
                day = parseInt(parts[2]);
            } else {
                year = date.getFullYear();
                month = date.getMonth();
                day = date.getDate();
            }
            
            // Crear fecha local sin zona horaria
            const localDate = new Date(year, month, day);
            return localDate.toLocaleDateString('es-CR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        };
    }, []);
};
