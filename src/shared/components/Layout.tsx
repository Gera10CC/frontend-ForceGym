import { useState } from "react";
import AsideBar from "./AsideBar";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  return (
    <div className="flex bg-black w-full min-h-screen relative overflow-hidden">

      <AsideBar
        expanded={sidebarExpanded}
        setExpanded={setSidebarExpanded}
      />

      {sidebarExpanded && (
        <div
          onClick={() => setSidebarExpanded(false)}
          className="
            fixed inset-0 z-30
            bg-black/40
            backdrop-blur-sm
            transition-opacity
          "
        />
      )}

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