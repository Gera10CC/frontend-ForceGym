import { FormProvider } from "react-hook-form";
import { StepContactInfo } from "./StepContactInfo";
import { StepHealthInfo } from "./StepHealthInfo";
import { useMultiStepForm } from "./useMultiStepForm";
import { StepClientInfo } from "./StepPersonalInfo";
import { StepContract } from "./StepContract";
import { ClientFormProvider } from "./Context";

const MultiStepForm = () => {
  const {
    methods,
    step,
    genders,
    clientTypes,
    activeEditingId,
    submitForm,
    prevStep,
    nextStep,
    handleStepChangeByMenu,
    handleStepChangeByButton
  } = useMultiStepForm();

  const renderStep = () => {
    switch (step) {
      case 1:
        return <StepContract />;
      case 2:
        return <StepClientInfo genders={genders} clientTypes={clientTypes} />;
      case 3:
        return <StepContactInfo />;
      case 4:
        return <StepHealthInfo />;
      default:
        return null;
    }
  };

  const formMenu = () => {
    return (
      <ul
        className="
          flex flex-col sm:flex-row
          text-center justify-around
          mt-6 mb-8 gap-4
          text-lg sm:text-xl font-medium
        "
      >
        {[ 
          { id: 1, label: "Contrato" },
          { id: 2, label: "Información Personal" },
          { id: 3, label: "Contacto" },
          { id: 4, label: "Salud" }
        ].map(({ id, label }) => (
          <button
            key={id}
            type="button"
            className={`
              p-1 transition-colors
              ${step === id 
                ? "opacity-100 font-bold border-b-2 border-yellow"
                : "opacity-60 hover:border-b-2"}
            `}
            onClick={() => handleStepChangeByMenu(id)}
          >
            {label}
          </button>
        ))}
      </ul>
    );
  };

  return (
    <FormProvider {...methods}>
      <form
        noValidate
        onSubmit={methods.handleSubmit(submitForm)}
        className="
          bg-white rounded-lg
          max-h-[80vh] overflow-y-auto
          w-full max-w-4xl mx-auto
          px-4 sm:px-8 py-6
          space-y-6 mb-10
        "
      >
        <legend
          className="
            uppercase text-center text-yellow
            text-xl sm:text-2xl font-black
            border-b-2 border-yellow pb-2
          "
        >
          {activeEditingId ? "Actualizar cliente" : "Registrar cliente"}
        </legend>

        <input type="hidden" {...methods.register("idUser")} />
        <input type="hidden" {...methods.register("idClient")} />
        <input type="hidden" {...methods.register("isDeleted")} />
        <input type="hidden" {...methods.register("signatureImage")} />
        <input type="hidden" {...methods.register("idHealthQuestionnaire")} />
        <input type="hidden" {...methods.register("idPerson")} />

        {formMenu()}

        <div className="px-1 sm:px-2 space-y-5">
          {renderStep()}
        </div>

        <div className="flex justify-between mt-5 gap-3">
          {step > 1 && (
            <button
              type="button"
              onClick={prevStep}
              className="
                border-2 border-gray-600 text-gray-600
                py-2 px-3 uppercase font-bold rounded-md
                hover:opacity-70 cursor-pointer
                transition-colors
              "
            >
              Anterior
            </button>
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={() => handleStepChangeByButton(nextStep)}
              className="
                bg-yellow text-black
                py-2 px-4 uppercase font-bold rounded-md
                hover:bg-amber-500 cursor-pointer
                transition-colors ml-auto
              "
            >
              Siguiente
            </button>
          ) : (
            <input
              type="submit"
              className="
                bg-yellow text-black
                py-2 px-4 rounded-md
                uppercase font-bold
                hover:bg-amber-500 cursor-pointer
                transition-colors ml-auto
              "
              value={activeEditingId ? "Actualizar" : "Registrar"}
            />
          )}
        </div>
      </form>
    </FormProvider>
  );
};

export default function Form() {
  return (
    <ClientFormProvider>
      <MultiStepForm />
    </ClientFormProvider>
  );
}