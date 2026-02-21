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

    worksheet.mergeCells("A1:H1");
    worksheet.getCell("A1").value = `Reporte de Rutina - ${title}`;
    worksheet.getCell("A1").font = { size: 16, bold: true, name: "Arial" };
    worksheet.getCell("A1").alignment = {
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

    // ✅ Colores por día (igual que en PDF)
    const dayColors: string[] = [
        "FFCFAD04",   // Día 1 - Amarillo (yellow del sistema)
        "FF007BFF",   // Día 2 - Azul
        "FF28A745",   // Día 3 - Verde
        "FFFF9F40",   // Día 4 - Naranja
        "FF6F42C1",   // Día 5 - Púrpura
        "FFDC3545",   // Día 6 - Rojo
        "FF17A2B8",   // Día 7 - Cian
    ];

    // ✅ Agrupar por DÍA y luego por CATEGORÍA (igual que PDF)
    const groupedByDay: Record<string, Record<string, any[][]>> = {};

    tableRows.forEach((row) => {
        const dia = row[0] || "Día 1";        // Columna: Día
        const categoria = row[1] || "Otros";  // Columna: Categoría

        if (!groupedByDay[dia]) groupedByDay[dia] = {};
        if (!groupedByDay[dia][categoria]) groupedByDay[dia][categoria] = [];

        groupedByDay[dia][categoria].push(row);
    });

    let currentRow = 8;

    // ✅ Headers para las tablas (sin "Día" y "Categoría")
    const filteredHeaders = tableHeaders.slice(2);

    Object.entries(groupedByDay).forEach(([dia, categorias]) => {
        // ✅ Título del día (grande y destacado)
        const dayNumber = parseInt(dia.replace(/\D/g, '')) || 1;
        const dayColor = dayColors[(dayNumber - 1) % dayColors.length];

        worksheet.mergeCells(`A${currentRow}:${String.fromCharCode(64 + filteredHeaders.length)}${currentRow}`);
        const dayCell = worksheet.getCell(`A${currentRow}`);
        dayCell.value = dia.toUpperCase();
        dayCell.font = { bold: true, size: 16, name: "Arial", color: { argb: "FFFFFFFF" } };
        dayCell.alignment = { horizontal: "center", vertical: "middle" };
        dayCell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: dayColor },
        };
        dayCell.border = {
            top: { style: "medium" },
            left: { style: "medium" },
            bottom: { style: "medium" },
            right: { style: "medium" },
        };

        currentRow += 2;

        // ✅ Iterar por categorías dentro del día
        Object.entries(categorias).forEach(([categoria, rows]) => {
            // ✅ Título de la categoría (subcategoría con color del día)
            worksheet.mergeCells(`A${currentRow}:${String.fromCharCode(64 + filteredHeaders.length)}${currentRow}`);
            const categoryCell = worksheet.getCell(`A${currentRow}`);
            categoryCell.value = `Categoría: ${categoria}`;
            categoryCell.font = { bold: true, size: 13, name: "Arial", color: { argb: "FFFFFFFF" } };
            categoryCell.alignment = { horizontal: "left", vertical: "middle" };
            categoryCell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: dayColor },
            };
            categoryCell.border = {
                top: { style: "thin" },
                left: { style: "thin" },
                bottom: { style: "thin" },
                right: { style: "thin" },
            };

            currentRow++;

            // ✅ Headers de la tabla
            const headerRow = worksheet.getRow(currentRow);
            filteredHeaders.forEach((header, index) => {
                const cell = headerRow.getCell(index + 1);
                cell.value = header;
                cell.font = { bold: true, size: 12, name: "Arial", color: { argb: "FFFFFFFF" } };
                cell.alignment = { horizontal: "center", vertical: "middle" };
                cell.fill = {
                    type: "pattern",
                    pattern: "solid",
                    fgColor: { argb: dayColor },
                };
                cell.border = {
                    top: { style: "thin" },
                    left: { style: "thin" },
                    bottom: { style: "thin" },
                    right: { style: "thin" },
                };
            });

            currentRow++;

            // ✅ Filas de ejercicios (sin columnas Día y Categoría)
            rows.forEach((rowData) => {
                const row = worksheet.getRow(currentRow);
                const filteredRowData = rowData.slice(2); // Omitir primeras 2 columnas

                filteredRowData.forEach((value, colIndex) => {
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
                    
                    // ✅ Filas alternadas con color suave
                    if ((currentRow - currentRow % 2) % 4 === 0) {
                        cell.fill = {
                            type: "pattern",
                            pattern: "solid",
                            fgColor: { argb: "FFF5F5F5" },
                        };
                    }
                });

                currentRow++;
            });

            currentRow += 2; // Espacio entre categorías
        });

        currentRow += 1; // Espacio entre días
    });

    // ✅ Instrucciones al final
    const numCols = filteredHeaders.length;
    worksheet.mergeCells(`A${currentRow}:${String.fromCharCode(64 + numCols)}${currentRow}`);
    const instructionsTitle = worksheet.getCell(`A${currentRow}`);
    instructionsTitle.value = "INSTRUCCIONES DE ENTRENAMIENTO";
    instructionsTitle.font = { bold: true, size: 14, name: "Arial" };
    instructionsTitle.alignment = { horizontal: "center" };

    currentRow += 2;

    worksheet.mergeCells(`A${currentRow}:${String.fromCharCode(64 + numCols)}${currentRow + 4}`);
    const instructions = worksheet.getCell(`A${currentRow}`);
    instructions.value =
        "• Siga los ejercicios en el orden indicado.\n" +
        "• Mantenga los movimientos controlados.\n" +
        "• Respire correctamente durante todo el ejercicio.\n" +
        "• Manténgase hidratado durante el entrenamiento.\n" +
        "• Si presenta mareos o dolor, detenga el ejercicio.";
    instructions.font = { size: 12, name: "Arial" };
    instructions.alignment = { horizontal: "left", vertical: "top", wrapText: true };

    // ✅ Ajustar ancho de columnas
    worksheet.columns.forEach((column) => {
        column.width = 22;
    });

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(
        new Blob([buffer]),
        `Rutina - ${title} - ${formattedCurrentDate}.xlsx`
    );
};