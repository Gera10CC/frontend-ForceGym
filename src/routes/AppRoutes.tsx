import { Route, Routes } from "react-router";
import PublicRoutes from "./PublicRoutes";
import PrivateRoutes from "./PrivateRoutes";
import Layout from "../shared/components/Layout"; 

function AppRoutes() {
  return (
    <Routes>
      {/* RUTAS PÚBLICAS */}
      <Route path="/*" element={<PublicRoutes />} />

      {/* RUTAS PRIVADAS CON LAYOUT */}
      <Route
        path="gestion/*"
        element={
          <Layout>
            <PrivateRoutes />
          </Layout>
        }
      />
    </Routes>
  );
}

export default AppRoutes;