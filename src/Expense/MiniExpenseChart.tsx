import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell
} from "recharts";

import { formatAmountToCRC } from "../shared/utils/format";
import { EconomicExpense } from "../shared/types";

interface MiniExpenseChartProps {
  economicExpenses: EconomicExpense[];
}

const MiniExpenseChart: React.FC<MiniExpenseChartProps> = ({ economicExpenses }) => {

  const calculateTotals = () => {
    let dailyTotal = 0;
    let weeklyTotal = 0;
    let biweeklyTotal = 0;
    let monthlyTotal = 0;

    const today = new Date();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(today.getDate() - 7);

    economicExpenses.forEach((expense) => {
      const expenseDate = new Date(expense.registrationDate);

      if (expenseDate.toDateString() === today.toDateString()) {
        dailyTotal += expense.amount;
      }

      if (expenseDate >= oneWeekAgo) {
        weeklyTotal += expense.amount;
      }

      if (expenseDate.getMonth() === today.getMonth() && expenseDate.getDate() <= 15) {
        biweeklyTotal += expense.amount;
      }

      if (expenseDate.getMonth() === today.getMonth()) {
        monthlyTotal += expense.amount;
      }
    });

    return { dailyTotal, weeklyTotal, biweeklyTotal, monthlyTotal };
  };

  const { dailyTotal, weeklyTotal, biweeklyTotal, monthlyTotal } = calculateTotals();

  const chartData = [
    { name: "Diario", value: dailyTotal, fill: "#e63946" },
    { name: "Semanal", value: weeklyTotal, fill: "#f4a261" },
    { name: "Quincenal", value: biweeklyTotal, fill: "#2a9d8f" },
    { name: "Mensual", value: monthlyTotal, fill: "#264653" }
  ];

  return (
    <div className="w-full h-40 sm:h-48 lg:h-56 px-2">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis 
            dataKey="name"
            tick={{ fontSize: 10, fill: "#444" }}
          />

          <YAxis 
            tick={{ fontSize: 10, fill: "#444" }}
          />

          <Tooltip
            formatter={(value) => [`${formatAmountToCRC(Number(value))}`, "Gastos"]}
            labelStyle={{ fontSize: 12 }}
          />

          <Bar dataKey="value" name="Gastos">
            {chartData.map((entry, index) => (
              <Cell key={index} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MiniExpenseChart;