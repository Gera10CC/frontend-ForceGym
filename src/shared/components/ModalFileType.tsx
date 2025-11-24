import { useState } from "react";
import Swal from "sweetalert2";

type FileTypeDecisionProps = {
  modulo: string;
  closeModal: () => void;
  exportToPDF: () => void;
  exportToExcel: () => void;
};

export default function FileTypeDecision({
  modulo,
  closeModal,
  exportToPDF,
  exportToExcel,
}: FileTypeDecisionProps) {
  const [selected, setSelected] = useState<"pdf" | "excel" | null>(null);

  const handleSubmit = async () => {
    if (!selected) {
      await Swal.fire({
        title: "Advertencia",
        text: "Debe escoger 1 de las opciones para realizar la exportación",
        icon: "warning",
        confirmButtonText: "OK",
        timer: 3000,
        timerProgressBar: true,
        width: 500,
        confirmButtonColor: "#CFAD04",
      });
      return;
    }

    selected === "pdf" ? exportToPDF() : exportToExcel();
  };
const optionClass = (type: "pdf" | "excel") =>
  `
    rounded-xl py-5 px-4 flex gap-4 justify-center items-center cursor-pointer
    border-2 transition-all duration-200
    ${selected === type 
      ? "border-yellow bg-yellor shadow-md scale-[1.02]" 
      : "border-gray-300 hover:border-yellow hover:bg-gray-50"
    }
  `;
  return (
    <div className="justify-center">
      {/* HEADER */}
      <header className="mb-12 text-center">
        <h1 className="text-xl pb-2 font-bold">{modulo}</h1>
        <p className="text-gray-600">
          Elija el tipo de archivo al que desea exportar la información.
        </p>
      </header>

      {/* OPTIONS */}
      <main className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className={optionClass("pdf")} onClick={() => setSelected("pdf")}>
          <img src="/logo-pdf.webp" alt="Logo PDF" className="w-12 h-auto" />
          Documento PDF
        </div>

        <div
          className={optionClass("excel")}
          onClick={() => setSelected("excel")}
        >
          <img src="/logo-excel.webp" alt="Logo Excel" className="w-12 h-auto" />
          Documento Excel
        </div>
      </main>

      {/* BUTTONS */}
      <div className="mt-12 mb-2 flex gap-10 sm:gap-24 justify-center">
        <button
          className="rounded-lg px-6 py-2 border-2 border-gray-400 hover:opacity-75 transition"
          onClick={closeModal}
        >
          Cancelar
        </button>

        <button
          className="rounded-lg px-6 py-2 bg-yellow hover:opacity-75 transition"
          onClick={handleSubmit}
        >
          Confirmar
        </button>
      </div>
    </div>
  );
}