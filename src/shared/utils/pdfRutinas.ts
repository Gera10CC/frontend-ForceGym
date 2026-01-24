import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  formatCurrentDateForDocument,
  formatCurrentDateWithHourForTitle,
  formatCurrentHourForDocument,
} from "./format";
import { getAuthUser } from "./authentication";

export const exportToPDFRutinas = (
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
     ✅ HEADER
  ================================= */
  const logo = "/Logo.webp";
  doc.addImage(logo, "WEBP", 13, 8, 35, 15);

  // Título a la derecha del logo
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  const titleText = `Reporte de ${title}`;
  const splitTitle = doc.splitTextToSize(titleText, 140);
  doc.text(splitTitle, 53, 13);

  doc.setLineWidth(0.1);
  doc.setDrawColor(200, 200, 200);
  doc.line(13, 27, 195, 27);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`Hecho por: ${userName}`, 13, 35);
  doc.text(`Fecha: ${formattedCurrentDateDoc}`, 13, 40);
  doc.text(`Hora: ${formattedCurrentHourDoc}`, 13, 45);

  doc.line(13, 50, 195, 50);

  /* ======================================
     ✅ AGRUPAR POR GRUPO MUSCULAR
  ====================================== */
  const muscleColors: Record<string, [number, number, number]> = {
    "Pecho": [40, 167, 69],
    "Pierna": [0, 123, 255],
    "Espalda": [255, 159, 64],
    "Bíceps": [111, 66, 193],
    "Tríceps": [220, 53, 69],
    "Hombro": [23, 162, 184],
    "Abdomen": [255, 193, 7],
    "Otros": [108, 117, 125],
  };

  const grouped: Record<string, any[][]> = {};

  tableRows.forEach(row => {
    const grupo = row[2] || "Otros"; // Grupo Muscular
    if (!grouped[grupo]) grouped[grupo] = [];
    grouped[grupo].push(row);
  });

  /* ======================================
     ✅ TABLAS POR GRUPO (MISMA HOJA)
  ====================================== */
  let currentY = 60;

  Object.entries(grouped).forEach(([grupo, rows]) => {
    const color = muscleColors[grupo] || muscleColors["Otros"];

    // ✅ Si no cabe, nueva hoja
    if (currentY > 240) {
      doc.addPage();
      currentY = 30;
    }

    // ✅ Título del grupo
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(...color);
    doc.text(`Grupo Muscular: ${grupo}`, 13, currentY);

    doc.setTextColor(0, 0, 0);
    currentY += 5;

    // ✅ Tabla del grupo
    autoTable(doc, {
      startY: currentY,
      head: [tableColumn],
      body: rows,
      theme: "striped",
      styles: {
        fontSize: 9,
        halign: "center",
        cellPadding: 2,
      },
      headStyles: {
        fillColor: color,
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
      margin: { left: 10, right: 10 },
    });

    currentY = (doc as any).lastAutoTable.finalY + 12;
  });

  /* ======================================
     ✅ INSTRUCCIONES FINALES
  ====================================== */
  if (currentY > 200) {
    doc.addPage();
    currentY = 30;
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("INSTRUCCIONES DE ENTRENAMIENTO", 105, currentY, { align: "center" });

  currentY += 10;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text(
    "• Siga los ejercicios en el orden indicado.\n" +
    "• Mantenga los movimientos controlados.\n" +
    "• Respire correctamente durante todo el ejercicio.\n" +
    "• Manténgase hidratado durante el entrenamiento.\n" +
    "• Si presenta mareos o dolor, detenga el ejercicio.",
    30,
    currentY,
    { maxWidth: 150 }
  );

  doc.save(`Reporte de ${title} - ${formattedCurrentDate}.pdf`);
};