import { memo } from 'react';
import { FaExclamationTriangle, FaClock, FaCheckCircle, FaCalendarAlt } from 'react-icons/fa';

interface MembershipStatusCardProps {
    membershipStatus: {
        status: string;
        daysRemaining: number;
        lastValidDay: Date | null;
    };
    formatDate: (date: Date | string) => string;
}

const MembershipStatusCard = memo(({ membershipStatus, formatDate }: MembershipStatusCardProps) => {
    const getStatusConfig = () => {
        switch (membershipStatus.status) {
            case 'expired':
                return {
                    bgClass: 'bg-red-100 border-l-4 border-red-500',
                    icon: <FaExclamationTriangle className="text-red-500 text-2xl md:text-3xl mt-1 flex-shrink-0" />,
                    titleClass: 'text-red-700',
                    textClass: 'text-red-600',
                    title: 'Membresía Vencida',
                    description: `Tu membresía venció hace ${membershipStatus.daysRemaining} día${membershipStatus.daysRemaining !== 1 ? 's' : ''}.`,
                    alert: 'Por favor, acércate a recepción para renovar tu membresía y continuar disfrutando de nuestros servicios.',
                    alertClass: 'bg-red-50 text-red-600'
                };
            case 'lastDay':
                return {
                    bgClass: 'bg-orange-100 border-l-4 border-orange-500',
                    icon: <FaClock className="text-orange-500 text-2xl md:text-3xl mt-1 flex-shrink-0" />,
                    titleClass: 'text-orange-700',
                    textClass: 'text-orange-600',
                    title: '¡Último Día de Membresía!',
                    description: 'Hoy es tu último día para ingresar al gimnasio.',
                    alert: '⚠️ Renueva tu membresía mañana para no perder acceso al gimnasio.',
                    alertClass: 'bg-orange-50 text-orange-600'
                };
            case 'warning':
                return {
                    bgClass: 'bg-yellow-100 border-l-4 border-yellow-500',
                    icon: <FaClock className="text-yellow-600 text-2xl md:text-3xl mt-1 flex-shrink-0" />,
                    titleClass: 'text-yellow-700',
                    textClass: 'text-yellow-700',
                    title: 'Membresía por Vencer',
                    description: `Te quedan ${membershipStatus.daysRemaining} día${membershipStatus.daysRemaining !== 1 ? 's' : ''} de membresía.`,
                    alert: 'Recuerda renovar tu membresía pronto para no perder acceso al gimnasio.',
                    alertClass: 'bg-yellow-50 text-yellow-700'
                };
            default:
                return {
                    bgClass: 'bg-green-100 border-l-4 border-green-500',
                    icon: <FaCheckCircle className="text-green-500 text-2xl md:text-3xl mt-1 flex-shrink-0" />,
                    titleClass: 'text-green-700',
                    textClass: 'text-green-600',
                    title: 'Membresía Activa',
                    description: `Te quedan ${membershipStatus.daysRemaining} día${membershipStatus.daysRemaining !== 1 ? 's' : ''} de membresía.`,
                    alert: null,
                    alertClass: ''
                };
        }
    };

    const config = getStatusConfig();

    return (
        <div className={`rounded-lg shadow-lg p-4 md:p-6 ${config.bgClass}`}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-start gap-3">
                    {config.icon}
                    <div>
                        <h3 className={`font-bold text-lg md:text-xl ${config.titleClass}`}>
                            {config.title}
                        </h3>
                        <p className={`text-sm md:text-base ${config.textClass}`}>
                            {config.description}
                        </p>
                    </div>
                </div>
                <div className="flex flex-col items-start sm:items-end">
                    <div className="flex items-center gap-2 text-gray-600">
                        <FaCalendarAlt />
                        <span className="text-xs md:text-sm font-medium">Último día de ingreso:</span>
                    </div>
                    <span className="text-base md:text-lg font-bold text-gray-800">
                        {membershipStatus.lastValidDay && formatDate(membershipStatus.lastValidDay)}
                    </span>
                </div>
            </div>
            {config.alert && (
                <p className={`mt-3 text-sm p-2 rounded ${config.alertClass}`}>
                    {config.alert}
                </p>
            )}
        </div>
    );
});

MembershipStatusCard.displayName = 'MembershipStatusCard';

export default MembershipStatusCard;
