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
     ✅ AGRUPAR POR DÍA Y CATEGORÍA
  ====================================== */
  const dayColors: [number, number, number][] = [
    [207, 173, 4],   // Día 1 - Amarillo (yellow del sistema)
    [0, 123, 255],   // Día 2 - Azul
    [40, 167, 69],   // Día 3 - Verde
    [255, 159, 64],  // Día 4 - Naranja
    [111, 66, 193],  // Día 5 - Púrpura
    [220, 53, 69],   // Día 6 - Rojo
    [23, 162, 184],  // Día 7 - Cian
  ];

  // Estructura: { "Día 1": { "Pierna": [...], "Glúteo": [...] }, "Día 2": { ... } }
  const groupedByDay: Record<string, Record<string, any[][]>> = {};

  tableRows.forEach(row => {
    const dia = row[0] || "Día 1";        // Columna: Día
    const categoria = row[1] || "Otros";  // Columna: Categoría
    
    if (!groupedByDay[dia]) groupedByDay[dia] = {};
    if (!groupedByDay[dia][categoria]) groupedByDay[dia][categoria] = [];
    
    groupedByDay[dia][categoria].push(row);
  });

  /* ======================================
     ✅ TABLAS POR DÍA Y CATEGORÍA
  ====================================== */
  let currentY = 60;

  Object.entries(groupedByDay).forEach(([dia, categorias]) => {
    // ✅ Si no cabe, nueva hoja
    if (currentY > 230) {
      doc.addPage();
      currentY = 30;
    }

    // ✅ Título del día (más grande y destacado)
    const dayNumber = parseInt(dia.replace(/\D/g, '')) || 1;
    const dayColor = dayColors[(dayNumber - 1) % dayColors.length];
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(...dayColor);
    doc.text(dia.toUpperCase(), 13, currentY);
    
    doc.setLineWidth(0.5);
    doc.setDrawColor(...dayColor);
    doc.line(13, currentY + 2, 195, currentY + 2);
    
    doc.setTextColor(0, 0, 0);
    currentY += 10;

    // ✅ Iterar por categorías dentro del día
    Object.entries(categorias).forEach(([categoria, rows]) => {
      // ✅ Usar el color del día para todas las categorías
      const categoryColor = dayColor;

      // ✅ Si no cabe, nueva hoja
      if (currentY > 240) {
        doc.addPage();
        currentY = 30;
      }

      // ✅ Título de la categoría (subcategoría dentro del día)
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(...categoryColor);
      doc.text(`Categoría: ${categoria}`, 20, currentY);

      doc.setTextColor(0, 0, 0);
      currentY += 5;

      // ✅ Tabla de ejercicios de esta categoría (sin columnas Día y Categoría)
      const filteredColumns = tableColumn.slice(2); // Omitir "Día" y "Categoría"
      const filteredRows = rows.map(row => row.slice(2)); // Omitir primeras 2 columnas
      
      autoTable(doc, {
        startY: currentY,
        head: [filteredColumns],
        body: filteredRows,
        theme: "striped",
        styles: {
          fontSize: 9,
          halign: "center",
          cellPadding: 2,
        },
        headStyles: {
          fillColor: categoryColor,
          textColor: [255, 255, 255],
          fontStyle: "bold",
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245],
        },
        margin: { left: 15, right: 10 },
      });

      currentY = (doc as any).lastAutoTable.finalY + 8;
    });

    currentY += 5; // Espaciado extra entre días
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