import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { Download, FileText, Calendar, Dumbbell, ArrowLeft } from "lucide-react";
import Swal from "sweetalert2";

import { getData } from "../shared/services/gym";
import { setAuthHeader, setAuthUser } from "../shared/utils/authentication";
import { useCommonDataStore } from "../shared/CommonDataStore";
import NoData from "../shared/components/NoData";
import { formatDate } from "../shared/utils/format";
import { exportToPDFRutinas } from "../shared/utils/pdfRutinas";

interface AssignedRoutine {
  idRoutineAssignment: number;
  assignmentDate: string;
  routine: {
    idRoutine: number;
    name: string;
    date: string;
    difficultyRoutine: {
      idDifficultyRoutine: number;
      name: string;
    };
    routineExercises: Array<{
      idExercise: number;
      series: number;
      repetitions: number;
      note: string;
      exercise: {
        idExercise: number;
        name: string;
        exerciseCategory: {
          name: string;
        };
      };
    }>;
  };
}

interface ClientInfo {
  idClient: number;
  person: {
    name: string;
    firstLastName: string;
    secondLastName: string;
    identificationNumber: string;
  };
}

export default function AssignedRoutines() {
  const location = useLocation();
  const navigate = useNavigate();
  const { exercise: allExercises } = useCommonDataStore();
  const idClient = location.state?.idClient;

  const [assignedRoutines, setAssignedRoutines] = useState<AssignedRoutine[]>([]);
  const [clientInfo, setClientInfo] = useState<ClientInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!idClient) {
      Swal.fire({
        title: "Error",
        text: "No se especificó un cliente",
        icon: "warning",
        confirmButtonColor: "#CFAD04",
      }).then(() => {
        navigate("/gestion/clientes", { replace: true });
      });
      return;
    }
  }, [idClient, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      if (!idClient) return;

      setIsLoading(true);

      try {
        // Obtener todas las rutinas con sus asignaciones
        const routinesResult = await getData(
          `${import.meta.env.VITE_URL_API}routine/list`
        );

        if (routinesResult?.logout) {
          setAuthHeader(null);
          setAuthUser(null);
          navigate("/login", { replace: true });
          return;
        }

        if (routinesResult?.ok) {
          const allRoutines = routinesResult.data || [];
          
          // Filtrar rutinas que están asignadas a este cliente
          const clientRoutines: AssignedRoutine[] = [];
          
          allRoutines.forEach((routine: any) => {
            if (routine.assignments && Array.isArray(routine.assignments)) {
              routine.assignments.forEach((assignment: any) => {
                
                if (assignment.idClient === Number(idClient)) {
                  clientRoutines.push({
                    idRoutineAssignment: assignment.idRoutineAssignment || Math.random(),
                    assignmentDate: assignment.assignmentDate,
                    routine: {
                      idRoutine: routine.idRoutine,
                      name: routine.name,
                      date: routine.date,
                      difficultyRoutine: routine.difficultyRoutine,
                      routineExercises: routine.exercises || []
                    }
                  });
                }
              });
            }
          });
          
          setAssignedRoutines(clientRoutines);
          
          // Si no se encontró información del cliente en las asignaciones, buscar en la lista de todos los clientes
          if (!clientInfo) {
            const clientsResult = await getData(
              `${import.meta.env.VITE_URL_API}client/listAll`
            );
            
            if (clientsResult?.logout) {
              setAuthHeader(null);
              setAuthUser(null);
              navigate("/login", { replace: true });
              return;
            }
            
            if (clientsResult?.ok && Array.isArray(clientsResult.data)) {
              const foundClient = clientsResult.data.find((c: any) => c.value === Number(idClient));
              if (foundClient) {
                // Construir la estructura de cliente esperada
                const [name, ...lastNames] = foundClient.label.split(' ');
                setClientInfo({
                  idClient: foundClient.value,
                  person: {
                    name: name,
                    firstLastName: lastNames[0] || '',
                    secondLastName: lastNames[1] || '',
                    identificationNumber: 'N/A'
                  }
                });
              }
            }
          }
        }
      } catch (error) {
        console.error("Error al obtener rutinas asignadas:", error);
        await Swal.fire({
          title: "Error",
          text: "No se pudieron cargar las rutinas asignadas",
          icon: "error",
          confirmButtonColor: "#CFAD04",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [idClient, navigate]);

  const handleExportRoutine = async (routineAssignment: AssignedRoutine) => {
    try {
      const routine = routineAssignment.routine;

      const exerciseHeaders = [
        "Paso",
        "Ejercicio",
        "Grupo Muscular",
        "Series",
        "Repeticiones",
        "Indicaciones",
      ];

      let stepCounter = 1;
      const exerciseRows = routine.routineExercises?.map((re) => {
        const exerciseInfo = allExercises.find(e => e.idExercise === re.idExercise);
        
        return [
          `Paso ${stepCounter++}`,
          exerciseInfo?.name || `Ejercicio #${re.idExercise}`,
          exerciseInfo?.exerciseCategory?.name || "N/A",
          `${re.series}`,
          `${re.repetitions}`,
          re.note || "Sin indicaciones",
        ];
      }) || [];

      const clientName = clientInfo
        ? `${clientInfo.person.name} ${clientInfo.person.firstLastName} ${clientInfo.person.secondLastName}`
        : "Cliente";

      const routineTitle = `Rutina: ${routine.name} - Cliente: ${clientName}`;

      exportToPDFRutinas(
        routineTitle,
        exerciseHeaders,
        exerciseRows
      );

      await Swal.fire({
        title: "Exportado exitosamente",
        text: `La rutina "${routine.name}" se ha descargado en PDF`,
        icon: "success",
        confirmButtonText: "OK",
        timer: 3000,
        timerProgressBar: true,
        confirmButtonColor: "#CFAD04",
      });
    } catch (error) {
      console.error("Error al exportar rutina:", error);
      await Swal.fire({
        title: "Error",
        text: "No se pudo exportar la rutina",
        icon: "error",
        confirmButtonColor: "#CFAD04",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-yellow mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando rutinas asignadas...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <header className="flex flex-col md:flex-row items-center justify-between bg-yellow text-black px-4 py-4 rounded-md shadow-md">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl uppercase tracking-wide">
              Rutinas Asignadas
            </h1>
            {clientInfo && (
              <p className="text-sm md:text-base mt-1">
                Cliente: {clientInfo.person.name}{" "}
                {clientInfo.person.firstLastName}{" "}
                {clientInfo.person.secondLastName}{" "}
              </p>
            )}
          </div>
        </div>
      </header>

      <main className="mt-6">
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
          {assignedRoutines.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {assignedRoutines.map((assignment) => (
                <div
                  key={assignment.idRoutineAssignment}
                  className="border rounded-lg p-4 hover:shadow-lg transition-shadow bg-gray-50"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <Dumbbell className="text-yellow" size={24} />
                      <h3 className="text-xl font-bold text-gray-800">
                        {assignment.routine.name}
                      </h3>
                    </div>
                    <button
                      onClick={() => handleExportRoutine(assignment)}
                      className="p-2 bg-yellow hover:bg-yellow-600 rounded-full transition"
                      title="Descargar en PDF"
                    >
                      <Download size={18} />
                    </button>
                  </div>

                  <div className="space-y-2 text-sm text-gray-700">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-gray-500" />
                      <span>
                        <strong>Asignada:</strong>{" "}
                        {formatDate(new Date(assignment.assignmentDate))}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <FileText size={16} className="text-gray-500" />
                      <span>
                        <strong>Creada:</strong>{" "}
                        {formatDate(new Date(assignment.routine.date))}
                      </span>
                    </div>

                    <div className="mt-2 pt-2 border-t">
                      <span className="inline-block px-3 py-1 bg-yellow rounded-full text-xs font-semibold">
                        {assignment.routine.difficultyRoutine.name}
                      </span>
                    </div>

                    <div className="mt-3">
                      <p className="text-xs text-gray-600 mb-1">
                        <strong>Ejercicios:</strong>{" "}
                        {assignment.routine.routineExercises.length}
                      </p>
                      <div className="max-h-32 overflow-y-auto space-y-1">
                        {assignment.routine.routineExercises.map((re, idx) => {
                          const exerciseInfo = allExercises.find(e => e.idExercise === re.idExercise);
                          return (
                            <div
                              key={idx}
                              className="text-xs bg-white p-2 rounded border"
                            >
                              <p className="font-semibold">
                                {idx + 1}. {exerciseInfo?.name || `Ejercicio #${re.idExercise}`}
                              </p>
                              <p className="text-gray-600">
                                {re.series} series × {re.repetitions} reps
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <NoData module="rutinas asignadas para este cliente" />
          )}
        </div>
      </main>
    </>
  );
}
