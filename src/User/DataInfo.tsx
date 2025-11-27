import { formatDate } from "../shared/utils/format";
import useUserStore from "./Store";

function DataInfo() {
  const { users, activeEditingId } = useUserStore();

  // Si no hay usuario seleccionado
  if (!activeEditingId) {
    return (
      <section className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 min-h-[260px] flex items-center justify-center">
        <p className="text-gray-500 text-sm sm:text-base text-center">
          No hay un usuario seleccionado para mostrar.
        </p>
      </section>
    );
  }

  const activeEditingUser = users.find(
    (user) => user.idUser === activeEditingId
  );

  // Si no se encuentra el usuario
  if (!activeEditingUser) {
    return (
      <section className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 min-h-[260px] flex items-center justify-center">
        <p className="text-gray-500 text-sm sm:text-base text-center">
          No se encontró la información del usuario seleccionado.
        </p>
      </section>
    );
  }

  const fullName = `
    ${activeEditingUser.person.name} 
    ${activeEditingUser.person.firstLastName} 
    ${activeEditingUser.person.secondLastName}
  `.trim();

  return (
    <section
      className="
        w-full max-w-4xl mx-auto
        px-4 sm:px-6 py-6
        min-h-[260px]
        flex flex-col gap-8
      "
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">

        <div className="flex flex-col gap-3">
          <h1 className="text-yellow font-black text-2xl uppercase underline">
            Persona
          </h1>

          <div className="flex flex-col text-sm sm:text-base">
            <p className="font-semibold uppercase text-gray-600 text-xs">Cédula</p>
            <p className="break-words">
              {activeEditingUser.person.identificationNumber}
            </p>
          </div>

          <div className="flex flex-col text-sm sm:text-base">
            <p className="font-semibold uppercase text-gray-600 text-xs">Nombre</p>
            <p className="break-words">{fullName}</p>
          </div>

          <div className="flex flex-col text-sm sm:text-base">
            <p className="font-semibold uppercase text-gray-600 text-xs">Género</p>
            <p>{activeEditingUser.person.gender.name}</p>
          </div>

          <div className="flex flex-col text-sm sm:text-base">
            <p className="font-semibold uppercase text-gray-600 text-xs">
              Fecha de Nacimiento
            </p>
            <p>{formatDate(new Date(activeEditingUser.person.birthday))}</p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <h1 className="text-yellow font-black text-2xl uppercase underline">
            Contacto
          </h1>

          <div className="flex flex-col text-sm sm:text-base">
            <p className="font-semibold uppercase text-gray-600 text-xs">Teléfono</p>
            <p>{activeEditingUser.person.phoneNumber}</p>
          </div>

          <div className="flex flex-col text-sm sm:text-base">
            <p className="font-semibold uppercase text-gray-600 text-xs">Email</p>
            <p className="break-words">{activeEditingUser.person.email}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <h1 className="text-yellow font-black text-2xl uppercase underline">
          Usuario
        </h1>

        <div className="flex flex-col text-sm sm:text-base">
          <p className="font-semibold uppercase text-gray-600 text-xs">Rol</p>
          <p>{activeEditingUser.role.name}</p>
        </div>

        <div className="flex flex-col text-sm sm:text-base">
          <p className="font-semibold uppercase text-gray-600 text-xs">
            Nombre de Usuario
          </p>
          <p className="break-words">{activeEditingUser.username}</p>
        </div>
      </div>
    </section>
  );
}

export default DataInfo;