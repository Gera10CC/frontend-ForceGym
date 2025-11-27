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
import { EconomicExpense } from '../shared/types';

interface ExpenseDashboardProps {
  economicExpenses: EconomicExpense[];
}

const ExpenseDashboard: React.FC<ExpenseDashboardProps> = ({ economicExpenses }) => {
  
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

    economicExpenses.forEach((expense) => {
      const expenseDate = new Date(expense.registrationDate);
      const formattedDate = formatDate(expenseDate);

      dailyData[formattedDate] = (dailyData[formattedDate] || 0) + expense.amount;

      if (formattedDate === currentDay) {
        dailyTotal += expense.amount;
      }

      if (getWeekNumber(expenseDate) === currentWeek) {
        weeklyTotal += expense.amount;
      }

      if (expenseDate.getMonth() === today.getMonth()) {
        if (
          (isFirstQuincena && expenseDate.getDate() <= 15) ||
          (!isFirstQuincena && expenseDate.getDate() > 15)
        ) {
          biweeklyTotal += expense.amount;
        }
      }

      if (expenseDate.getMonth() === today.getMonth()) {
        monthlyTotal += expense.amount;
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
    { name: 'Diario', value: dailyTotal, fill: '#f87171' },
    { name: 'Semanal', value: weeklyTotal, fill: '#fb923c' },
    { name: 'Quincenal', value: biweeklyTotal, fill: '#fbbf24' },
    { name: 'Mensual', value: monthlyTotal, fill: '#f43f5e' }
  ];

  return (
    <div className="w-full px-3 sm:px-4 lg:px-10 mt-6">

      <h2 className="text-center text-xl sm:text-2xl lg:text-3xl font-bold mb-8">
        Dashboard de Gastos
      </h2>

      <div className="
        grid grid-cols-1 
        sm:grid-cols-2 
        lg:grid-cols-4 
        gap-4 
        mb-8
      ">
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-red-500">
          <h3 className="font-semibold text-gray-600 text-sm sm:text-base">Hoy</h3>
          <p className="text-2xl font-bold">{formatAmountToCRC(dailyTotal)}</p>
          <p className="text-xs sm:text-sm text-gray-500">{formatDate(new Date())}</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-orange-500">
          <h3 className="font-semibold text-gray-600 text-sm sm:text-base">Esta Semana</h3>
          <p className="text-2xl font-bold">{formatAmountToCRC(weeklyTotal)}</p>
          <p className="text-xs sm:text-sm text-gray-500">Semana {currentWeek}</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-amber-500">
          <h3 className="font-semibold text-gray-600 text-sm sm:text-base">Quincena Actual</h3>
          <p className="text-2xl font-bold">{formatAmountToCRC(biweeklyTotal)}</p>
          <p className="text-xs sm:text-sm text-gray-500">
            {currentMonth} {isFirstQuincena ? '(1-15)' : '(16-final)'}
          </p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-rose-500">
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
                formatter={(value) => [`${formatAmountToCRC(Number(value))}`, 'Gastos']}
                labelFormatter={(name) => `Periodo: ${name}`}
              />
              <Legend />
              <Bar dataKey="value" name="Gastos">
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
          <h3 className="font-semibold text-base mb-2">Día con más gastos</h3>
          <div className="flex justify-between">
            <span className="text-gray-600 text-sm">{highestDay.date || 'No hay datos'}</span>
            <span className="text-red-600 font-bold">
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

export default ExpenseDashboard;