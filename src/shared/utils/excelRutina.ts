import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import {
    formatCurrentDateWithHourForTitle,
    formatCurrentDateForDocument,
    formatCurrentHourForDocument,
} from "./format";
import { getAuthUser } from "./authentication";

export const exportToExcelRutinas = async (
    title: string,
    tableHeaders: string[],
    tableRows: any[][]
) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(`Rutina - ${title}`);

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

    worksheet.mergeCells("D1:H1");
    worksheet.getCell("D1").value = `Reporte de Rutina - ${title}`;
    worksheet.getCell("D1").font = { size: 16, bold: true, name: "Arial" };
    worksheet.getCell("D1").alignment = {
        horizontal: "center",
        vertical: "middle",
    };

    worksheet.getCell("A3").value = `Hecho por: ${userName}`;
    worksheet.getCell("A4").value = `Fecha: ${formattedCurrentDateDoc}`;
    worksheet.getCell("A5").value = `Hora: ${formattedCurrentHourDoc}`;

    ["A3", "A4", "A5"].forEach((ref) => {
        const cell = worksheet.getCell(ref);
        cell.font = { size: 11, italic: true, name: "Arial" };
    });

    const muscleColors: Record<string, string> = {
        "Pecho": "FF28A745",
        "Pierna": "FF007BFF",
        "Espalda": "FFFF9F40",
        "Bíceps": "FF6F42C1",
        "Tríceps": "FFDC3545",
        "Hombro": "FF17A2B8",
        "Abdomen": "FFFFC107",
        "Otros": "FF6C757D",
    };

    const grouped: Record<string, any[][]> = {};
    tableRows.forEach((row) => {
        const grupo = row[2] || "Otros";
        if (!grouped[grupo]) grouped[grupo] = [];
        grouped[grupo].push(row);
    });

    let currentRow = 8;

    Object.entries(grouped).forEach(([grupo, rows]) => {
        const color = muscleColors[grupo] || muscleColors["Otros"];

        worksheet.getCell(`A${currentRow}`).value = `GRUPO MUSCULAR: ${grupo.toUpperCase()}`;
        worksheet.getCell(`A${currentRow}`).font = { bold: true, size: 13, name: "Arial" };
        worksheet.getCell(`A${currentRow}`).alignment = { horizontal: "left" };
        worksheet.getCell(`A${currentRow}`).fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: color },
        };
        worksheet.getCell(`A${currentRow}`).border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
        };

        currentRow++;

        const headerRow = worksheet.getRow(currentRow);
        tableHeaders.forEach((header, index) => {
            const cell = headerRow.getCell(index + 1);
            cell.value = header;
            cell.font = { bold: true, size: 12, name: "Arial", color: { argb: "FFFFFFFF" } };
            cell.alignment = { horizontal: "center", vertical: "middle" };
            cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: color },
            };
            cell.border = {
                top: { style: "thin" },
                left: { style: "thin" },
                bottom: { style: "thin" },
                right: { style: "thin" },
            };
        });

        currentRow++;
        rows.forEach((rowData) => {
            const row = worksheet.getRow(currentRow);

            rowData.forEach((value, colIndex) => {
                const cell = row.getCell(colIndex + 1);
                cell.value = value;
                cell.font = { size: 11, name: "Arial" };
                cell.alignment = {
                    horizontal: "center",
                    vertical: "middle",
                    wrapText: true,
                };
                cell.border = {
                    top: { style: "thin" },
                    left: { style: "thin" },
                    bottom: { style: "thin" },
                    right: { style: "thin" },
                };
            });

            currentRow++;
        });

        currentRow += 2; 
    });

    worksheet.mergeCells(`A${currentRow}:H${currentRow}`);
    const instructionsTitle = worksheet.getCell(`A${currentRow}`);
    instructionsTitle.value = "INSTRUCCIONES DE ENTRENAMIENTO";
    instructionsTitle.font = { bold: true, size: 14, name: "Arial" };
    instructionsTitle.alignment = { horizontal: "center" };

    currentRow += 2;

    worksheet.mergeCells(`A${currentRow}:H${currentRow + 4}`);
    const instructions = worksheet.getCell(`A${currentRow}`);
    instructions.value =
        "• Siga los ejercicios en el orden indicado.\n" +
        "• Mantenga los movimientos controlados.\n" +
        "• Respire correctamente durante todo el ejercicio.\n" +
        "• Manténgase hidratado durante el entrenamiento.\n" +
        "• Si presenta mareos o dolor, detenga el ejercicio.";
    instructions.font = { size: 12, name: "Arial" };
    instructions.alignment = { horizontal: "left", vertical: "top", wrapText: true };

    worksheet.columns.forEach((column) => {
        column.width = 22;
    });

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(
        new Blob([buffer]),
        `Rutina - ${title} - ${formattedCurrentDate}.xlsx`
    );
};