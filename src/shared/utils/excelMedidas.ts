import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import {
  formatCurrentDateWithHourForTitle,
  formatCurrentDateForDocument,
  formatCurrentHourForDocument,
} from "./format";
import { getAuthUser } from "./authentication";

export const exportToExcelMedidas = async (
  title: string,
  tableHeaders: string[],
  tableRows: any[][],
  clientData?: { name: string; age: number; height: number }
) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(
    clientData ? `Reporte ${title} - ${clientData.name}` : `Reporte ${title}`
  );

  const formattedCurrentDate = formatCurrentDateWithHourForTitle();
  const formattedCurrentDateDoc = formatCurrentDateForDocument();
  const formattedCurrentHourDoc = formatCurrentHourForDocument();

  const user = getAuthUser();
  const userName = `${user?.person.name} ${user?.person.firstLastName} ${user?.person.secondLastName}`;


  const logoPath = "/Logo.png";
  const logoBuffer = await fetch(logoPath).then((res) => res.arrayBuffer());
  const logoImage = await workbook.addImage({
    buffer: logoBuffer,
    extension: "png",
  });

  worksheet.addImage(logoImage, {
    tl: { col: 0, row: 0 },
    ext: { width: 160, height: 63 },
  });

  worksheet.getRow(1).height = 50;

  worksheet.mergeCells("D1:H1");
  const titleCell = worksheet.getCell("D1");
  titleCell.value = clientData
    ? `Reporte de ${title} - ${clientData.name}`
    : `Reporte de ${title}`;
  titleCell.font = { size: 16, bold: true, name: "Arial" };
  titleCell.alignment = { horizontal: "center", vertical: "middle" };


  worksheet.getCell("A3").value = `Hecho por: ${userName}`;
  worksheet.getCell("A4").value = `Fecha: ${formattedCurrentDateDoc}`;
  worksheet.getCell("A5").value = `Hora: ${formattedCurrentHourDoc}`;

  ["A3", "A4", "A5"].forEach((ref) => {
    const cell = worksheet.getCell(ref);
    cell.font = { size: 11, italic: true, name: "Arial" };
    cell.alignment = { vertical: "middle" };
  });


  let currentRow = 7;

  if (clientData) {
    const clientRow = worksheet.getRow(currentRow);
    clientRow.getCell(1).value = `Cliente: ${clientData.name}`;
    clientRow.getCell(1).font = {
      size: 11,
      bold: true,
      name: "Arial",
    };
    currentRow++;

    const ageRow = worksheet.getRow(currentRow);
    ageRow.getCell(1).value = `Edad: ${clientData.age} años`;
    ageRow.getCell(1).font = {
      size: 11,
      name: "Arial",
    };
    currentRow++;

    const heightRow = worksheet.getRow(currentRow);
    heightRow.getCell(1).value = `Estatura: ${clientData.height} cm`;
    heightRow.getCell(1).font = {
      size: 11,
      name: "Arial",
    };
    currentRow++;

    currentRow += 1; 
    worksheet.mergeCells(`A${currentRow}:H${currentRow}`);
    worksheet.getCell(`A${currentRow}`).border = {
      bottom: { style: "thin", color: { argb: "FFC8C8C8" } },
    };
    currentRow += 2; 
  } else {
    currentRow = 10;
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

    const resumenHeaderRow = worksheet.getRow(currentRow);
    resumenHeaderRow.values = ["RESUMEN", "INICIO", "ACTUAL", "CAMBIO"];
    resumenHeaderRow.font = { bold: true, name: "Arial" };
    resumenHeaderRow.alignment = { horizontal: "center" };
    currentRow++;

    const resumenData = [
      ["Peso (kg)", first[1], last[1], calcIndicator(first[1], last[1])],
      ["Grasa Corporal", first[2], last[2], calcIndicator(first[2], last[2])],
      ["Masa Muscular", first[3], last[3], calcIndicator(first[3], last[3])],
    ];

    resumenData.forEach((row) => {
      const excelRow = worksheet.getRow(currentRow);
      excelRow.values = row;
      excelRow.font = { size: 11, name: "Arial" };
      excelRow.alignment = { horizontal: "center" };
      currentRow++;
    });

    currentRow += 2;
  }

  const headerRow = worksheet.getRow(currentRow);
  headerRow.height = 25;

  tableHeaders.forEach((header, index) => {
    const cell = headerRow.getCell(index + 1);
    cell.value = header;
    cell.font = {
      bold: true,
      size: 12,
      name: "Arial",
      color: { argb: "FF000000" },
    };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFCFAD04" },
    };
    cell.border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
    cell.alignment = {
      horizontal: "center",
      vertical: "middle",
      wrapText: true,
    };
  });

  currentRow++;

  tableRows.forEach((rowData) => {
    const row = worksheet.getRow(currentRow);
    rowData.forEach((value, colIndex) => {
      const cell = row.getCell(colIndex + 1);
      cell.value = value;
      cell.font = { size: 11, name: "Arial" };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
      cell.alignment = {
        vertical: "middle",
        horizontal: "center",
        wrapText: true,
      };
    });
    currentRow++;
  });


  const motivationalMessages = [
    "¡Sigue así! La constancia es la clave del éxito.",
    "Cada pequeño esfuerzo te acerca más a tu mejor versión.",
    "Tu disciplina está dando resultados. No te detengas.",
    "El progreso es lento, pero seguro. ¡Excelente trabajo!",
  ];

  const message =
    motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];

  currentRow += 2;
  worksheet.mergeCells(`A${currentRow}:H${currentRow}`);
  const msgCell = worksheet.getRow(currentRow).getCell(1);
  msgCell.value = message;
  msgCell.font = { italic: true, bold: true, size: 12, name: "Arial" };
  msgCell.alignment = {
    horizontal: "center",
    vertical: "middle",
    wrapText: true,
  };
  worksheet.getRow(currentRow).height = 30;


  currentRow += 3;

  const referenceHeaders = ["", "BAJO", "NORMAL", "ELEVADO", "MUY ELEVADO"];
  const refHeaderRow = worksheet.getRow(currentRow);
  refHeaderRow.values = referenceHeaders;
  refHeaderRow.font = { bold: true, size: 10, name: "Arial" };
  refHeaderRow.alignment = { horizontal: "center", vertical: "middle" };
  currentRow++;

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

  referenceData.forEach((rowData) => {
    const row = worksheet.getRow(currentRow);
    row.values = rowData;
    row.font = { size: 9, name: "Arial" };
    row.alignment = {
      vertical: "middle",
      horizontal: "center",
      wrapText: true,
    };
    currentRow++;
  });

  worksheet.columns.forEach((col) => {
    col.width = 18;
  });

  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(
    new Blob([buffer]),
    clientData
      ? `Reporte de ${title} - ${clientData.name} - ${formattedCurrentDate}.xlsx`
      : `Reporte de ${title} - ${formattedCurrentDate}.xlsx`
  );
};