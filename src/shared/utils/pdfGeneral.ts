import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  formatCurrentDateForDocument,
  formatCurrentDateWithHourForTitle,
  formatCurrentHourForDocument,
} from "./format";
import { getAuthUser } from "./authentication";

export const exportToPDFGeneral = (
  title: string,
  tableColumn: string[],
  tableRows: any[][]
) => {
  const doc = new jsPDF({ putOnlyUsedFonts: true });

  const formattedCurrentDate = formatCurrentDateWithHourForTitle();
  const formattedCurrentDateDoc = formatCurrentDateForDocument();
  const formattedCurrentHourDoc = formatCurrentHourForDocument();
  const user = getAuthUser();

  const userName = `${user?.person.name} ${user?.person.firstLastName} ${user?.person.secondLastName}`;

  doc.setProperties({
    title: `Reporte de ${title} - ${formattedCurrentDate}`,
  });

  /* ================================
     ✅ HEADER GENERAL (TODOS)
  ================================= */
  const logo = "/Logo.webp";
  doc.addImage(logo, "WEBP", 13, 8, 35, 15);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text(`Reporte de ${title}`, 105, 18, { align: "center" });

  doc.setLineWidth(0.1);
  doc.setDrawColor(200, 200, 200);
  doc.line(13, 27, 195, 27);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`Hecho por: ${userName}`, 13, 35);
  doc.text(`Fecha: ${formattedCurrentDateDoc}`, 13, 40);
  doc.text(`Hora: ${formattedCurrentHourDoc}`, 13, 45);

  doc.line(13, 50, 195, 50);

  let nextStartY = 58;

  /* ======================================
     ✅ TABLA PRINCIPAL (GENERAL)
  ====================================== */
  autoTable(doc, {
    startY: nextStartY,
    head: [tableColumn],
    body: tableRows,
    theme: "striped",
    styles: {
      fontSize: 9,
      halign: "center",
      cellPadding: 2,
    },
    headStyles: {
      fillColor: [207, 173, 4],
      textColor: [0, 0, 0],
      fontStyle: "bold",
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
    margin: { left: 10, right: 10 },
  });

  /* ======================================
     ✅ GUARDAR PDF
  ====================================== */
  doc.save(`Reporte de ${title} - ${formattedCurrentDate}.pdf`);
};