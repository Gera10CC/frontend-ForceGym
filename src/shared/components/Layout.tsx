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
          flex-1 min-h-screen overflow-y-auto
          transition-all duration-300 ease-in-out
          text-black relative z-10
          ${sidebarExpanded ? "ml-56 blur-[1.5px]" : "ml-14"}
        `}
      >
        {children}
      </div>
    </div>
  );
}