import { useFormContext } from "react-hook-form";
import ErrorForm from "../../shared/components/ErrorForm";

const MAXLENGTH_PHONENUMBER = 15;
const MAXLENGTH_EMAIL = 100;

export const ContactInfoStep = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">

      <div>
        <label
          htmlFor="phoneNumber"
          className="text-sm uppercase font-bold block mb-1"
        >
          Teléfono
        </label>

        <input
          id="phoneNumber"
          type="text"
          placeholder="Ingrese el número de teléfono"
          className="
            w-full p-3 border border-gray-200 rounded-md
            focus:outline-none focus:ring-2 focus:ring-yellow
          "
          {...register("phoneNumber", {
            required: "El número de teléfono es obligatorio",
            maxLength: {
              value: MAXLENGTH_PHONENUMBER,
              message: `Debe ingresar número de teléfono de máximo ${MAXLENGTH_PHONENUMBER} caracteres`,
            },
          })}
        />

        {errors.phoneNumber && (
          <ErrorForm>{errors.phoneNumber.message?.toString()}</ErrorForm>
        )}
      </div>

      <div>
        <label
          htmlFor="email"
          className="text-sm uppercase font-bold block mb-1"
        >
          Email
        </label>

        <input
          id="email"
          type="email"
          placeholder="Ingrese el email"
          className="
            w-full p-3 border border-gray-200 rounded-md
            focus:outline-none focus:ring-2 focus:ring-yellow
          "
          {...register("email", {
            required: "El email es obligatorio",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Email no válido",
            },
            maxLength: {
              value: MAXLENGTH_EMAIL,
              message: `Debe ingresar email de máximo ${MAXLENGTH_EMAIL} caracteres`,
            },
          })}
        />

        {errors.email && (
          <ErrorForm>{errors.email.message?.toString()}</ErrorForm>
        )}
      </div>

    </div>
  );
};