import { Fragment, useEffect, useState, useCallback } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { IoIosNotificationsOutline } from "react-icons/io";
import { NotificationTemplateModal } from "./NotificationTemplateModal";

export type ClientNotification = {
  idClient: string;
  name: string;
  firstLastName: string;
  secondLastName: string;
  email: string;
  phoneNumber: string;
  additionalInfo?: string;
};

type NotificationsData = {
  mensualidades: ClientNotification[];
  cumpleanos: ClientNotification[];
  aniversarios: ClientNotification[];
};

type NotificationsModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function NotificationsModal({ isOpen, onClose }: NotificationsModalProps) {
  const [notifications, setNotifications] = useState<NotificationsData>({
    mensualidades: [],
    cumpleanos: [],
    aniversarios: [],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [templateModalOpen, setTemplateModalOpen] = useState(false);
  const [selectedClients, setSelectedClients] = useState<ClientNotification[]>([]);
  const [notificationType, setNotificationType] = useState<
    "mensualidades" | "cumpleanos" | "aniversarios"
  >("mensualidades");

  // --------------------------------------------
  // FETCH NOTIFICATIONS
  // --------------------------------------------
  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("auth_token");

      const endpoints = [
        ["aniversarios", 3],
        ["cumpleanos", 2],
        ["mensualidades", 1],
      ] as const;

      const responses = await Promise.all(
        endpoints.map(([_, filter]) =>
          fetch(`${import.meta.env.VITE_URL_API}client/filter?filterType=${filter}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
        )
      );

      if (!responses.every((res) => res.ok)) {
        throw new Error("Error al cargar las notificaciones");
      }

      const data = await Promise.all(responses.map((res) => res.json()));

      setNotifications({
        aniversarios: data[0]?.data?.clients || [],
        cumpleanos: data[1]?.data?.clients || [],
        mensualidades: data[2]?.data?.clients || [],
      });
    } catch (err) {
      console.error(err);
      setError("Error al cargar las notificaciones");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) fetchNotifications();
  }, [isOpen, fetchNotifications]);

  // --------------------------------------------
  // SEND EMAIL + WHATSAPP
  // --------------------------------------------
  const sendEmail = async (clients: ClientNotification[], subject: string, message: string) => {
    const token = localStorage.getItem("auth_token");

    try {
      const response = await fetch(`${import.meta.env.VITE_URL_API}mail/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          toUsers: clients.map((c) => c.email),
          subject,
          message,
        }),
      });

      if (!response.ok) {
        throw new Error(`Email error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error enviando email:", error);
      throw error;
    }
  };

  const handleSendNotification = async (message: string, client: ClientNotification) => {
    try {
      // Email
      if (client.email) {
        await sendEmail([client], "Notificación de ForceGym", message);
      }

      // WhatsApp
      if (client.phoneNumber) {
        const encodedMessage = encodeURIComponent(message);
        const phone = client.phoneNumber.startsWith("506")
          ? client.phoneNumber
          : `506${client.phoneNumber}`;
        window.open(`https://wa.me/${phone}?text=${encodedMessage}`, "_blank");
      }
    } catch (err) {
      console.error("Error en handleSendNotification:", err);
    }
  };

  // --------------------------------------------
  // COMPONENTE DE SECCIÓN REUTILIZABLE
  // --------------------------------------------
  const NotificationSection = ({
    title,
    type,
    clients,
    actionText,
  }: {
    title: string;
    type: "mensualidades" | "cumpleanos" | "aniversarios";
    clients: ClientNotification[];
    actionText: string;
  }) => {
    if (clients.length === 0) return null;

    const main = clients[0];
    const more = clients.length - 1;

    const msg =
      title === "Mensualidades"
        ? "se les ha caducado la mensualidad."
        : title === "Cumpleaños"
        ? "cumplen años el día de hoy."
        : "cumplen su aniversario el día de hoy.";

    return (
      <div className="mb-6">
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="mb-1">
          {more > 0 ? `${main.name} y ${more} más` : main.name} {msg}
        </p>

        <button
          className="font-bold text-white hover:underline"
          onClick={() => {
            setSelectedClients(clients);
            setNotificationType(type);
            onClose();
            setTemplateModalOpen(true);
          }}
        >
          {actionText}
        </button>
      </div>
    );
  };

  const hasNotifications =
    notifications.mensualidades.length +
      notifications.cumpleanos.length +
      notifications.aniversarios.length >
    0;

  // --------------------------------------------
  // MODAL PRINCIPAL
  // --------------------------------------------
  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-[999]" onClose={onClose}>
          {/* Overlay */}
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
          </Transition.Child>

          {/* Panel lateral */}
          <div className="fixed inset-0 flex items-start justify-end p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 translate-x-3 scale-95"
              enterTo="opacity-100 translate-x-0 scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 translate-x-0 scale-100"
              leaveTo="opacity-0 translate-x-3 scale-95"
            >
              <Dialog.Panel className="w-96 bg-[#E6C200] text-black rounded-lg shadow-xl overflow-hidden">
                {/* Header */}
                <div className="bg-black text-white p-4 flex items-center gap-2 font-bold text-lg">
                  <IoIosNotificationsOutline className="text-2xl" />
                  Notificaciones
                </div>

                <div className="p-4">
                  {loading && <p>Cargando notificaciones...</p>}
                  {error && <p className="text-red-500">{error}</p>}

                  {!loading && !error && !hasNotifications && (
                    <p className="text-center py-4">No hay notificaciones</p>
                  )}

                  {!loading && !error && hasNotifications && (
                    <>
                      <NotificationSection
                        title="Mensualidades"
                        type="mensualidades"
                        clients={notifications.mensualidades}
                        actionText="Recuérdales"
                      />

                      <NotificationSection
                        title="Cumpleaños"
                        type="cumpleanos"
                        clients={notifications.cumpleanos}
                        actionText="Felicítales"
                      />

                      <NotificationSection
                        title="Aniversarios"
                        type="aniversarios"
                        clients={notifications.aniversarios}
                        actionText="Agradéceles"
                      />
                    </>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>

      {/* Modal de plantilla */}
      <NotificationTemplateModal
        clients={selectedClients}
        notificationType={notificationType}
        onSend={handleSendNotification}
        isOpen={templateModalOpen}
        onClose={() => setTemplateModalOpen(false)}
      />
    </>
  );
}