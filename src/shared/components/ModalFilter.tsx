import { Fragment } from "react";
import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";

type FilterModalProps = {
  modalFilter: boolean;
  closeModalFilter: () => void;
  FilterButton: () => JSX.Element;
  FilterSelect: () => JSX.Element;
};

export default function ModalFilter({
  modalFilter,
  closeModalFilter,
  FilterButton,
  FilterSelect,
}: FilterModalProps) {
  return (
    <>
      <FilterButton />

      <Transition appear show={modalFilter} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-[999]"
          onClose={closeModalFilter}
        >
          {/* Fondo oscuro */}
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/50 backdrop-blur-[2px]" />
          </TransitionChild>

          {/* Contenedor */}
          <div className="fixed inset-0 flex items-start justify-end p-0 sm:p-4">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 translate-x-4"
              enterTo="opacity-100 translate-x-0"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 translate-x-0"
              leaveTo="opacity-0 translate-x-4"
            >
              <DialogPanel
                className="
                  w-full sm:w-80 md:w-96 
                  max-w-full bg-white 
                  rounded-none sm:rounded-xl 
                  shadow-xl 
                  p-4 sm:p-6 
                  transform transition-all
                  overflow-y-auto 
                  max-h-[90vh]
                "
              >
                {/* LIMITADOR DE ANCHO + PROTECCIÓN */}
                <div className="w-full max-w-full overflow-hidden">
                  <FilterSelect />
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}