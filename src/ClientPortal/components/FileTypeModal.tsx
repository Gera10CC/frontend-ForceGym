import { memo } from 'react';
import { FaFilePdf, FaFileExcel } from 'react-icons/fa';

interface FileTypeModalProps {
    onClose: () => void;
    onDownloadPdf: () => void;
    onDownloadExcel: () => void;
}

const FileTypeModal = memo(({ onClose, onDownloadPdf, onDownloadExcel }: FileTypeModalProps) => {
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
                        className="w-full flex items-center justify-center gap-3 bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-lg transition-colors"
                    >
                        <FaFilePdf className="text-xl" />
                        <span className="font-semibold">Descargar PDF</span>
                    </button>
                    
                    <button
                        onClick={onDownloadExcel}
                        className="w-full flex items-center justify-center gap-3 bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg transition-colors"
                    >
                        <FaFileExcel className="text-xl" />
                        <span className="font-semibold">Descargar Excel</span>
                    </button>
                    
                    <button
                        onClick={onClose}
                        className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 px-4 rounded-lg transition-colors font-semibold"
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
