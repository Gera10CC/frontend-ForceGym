import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import {
  formatCurrentDateWithHourForTitle,
  formatCurrentDateForDocument,
  formatCurrentHourForDocument,
} from "./format";
import { getAuthUser } from "./authentication";

export const exportToExcel = async (
  title: string,
  tableHeaders: string[],
  tableRows: any[][],
  clientData?: { name: string; age: number; height: number },
  amountColumnIndex?: number
) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(`Reporte de ${title}`);

  const formattedCurrentDate = formatCurrentDateWithHourForTitle();
  const formattedCurrentDateDoc = formatCurrentDateForDocument();
  const formattedCurrentHourDoc = formatCurrentHourForDocument();

  const user = getAuthUser();
  const userName = `${user?.person.name} ${user?.person.firstLastName} ${user?.person.secondLastName}`;


  const logoPath = "/Logo.png";
  const logoBuffer = await fetch(logoPath).then((res) => res.arrayBuffer());
  const logoImage = workbook.addImage({
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
  titleCell.value = `Reporte de ${title}`;
  titleCell.font = { size: 16, bold: true, name: "Arial" };
  titleCell.alignment = { horizontal: "center", vertical: "middle" };


  worksheet.getCell("A3").value = `Hecho por: ${userName}`;
  worksheet.getCell("A4").value = `Fecha: ${formattedCurrentDateDoc}`;
  worksheet.getCell("A5").value = `Hora: ${formattedCurrentHourDoc}`;

  ["A3", "A4", "A5"].forEach((ref) => {
    const cell = worksheet.getCell(ref);
    cell.font = { size: 11, italic: true, name: "Arial" };
  });

  let tableStartRow = 8;

  if (clientData) {
    worksheet.getRow(6).getCell(1).value = `Cliente: ${clientData.name}`;
    worksheet.getRow(6).getCell(1).font = { size: 11, bold: true, name: "Arial" };

    worksheet.getRow(7).getCell(1).value = `Edad: ${clientData.age} años`;
    worksheet.getRow(8).getCell(1).value = `Estatura: ${clientData.height} cm`;

    worksheet.mergeCells("A10:H10");
    worksheet.getCell("A10").border = {
      bottom: { style: "thin", color: { argb: "FFC8C8C8" } },
    };

    tableStartRow = 12;
  }


  const headerRow = worksheet.getRow(tableStartRow);
  tableHeaders.forEach((header, index) => {
    const cell = headerRow.getCell(index + 1);
    cell.value = header;
    cell.font = { bold: true, size: 12, name: "Arial" };
    cell.alignment = { horizontal: "center", vertical: "middle" };
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
  });

  let currentRow = tableStartRow + 1;

  tableRows.forEach((rowData) => {
    const row = worksheet.getRow(currentRow);

    rowData.forEach((value, colIndex) => {
      const cell = row.getCell(colIndex + 1);
      cell.value = value;
      cell.font = { size: 11, name: "Arial" };
      cell.alignment = {
        vertical: "middle",
        horizontal: "center",
        wrapText: true,
      };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };

      // Format numbers: amount column gets currency format, others get integer format
      if (typeof cell.value === "number") {
        if (amountColumnIndex !== undefined && colIndex === amountColumnIndex) {
          // Currency format for Costa Rica: ₡14.500,00
          cell.value = value;
          cell.numFmt = '"₡"#,##0.00';
        } else {
          // Integer format for index and other numbers
          cell.numFmt = "0";
        }
      }
    });

    currentRow++;
  });

  // Add total row if amountColumnIndex is provided
  if (amountColumnIndex !== undefined && tableRows.length > 0) {
    const totalRow = worksheet.getRow(currentRow);
    
    // Calculate total from numeric values
    const total = tableRows.reduce((sum, row) => {
      const amountValue = row[amountColumnIndex];
      const numericValue = typeof amountValue === 'number' ? amountValue : parseFloat(String(amountValue));
      return sum + (isNaN(numericValue) ? 0 : numericValue);
    }, 0);

    // Set cells for total row
    tableHeaders.forEach((_, colIndex) => {
      const cell = totalRow.getCell(colIndex + 1);
      
      if (colIndex === amountColumnIndex - 1) {
        // Cell before amount column shows "TOTAL"
        cell.value = "TOTAL";
        cell.font = { size: 12, bold: true, name: "Arial" };
        cell.alignment = { horizontal: "right", vertical: "middle" };
      } else if (colIndex === amountColumnIndex) {
        // Amount column shows the total as a number with currency format
        cell.value = total;
        cell.numFmt = '"₡"#,##0.00';
        cell.font = { size: 12, bold: true, name: "Arial" };
        cell.alignment = { horizontal: "center", vertical: "middle" };
      } else {
        // Other cells are empty
        cell.value = "";
      }
      
      // Style for total row
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFE8E8E8" },
      };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });
  }

  worksheet.columns.forEach((column) => {
    column.width = 20;
  });


  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(
    new Blob([buffer]),
    `Reporte de ${title} - ${formattedCurrentDate}.xlsx`
  );
};