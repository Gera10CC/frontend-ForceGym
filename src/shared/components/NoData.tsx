import { ReactNode } from "react";
import { AlertCircle } from "lucide-react"; // Ícono moderno y ligero

type NoDataProps = {
  module?: string;
  children?: ReactNode;
  description?: string;
};

export default function NoData({
  module = "datos",
  children,
  description = "Intenta agregando nuevos registros.",
}: NoDataProps) {
  const mod = module.trim() || "datos";

  return (
    <div
      role="status"
      className="flex flex-col items-center text-center gap-3 my-10 mx-4"
    >
      <AlertCircle className="text-red-500 w-20 h-20" />

      <h2 className="text-2xl font-semibold">
        No hay {mod} para mostrar
      </h2>

      <p className="text-gray-600">{description}</p>

      {/* Optional Action Slot */}
      {children && (
        <div className="mt-3" data-testid="custom-children">
          {children}
        </div>
      )}
    </div>
  );
}