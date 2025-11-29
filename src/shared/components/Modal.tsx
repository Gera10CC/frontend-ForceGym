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

  resetOnClose?: boolean;
};

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
    closeModal();

    if (resetOnClose) {
      setTimeout(() => {
        getDataById(0); 
      }, CLOSE_CLEANUP_DELAY);
    }
  }, [closeModal, getDataById, resetOnClose]);

  return (
    <>
      <Button />

      <Transition appear show={modal} as={Fragment}>
        <Dialog
        as="div"
        className="fixed inset-0 z-[9999]"
        onClose={handleClose}
      >
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