import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function LogoutModal({ isOpen, onClose, onConfirm }: LogoutModalProps) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-[999]"
        onClose={onClose}
      >
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
          <div className="fixed inset-0 bg-black/60 backdrop-blur-[2px]" />
        </Transition.Child>

        {/* Modal wrapper */}
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0 scale-95 translate-y-2"
            enterTo="opacity-100 scale-100 translate-y-0"
            leave="ease-in duration-150"
            leaveFrom="opacity-100 scale-100 translate-y-0"
            leaveTo="opacity-0 scale-95 translate-y-2"
          >
            <Dialog.Panel className="w-full max-w-xs sm:max-w-sm md:max-w-md rounded-xl bg-white shadow-lg p-6 text-gray-800 border border-gray-200">
              {/* Title */}
              <Dialog.Title className="text-lg font-semibold text-center">
                Cerrar sesión
              </Dialog.Title>

              {/* Message */}
              <p className="mt-2 text-sm text-center text-gray-500">
                ¿Deseas cerrar sesión?
              </p>

              {/* Buttons */}
              <div className="mt-6 flex justify-center gap-4">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-100 transition"
                >
                  Cancelar
                </button>

                <button
                  onClick={() => {
                    onConfirm();
                    onClose();
                  }}
                  className="px-4 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                >
                  Cerrar sesión
                </button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}