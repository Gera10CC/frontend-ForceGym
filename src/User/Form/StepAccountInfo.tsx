import { useFormContext } from "react-hook-form";
import ErrorForm from "../../shared/components/ErrorForm";
import PasswordInput from "../../shared/components/PasswordInput";
import { Role } from "../../shared/types";
import { getAuthUser } from "../../shared/utils/authentication";

const MAXLENGTH_USERNAME = 50;

export const AccountInfoStep = ({
  activeEditingId,
  roles,
}: {
  activeEditingId: number;
  roles: Role[];
}) => {
  const { register, formState: { errors }, watch } = useFormContext();
  const loggedUser = getAuthUser();
  const isSelfEditing = loggedUser?.idUser === activeEditingId;

  const validatePassword = (password: string) => {
    if (activeEditingId !== 0 && !password) return true;

    const num = /\d/;
    const lowercase = /[a-z]/;
    const uppercase = /[A-Z]/;
    const specialChar = /[!@#$%^&*(),.?":{}|<>]/;
    const charLength = /^.{8,20}$/;

    if (!charLength.test(password)) return "Entre 8 y 20 caracteres";
    if (!lowercase.test(password)) return "Debe contener minúsculas";
    if (!uppercase.test(password)) return "Debe contener mayúsculas";
    if (!num.test(password)) return "Debe contener números";
    if (!specialChar.test(password)) return "Debe contener caracteres especiales";

    return true;
  };

  return (
    <div className="space-y-5 w-full px-1 sm:px-2">
      
      <div>
        <label className="text-sm uppercase font-bold">Rol</label>
        <select
          className="w-full p-3 border border-gray-200 rounded-md mt-1"
          defaultValue=""
          {...register("idRole", {
            required: "El rol es obligatorio",
            validate: (v) => Number(v) !== 0 || "Debe seleccionar un rol",
          })}
        >
          <option value={0}>Seleccione un rol</option>
          {roles.map((role) => (
            <option key={role.idRole} value={role.idRole}>
              {role.name}
            </option>
          ))}
        </select>
        {errors.idRole && <ErrorForm>{errors.idRole.message?.toString()}</ErrorForm>}
      </div>

      <div>
        <label className="text-sm uppercase font-bold">Nombre de usuario</label>

        {!isSelfEditing && activeEditingId !== 0 && (
          <p className="text-xs text-gray-500 mb-1">
            Solo puedes editar tu propio nombre de usuario.
          </p>
        )}

        <input
          type="text"
          disabled={activeEditingId !== 0 && !isSelfEditing}
          className={`
            w-full p-3 rounded-md mt-1
            ${activeEditingId !== 0 && !isSelfEditing
              ? "bg-gray-100 border border-gray-300 cursor-not-allowed"
              : "border border-gray-200"}
          `}
          placeholder={
            activeEditingId !== 0 && !isSelfEditing
              ? "No editable"
              : "Ingrese el nombre de usuario"
          }
          {...register("username", {
            required: "El nombre de usuario es obligatorio",
            maxLength: {
              value: MAXLENGTH_USERNAME,
              message: `Máximo ${MAXLENGTH_USERNAME} caracteres`,
            },
          })}
        />
        {errors.username && <ErrorForm>{errors.username.message?.toString()}</ErrorForm>}
      </div>

      {(activeEditingId === 0 || isSelfEditing) && (
        <>
          <div>
            <label className="text-sm uppercase font-bold">Contraseña</label>
            <PasswordInput
              className="w-full p-3 border border-gray-200 rounded-md mt-1"
              {...register("password", {
                required: activeEditingId === 0 ? "La contraseña es obligatoria" : false,
                validate: validatePassword,
              })}
            />
            {errors.password && <ErrorForm>{errors.password.message?.toString()}</ErrorForm>}
          </div>

          <div>
            <label className="text-sm uppercase font-bold">Confirmar contraseña</label>
            <PasswordInput
              className="w-full p-3 border border-gray-200 rounded-md mt-1"
              {...register("confirmPassword", {
                validate: (value) => {
                  const pass = watch("password");
                  if ((activeEditingId === 0 || pass) && value !== pass) {
                    return "Las contraseñas no coinciden";
                  }
                  return true;
                },
              })}
            />
            {errors.confirmPassword && (
              <ErrorForm>{errors.confirmPassword.message?.toString()}</ErrorForm>
            )}
          </div>
        </>
      )}
    </div>
  );
};