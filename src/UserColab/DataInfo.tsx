import { formatDate } from "../shared/utils/format";
import useUserStore from "./Store";

function DataInfo() {
  const { currentUser } = useUserStore();
  if (!currentUser) return <></>;

  const activeEditingUser = currentUser;
  if (!activeEditingUser) return <></>;

  return (
    <section
      className="
        w-full max-w-5xl mx-auto
        px-4 sm:px-6 py-6
        grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3
        gap-8
      "
    >
      <div className="flex flex-col gap-3">
        <h1 className="text-yellow font-black text-xl sm:text-2xl uppercase underline">
          Persona
        </h1>

        <div className="flex flex-col text-sm sm:text-base">
          <p className="font-semibold uppercase text-gray-600 text-xs">
            Cédula
          </p>
          <p>{activeEditingUser.person.identificationNumber}</p>
        </div>

        <div className="flex flex-col text-sm sm:text-base">
          <p className="font-semibold uppercase text-gray-600 text-xs">
            Nombre completo
          </p>
          <p>
            {activeEditingUser.person.name}{" "}
            {activeEditingUser.person.firstLastName}{" "}
            {activeEditingUser.person.secondLastName}
          </p>
        </div>

        <div className="flex flex-col text-sm sm:text-base">
          <p className="font-semibold uppercase text-gray-600 text-xs">
            Género
          </p>
          <p>{activeEditingUser.person.gender.name}</p>
        </div>

        <div className="flex flex-col text-sm sm:text-base">
          <p className="font-semibold uppercase text-gray-600 text-xs">
            Fecha de nacimiento
          </p>
          <p>
            {formatDate(new Date(activeEditingUser.person.birthday))}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <h1 className="text-yellow font-black text-xl sm:text-2xl uppercase underline">
          Contacto
        </h1>

        <div className="flex flex-col text-sm sm:text-base">
          <p className="font-semibold uppercase text-gray-600 text-xs">
            Teléfono
          </p>
          <p>{activeEditingUser.person.phoneNumber}</p>
        </div>

        <div className="flex flex-col text-sm sm:text-base">
          <p className="font-semibold uppercase text-gray-600 text-xs">
            Email
          </p>
          <p className="break-words">
            {activeEditingUser.person.email}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <h1 className="text-yellow font-black text-xl sm:text-2xl uppercase underline">
          Usuario
        </h1>

        <div className="flex flex-col text-sm sm:text-base">
          <p className="font-semibold uppercase text-gray-600 text-xs">
            Rol
          </p>
          <p>{activeEditingUser.role.name}</p>
        </div>

        <div className="flex flex-col text-sm sm:text-base">
          <p className="font-semibold uppercase text-gray-600 text-xs">
            Nombre de usuario
          </p>
          <p>{activeEditingUser.username}</p>
        </div>
      </div>
    </section>
  );
}

export default DataInfo;