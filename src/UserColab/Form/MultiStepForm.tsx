import { FormProvider } from "react-hook-form";
import { PersonalInfoStep } from "./StepPersonalInfo";
import { ContactInfoStep } from "./StepContactInfo";
import { AccountInfoStep } from "./StepAccountInfo";
import { useMultiStepForm } from "./useMultiStepForm";
import { UserDataForm } from "../../shared/types";
import { User } from "lucide-react";

interface MultiStepFormProps {
  initialData: any;
  onSubmit: (data: UserDataForm) => Promise<void>;
  isUpdate: boolean;
}

const MultiStepForm = ({ initialData, onSubmit, isUpdate }: MultiStepFormProps) => {
  const { methods, roles, genders, submitForm } = useMultiStepForm({
    initialData,
    onSubmit,
    isUpdate,
  });

  return (
    <FormProvider {...methods}>
      <form
        noValidate
        onSubmit={methods.handleSubmit(submitForm)}
        className="
          bg-gray-50 
          w-full
          px-6 sm:px-10 py-10
          rounded-2xl shadow-lg border border-gray-200
        "
      >
        <div className="flex flex-col items-center gap-3 mb-12">
          <div className="
            w-24 h-24 rounded-full 
            bg-yellow/90 flex items-center justify-center 
            shadow
          ">
            <User size={42} className="text-white" />
          </div>

          <h2 className="text-2xl font-black uppercase text-gray-800">
            Mi Perfil
          </h2>
          <p className="text-gray-500 text-sm">
            Actualiza tu información personal
          </p>
        </div>

        <section className="bg-white rounded-xl p-6 mb-10 shadow-sm border border-gray-200">
          <h3 className="text-yellow font-bold mb-6 uppercase">
            Información Personal
          </h3>

          <div className="grid grid-cols-1">
            <PersonalInfoStep genders={genders} />
          </div>
        </section>

        <section className="bg-white rounded-xl p-6 mb-10 shadow-sm border border-gray-200">
          <h3 className="text-yellow font-bold mb-6 uppercase">
            Información de Contacto
          </h3>

          <div className="grid grid-cols-1">
            <ContactInfoStep />
          </div>
        </section>

        <section className="bg-white rounded-xl p-6 mb-10 shadow-sm border border-gray-200">
          <h3 className="text-yellow font-bold mb-6 uppercase">
            Información de Cuenta
          </h3>

          <div className="grid grid-cols-1">
            <AccountInfoStep roles={roles} isUpdate={isUpdate} />
          </div>
        </section>

        <div className="flex justify-center sm:justify-end mt-10">
          <button
            type="submit"
            className="
              bg-yellow px-12 py-3 rounded-md 
              text-white uppercase font-bold 
              hover:bg-amber-500 transition
              shadow
            "
          >
            Actualizar perfil
          </button>
        </div>
      </form>
    </FormProvider>
  );
};

export default MultiStepForm;