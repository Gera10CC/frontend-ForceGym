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


const NavItem = memo(
  ({
    to,
    icon,
    label,
    isActive,
    expanded,
    onClick,
    allowedRoles,
    userRole,
  }: any) => {
    if (allowedRoles && !allowedRoles.includes(userRole)) return null;

    return (
      <Link
        to={to}
        onClick={() => onClick?.()}
        className={`flex items-center gap-3 px-4 py-2 rounded-md transition
          ${isActive ? "bg-yellow text-black font-semibold" : "hover:bg-yellow hover:text-black"}
        `}
      >
        <span className={`${expanded ? "pl-2" : ""}`}>{icon}</span>
        {expanded && <span className="truncate">{label}</span>}
      </Link>
    );
  }
);


export default function AsideBar({
  expanded,
  setExpanded,
}: {
  expanded: boolean;
  setExpanded: (value: boolean) => void;
}) {
  const loggedUser = getAuthUser();
  const userRole = loggedUser?.role?.name ?? "";

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const submenuRef = useRef<HTMLDivElement>(null);
  const optionsBtnRef = useRef<HTMLDivElement>(null);

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
        className={`
        fixed bg-black text-white h-full ...
        transition-all duration-300 z-[100] shadow-xl
          ${expanded ? "w-56 px-2" : "w-14"}
        `}
      >

        <div
          className="flex items-center gap-3  py-[21px] px-4 hover:bg-yellow hover:text-black cursor-pointer rounded-b-md"
          onClick={() => setExpanded(!expanded)}
        >
          <Menu />
          {expanded && <span className="text-sm font-medium">Menú</span>}
        </div>

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

          <div
            ref={optionsBtnRef}
            onClick={(e) => {
              e.stopPropagation();
              setShowOptions(!showOptions);
              // Cerrar sidebar en mobile cuando se abre el submenú
              if (!showOptions && window.innerWidth < 768) {
                setExpanded(false);
              }
            }}
            className="flex items-center gap-3 px-4 py-2 hover:bg-yellow hover:text-black cursor-pointer rounded-md"
          >
            <Settings2 size={18} />
            {expanded && <span>Más opciones</span>}
          </div>
        </nav>

        <div className="mb-4">
          {expanded && (
            <p className="px-4 truncate opacity-80 text-sm">
              {loggedUser?.username}
            </p>
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

      {showOptions && (
        <div
          ref={submenuRef}
          key={`submenu-${expanded}`}
          className="fixed bg-black border border-gray-700 rounded-md shadow-lg text-white p-2 w-64 z-50 flex flex-col gap-2 max-h-80 overflow-y-auto"
          style={{
            top: (() => {
              const btnRect = optionsBtnRef.current?.getBoundingClientRect();
              if (!btnRect) return 0;
              
              // Altura aproximada del menú (4 items * ~40px cada uno + padding)
              const menuHeight = 280;
              const spaceBelow = window.innerHeight - btnRect.bottom;
              
              // Si no hay suficiente espacio abajo, abrir hacia arriba
              if (spaceBelow < menuHeight) {
                return btnRect.top - menuHeight + 20;
              }
              
              return btnRect.top - 20;
            })(),
            left: (() => {
              const btnRect = optionsBtnRef.current?.getBoundingClientRect();
              if (!btnRect) return 0;
              
              // Si el sidebar está expandido, posicionar a la derecha del sidebar
              if (expanded) {
                return btnRect.right + 8;
              }
              
              // Si el sidebar está colapsado, posicionar más adentro de la pantalla
              const menuWidth = 256;
              const rightEdge = btnRect.right + 8 + menuWidth;
              
              // Si el menú se sale de la pantalla, posicionarlo desde la izquierda con margen
              if (rightEdge > window.innerWidth) {
                return 60; // Margen desde la izquierda
              }
              
              return btnRect.right + 8;
            })()
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
            isActive={
              location.pathname === "/gestion/categorias-ejercicios"
            }
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