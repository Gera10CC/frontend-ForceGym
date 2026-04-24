import { useEffect, useState } from "react";
import { X, UserPlus, Users, Check } from "lucide-react";
import Select from 'react-select';
import Swal from "sweetalert2";
import useRoutineStore from "./Store";
import { useCommonDataStore } from "../shared/CommonDataStore";
import { setAuthHeader, setAuthUser } from "../shared/utils/authentication";
import { useNavigate } from "react-router";

type ClientOption = {
  value: number;
  label: string;
};

export default function AssignClientsModal() {
  const navigate = useNavigate();
  const {
    modalAssignClients,
    activeAssigningId,
    closeModalAssignClients,
    assignClientsToRoutine,
    getAssignedClients,
    fetchRoutines
  } = useRoutineStore();

  const { allClients, fetchAllClients } = useCommonDataStore();

  const [selectedClients, setSelectedClients] = useState<ClientOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [routineName, setRoutineName] = useState<string>("");

  // Cargar datos cuando se abre el modal
  useEffect(() => {
    const loadData = async () => {
      if (!modalAssignClients || !activeAssigningId) return;

      setIsLoading(true);
      try {
        // SIEMPRE cargar clientes primero para asegurar que están disponibles
        await fetchAllClients();

        // Obtener la rutina actual para mostrar su nombre
        const routinesStore = useRoutineStore.getState();
        const routine = routinesStore.routines.find(r => r.idRoutine === activeAssigningId);
        if (routine) {
          setRoutineName(routine.name);
        }

        // Cargar clientes ya asignados
        const assignedClientIds = await getAssignedClients(activeAssigningId);
        
        // Obtener allClients actualizado del store después de fetchAllClients
        const currentClients = useCommonDataStore.getState().allClients;
        
        // Mapear IDs a opciones de Select con los clientes actualizados
        const assignedOptions = assignedClientIds
          .map((clientId: number) => {
            const client = currentClients.find(c => c.value === clientId);
            return client ? { value: client.value, label: client.label } : null;
          })
          .filter((option): option is ClientOption => option !== null);

        setSelectedClients(assignedOptions);
      } catch (error) {
        console.error("Error al cargar datos:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudieron cargar los datos",
          confirmButtonColor: "#CFAD04"
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [modalAssignClients, activeAssigningId, fetchAllClients, getAssignedClients]);

  const handleClose = () => {
    setSelectedClients([]);
    setRoutineName("");
    closeModalAssignClients();
  };

  const handleSave = async () => {
    if (!activeAssigningId) return;

    // Validar que se haya seleccionado al menos un cliente
    if (selectedClients.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Atención",
        text: "Debe seleccionar al menos un cliente para asignar la rutina",
        confirmButtonColor: "#CFAD04"
      });
      return;
    }

    setIsSaving(true);
    try {
      const clientIds = selectedClients.map(client => client.value);
      const result = await assignClientsToRoutine(activeAssigningId, clientIds);

      if (result?.logout) {
        setAuthHeader(null);
        setAuthUser(null);
        navigate("/login", { replace: true });
        return;
      }

      if (result?.ok) {
        await fetchRoutines();
        Swal.fire({
          icon: "success",
          title: "¡Éxito!",
          text: `Rutina asignada correctamente a ${selectedClients.length} cliente(s)`,
          timer: 3000,
          confirmButtonColor: "#CFAD04"
        });
        handleClose();
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: result?.message || "No se pudo asignar la rutina",
          confirmButtonColor: "#CFAD04"
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Ocurrió un error al asignar los clientes",
        confirmButtonColor: "#CFAD04"
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (!modalAssignClients) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-amber-50 to-yellow-50">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-amber-500 flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Asignar Clientes</h2>
              {routineName && (
                <p className="text-sm text-gray-600 mt-1">
                  Rutina: <span className="font-semibold">{routineName}</span>
                </p>
              )}
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
            disabled={isSaving}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <UserPlus className="w-4 h-4 inline mr-2" />
                Seleccionar Clientes
              </label>
              <Select
                isMulti
                value={selectedClients}
                onChange={(selected) => setSelectedClients(selected as ClientOption[])}
                options={allClients}
                placeholder="Buscar y seleccionar clientes..."
                noOptionsMessage={() => "No hay clientes disponibles"}
                className="react-select-container"
                classNamePrefix="react-select"
                styles={{
                  control: (base) => ({
                    ...base,
                    minHeight: '44px',
                    borderColor: '#e5e7eb',
                    '&:hover': {
                      borderColor: '#CFAD04'
                    }
                  }),
                  multiValue: (base) => ({
                    ...base,
                    backgroundColor: '#fef3c7',
                    borderRadius: '6px'
                  }),
                  multiValueLabel: (base) => ({
                    ...base,
                    color: '#92400e',
                    fontWeight: 500
                  }),
                  multiValueRemove: (base) => ({
                    ...base,
                    color: '#92400e',
                    ':hover': {
                      backgroundColor: '#fde68a',
                      color: '#78350f'
                    }
                  })
                }}
                isDisabled={isSaving}
              />
              
              {selectedClients.length > 0 && (
                <div className="mt-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <p className="text-sm text-amber-800 flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    <span className="font-semibold">{selectedClients.length}</span>
                    {selectedClients.length === 1 ? " cliente seleccionado" : " clientes seleccionados"}
                  </p>
                </div>
              )}

              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800">
                  <strong>Nota:</strong> Esta acción asignará la rutina a los clientes seleccionados. 
                  Los clientes que ya tenían esta rutina asignada y no estén en la selección serán desasignados.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={handleClose}
            disabled={isSaving}
            className="px-6 py-2.5 rounded-lg font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving || isLoading}
            className="px-6 py-2.5 rounded-lg font-medium text-white bg-amber-500 hover:bg-amber-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Guardando...
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                Guardar Asignación
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
