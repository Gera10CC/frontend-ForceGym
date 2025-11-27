import { useFormContext } from "react-hook-form";
import ErrorForm from "../../shared/components/ErrorForm";

const MAXLENGTH_PHONENUMBER = 15;
const MAXLENGTH_EMAIL = 100;

export const ContactInfoStep = () => {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div className="space-y-5 w-full px-1 sm:px-2">
      <div>
        <label className="text-sm uppercase font-bold">Teléfono</label>
        <input
          type="text"
          className="w-full p-3 border border-gray-200 rounded-md mt-1"
          placeholder="Ingrese el número de teléfono"
          {...register("phoneNumber", {
            required: "El número de teléfono es obligatorio",
            maxLength: {
              value: MAXLENGTH_PHONENUMBER,
              message: `Máximo ${MAXLENGTH_PHONENUMBER} caracteres`,
            },
          })}
        />
        {errors.phoneNumber && (
          <ErrorForm>{errors.phoneNumber.message?.toString()}</ErrorForm>
        )}
      </div>

      <div>
        <label className="text-sm uppercase font-bold">Email</label>
        <input
          type="email"
          className="w-full p-3 border border-gray-200 rounded-md mt-1"
          placeholder="Ingrese el email"
          {...register("email", {
            required: "El email es obligatorio",
            maxLength: { value: MAXLENGTH_EMAIL, message: `Máximo ${MAXLENGTH_EMAIL} caracteres` },
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Email no válido",
            },
          })}
        />
        {errors.email && <ErrorForm>{errors.email.message?.toString()}</ErrorForm>}
      </div>
    </div>
  );
};