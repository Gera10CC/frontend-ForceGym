import { Routes, Route, useNavigate } from "react-router";
import { useEffect, lazy, Suspense } from "react";
import { setAuthHeader, setAuthUser } from "../shared/utils/authentication";
import { useCommonDataStore } from "../shared/CommonDataStore";
import { ProtectedRoute } from "./ProtectedRoutes";

// Lazy loading de componentes para reducir el bundle inicial
const DashboardManagement = lazy(() => import("../Dashboard/Page"));
const UserManagement = lazy(() => import("../User/Page"));
const EconomicIncomeManagement = lazy(() => import("../Income/Page"));
const EconomicExpenseManagement = lazy(() => import("../Expense/Page"));
const AssetManagement = lazy(() => import("../Asset/Page"));
const ClientManagement = lazy(() => import("../Client/Page"));
const NotificationTemplateManagement = lazy(() => import("../TemplateNotification/Page"));
const MeasurementManagement = lazy(() => import("../Measurement/Page"));
const AssignedRoutines = lazy(() => import("../Client/AssignedRoutines"));
const EconomicBalanceDashboard = lazy(() => import("../Balance/Page"));
const CategoryManagement = lazy(() => import("../Category/Page"));
const ClientTypeManagement = lazy(() => import("../ClientType/Page"));
const ExerciseManagement = lazy(() => import("../Exercise/Page"));
const ActivityTypeManagement = lazy(() => import("../ActivityType/Page"));
const RoutineManagement = lazy(() => import("../Routine/Page"));
const ExerciseCategoryManagement = lazy(() => import("../ExerciseCategory/Page"));
const UserColabManagement = lazy(() => import("../UserColab/Page"));

// Loading fallback component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
);

function PrivateRoutes() {
  const {
    fetchRoles,
    fetchMeansOfPayment,
    fetchActivityTypes,
    fetchGenders,
    fetchClientTypes,
    fetchCategories,
    fetchNotificationTypes,
    fetchExerciseDifficulty,
    fetchDifficultyRoutines,
    fetchExercise,
  } = useCommonDataStore();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const fetchFunctions = [
        fetchRoles,
        fetchMeansOfPayment,
        fetchActivityTypes,
        fetchGenders,
        fetchClientTypes,
        fetchCategories,
        fetchNotificationTypes,
        fetchDifficultyRoutines,
        fetchExercise,
        fetchExerciseDifficulty,
      ];

      for (const fetchFn of fetchFunctions) {
        const result = await fetchFn();
        if (result.logout) {
          setAuthHeader(null);
          setAuthUser(null);
          navigate("/login", { replace: true });
          return;
        }
      }
    };

    fetchData();
  }, []);

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="dashboard" element={<DashboardManagement />} />

        <Route
          path="usuarios"
          element={
            <ProtectedRoute allowedRoles={["Administrador"]}>
              <UserManagement />
            </ProtectedRoute>
          }
        />

        <Route
          path="usuariocolaborador"
          element={
            <ProtectedRoute allowedRoles={["Colaborador"]}>
              <UserColabManagement />
            </ProtectedRoute>
          }
        />

        <Route path="ingresos" element={<EconomicIncomeManagement />} />

        <Route
          path="gastos"
          element={
            <ProtectedRoute allowedRoles={["Administrador"]}>
              <EconomicExpenseManagement />
            </ProtectedRoute>
          }
        />

        <Route path="balance" element={<EconomicBalanceDashboard />} />

        <Route path="activos" element={<AssetManagement />} />
        <Route path="clientes" element={<ClientManagement />} />
        <Route path="tipos-cliente" element={<ClientTypeManagement />} />
        <Route path="medidas" element={<MeasurementManagement />} />
        <Route path="rutinas-asignadas" element={<AssignedRoutines />} />
        <Route path="plantillas-notificacion" element={<NotificationTemplateManagement />} />
        <Route path="categorias" element={<CategoryManagement />} />
        <Route path="ejercicios" element={<ExerciseManagement />} />
        <Route path="tipos-actividad" element={<ActivityTypeManagement />} />
        <Route path="rutinas" element={<RoutineManagement />} />
        <Route path="categorias-ejercicios" element={<ExerciseCategoryManagement />} />
      </Routes>
    </Suspense>
  );
}

export default PrivateRoutes;