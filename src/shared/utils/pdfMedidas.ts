import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  formatCurrentDateForDocument,
  formatCurrentDateWithHourForTitle,
  formatCurrentHourForDocument,
} from "./format";
import { getAuthUser } from "./authentication";

export const exportToPDFMedidas = (
  title: string,
  tableColumn: string[],
  tableRows: any[][],
  clientData?: {
    name: string;
    age: number;
    height: number;
  }
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

  if (clientData) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("DATOS DEL CLIENTE", 13, nextStartY);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Nombre: ${clientData.name}`, 13, nextStartY + 6);
    doc.text(`Edad: ${clientData.age} años`, 13, nextStartY + 11);
    doc.text(`Estatura: ${clientData.height} cm`, 13, nextStartY + 16);

    doc.line(13, nextStartY + 20, 195, nextStartY + 20);
    nextStartY += 26;
  }


  if (tableRows.length > 1) {
    const first = tableRows[tableRows.length - 1];
    const last = tableRows[0];

    const calcIndicator = (start: any, end: any) => {
      const s = parseFloat(start);
      const e = parseFloat(end);
      if (isNaN(s) || isNaN(e)) return "—";
      const diff = (e - s).toFixed(1);
      return diff > "0" ? `▲ +${diff}` : diff < "0" ? `▼ ${diff}` : "—";
    };

    autoTable(doc, {
      startY: nextStartY,
      head: [["RESUMEN", "INICIO", "ACTUAL", "CAMBIO"]],
      body: [
        ["Peso (kg)", first[1], last[1], calcIndicator(first[1], last[1])],
        ["Grasa Corporal", first[2], last[2], calcIndicator(first[2], last[2])],
        ["Masa Muscular", first[3], last[3], calcIndicator(first[3], last[3])],
      ],
      theme: "grid",
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
    });

    nextStartY = (doc as any).lastAutoTable.finalY + 10;
  }


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
  });

  nextStartY = (doc as any).lastAutoTable.finalY + 15;


  const motivationalMessages = [
    "¡Sigue así! La constancia es la clave del éxito.",
    "Cada pequeño esfuerzo te acerca más a tu mejor versión.",
    "Tu disciplina está dando resultados. No te detengas.",
    "El progreso es lento, pero seguro. ¡Excelente trabajo!",
  ];

  const message =
    motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];

  doc.setFont("helvetica", "italic");
  doc.setFontSize(11);
  doc.text(message, 105, nextStartY, {
    align: "center",
    maxWidth: 160,
  });

  doc.addPage();

  doc.setFont("helvetica", "bold");
  doc.text("TABLA DE REFERENCIAS", 105, 20, { align: "center" });

  const referenceHeaders = ["", "BAJO", "NORMAL", "ELEVADO", "MUY ELEVADO"];
  const referenceData = [
    ["IMC", "<18.5", "18.5 a 25", "25 a 30", "30 o +"],
    ["VISCERAL", "", "<9", "10 a 14", "15 o +"],
    ["GRASA C", "FEM / MAS", "FEM / MAS", "FEM / MAS", "FEM / MAS"],
    ["20-39", "<21 / <8", "21-22.9 / 8-19.9", "33-38.9 / 20-24.9", ">39 / >25"],
    ["40-59", "<23 / <11", "23-33.9 / 11-21.9", "34-39.9 / 22-24.9", ">40 / >28"],
    ["60-79", "<24 / <13", "24-35.9 / 13-24.9", "36-41.9 / 25-29.9", ">42 / >30"],
    ["M.M", "FEM / MAS", "FEM / MAS", "FEM / MAS", "FEM / MAS"],
    ["18-39", "<24.3 / <33.3", "24.3-30.3 / 33.3-39.3", "30.4-35.3 / 39.4-44", ">35.4 / >44.1"],
    ["40-59", "<24.1 / <33.1", "24.1-30.1 / 33.1-39.1", "30.2-35.1 / 39.2-43.8", ">35.2 / >43.9"],
    ["60-80", "<23.9 / <32.9", "23.9-29.9 / 32.9-38.9", "30-34.9 / 39-43.6", ">35 / >43.7"],
  ];

  autoTable(doc, {
    startY: 30,
    head: [referenceHeaders],
    body: referenceData,
    theme: "grid",
    styles: {
      fontSize: 7,
      cellPadding: 1,
      halign: "center",
      valign: "middle",
    },
    headStyles: {
      fillColor: [230, 230, 230],
      textColor: [0, 0, 0],
      fontStyle: "bold",
    },
    columnStyles: {
      0: { fillColor: [242, 242, 242], fontStyle: "bold" },
    },
  });

  doc.save(`Reporte de ${title} - ${formattedCurrentDate}.pdf`);
};