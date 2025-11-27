import { useCallback } from "react";
import { formatDate, formatNullable } from "../shared/utils/format";
import useClientStore from "./Store";
import { CiCircleCheck } from "react-icons/ci";
import { MdOutlineCancel } from "react-icons/md";

function DataInfo() {
  const { clients, activeEditingId } = useClientStore();

  const client = clients.find((c) => c.idClient === activeEditingId);

  if (!activeEditingId || !client) {
    return (
      <section className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 min-h-[260px] flex items-center justify-center">
        <p className="text-gray-500 text-sm sm:text-base text-center">
          No hay información del cliente seleccionada.
        </p>
      </section>
    );
  }

  const getValidSignature = useCallback(() => {
    if (!client?.signatureImage) return null;

    try {
      if (client.signatureImage.startsWith("data:image/png;base64,")) {
        return client.signatureImage;
      }

      if (/^[A-Za-z0-9+/=]+$/.test(client.signatureImage)) {
        return `data:image/png;base64,${client.signatureImage}`;
      }

      const decoded = decodeURIComponent(client.signatureImage);
      if (decoded.startsWith("data:image")) return decoded;

      return null;
    } catch {
      return null;
    }
  }, [client]);

  const validSignature = getValidSignature();

  const BoolItem = ({ value }: { value: boolean }) => (
    <span className="flex items-center gap-2">
      {value ? (
        <>
          <CiCircleCheck className="text-green-400" /> Sí
        </>
      ) : (
        <>
          <MdOutlineCancel className="text-red-400" /> No
        </>
      )}
    </span>
  );

  return (
    <section
      className="
        w-full max-w-5xl mx-auto
        px-4 sm:px-6 py-6
        flex flex-col gap-10
      "
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-10">

        <div className="flex flex-col gap-3">
          <h1 className="text-yellow font-black text-xl sm:text-2xl uppercase underline">Persona</h1>

          <div className="flex flex-col text-xs sm:text-sm md:text-base">
            <p className="font-semibold uppercase text-gray-600 text-xs">Cédula</p>
            <p>{client.person.identificationNumber}</p>
          </div>

          <div className="flex flex-col text-xs sm:text-sm md:text-base">
            <p className="font-semibold uppercase text-gray-600 text-xs">Nombre</p>
            <p className="break-words">
              {client.person.name} {client.person.firstLastName} {client.person.secondLastName}
            </p>
          </div>

          <div className="flex flex-col text-xs sm:text-sm md:text-base">
            <p className="font-semibold uppercase text-gray-600 text-xs">Género</p>
            <p>{client.person.gender.name}</p>
          </div>

          <div className="flex flex-col text-xs sm:text-sm md:text-base">
            <p className="font-semibold uppercase text-gray-600 text-xs">Fecha de nacimiento</p>
            <p>{formatDate(new Date(client.person.birthday))}</p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <h1 className="text-yellow font-black text-xl sm:text-2xl uppercase underline">Contacto</h1>

          <div className="flex flex-col text-xs sm:text-sm md:text-base">
            <p className="font-semibold uppercase text-gray-600 text-xs">Teléfono</p>
            <p>{client.person.phoneNumber}</p>
          </div>

          <div className="flex flex-col text-xs sm:text-sm md:text-base">
            <p className="font-semibold uppercase text-gray-600 text-xs">
              Número de emergencia
            </p>
            <p>{formatNullable(client.phoneNumberContactEmergency)}</p>
          </div>

          <div className="flex flex-col text-xs sm:text-sm md:text-base">
            <p className="font-semibold uppercase text-gray-600 text-xs">
              Nombre Contacto Emergencia
            </p>
            <p>{formatNullable(client.nameEmergencyContact)}</p>
          </div>
        </div>


        <div className="flex flex-col gap-3">
          <h1 className="text-yellow font-black text-xl sm:text-2xl uppercase underline">Salud</h1>

          <div className="flex flex-col text-xs sm:text-sm md:text-base">
            <p className="font-semibold uppercase text-gray-600 text-xs">Diabetes</p>
            <BoolItem value={client.healthQuestionnaire.diabetes} />
          </div>

          <div className="flex flex-col text-xs sm:text-sm md:text-base">
            <p className="font-semibold uppercase text-gray-600 text-xs">Hipertensión</p>
            <BoolItem value={client.healthQuestionnaire.hypertension} />
          </div>

          <div className="flex flex-col text-xs sm:text-sm md:text-base">
            <p className="font-semibold uppercase text-gray-600 text-xs">Lesiones musculares</p>
            <BoolItem value={client.healthQuestionnaire.muscleInjuries} />
          </div>

          <div className="flex flex-col text-xs sm:text-sm md:text-base">
            <p className="font-semibold uppercase text-gray-600 text-xs">
              Problemas articulares
            </p>
            <BoolItem value={client.healthQuestionnaire.boneJointIssues} />
          </div>

          <div className="flex flex-col text-xs sm:text-sm md:text-base">
            <p className="font-semibold uppercase text-gray-600 text-xs">
              Pérdida de equilibrio
            </p>
            <BoolItem value={client.healthQuestionnaire.balanceLoss} />
          </div>

          <div className="flex flex-col text-xs sm:text-sm md:text-base">
            <p className="font-semibold uppercase text-gray-600 text-xs">
              Enfermedades cardiovasculares
            </p>
            <BoolItem value={client.healthQuestionnaire.cardiovascularDisease} />
          </div>

          <div className="flex flex-col text-xs sm:text-sm md:text-base">
            <p className="font-semibold uppercase text-gray-600 text-xs">
              Problemas para respirar
            </p>
            <BoolItem value={client.healthQuestionnaire.breathingIssues} />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <h1 className="text-yellow font-black text-xl sm:text-2xl uppercase underline">Tipo</h1>

          <div className="flex flex-col text-xs sm:text-sm md:text-base">
            <p className="font-semibold uppercase text-gray-600 text-xs">Nombre</p>
            <p>{client.clientType.name}</p>
          </div>

          <div className="flex flex-col text-xs sm:text-sm md:text-base">
            <p className="font-semibold uppercase text-gray-600 text-xs">Firma</p>

            {validSignature ? (
              <div className="border border-gray-300 p-2 rounded-md bg-white w-full max-w-[260px]">
                <img
                  src={validSignature}
                  alt="Firma del cliente"
                  className="w-full h-auto object-contain"
                />
              </div>
            ) : (
              <p className="text-gray-500">No hay firma registrada</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default DataInfo;