import { useFormContext } from "react-hook-form";
import ErrorForm from "../../shared/components/ErrorForm";
import { formatDate } from "../../shared/utils/format";

const MAXLENGTH_PHONENUMBER = 15;
const MINLENGTH_PHONENUMBER = 8;
const MAXLENGTH_EMAIL = 100;
const MAXLENGTH_NAME = 50;
const MINLENGTH_NAME = 2;
const MAXDATE = new Date().toUTCString();

export const StepContactInfo = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

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
            minLength: {
              value: MINLENGTH_PHONENUMBER,
              message: `Mínimo ${MINLENGTH_PHONENUMBER} caracteres`,
            },
            maxLength: {
              value: MAXLENGTH_PHONENUMBER,
              message: `Máximo ${MAXLENGTH_PHONENUMBER} caracteres`,
            },
            pattern: {
              value: /^[0-9]+$/,
              message: "Solo se permiten números",
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
            maxLength: {
              value: MAXLENGTH_EMAIL,
              message: `Máximo ${MAXLENGTH_EMAIL} caracteres`,
            },
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Email no válido",
            },
          })}
        />
        {errors.email && (
          <ErrorForm>{errors.email.message?.toString()}</ErrorForm>
        )}
      </div>

      <div>
        <label className="text-sm uppercase font-bold">
          Nombre del contacto de emergencia
        </label>
        <input
          type="text"
          className="w-full p-3 border border-gray-200 rounded-md mt-1"
          placeholder="Nombre del contacto"
          {...register("nameEmergencyContact", {
            required: "El nombre del contacto es obligatorio",
            minLength: {
              value: MINLENGTH_NAME,
              message: `Mínimo ${MINLENGTH_NAME} caracteres`,
            },
            maxLength: {
              value: MAXLENGTH_NAME,
              message: `Máximo ${MAXLENGTH_NAME} caracteres`,
            },
            pattern: {
              value: /^[A-Za-zÁáÉéÍíÓóÚúÜüÑñ\s'-]*$/,
              message: "No puede contener números ni símbolos",
            },
          })}
        />
        {errors.nameEmergencyContact && (
          <ErrorForm>
            {errors.nameEmergencyContact.message?.toString()}
          </ErrorForm>
        )}
      </div>

      <div>
        <label className="text-sm uppercase font-bold">
          Teléfono contacto emergencia
        </label>
        <input
          type="text"
          className="w-full p-3 border border-gray-200 rounded-md mt-1"
          placeholder="Número del contacto"
          {...register("phoneNumberContactEmergency", {
            required: "El teléfono del contacto es obligatorio",
            minLength: {
              value: MINLENGTH_PHONENUMBER,
              message: `Mínimo ${MINLENGTH_PHONENUMBER} caracteres`,
            },
            maxLength: {
              value: MAXLENGTH_PHONENUMBER,
              message: `Máximo ${MAXLENGTH_PHONENUMBER} caracteres`,
            },
            pattern: {
              value: /^[0-9]+$/,
              message: "Solo se permiten números",
            },
          })}
        />
        {errors.phoneNumberContactEmergency && (
          <ErrorForm>
            {errors.phoneNumberContactEmergency.message?.toString()}
          </ErrorForm>
        )}
      </div>

      <div>
        <label className="text-sm uppercase font-bold">
          Fecha de registro
        </label>
        <input
          type="date"
          className="w-full p-3 border border-gray-200 rounded-md mt-1"
          {...register("registrationDate", {
            required: "La fecha de registro es obligatoria",
            max: {
              value: MAXDATE,
              message: `Máximo ${formatDate(new Date())}`,
            },
          })}
        />
        {errors.registrationDate && (
          <ErrorForm>
            {errors.registrationDate.message?.toString()}
          </ErrorForm>
        )}
      </div>
    </div>
  );
};