import { memo } from 'react';
import { FaFilePdf, FaFileExcel, FaSpinner } from 'react-icons/fa';

interface FileTypeModalProps {
    onClose: () => void;
    onDownloadPdf: () => void;
    onDownloadExcel: () => void;
    isDownloadingPdf?: boolean;
    isDownloadingExcel?: boolean;
}

const FileTypeModal = memo(({ onClose, onDownloadPdf, onDownloadExcel, isDownloadingPdf = false, isDownloadingExcel = false }: FileTypeModalProps) => {
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                <h3 className="text-xl font-bold mb-4 text-center">Seleccionar formato de descarga</h3>
                <p className="text-gray-600 text-sm mb-6 text-center">
                    Elige el formato en el que deseas descargar tu historial de medidas
                </p>
                
                <div className="space-y-3">
                    <button
                        onClick={onDownloadPdf}
                        disabled={isDownloadingPdf || isDownloadingExcel}
                        className={`w-full flex items-center justify-center gap-3 py-3 px-4 rounded-lg transition-colors ${
                            isDownloadingPdf || isDownloadingExcel
                                ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                                : 'bg-red-500 hover:bg-red-600 text-white'
                        }`}
                    >
                        {isDownloadingPdf ? (
                            <>
                                <FaSpinner className="text-xl animate-spin" />
                                <span className="font-semibold">Descargando PDF...</span>
                            </>
                        ) : (
                            <>
                                <FaFilePdf className="text-xl" />
                                <span className="font-semibold">Descargar PDF</span>
                            </>
                        )}
                    </button>
                    
                    <button
                        onClick={onDownloadExcel}
                        disabled={isDownloadingPdf || isDownloadingExcel}
                        className={`w-full flex items-center justify-center gap-3 py-3 px-4 rounded-lg transition-colors ${
                            isDownloadingPdf || isDownloadingExcel
                                ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                                : 'bg-green-600 hover:bg-green-700 text-white'
                        }`}
                    >
                        {isDownloadingExcel ? (
                            <>
                                <FaSpinner className="text-xl animate-spin" />
                                <span className="font-semibold">Descargando Excel...</span>
                            </>
                        ) : (
                            <>
                                <FaFileExcel className="text-xl" />
                                <span className="font-semibold">Descargar Excel</span>
                            </>
                        )}
                    </button>
                    
                    <button
                        onClick={onClose}
                        disabled={isDownloadingPdf || isDownloadingExcel}
                        className={`w-full py-3 px-4 rounded-lg transition-colors font-semibold ${
                            isDownloadingPdf || isDownloadingExcel
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                        }`}
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
});

FileTypeModal.displayName = 'FileTypeModal';

export default FileTypeModal;
