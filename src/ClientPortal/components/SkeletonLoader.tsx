import { memo } from 'react';

export const CardSkeleton = memo(() => (
    <div className="bg-white rounded-lg shadow-lg p-4 md:p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
        </div>
    </div>
));

CardSkeleton.displayName = 'CardSkeleton';

export const RoutineSkeleton = memo(() => (
    <div className="border-2 border-gray-200 rounded-lg p-4 md:p-6 animate-pulse">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-6">
            <div className="flex-1">
                <div className="h-8 bg-gray-200 rounded w-2/3 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-1"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <div className="h-10 bg-gray-200 rounded w-full sm:w-32"></div>
                <div className="h-10 bg-gray-200 rounded w-full sm:w-32"></div>
            </div>
        </div>
        <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
        </div>
    </div>
));

RoutineSkeleton.displayName = 'RoutineSkeleton';

export const MeasurementSkeleton = memo(() => (
    <div className="border-2 border-gray-200 rounded-lg p-4 md:p-5 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-gray-100 border-2 border-gray-200 p-3 md:p-4 rounded-lg">
                    <div className="h-3 bg-gray-200 rounded w-2/3 mb-2"></div>
                    <div className="h-8 bg-gray-200 rounded w-full"></div>
                </div>
            ))}
        </div>
    </div>
));

MeasurementSkeleton.displayName = 'MeasurementSkeleton';
