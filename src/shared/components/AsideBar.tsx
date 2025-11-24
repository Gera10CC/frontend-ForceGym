import { useState, useEffect, useRef, memo } from "react";
import {
  Menu,
  User,
  Dumbbell,
  TrendingUp,
  TrendingDown,
  Scale,
  LayoutDashboard,
  Calendar,
  BellDot,
  Settings2,
  Users,
  Layers,
  LogOut,
  ClipboardList,
  NotebookText
} from "lucide-react";

import { Link, useNavigate, useLocation } from "react-router-dom";
import { getAuthUser } from "../utils/authentication";
import { LogoutModal } from "./LogoutModal";

// =====================================================================
// NavItem optimizado con memo (para evitar renders innecesarios)
// =====================================================================
const NavItem = memo(
  ({
    to,
    icon,
    label,
    isActive,
    expanded,
    onClick,
    allowedRoles,
    userRole
  }: any) => {
    if (allowedRoles && !allowedRoles.includes(userRole)) return null;

    return (
      <Link
        to={to}
        onClick={onClick}
        className={`flex items-center gap-3 px-4 py-2 rounded-md transition
          ${isActive ? "bg-yellow text-black font-semibold" : "hover:bg-yellow hover:text-black"}
        `}
      >
        <span className={`${expanded && "pl-2"}`}>{icon}</span>
        {expanded && <span className="truncate">{label}</span>}
      </Link>
    );
  }
);

