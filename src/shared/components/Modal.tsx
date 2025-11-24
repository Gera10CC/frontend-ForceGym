import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { Fragment, useCallback } from "react";
import { MdOutlineCancel } from "react-icons/md";

type ModalProps = {
  Button: () => JSX.Element;
  modal: boolean;
  closeModal: () => void;
  getDataById: (id: number) => void;
  Content: React.ComponentType<any>;
  /**
   * Si es true, limpia el dato activo (getDataById(0))
   * después de que termine la animación de cierre.
   *
   * Útil para el modal de "Ver más".
   */
  resetOnClose?: boolean;
};

// Debe ser ligeramente mayor a leave duration (150ms)
const CLOSE_CLEANUP_DELAY = 220;

export default function Modal({
  Button,
  modal,
  closeModal,
  getDataById,
  Content,
  resetOnClose = false,
}: ModalProps) {
  const handleClose = useCallback(() => {
    // 1) Disparamos el cierre del modal (cambia el estado global)
    closeModal();

    // 2) (Opcional) Limpiamos los datos DESPUÉS de la animación
    if (resetOnClose) {
      setTimeout(() => {
        getDataById(0); // aquí reseteas activeEditingId o lo que maneje ese id
      }, CLOSE_CLEANUP_DELAY);
    }
  }, [closeModal, getDataById, resetOnClose]);

  return (
    <>
      {/* Botón disparador */}
      <Button />

      <Transition appear show={modal} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-[999]"
          onClose={handleClose}
        >
          {/* OVERLAY */}
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/60" />
          </TransitionChild>

          {/* CONTENEDOR DEL MODAL */}
          <div className="fixed inset-0 overflow-y-auto z-[999]">
            <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
              <TransitionChild
                as={Fragment}
                enter="ease-out duration-200"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-150"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <DialogPanel
                  className="
                    w-full max-w-3xl
                    bg-white
                    rounded-2xl
                    shadow-xl
                    p-6
                    relative
                  "
                >
                  {/* Botón cerrar */}
                  <button
                    onClick={handleClose}
                    className="
                      absolute top-3 right-3
                      text-3xl text-gray-600
                      hover:text-yellow transition
                    "
                    aria-label="Cerrar"
                  >
                    <MdOutlineCancel />
                  </button>

                  {/* Contenido dinámico */}
                  <Content />
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}