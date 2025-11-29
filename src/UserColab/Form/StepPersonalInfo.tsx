import { useFormContext } from "react-hook-form";
import ErrorForm from "../../shared/components/ErrorForm";
import { formatDate } from "../../shared/utils/format";

const MAXLENGTH_IDENTIFICATIONUMBER = 20;
const MAXLENGTH_NAME = 50;
const MAXLENGTH_FIRSTLASTNAME = 50;
const MAXLENGTH_SECONDLASTNAME = 50;
const MAXDATE_BIRTHDAY = new Date().toUTCString();

export const PersonalInfoStep = ({ genders }: { genders: any[] }) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">

      <div>
        <label
          htmlFor="identificationNumber"
          className="text-sm uppercase font-bold block mb-1"
        >
          Cédula
        </label>

        <input
          id="identificationNumber"
          type="text"
          placeholder="Ingrese la cédula"
          className="
            w-full p-3 border border-gray-200 rounded-md
            focus:outline-none focus:ring-2 focus:ring-yellow
          "
          {...register("identificationNumber", {
            required: "La cédula es obligatoria",
            maxLength: {
              value: MAXLENGTH_IDENTIFICATIONUMBER,
              message: `Debe ingresar una cédula de máximo ${MAXLENGTH_IDENTIFICATIONUMBER} caracteres`,
            },
          })}
        />

        {errors.identificationNumber && (
          <ErrorForm>
            {errors.identificationNumber.message?.toString()}
          </ErrorForm>
        )}
      </div>

      <div>
        <label
          htmlFor="name"
          className="text-sm uppercase font-bold block mb-1"
        >
          Nombre
        </label>

        <input
          id="name"
          type="text"
          placeholder="Ingrese el nombre"
          className="
            w-full p-3 border border-gray-200 rounded-md
            focus:outline-none focus:ring-2 focus:ring-yellow
          "
          {...register("name", {
            required: "El nombre es obligatorio",
            maxLength: {
              value: MAXLENGTH_NAME,
              message: `Debe ingresar un nombre de máximo ${MAXLENGTH_NAME} caracteres`,
            },
          })}
        />

        {errors.name && (
          <ErrorForm>{errors.name.message?.toString()}</ErrorForm>
        )}
      </div>

      <div>
        <label
          htmlFor="firstLastName"
          className="text-sm uppercase font-bold block mb-1"
        >
          Primer Apellido
        </label>

        <input
          id="firstLastName"
          type="text"
          placeholder="Ingrese el primer apellido"
          className="
            w-full p-3 border border-gray-200 rounded-md
            focus:outline-none focus:ring-2 focus:ring-yellow
          "
          {...register("firstLastName", {
            required: "El primer apellido es obligatorio",
            maxLength: {
              value: MAXLENGTH_FIRSTLASTNAME,
              message: `Debe ingresar un primer apellido de máximo ${MAXLENGTH_FIRSTLASTNAME} caracteres`,
            },
          })}
        />

        {errors.firstLastName && (
          <ErrorForm>{errors.firstLastName.message?.toString()}</ErrorForm>
        )}
      </div>

      <div>
        <label
          htmlFor="secondLastName"
          className="text-sm uppercase font-bold block mb-1"
        >
          Segundo Apellido
        </label>

        <input
          id="secondLastName"
          type="text"
          placeholder="Ingrese el segundo apellido"
          className="
            w-full p-3 border border-gray-200 rounded-md
            focus:outline-none focus:ring-2 focus:ring-yellow
          "
          {...register("secondLastName", {
            required: "El segundo apellido es obligatorio",
            maxLength: {
              value: MAXLENGTH_SECONDLASTNAME,
              message: `Debe ingresar un segundo apellido de máximo ${MAXLENGTH_SECONDLASTNAME} caracteres`,
            },
          })}
        />

        {errors.secondLastName && (
          <ErrorForm>
            {errors.secondLastName.message?.toString()}
          </ErrorForm>
        )}
      </div>

      <div>
        <label
          htmlFor="birthday"
          className="text-sm uppercase font-bold block mb-1"
        >
          Fecha de nacimiento
        </label>

        <input
          id="birthday"
          type="date"
          className="
            w-full p-3 border border-gray-200 rounded-md
            focus:outline-none focus:ring-2 focus:ring-yellow
          "
          {...register("birthday", {
            required: "La fecha de nacimiento es obligatoria",
            max: {
              value: MAXDATE_BIRTHDAY,
              message: `Debe ingresar una fecha de nacimiento de máximo ${formatDate(
                new Date()
              )}`,
            },
          })}
        />

        {errors.birthday && (
          <ErrorForm>{errors.birthday.message?.toString()}</ErrorForm>
        )}
      </div>

      <div>
        <label
          htmlFor="idGender"
          className="text-sm uppercase font-bold block mb-1"
        >
          Género
        </label>

        <select
          id="idGender"
          className="
            w-full p-3 border border-gray-200 rounded-md
            focus:outline-none focus:ring-2 focus:ring-yellow
          "
          {...register("idGender", {
            required: "El género es obligatorio",
            validate: (value) =>
              Number(value) !== 0 || "Debe seleccionar un género",
          })}
        >
          <option value={0}>Seleccione un género</option>
          {genders.map((gender) => (
            <option key={gender.idGender} value={gender.idGender}>
              {gender.name}
            </option>
          ))}
        </select>

        {errors.idGender && (
          <ErrorForm>{errors.idGender.message?.toString()}</ErrorForm>
        )}
      </div>
    </div>
  );
};