// =====================================================================
// ASIDEBAR PRINCIPAL
// =====================================================================
export default function AsideBar() {
  const loggedUser = getAuthUser();
  const userRole = loggedUser?.role?.name ?? "";

  const [expanded, setExpanded] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const submenuRef = useRef<HTMLDivElement>(null);
  const optionsBtnRef = useRef<HTMLDivElement>(null);

  // Emitimos el estado del sidebar al layout global
  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("sidebar-toggle", { detail: expanded })
    );
  }, [expanded]);

  // Cerrar submenús al hacer click afuera
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        submenuRef.current &&
        !submenuRef.current.contains(e.target as Node) &&
        !optionsBtnRef.current?.contains(e.target as Node)
      ) {
        setShowOptions(false);
      }
    };

    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <>
      <aside
        id="sidebar"
        className={`
          fixed bg-black text-white h-full flex flex-col justify-between 
          transition-all duration-300 z-40 shadow-xl
          ${expanded ? "w-56 px-2" : "w-14"}
        `}
      >
        {/* BOTÓN MENÚ */}
        <div
          className="flex items-center gap-3 p-3 hover:bg-yellow hover:text-black cursor-pointer rounded-b-md"
          onClick={() => setExpanded(!expanded)}
        >
          <Menu />
          {expanded && <span className="text-sm font-medium">Menú</span>}
        </div>

        {/* NAV ITEMS */}
        <nav className="flex flex-col gap-1 mt-4 border-y border-gray-700 py-4">
          <NavItem
            to="/gestion/dashboard"
            icon={<LayoutDashboard size={18} />}
            label="Dashboard"
            isActive={location.pathname === "/gestion/dashboard"}
            expanded={expanded}
            onClick={() => setShowOptions(false)}
            userRole={userRole}
          />

          <NavItem
            to="/gestion/usuarios"
            icon={<User size={18} />}
            label="Usuarios"
            allowedRoles={["Administrador"]}
            isActive={location.pathname === "/gestion/usuarios"}
            expanded={expanded}
            onClick={() => setShowOptions(false)}
            userRole={userRole}
          />

          <NavItem
            to="/gestion/clientes"
            icon={<Dumbbell size={18} />}
            label="Clientes"
            isActive={location.pathname === "/gestion/clientes"}
            expanded={expanded}
            onClick={() => setShowOptions(false)}
            userRole={userRole}
          />

          <NavItem
            to="/gestion/ingresos"
            icon={<TrendingUp size={18} />}
            label="Ingresos"
            isActive={location.pathname === "/gestion/ingresos"}
            expanded={expanded}
            onClick={() => setShowOptions(false)}
            userRole={userRole}
          />

          <NavItem
            to="/gestion/gastos"
            icon={<TrendingDown size={18} />}
            label="Gastos"
            allowedRoles={["Administrador"]}
            isActive={location.pathname === "/gestion/gastos"}
            expanded={expanded}
            onClick={() => setShowOptions(false)}
            userRole={userRole}
          />

          <NavItem
            to="/gestion/balance"
            icon={<Scale size={18} />}
            label="Balance"
            isActive={location.pathname === "/gestion/balance"}
            expanded={expanded}
            onClick={() => setShowOptions(false)}
            userRole={userRole}
          />

          <NavItem
            to="/gestion/activos"
            icon={<Layers size={18} />}
            label="Activos"
            isActive={location.pathname === "/gestion/activos"}
            expanded={expanded}
            onClick={() => setShowOptions(false)}
            userRole={userRole}
          />

          <NavItem
            to="/gestion/rutinas"
            icon={<NotebookText size={18} />}
            label="Rutinas"
            isActive={location.pathname === "/gestion/rutinas"}
            expanded={expanded}
            onClick={() => setShowOptions(false)}
            userRole={userRole}
          />

          <NavItem
            to="/gestion/ejercicios"
            icon={<ClipboardList size={18} />}
            label="Ejercicios"
            isActive={location.pathname === "/gestion/ejercicios"}
            expanded={expanded}
            onClick={() => setShowOptions(false)}
            userRole={userRole}
          />

          {/* MORE OPTIONS */}
          <div
            ref={optionsBtnRef}
            onClick={(e) => {
              e.stopPropagation();
              setShowOptions(!showOptions);
            }}
            className="flex items-center gap-3 px-4 py-2 hover:bg-yellow hover:text-black cursor-pointer rounded-md"
          >
            <Settings2 size={18} />
            {expanded && <span>Más opciones</span>}
          </div>
        </nav>

        {/* USER + LOGOUT */}
        <div className="mb-4">
          {expanded && (
            <p className="px-4 truncate opacity-80 text-sm">{loggedUser?.username}</p>
          )}

          <div
            onClick={() => setShowLogoutModal(true)}
            className="flex items-center gap-3 px-4 py-2 mt-4 hover:bg-yellow hover:text-black cursor-pointer rounded-md"
          >
            <LogOut size={20} />
            {expanded && <span>Cerrar sesión</span>}
          </div>
        </div>
      </aside>

      {/* SUBMENÚ FLOTANTE */}
      {showOptions && (
        <div
          ref={submenuRef}
          className="fixed bg-black border border-gray-700 rounded-md shadow-lg text-white p-2 w-64 z-50 flex flex-col gap-2"
          style={{
            top: (optionsBtnRef.current?.getBoundingClientRect().top ?? 0) - 20,
            left: (optionsBtnRef.current?.getBoundingClientRect().right ?? 0) + 8
          }}
        >
          <NavItem
            to="/gestion/categorias"
            icon={<Layers size={18} />}
            label="Categorías de Gastos"
            expanded
            userRole={userRole}
            isActive={location.pathname === "/gestion/categorias"}
            onClick={() => setShowOptions(false)}
          />

          <NavItem
            to="/gestion/tipos-cliente"
            icon={<Users size={18} />}
            label="Tipos de Cliente"
            expanded
            userRole={userRole}
            isActive={location.pathname === "/gestion/tipos-cliente"}
            onClick={() => setShowOptions(false)}
          />

          <NavItem
            to="/gestion/tipos-actividad"
            icon={<Calendar size={18} />}
            label="Tipos de Actividad"
            expanded
            userRole={userRole}
            isActive={location.pathname === "/gestion/tipos-actividad"}
            onClick={() => setShowOptions(false)}
          />

          <NavItem
            to="/gestion/plantillas-notificacion"
            icon={<BellDot size={18} />}
            label="Plantillas de Notificación"
            expanded
            userRole={userRole}
            isActive={location.pathname === "/gestion/plantillas-notificacion"}
            onClick={() => setShowOptions(false)}
          />

          <NavItem
            to="/gestion/categorias-ejercicios"
            icon={<Dumbbell size={18} />}
            label="Categorías de Ejercicios"
            expanded
            userRole={userRole}
            isActive={location.pathname === "/gestion/categorias-ejercicios"}
            onClick={() => setShowOptions(false)}
          />
        </div>
      )}

      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={logout}
      />
    </>
  );
}