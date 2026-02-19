import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { IoIosNotificationsOutline } from "react-icons/io";
import { NotificationsModal } from "../shared/components/NotificationsModal";
import { formatAmountToCRC } from "../shared/utils/format";
import { useEconomicBalanceStore } from '../Balance/Store';
import { useNavigate } from "react-router";
import { setAuthHeader, setAuthUser } from "../shared/utils/authentication";
import MembershipCalendar from "./MembershipCalendar";

function DashboardManagement() {
  const {
    economicExpenses,
    economicIncomes,
    fetchEconomicExpenses,
    fetchEconomicIncomes,
  } = useEconomicBalanceStore();

  const navigate = useNavigate();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const expenseResult = await fetchEconomicExpenses();
      const incomeResult = await fetchEconomicIncomes();

      if (expenseResult.logout || incomeResult.logout) {
        setAuthHeader(null);
        setAuthUser(null);
        navigate('/login', { replace: true });
      }
    };

    fetchData();
  }, []);

  const processChartData = () => {
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const monthlyData = months.map(month => ({
      name: month,
      income: 0,
      expense: 0,
      balance: 0
    }));

    economicIncomes.forEach((income: any) => {
      const monthIndex = new Date(income.registrationDate).getMonth();
      monthlyData[monthIndex].income += income.amount;
      monthlyData[monthIndex].balance += income.amount;
    });

    economicExpenses.forEach((expense: any) => {
      const monthIndex = new Date(expense.registrationDate).getMonth();
      monthlyData[monthIndex].expense += expense.amount;
      monthlyData[monthIndex].balance -= expense.amount;
    });

    return monthlyData;
  };

  const chartData = processChartData();
  const formatYAxis = (value: number) => `₡${value.toLocaleString('es-CR')}`;

  return (
<div className="bg-black min-h-screen text-gray-800 transition-all duration-100">
        {/* Header */}
      <header className="relative flex justify-center items-center py-4 mb-6 bg-black px-4 sm:px-6">
        <img src="/LogoBlack.jpg" alt="Logo de Force GYM" className="w-32 sm:w-40 h-auto" />
        <button
          className="p-2 rounded-full hover:bg-gray-800 absolute right-4"
          onClick={() => setIsNotificationsOpen(true)}
        >
          <IoIosNotificationsOutline className="text-white text-2xl" />
        </button>
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-1 gap-6 px-4 sm:px-6 lg:px-20">
        {/* Balance */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md overflow-x-auto">
          <h2 className="text-lg sm:text-xl font-semibold text-center mb-4">Balance Mensual</h2>
          <div className="flex justify-center w-full">
            <div className="w-full h-40 sm:h-48 lg:h-52">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="2 2" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#666", fontSize: 11 }}
                  />
                  <YAxis
                    tickFormatter={formatYAxis}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#666", fontSize: 11 }}
                    width={80}
                  />
                  <Tooltip
                    formatter={(value: number) => [`₡${value.toLocaleString("es-CR")}`, "Monto"]}
                    labelFormatter={(label) => `Mes: ${label}`}
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #eee",
                      borderRadius: "6px",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                      fontSize: "12px",
                    }}
                  />
                  <Legend wrapperStyle={{ paddingTop: "10px", fontSize: "12px" }} />
                  <Bar dataKey="balance" name="Balance" fill="#8a2be2" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Ingresos y Gastos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Ingresos */}
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md overflow-x-auto">
            <h2 className="text-lg font-semibold text-center mb-4">Ingresos Mensuales</h2>
            <div className="flex justify-center w-full">
              <div className="w-full h-32 sm:h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 15, right: 20, left: 20, bottom: 15 }}>
                    <CartesianGrid strokeDasharray="2 2" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#666", fontSize: 10 }}
                    />
                    <YAxis
                      tickFormatter={formatYAxis}
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#666", fontSize: 10 }}
                      width={70}
                    />
                    <Tooltip
                      formatter={(value: number) => [`₡${value.toLocaleString("es-CR")}`, "Monto"]}
                      labelFormatter={(label) => `Mes: ${label}`}
                      contentStyle={{ fontSize: "12px" }}
                    />
                    <Legend wrapperStyle={{ paddingTop: "5px", fontSize: "11px" }} />
                    <Bar dataKey="income" name="Ingresos" fill="#4CAF50" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Gastos */}
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md overflow-x-auto">
            <h2 className="text-lg font-semibold text-center mb-4">Gastos Mensuales</h2>
            <div className="flex justify-center w-full">
              <div className="w-full h-32 sm:h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 15, right: 20, left: 20, bottom: 15 }}>
                    <CartesianGrid strokeDasharray="2 2" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#666", fontSize: 10 }}
                    />
                    <YAxis
                      tickFormatter={formatYAxis}
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#666", fontSize: 10 }}
                      width={70}
                    />
                    <Tooltip
                      formatter={(value: number) => [`₡${value.toLocaleString("es-CR")}`, "Monto"]}
                      labelFormatter={(label) => `Mes: ${label}`}
                      contentStyle={{ fontSize: "12px" }}
                    />
                    <Legend wrapperStyle={{ paddingTop: "5px", fontSize: "11px" }} />
                    <Bar dataKey="expense" name="Gastos" fill="#FFD700" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Calendario de Vencimientos */}
        <MembershipCalendar />
      </main>

      {/* Notificaciones Modal */}
      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />
    </div>
  );
}

export default DashboardManagement;