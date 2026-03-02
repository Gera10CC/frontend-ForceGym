/**
 * Lazy loading para funciones de exportación pesadas (PDF y Excel)
 * Esto reduce el bundle inicial cargando estas librerías solo cuando se necesitan
 */

// Lazy loaders para PDFs
export const exportToPDFGeneralLazy = async (...args: Parameters<typeof import('./pdfGeneral').exportToPDFGeneral>) => {
  const { exportToPDFGeneral } = await import('./pdfGeneral');
  return exportToPDFGeneral(...args);
};

export const exportToPDFMedidasLazy = async (...args: Parameters<typeof import('./pdfMedidas').exportToPDFMedidas>) => {
  const { exportToPDFMedidas } = await import('./pdfMedidas');
  return exportToPDFMedidas(...args);
};

export const exportToPDFRutinasLazy = async (...args: Parameters<typeof import('./pdfRutinas').exportToPDFRutinas>) => {
  const { exportToPDFRutinas } = await import('./pdfRutinas');
  return exportToPDFRutinas(...args);
};

// Lazy loaders para Excel
export const exportToExcelLazy = async (...args: Parameters<typeof import('./excelGeneral').exportToExcel>) => {
  const { exportToExcel } = await import('./excelGeneral');
  return exportToExcel(...args);
};

export const exportToExcelMedidasLazy = async (...args: Parameters<typeof import('./excelMedidas').exportToExcelMedidas>) => {
  const { exportToExcelMedidas } = await import('./excelMedidas');
  return exportToExcelMedidas(...args);
};

export const exportToExcelRutinasLazy = async (...args: Parameters<typeof import('./excelRutina').exportToExcelRutinas>) => {
  const { exportToExcelRutinas } = await import('./excelRutina');
  return exportToExcelRutinas(...args);
};
