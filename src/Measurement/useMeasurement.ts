import { FormEvent } from "react";
import Swal from "sweetalert2";
import { Measurement, MeasurementDataForm } from "../shared/types";
import {
  getAuthUser,
  setAuthHeader,
  setAuthUser,
} from "../shared/utils/authentication";
import useMeasurementStore from "./Store";
import { useNavigate } from "react-router";
import { formatDateFromString } from "../shared/utils/format";

export const useMeasurement = () => {
  const navigate = useNavigate();

  const {
    measurements,
    fetchMeasurements,
    deleteMeasurement,
    updateMeasurement,
    changeSearchTerm,
    changeOrderBy,
    changeDirectionOrderBy,
    directionOrderBy,
  } = useMeasurementStore();

  const handleDelete = async (measurement: Measurement) => {
    await Swal.fire({
      title: "¿Desea eliminar esta medición?",
      text: `Está eliminando la medición del ${formatDateFromString(
        measurement.measurementDate
      )}`,

      icon: "question",
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      cancelButtonColor: "#bebdbd",
      confirmButtonText: "Eliminar",
      confirmButtonColor: "#CFAD04",
      width: 500,
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        const loggedUser = getAuthUser();
        const response = await deleteMeasurement(
          measurement.idMeasurement,
          loggedUser?.idUser as number
        );

        if (response.ok) {
          Swal.fire({
            title: "Medición eliminada",
            text: `Se ha eliminado la medición del ${formatDateFromString(
              measurement.measurementDate
            )}`,

            icon: "success",
            confirmButtonText: "OK",
            timer: 3000,
            timerProgressBar: true,
            width: 500,
            confirmButtonColor: "#CFAD04",
          });
          fetchMeasurements();
        }

        if (response.logout) {
          setAuthHeader(null);
          setAuthUser(null);
          navigate("/login", { replace: true });
        }
      }
    });
  };

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const { searchTerm } = Object.fromEntries(new FormData(form));
    changeSearchTerm(searchTerm.toString());
  };

  const handleOrderByChange = (orderByTerm: string) => {
    changeOrderBy(orderByTerm);
    changeDirectionOrderBy(directionOrderBy === "DESC" ? "ASC" : "DESC");
  };

  const handleRestore = async (measurement: MeasurementDataForm) => {
    const loggedUser = getAuthUser();

    const reqMeasurement = {
      ...measurement,
      isDeleted: 0,
      paramLoggedIdUser: loggedUser?.idUser,
    };

    await Swal.fire({
      title: "¿Desea restaurar esta medición?",
      text: `Está restaurando la medición del ${formatDateFromString(
        measurement.measurementDate
      )}`,

      icon: "question",
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      cancelButtonColor: "#bebdbd",
      confirmButtonText: "Restaurar",
      confirmButtonColor: "#CFAD04",
      width: 500,
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await updateMeasurement(reqMeasurement);

        if (response.ok) {
          Swal.fire({
            title: "Medición restaurada",
            text: `Se ha restaurado la medición del ${formatDateFromString(
              measurement.measurementDate
            )}`,

            icon: "success",
            confirmButtonText: "OK",
            timer: 3000,
            timerProgressBar: true,
            width: 500,
            confirmButtonColor: "#CFAD04",
          });
          fetchMeasurements();
        }

        if (response.logout) {
          setAuthHeader(null);
          setAuthUser(null);
          navigate("/login", { replace: true });
        }
      }
    });
  };

  const calculateAge = (birthDate: Date | string): number => {
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }

    return age;
  };


  const clientData =
    measurements.length > 0
      ? {
          name: `${measurements[0].client.person.name} ${measurements[0].client.person.firstLastName}`,
          age: calculateAge(measurements[0].client.person.birthday),
          height: measurements[0].height,
        }
      : undefined;


  const tableColumn = [
    "Fecha",
    // Medidas Básicas y Composición
    "Peso (kg)",
    "Altura (cm)",
    "IMC",
    "Masa Musc. (%)",
    "Grasa Corp. (%)",
    "Grasa Visc. (%)",
    // Medidas del Torso
    "Pecho (cm)",
    "Espalda (cm)",
    "Cintura (cm)",
    "Cadera (cm)",
    // Brazos
    "Brazo Der. (cm)",
    "Brazo Izq. (cm)",
    "Antebrazo Der. (cm)",
    "Antebrazo Izq. (cm)",
    // Piernas
    "Pierna Der. (cm)",
    "Pierna Izq. (cm)",
    "Pantorrilla Der. (cm)",
    "Pantorrilla Izq. (cm)",
  ];

  const orderedMeasurements = [...measurements].sort(
    (a, b) => {
      // Comparar fechas como strings YYYY-MM-DD sin convertir a Date para evitar problemas de zona horaria
      const dateA = String(a.measurementDate).split('T')[0];
      const dateB = String(b.measurementDate).split('T')[0];
      return dateB.localeCompare(dateA); // Orden descendente (más reciente primero)
    }
  );



    const tableRows = orderedMeasurements.map((measurement) => {
    return [
        formatDateFromString(measurement.measurementDate),
        // Medidas Básicas y Composición
        measurement.weight.toFixed(1),
        measurement.height.toFixed(1),
        measurement.bmi.toFixed(1),
        measurement.muscleMass.toFixed(1),
        measurement.bodyFatPercentage.toFixed(1),
        measurement.visceralFatPercentage.toFixed(1),
        // Medidas del Torso
        measurement.chestSize || "0",
        measurement.backSize || "0",
        measurement.waistSize || "0",
        measurement.hipSize || "0",
        // Brazos
        measurement.rightArmSize || "0",
        measurement.leftArmSize || "0",
        measurement.rightForeArmSize || "0",
        measurement.leftForeArmSize || "0",
        // Piernas
        measurement.rightLegSize || "0",
        measurement.leftLegSize || "0",
        measurement.rightCalfSize || "0",
        measurement.leftCalfSize || "0",
    ];
    });

  return {
    handleDelete,
    handleSearch,
    handleOrderByChange,
    handleRestore,
    tableColumn,
    tableRows,
    clientData,
  };
};