import { useState, useEffect } from "react";
import AsideBar from "./AsideBar";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  useEffect(() => {
    const handler = (e: any) => setSidebarExpanded(e.detail);
    window.addEventListener("sidebar-toggle", handler);
    return () => window.removeEventListener("sidebar-toggle", handler);
  }, []);

  return (
    <div className="flex bg-black w-full min-h-screen relative">

      <AsideBar />

      <div
        className={`
          flex-1 min-h-screen overflow-hidden
          transition-all duration-300
          text-black 
          relative z-10
          ${sidebarExpanded ? "pl-56" : "pl-14"}
        `}
      >
        <div className="h-full overflow-y-auto">
          {children}
        </div>
      </div>

    </div>
  );
}