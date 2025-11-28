import { useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { useEconomicBalanceStore } from "./Store";
import { setAuthHeader, setAuthUser } from "../shared/utils/authentication";
import { useNavigate } from "react-router";

import { FilterButton, FilterSelect } from "./Filter";
import ModalFilter from "../shared/components/ModalFilter";

export default function EconomicBalanceDashboard() {
  const {
    economicExpenses,
    economicIncomes,

    modalFilter,

    filterByStatus,
    filterByAmountRangeMin,
    filterByAmountRangeMax,
    filterByDateRangeMin,
    filterByDateRangeMax,
    filterByMeanOfPayment,

    fetchEconomicExpenses,
    fetchEconomicIncomes,
    closeModalFilter,
  } = useEconomicBalanceStore();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const expenseResult = await fetchEconomicExpenses();
      const incomeResult = await fetchEconomicIncomes();

      if (expenseResult.logout || incomeResult.logout) {
        setAuthHeader(null);
        setAuthUser(null);
        navigate("/login", { replace: true });
      }
    };

    fetchData();
  }, [
    filterByStatus,
    filterByAmountRangeMin,
    filterByAmountRangeMax,
    filterByDateRangeMin,
    filterByDateRangeMax,
    filterByMeanOfPayment,
  ]);

  const processChartData = () => {
    const months = [
      "Ene", "Feb", "Mar", "Abr", "May", "Jun",
      "Jul", "Ago", "Sep", "Oct", "Nov", "Dic",
    ];

    const monthlyData = months.map((m) => ({
      name: m,
      income: 0,
      expense: 0,
      balance: 0,
    }));

    economicIncomes.forEach((income) => {
      const month = new Date(income.registrationDate).getMonth();
      monthlyData[month].income += income.amount;
      monthlyData[month].balance += income.amount;
    });

    economicExpenses.forEach((exp) => {
      const month = new Date(exp.registrationDate).getMonth();
      monthlyData[month].expense += exp.amount;
      monthlyData[month].balance -= exp.amount;
    });

    return monthlyData;
  };

  const chartData = processChartData();

  const formatYAxis = (value: number) =>
    `₡${value.toLocaleString("es-CR")}`;

  return (
    <div className="min-h-screen text-gray-800">

      {/* ✅ HEADER IDÉNTICO AL DE CLIENTES */}
      <header
        className="
          flex flex-col md:flex-row items-center justify-between
          bg-yellow text-black px-4 py-4 rounded-md shadow-md
          gap-4
        "
      >
        <h1 className="text-3xl md:text-4xl uppercase tracking-wide">
          Balance Económico
        </h1>

        {/* Espacio invisible para igualar al SearchInput de Clientes */}
        <div className="hidden md:block flex-1" />

        <ModalFilter
          modalFilter={modalFilter}
          closeModalFilter={closeModalFilter}
          FilterButton={FilterButton}
          FilterSelect={FilterSelect}
        />
      </header>

      {/* ✅ CONTENIDO */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-8 grid gap-8">

        {/* BALANCE GENERAL */}
        <section
          className="
            bg-white rounded-lg shadow-md p-6 w-full
            max-w-4xl mx-auto
          "
        >
          <h2 className="text-lg font-semibold text-center mb-4">
            Balance Mensual
          </h2>

          <div className="w-full h-48 sm:h-56 lg:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 30, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
                <XAxis tick={{ fontSize: 12 }} dataKey="name" />
                <YAxis
                  width={75}
                  tick={{ fontSize: 12 }}
                  tickFormatter={formatYAxis}
                />
                <Tooltip
                  formatter={(value: any) => [
                    `₡${Number(value).toLocaleString("es-CR")}`,
                    "Monto",
                  ]}
                />
                <Legend />

                <Bar
                  dataKey="balance"
                  name="Balance"
                  fill="#6B46C1"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* INGRESOS Y GASTOS */}
        <section
          className="
            grid grid-cols-1 md:grid-cols-2 gap-8 
            w-full max-w-6xl mx-auto
          "
        >

          {/* INGRESOS */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-center mb-4">
              Ingresos
            </h2>

            <div className="w-full h-40 sm:h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis
                    width={70}
                    tickFormatter={formatYAxis}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip formatter={(value: any) =>
                    `₡${Number(value).toLocaleString("es-CR")}`
                  } />
                  <Legend />

                  <Bar
                    dataKey="income"
                    name="Ingresos"
                    fill="#48BB78"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* GASTOS */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-center mb-4">
              Gastos
            </h2>

            <div className="w-full h-40 sm:h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis
                    width={70}
                    tick={{ fontSize: 11 }}
                    tickFormatter={formatYAxis}
                  />
                  <Tooltip formatter={(value: any) =>
                    `₡${Number(value).toLocaleString("es-CR")}`
                  } />
                  <Legend />

                  <Bar
                    dataKey="expense"
                    name="Gastos"
                    fill="#FFD700"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </section>
      </main>
    </div>
  );
}