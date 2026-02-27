import { Fragment, useEffect, useState, useCallback, useMemo } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { IoIosClose } from "react-icons/io";
import useNotificationTemplateStore from "../../TemplateNotification/Store";
import { NotificationTemplate } from "../types";
import { postData } from "../services/gym";
import Swal from "sweetalert2";
import { ClientNotification } from "./NotificationsModal";
import { getAuthUser } from "../utils/authentication";

// Colores centralizados para fácil mantenimiento
const gymColors = {
  primary: "#cfad04",
  secondary: "#000000",
  accent: "#FFFFFF",
  error: "#E53E3E",
};

// Mapa de tipo de notificación a ID
const NOTIFICATION_TYPE_MAP: Record<string, number> = {
  mensualidades: 1,  // Vencimiento de membresía
  cumpleanos: 2,     // Cumpleaños
  aniversarios: 3,   // Aniversario
};

interface NotificationTemplateModalProps {
  clients: ClientNotification[];
  notificationType: string;
  onSend: (message: string, client: ClientNotification) => Promise<void>;
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationTemplateModal({
  clients,
  notificationType,
  onSend,
  isOpen,
  onClose,
}: NotificationTemplateModalProps) {
  const { notificationTemplates, fetchNotificationTemplates } =
    useNotificationTemplateStore();

  const [selectedTemplate, setSelectedTemplate] = useState<NotificationTemplate | null>(null);
  const [message, setMessage] = useState("");
  const [selectedClientId, setSelectedClientId] = useState<string>("");
  const [availableClients, setAvailableClients] = useState<ClientNotification[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // -----------------------------------------
  // FILTRAR PLANTILLAS POR TIPO DE NOTIFICACIÓN
  // -----------------------------------------
  const filteredTemplates = useMemo(() => {
    const typeId = NOTIFICATION_TYPE_MAP[notificationType];
    if (!typeId) return notificationTemplates;
    
    return notificationTemplates.filter(
      (template) => !template.isDeleted && template.notificationType.idNotificationType === typeId
    );
  }, [notificationTemplates, notificationType]);

  // -----------------------------------------
  // CARGAR CLIENTES Y TEMPLATES AL ABRIR MODAL
  // -----------------------------------------
  useEffect(() => {
    if (!isOpen) return;

    fetchNotificationTemplates();

    setAvailableClients(clients);
    setSelectedClientId(clients[0]?.idClient || "");
    setSelectedTemplate(null);
    setMessage("");
    setErrorMsg(null);

  }, [isOpen, clients]);

  // -----------------------------------------
  // MANEJO DE PLANTILLA
  // -----------------------------------------
  const handleTemplateChange = (templateId: string) => {
    const template =
      notificationTemplates.find(
        (t) => t.idNotificationTemplate === Number(templateId)
      ) || null;

    setSelectedTemplate(template);
    setMessage(template?.message || "");
    setErrorMsg(null);
  };

  // -----------------------------------------
  // ENVÍO DE NOTIFICACIÓN
  // -----------------------------------------
  const handleSend = async () => {
    setErrorMsg(null);

    const selectedClient = availableClients.find((c) => String(c.idClient) === String(selectedClientId));

    if (!selectedTemplate) return setErrorMsg("Debes seleccionar una plantilla");
    if (!message.trim()) return setErrorMsg("El mensaje no puede estar vacío");
    if (!selectedClient) return setErrorMsg("Cliente no válido");
    if (!selectedClient.phoneNumber)
      return setErrorMsg("El cliente no tiene WhatsApp registrado");

    setIsSending(true);

    try {
      await onSend(message, selectedClient);

      // Obtener usuario logueado
      const loggedUser = getAuthUser();

      // Registrar notificación en DB
      const result = await postData(
        `${import.meta.env.VITE_URL_API}notification/add`,
        {
          idClient: selectedClient.idClient,
          idNotificationType: selectedTemplate.notificationType.idNotificationType,
          paramLoggedIdUser: loggedUser?.idUser,
        }
      );

      if (!result.ok) {
        await Swal.fire({
          title: "Error",
          text: "Ocurrió un error procesando la notificación automatizada",
          icon: "error",
          confirmButtonText: "OK",
          timer: 3000,
          confirmButtonColor: "#CFAD04",
        });
        return;
      }

      // Actualizar lista de clientes
      const updatedClients = availableClients.filter(
        (c) => c.idClient !== selectedClient.idClient
      );

      setAvailableClients(updatedClients);

      if (updatedClients.length === 0) {
        onClose();
      } else {
        setSelectedClientId(updatedClients[0].idClient);
      }

    } catch (err) {
      console.error(err);
      setErrorMsg("Error al enviar la notificación");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Transition show={isOpen} appear as={Fragment}>
      <Dialog as="div" className="relative z-[999]" onClose={onClose}>
        {/* Overlay */}
        <Transition.Child
          as={Fragment}
          enter="duration-200 ease-out"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="duration-150 ease-in"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50 backdrop-blur" />
        </Transition.Child>

        {/* Modal */}
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Transition.Child
            as={Fragment}
            enter="duration-200 ease-out"
            enterFrom="opacity-0 scale-95 translate-y-2"
            enterTo="opacity-100 scale-100 translate-y-0"
            leave="duration-150 ease-in"
            leaveFrom="opacity-100 scale-100 translate-y-0"
            leaveTo="opacity-0 scale-95 translate-y-2"
          >
            <Dialog.Panel
              className="w-full max-w-md rounded-lg shadow-xl overflow-hidden"
              style={{ backgroundColor: gymColors.accent }}
            >
              {/* HEADER */}
              <div
                className="p-4 flex justify-between items-center"
                style={{ backgroundColor: gymColors.primary }}
              >
                <Dialog.Title
                  className="text-xl font-bold"
                  style={{ color: gymColors.secondary }}
                >
                  ENVIAR NOTIFICACIÓN
                </Dialog.Title>

                <button
                  onClick={onClose}
                  className="text-2xl hover:bg-black/10 p-1 rounded-full transition"
                  style={{ color: gymColors.secondary }}
                >
                  <IoIosClose />
                </button>
              </div>

              {/* CONTENT */}
              <div className="p-6 space-y-4">
                {errorMsg && (
                  <div className="p-3 rounded bg-red-100 text-sm" style={{ color: gymColors.error }}>
                    {errorMsg}
                  </div>
                )}

                {/* CLIENTE */}
                <div>
                  <label className="block text-sm font-bold uppercase" style={{ color: gymColors.secondary }}>
                    Cliente
                  </label>
                  <select
                    className="w-full p-3 border rounded-lg mt-1 focus:ring-2 focus:outline-none"
                    onChange={(e) => setSelectedClientId(e.target.value)}
                    value={selectedClientId}
                    disabled={availableClients.length === 0}
                    style={{ borderColor: gymColors.primary }}
                  >
                    {availableClients.length === 0 ? (
                      <option>No hay clientes disponibles</option>
                    ) : (
                      availableClients.map((client) => (
                        <option key={client.idClient} value={client.idClient}>
                          {client.name} {client.firstLastName}
                        </option>
                      ))
                    )}
                  </select>
                </div>

                {/* PLANTILLA */}
                <div>
                  <label className="block text-sm font-bold uppercase" style={{ color: gymColors.secondary }}>
                    Plantilla
                  </label>
                  <select
                    className="w-full p-3 border rounded-lg mt-1 focus:ring-2 focus:outline-none"
                    onChange={(e) => handleTemplateChange(e.target.value)}
                    value={selectedTemplate?.idNotificationTemplate || ""}
                    style={{ borderColor: gymColors.primary }}
                  >
                    <option value="">Selecciona una plantilla</option>
                    {filteredTemplates.map((template) => (
                      <option key={template.idNotificationTemplate} value={template.idNotificationTemplate}>
                        {template.message}
                      </option>
                    ))}
                  </select>
                  {filteredTemplates.length === 0 && (
                    <p className="text-sm mt-1 text-gray-600">
                      No hay plantillas disponibles para este tipo de notificación
                    </p>
                  )}
                </div>

                {/* MENSAJE */}
                <div>
                  <label className="block text-sm font-bold uppercase" style={{ color: gymColors.secondary }}>
                    Mensaje
                  </label>
                  <textarea
                    className="w-full p-3 border rounded-lg mt-1 focus:ring-2 focus:outline-none resize-none"
                    style={{ borderColor: gymColors.primary, minHeight: "110px" }}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="El mensaje de la plantilla aparecerá aquí"
                  />
                </div>

                {/* BOTÓN ENVIAR */}
                <button
                  className="w-full py-3 rounded-lg font-bold transition disabled:opacity-40"
                  style={{
                    backgroundColor:
                      availableClients.length === 0 ? "#ccc" : gymColors.primary,
                    color: gymColors.secondary,
                  }}
                  onClick={handleSend}
                  disabled={isSending || availableClients.length === 0}
                >
                  {availableClients.length === 0
                    ? "NO HAY CLIENTES"
                    : isSending
                    ? "ENVIANDO..."
                    : "ENVIAR NOTIFICACIÓN"}
                </button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}