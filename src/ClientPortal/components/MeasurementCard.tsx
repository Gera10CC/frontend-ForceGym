import { memo } from 'react';
import type { Measurement } from '../../shared/types';

interface MeasurementCardProps {
    measurement: Measurement;
    formatDate: (date: Date | string) => string;
}

const MeasurementCard = memo(({ measurement, formatDate }: MeasurementCardProps) => {
    return (
        <div className="bg-white border-l-4 border-yellow rounded-lg shadow-md p-4 md:p-5">
            <h3 className="text-lg md:text-xl font-bold mb-4 text-yellow flex items-center gap-2">
                Medición del: {formatDate(measurement.measurementDate)}
            </h3>
            
            {/* Medidas básicas */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                <div className="bg-gradient-to-br from-yellow/10 to-yellow/5 border-l-4 border-yellow p-3 md:p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <p className="text-xs md:text-sm text-gray-600 font-medium mb-1">Peso</p>
                    <p className="text-xl md:text-2xl font-bold text-yellow">
                        {measurement.weight} <span className="text-base md:text-lg">kg</span>
                    </p>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-blue-25 border-l-4 border-blue-500 p-3 md:p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <p className="text-xs md:text-sm text-gray-600 font-medium mb-1">Altura</p>
                    <p className="text-xl md:text-2xl font-bold text-blue-600">
                        {measurement.height} <span className="text-base md:text-lg">cm</span>
                    </p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-25 border-l-4 border-green-500 p-3 md:p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <p className="text-xs md:text-sm text-gray-600 font-medium mb-1">Masa Muscular</p>
                    <p className="text-xl md:text-2xl font-bold text-green-600">{measurement.muscleMass}</p>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-orange-25 border-l-4 border-orange-500 p-3 md:p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <p className="text-xs md:text-sm text-gray-600 font-medium mb-1">% Grasa Corporal</p>
                    <p className="text-xl md:text-2xl font-bold text-orange-600">
                        {measurement.bodyFatPercentage}<span className="text-base md:text-lg">%</span>
                    </p>
                </div>
            </div>
        </div>
    );
});

MeasurementCard.displayName = 'MeasurementCard';

export default MeasurementCard;
