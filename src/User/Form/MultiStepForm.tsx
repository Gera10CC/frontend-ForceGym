import { FormProvider } from "react-hook-form";
import { PersonalInfoStep } from "./StepPersonalInfo";
import { ContactInfoStep } from "./StepContactInfo";
import { AccountInfoStep } from "./StepAccountInfo";
import { UserFormProvider } from "./Context";
import { useMultiStepForm } from "./useMultiStepForm";

const MultiStepForm = () => {
  const {
    methods,
    step,
    roles,
    genders,
    activeEditingId,
    submitForm,
    prevStep,
    nextStep,
    handleStepChangeByMenu,
    handleStepChangeByButton,
  } = useMultiStepForm();

  const renderStep = () => {
    switch (step) {
      case 1:
        return <PersonalInfoStep genders={genders} />;
      case 2:
        return <ContactInfoStep />;
      case 3:
        return (
          <AccountInfoStep
            activeEditingId={activeEditingId || 0}
            roles={roles}
          />
        );
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
        <button
          type="button"
          className={`
            p-1 transition-colors 
            ${step === 1 ? "opacity-100 font-bold border-b-2 border-yellow" : "opacity-60 hover:border-b-2"}
          `}
          onClick={() => handleStepChangeByMenu(1)}
        >
          Información Personal
        </button>

        <button
          type="button"
          className={`
            p-1 transition-colors 
            ${step === 2 ? "opacity-100 font-bold border-b-2 border-yellow" : "opacity-60 hover:border-b-2"}
          `}
          onClick={() => handleStepChangeByMenu(2)}
        >
          Información de Contacto
        </button>

        <button
          type="button"
          className={`
            p-1 transition-colors 
            ${step === 3 ? "opacity-100 font-bold border-b-2 border-yellow" : "opacity-60 hover:border-b-2"}
          `}
          onClick={() => handleStepChangeByMenu(3)}
        >
          Información de Cuenta
        </button>
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
          space-y-6
        "
      >
        <legend
          className="
            uppercase text-center text-yellow 
            text-xl sm:text-2xl font-black 
            border-b-2 border-yellow pb-2
          "
        >
          {activeEditingId ? "Actualizar usuario" : "Registrar usuario"}
        </legend>

        {/* Hidden inputs */}
        <input id="idUser" type="hidden" {...methods.register("idUser")} />
        <input id="idPerson" type="hidden" {...methods.register("idPerson")} />
        <input id="isDeleted" type="hidden" {...methods.register("isDeleted")} />

        {/* Menú de Steps */}
        {formMenu()}

        {/* Paso actual */}
        <div className="px-1 sm:px-2 space-y-5">{renderStep()}</div>

        {/* Botones de navegación */}
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

          {step < 3 ? (
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
    <UserFormProvider>
      <MultiStepForm />
    </UserFormProvider>
  );
}