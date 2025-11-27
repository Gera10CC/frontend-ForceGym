import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
  Cell
} from 'recharts';

import { formatAmountToCRC, formatDate } from '../shared/utils/format';
import { EconomicIncome } from '../shared/types';

interface IncomeDashboardProps {
  economicIncomes: EconomicIncome[];
}

const IncomeDashboard: React.FC<IncomeDashboardProps> = ({ economicIncomes }) => {

  const getWeekNumber = (date: Date): number => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7));
    const week1 = new Date(d.getFullYear(), 0, 4);
    return 1 +
      Math.round(
        ((d.getTime() - week1.getTime()) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7
      );
  };

  const calculateTotals = () => {
    const today = new Date();
    const currentDay = formatDate(today);
    const currentWeek = getWeekNumber(today);
    const currentMonth = today.toLocaleString('es-ES', { month: 'long' });
    const isFirstQuincena = today.getDate() <= 15;

    let dailyTotal = 0;
    let weeklyTotal = 0;
    let biweeklyTotal = 0;
    let monthlyTotal = 0;
    let highestDay = { date: '', amount: 0 };

    const dailyData: Record<string, number> = {};

    economicIncomes.forEach((income) => {
      const incomeDate = new Date(income.registrationDate);
      const formattedDate = formatDate(incomeDate);

      dailyData[formattedDate] = (dailyData[formattedDate] || 0) + income.amount;

      if (formattedDate === currentDay) {
        dailyTotal += income.amount;
      }

      if (getWeekNumber(incomeDate) === currentWeek) {
        weeklyTotal += income.amount;
      }

      if (incomeDate.getMonth() === today.getMonth()) {
        if (
          (isFirstQuincena && incomeDate.getDate() <= 15) ||
          (!isFirstQuincena && incomeDate.getDate() > 15)
        ) {
          biweeklyTotal += income.amount;
        }
      }

      if (incomeDate.getMonth() === today.getMonth()) {
        monthlyTotal += income.amount;
      }
    });

    Object.entries(dailyData).forEach(([date, amount]) => {
      if (amount > highestDay.amount) highestDay = { date, amount };
    });

    return {
      dailyTotal,
      weeklyTotal,
      biweeklyTotal,
      monthlyTotal,
      currentWeek,
      currentMonth,
      isFirstQuincena,
      highestDay
    };
  };

  const {
    dailyTotal,
    weeklyTotal,
    biweeklyTotal,
    monthlyTotal,
    currentWeek,
    currentMonth,
    isFirstQuincena,
    highestDay
  } = calculateTotals();

  const chartData = [
    { name: 'Diario', value: dailyTotal, fill: '#4ade80' },       
    { name: 'Semanal', value: weeklyTotal, fill: '#22c55e' },     
    { name: 'Quincenal', value: biweeklyTotal, fill: '#86efac' }, 
    { name: 'Mensual', value: monthlyTotal, fill: '#16a34a' }     
  ];

  return (
    <div className="w-full px-3 sm:px-4 lg:px-10 mt-6">

      <h2 className="text-center text-xl sm:text-2xl lg:text-3xl font-bold mb-8">
        Dashboard de Ingresos
      </h2>

      <div className="
        grid grid-cols-1 
        sm:grid-cols-2 
        lg:grid-cols-4 
        gap-4 
        mb-8
      ">
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
          <h3 className="font-semibold text-gray-600 text-sm sm:text-base">Hoy</h3>
          <p className="text-2xl font-bold">{formatAmountToCRC(dailyTotal)}</p>
          <p className="text-xs sm:text-sm text-gray-500">{formatDate(new Date())}</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-emerald-500">
          <h3 className="font-semibold text-gray-600 text-sm sm:text-base">Esta Semana</h3>
          <p className="text-2xl font-bold">{formatAmountToCRC(weeklyTotal)}</p>
          <p className="text-xs sm:text-sm text-gray-500">Semana {currentWeek}</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-lime-500">
          <h3 className="font-semibold text-gray-600 text-sm sm:text-base">Quincena Actual</h3>
          <p className="text-2xl font-bold">{formatAmountToCRC(biweeklyTotal)}</p>
          <p className="text-xs sm:text-sm text-gray-500">
            {currentMonth} {isFirstQuincena ? '(1-15)' : '(16-final)'}
          </p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-700">
          <h3 className="font-semibold text-gray-600 text-sm sm:text-base">Mes Actual</h3>
          <p className="text-2xl font-bold">{formatAmountToCRC(monthlyTotal)}</p>
          <p className="text-xs sm:text-sm text-gray-500">{currentMonth}</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow mb-8 w-full">
        <h3 className="text-lg sm:text-xl font-semibold mb-4">Resumen por periodos</h3>

        <div className="w-full h-60 sm:h-72 lg:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip
                formatter={(value) => [`${formatAmountToCRC(Number(value))}`, 'Ingresos']}
                labelFormatter={(name) => `Periodo: ${name}`}
              />
              <Legend />
              <Bar dataKey="value" name="Ingresos">
                {chartData.map((entry, index) => (
                  <Cell key={index} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold text-base mb-2">Día con más ingresos</h3>
          <div className="flex justify-between">
            <span className="text-gray-600 text-sm">{highestDay.date || 'No hay datos'}</span>
            <span className="text-green-600 font-bold">
              {highestDay.date ? formatAmountToCRC(highestDay.amount) : ''}
            </span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold text-base mb-2">Promedio diario</h3>
          <div className="flex justify-between">
            <span className="text-gray-600 text-sm">Este mes</span>
            <span className="font-bold">
              {formatAmountToCRC(monthlyTotal / new Date().getDate())}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncomeDashboard;