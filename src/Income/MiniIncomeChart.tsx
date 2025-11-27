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
import { EconomicIncome } from "../shared/types";

interface MiniIncomeChartProps {
  economicIncomes: EconomicIncome[];
}

const MiniIncomeChart: React.FC<MiniIncomeChartProps> = ({ economicIncomes }) => {

  const calculateTotals = () => {
    let dailyTotal = 0;
    let weeklyTotal = 0;
    let biweeklyTotal = 0;
    let monthlyTotal = 0;

    const today = new Date();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(today.getDate() - 7);

    economicIncomes.forEach((income) => {
      const incomeDate = new Date(income.registrationDate);

      if (incomeDate.toDateString() === today.toDateString()) {
        dailyTotal += income.amount;
      }

      if (incomeDate >= oneWeekAgo) {
        weeklyTotal += income.amount;
      }

      if (incomeDate.getMonth() === today.getMonth() && incomeDate.getDate() <= 15) {
        biweeklyTotal += income.amount;
      }

      if (incomeDate.getMonth() === today.getMonth()) {
        monthlyTotal += income.amount;
      }
    });

    return { dailyTotal, weeklyTotal, biweeklyTotal, monthlyTotal };
  };

  const { dailyTotal, weeklyTotal, biweeklyTotal, monthlyTotal } = calculateTotals();

  const chartData = [
    { name: "Diario", value: dailyTotal, fill: "#4f46e5" },
    { name: "Semanal", value: weeklyTotal, fill: "#16a34a" },
    { name: "Quincenal", value: biweeklyTotal, fill: "#eab308" },
    { name: "Mensual", value: monthlyTotal, fill: "#fb923c" },
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
            formatter={(value) => [`${formatAmountToCRC(Number(value))}`, "Ingresos"]}
            labelStyle={{ fontSize: 12 }}
          />

          <Bar dataKey="value" name="Ingresos">
            {chartData.map((entry, index) => (
              <Cell key={index} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MiniIncomeChart;