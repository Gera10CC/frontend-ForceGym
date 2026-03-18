import { useState } from "react";
import { MdClose, MdUpload } from "react-icons/md";
import Swal from "sweetalert2";
import useMeasurementStore from "./Store";

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  idClient: number;
}

function ImportModal({ isOpen, onClose, idClient }: ImportModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { fetchMeasurements } = useMeasurementStore();

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Validar que sea un archivo Excel
      const validExtensions = ['.xlsx', '.xls'];
      const fileExtension = selectedFile.name.substring(selectedFile.name.lastIndexOf('.')).toLowerCase();
      
      if (!validExtensions.includes(fileExtension)) {
        Swal.fire({
          icon: "error",
          title: "Archivo inválido",
          text: "Por favor selecciona un archivo Excel (.xlsx o .xls)",
          confirmButtonColor: "#CFAD04",
        });
        return;
      }
      
      setFile(selectedFile);
    }
  };

  const handleImport = async () => {
    if (!file) {
      Swal.fire({
        icon: "warning",
        title: "Sin archivo",
        text: "Por favor selecciona un archivo Excel",
        confirmButtonColor: "#CFAD04",
      });
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("idClient", idClient.toString());

      // Obtener el token de autenticación
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${import.meta.env.VITE_URL_API}measurement/import`,
        {
          method: "POST",
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
          body: formData,
        }
      );

      // Verificar si la respuesta es JSON válida
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const textResponse = await response.text();
        throw new Error(`Error del servidor: ${textResponse || 'Respuesta no válida'}`);
      }

      const result = await response.json();

      if (response.ok) {
        await Swal.fire({
          icon: "success",
          title: "Importación exitosa",
          text: `Se importaron ${result.data?.imported || 0} medidas correctamente`,
          confirmButtonColor: "#CFAD04",
          timer: 3000,
          timerProgressBar: true,
        });
        
        await fetchMeasurements();
        onClose();
        setFile(null);
      } else {
        throw new Error(result.message || "Error al importar el archivo");
      }
    } catch (error: any) {
      console.error("Error en importación:", error);
      Swal.fire({
        icon: "error",
        title: "Error en la importación",
        text: error.message || "Ocurrió un error al procesar el archivo Excel",
        confirmButtonColor: "#CFAD04",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            Importar Medidas desde Excel
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
            disabled={isUploading}
          >
            <MdClose size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="text-sm text-gray-600 space-y-2">
            <p>📋 <strong>Instrucciones:</strong></p>
            <ul className="list-disc list-inside ml-2 space-y-1">
              <li>El archivo debe ser formato Excel (.xlsx o .xls)</li>
              <li>Debe contener las columnas de medidas del cliente</li>
              <li>Se crearán registros por cada fila de medida</li>
            </ul>
          </div>

          {/* File Input */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <input
              type="file"
              id="excel-upload"
              accept=".xlsx,.xls"
              onChange={handleFileChange}
              className="hidden"
              disabled={isUploading}
            />
            <label
              htmlFor="excel-upload"
              className="cursor-pointer flex flex-col items-center gap-2"
            >
              <MdUpload size={48} className="text-gray-400" />
              <span className="text-sm text-gray-600">
                {file ? file.name : "Haz clic para seleccionar el archivo Excel"}
              </span>
            </label>
          </div>

          {file && (
            <div className="bg-green-50 border border-green-200 rounded-md p-3">
              <p className="text-sm text-green-700">
                ✓ Archivo seleccionado: <strong>{file.name}</strong>
              </p>
              <p className="text-xs text-green-600 mt-1">
                Tamaño: {(file.size / 1024).toFixed(2)} KB
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition"
            disabled={isUploading}
          >
            Cancelar
          </button>
          <button
            onClick={handleImport}
            disabled={!file || isUploading}
            className="px-4 py-2 bg-yellow text-black rounded-md hover:bg-yellow-600 transition disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isUploading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-black border-t-transparent"></div>
                Importando...
              </>
            ) : (
              <>
                <MdUpload size={20} />
                Importar
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ImportModal;
