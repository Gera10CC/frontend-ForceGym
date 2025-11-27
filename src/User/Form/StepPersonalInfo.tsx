import { useFormContext } from "react-hook-form";
import ErrorForm from "../../shared/components/ErrorForm";
import { formatDate } from "../../shared/utils/format";

const MAXLENGTH_IDENTIFICATIONUMBER = 20;
const MAXLENGTH_NAME = 50;
const MAXLENGTH_FIRSTLASTNAME = 50;
const MAXLENGTH_SECONDLASTNAME = 50;
const MAXDATE_BIRTHDAY = new Date().toUTCString();
const MINLENGTH_IDENTIFICATIONUMBER = 7;
const MINLENGTH_NAME = 2;

export const PersonalInfoStep = ({ genders }: { genders: any[] }) => {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div className="space-y-5 w-full px-1 sm:px-2">
      
      <div>
        <label className="text-sm uppercase font-bold">Cédula</label>
        <input
          type="text"
          className="
            w-full p-3 border border-gray-200 rounded-md mt-1
          "
          placeholder="Ingrese la cédula"
          {...register("identificationNumber", {
            required: "La cédula es obligatoria",
            minLength: {
              value: MINLENGTH_IDENTIFICATIONUMBER,
              message: `Debe ingresar una cédula de mínimo ${MINLENGTH_IDENTIFICATIONUMBER} caracteres`,
            },
            maxLength: {
              value: MAXLENGTH_IDENTIFICATIONUMBER,
              message: `Máximo ${MAXLENGTH_IDENTIFICATIONUMBER} caracteres`,
            },
            pattern: {
              value: /^[0-9]+$/,
              message: "Solo números",
            },
          })}
        />
        {errors.identificationNumber && (
          <ErrorForm>{errors.identificationNumber.message?.toString()}</ErrorForm>
        )}
      </div>

      <div>
        <label className="text-sm uppercase font-bold">Nombre</label>
        <input
          type="text"
          className="w-full p-3 border border-gray-200 rounded-md mt-1"
          placeholder="Ingrese el nombre"
          {...register("name", {
            required: "El nombre es obligatorio",
            minLength: { value: MINLENGTH_NAME, message: `Mínimo ${MINLENGTH_NAME} caracteres` },
            maxLength: { value: MAXLENGTH_NAME, message: `Máximo ${MAXLENGTH_NAME} caracteres` },
            pattern: {
              value: /^[A-Za-zÁáÉéÍíÓóÚúÜüÑñ\s'-]*$/,
              message: "No puede contener números",
            },
          })}
        />
        {errors.name && <ErrorForm>{errors.name.message?.toString()}</ErrorForm>}
      </div>

      <div>
        <label className="text-sm uppercase font-bold">Primer Apellido</label>
        <input
          type="text"
          className="w-full p-3 border border-gray-200 rounded-md mt-1"
          placeholder="Ingrese el primer apellido"
          {...register("firstLastName", {
            required: "Obligatorio",
            minLength: { value: MINLENGTH_NAME, message: `Mínimo ${MINLENGTH_NAME} caracteres` },
            maxLength: {
              value: MAXLENGTH_FIRSTLASTNAME,
              message: `Máximo ${MAXLENGTH_FIRSTLASTNAME} caracteres`,
            },
            pattern: {
              value: /^[A-Za-zÁáÉéÍíÓóÚúÜüÑñ\s'-]*$/,
              message: "No puede contener números",
            },
          })}
        />
        {errors.firstLastName && (
          <ErrorForm>{errors.firstLastName.message?.toString()}</ErrorForm>
        )}
      </div>

      <div>
        <label className="text-sm uppercase font-bold">Segundo Apellido</label>
        <input
          type="text"
          className="w-full p-3 border border-gray-200 rounded-md mt-1"
          placeholder="Ingrese el segundo apellido"
          {...register("secondLastName", {
            required: "Obligatorio",
            minLength: { value: MINLENGTH_NAME, message: `Mínimo ${MINLENGTH_NAME} caracteres` },
            maxLength: {
              value: MAXLENGTH_SECONDLASTNAME,
              message: `Máximo ${MAXLENGTH_SECONDLASTNAME} caracteres`,
            },
            pattern: {
              value: /^[A-Za-zÁáÉéÍíÓóÚúÜüÑñ\s'-]*$/,
              message: "No puede contener números",
            },
          })}
        />
        {errors.secondLastName && (
          <ErrorForm>{errors.secondLastName.message?.toString()}</ErrorForm>
        )}
      </div>

      <div>
        <label className="text-sm uppercase font-bold">Fecha de nacimiento</label>
        <input
          type="date"
          className="w-full p-3 border border-gray-200 rounded-md mt-1"
          {...register("birthday", {
            required: "La fecha de nacimiento es obligatoria",
            max: {
              value: MAXDATE_BIRTHDAY,
              message: `Debe ser antes de ${formatDate(new Date())}`,
            },
          })}
        />
        {errors.birthday && <ErrorForm>{errors.birthday.message?.toString()}</ErrorForm>}
      </div>

      <div>
        <label className="text-sm uppercase font-bold">Género</label>
        <select
          className="w-full p-3 border border-gray-200 rounded-md mt-1"
          {...register("idGender", {
            required: "El género es obligatorio",
            validate: (v) => Number(v) !== 0 || "Debe seleccionar un género",
          })}
        >
          <option value={0}>Seleccione un género</option>
          {genders.map((gender) => (
            <option key={gender.idGender} value={gender.idGender}>
              {gender.name}
            </option>
          ))}
        </select>
        {errors.idGender && <ErrorForm>{errors.idGender.message?.toString()}</ErrorForm>}
      </div>
    </div>
  );
};