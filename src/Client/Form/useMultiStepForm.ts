import { useForm } from "react-hook-form";
import Swal from 'sweetalert2';
import { useMemo } from "react";
import { useNavigate } from "react-router";
import { ClientDataForm } from "../../shared/types";
import { getAuthUser, setAuthHeader, setAuthUser } from "../../shared/utils/authentication";
import useClientStore from "../Store";
import { useCommonDataStore } from "../../shared/CommonDataStore";
import { useClientForm } from "./Context";

export const useMultiStepForm = () => {
  const navigate = useNavigate();
  const { genders, clientTypes } = useCommonDataStore();
  const { clients, activeEditingId, fetchClients, addClient, updateClient, closeModalForm } = useClientStore();
  const { step, nextStep, prevStep, setCustomStep, resetForm } = useClientForm();

  const getDefaultValues = (): ClientDataForm => ({
    idClient: 0,
    idUser: 0,
    idClientType: 0,
    registrationDate: new Date(),
    expirationMembershipDate: null as any, // null hasta que se active una membresía
    phoneNumberContactEmergency: '',
    nameEmergencyContact: '',
    signatureImage: '',
    isDeleted: 0,
    idHealthQuestionnaire: 0,
    diabetes: false,
    hypertension: false,
    muscleInjuries: false,
    boneJointIssues: false,
    balanceLoss: false,
    cardiovascularDisease: false,
    breathingIssues: false,
    idPerson: 0,
    identificationNumber: '',
    name: '',
    firstLastName: '',
    secondLastName: '',
    birthday: new Date(),
    idGender: 0,
    email: '',
    phoneNumber: ''
  });

  const formatToYYYYMMDD = (date: Date | string): string => {
    if (!date) return '';
  
    // Si ya es un string en formato YYYY-MM-DD, devolverlo directamente
    if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}/.test(date)) {
      return date.split('T')[0]; // Toma solo la parte de la fecha si viene con tiempo
    }
    
    // Si es un Date u otro string, parsearlo correctamente
    const d = typeof date === 'string' ? new Date(date) : date;
    
    // Usar getUTCFullYear, getUTCMonth, getUTCDate para evitar problemas de zona horaria
    const year = d.getUTCFullYear();
    const month = (`0${d.getUTCMonth() + 1}`).slice(-2);
    const day = (`0${d.getUTCDate()}`).slice(-2);
    return `${year}-${month}-${day}`;
  };
  
  const getEditingValues = (): ClientDataForm => {
    if (!activeEditingId) return getDefaultValues();
    
    const activeClient = clients.find(client => client.idClient === activeEditingId);
    if (!activeClient) return getDefaultValues();

    return {
      idClient: activeClient.idClient,
      idUser: activeClient.user.idUser,
      idClientType: activeClient.clientType.idClientType,
      registrationDate: formatToYYYYMMDD(activeClient.registrationDate),
      expirationMembershipDate: formatToYYYYMMDD(activeClient.expirationMembershipDate),
      phoneNumberContactEmergency: activeClient.phoneNumberContactEmergency,
      nameEmergencyContact: activeClient.nameEmergencyContact,
      signatureImage: activeClient.signatureImage,
      isDeleted: activeClient.isDeleted,
      idHealthQuestionnaire: activeClient.healthQuestionnaire.idHealthQuestionnaire,
      diabetes: activeClient.healthQuestionnaire.diabetes,
      hypertension: activeClient.healthQuestionnaire.hypertension,
      muscleInjuries: activeClient.healthQuestionnaire.muscleInjuries,
      boneJointIssues: activeClient.healthQuestionnaire.boneJointIssues,
      balanceLoss: activeClient.healthQuestionnaire.balanceLoss,
      cardiovascularDisease: activeClient.healthQuestionnaire.cardiovascularDisease,
      breathingIssues: activeClient.healthQuestionnaire.breathingIssues,
      idPerson: activeClient.person.idPerson,
      identificationNumber: activeClient.person.identificationNumber,
      name: activeClient.person.name,
      firstLastName: activeClient.person.firstLastName,
      secondLastName: activeClient.person.secondLastName,
      birthday: formatToYYYYMMDD(activeClient.person.birthday),
      idGender: activeClient.person.gender.idGender,
      email: activeClient.person.email,
      phoneNumber: activeClient.person.phoneNumber
    };
  };

  const defaultValues = useMemo(getEditingValues, [activeEditingId, clients]);

  const methods = useForm<ClientDataForm>({
    defaultValues,
    mode: 'onChange',
    reValidateMode: 'onChange',
    shouldFocusError: true,
    shouldUnregister: false
  });

  const submitForm = async (data: ClientDataForm) => {
    let action = '', result;
    const loggedUser = getAuthUser();

    // Función para convertir fecha a formato ISO con hora al mediodía
    const dateToISO = (dateValue: string | Date): string => {
      if (!dateValue) return '';
      
      if (typeof dateValue === 'string') {
        // Si es string YYYY-MM-DD, agregar hora del mediodía
        if (/^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
          return `${dateValue}T12:00:00`;
        }
        // Si ya tiene hora, devolverlo tal cual
        return dateValue;
      }
      
      // Si es Date, convertir a ISO
      return dateValue.toISOString();
    };

    const reqClient: ClientDataForm & { paramLoggedIdUser?: number } = {
      ...data,
      nameEmergencyContact: data.nameEmergencyContact?.trim() || 'no hay',
      phoneNumberContactEmergency: data.phoneNumberContactEmergency?.trim() || '00000000',
      registrationDate: dateToISO(data.registrationDate),
      // Solo enviar expirationMembershipDate si se está editando un cliente existente
      // Al crear nuevo cliente (activeEditingId === 0), no enviar el campo para que sea NULL en BD
      ...(activeEditingId !== 0 && { expirationMembershipDate: dateToISO(data.expirationMembershipDate) }),
      birthday: dateToISO(data.birthday),
      idUser: loggedUser?.idUser || 1,
      paramLoggedIdUser: loggedUser?.idUser
    };

    if (activeEditingId === 0) {
      result = await addClient(reqClient);
      action = 'agregado';
    } else {
      result = await updateClient(reqClient);
      action = 'editado';
    }

    if (result.ok) {
      const result2 = await fetchClients();
      if (result2.logout) {
        setAuthHeader(null);
        setAuthUser(null);
        navigate('/login', { replace: true });

      } else {
        handleClose();
        
        await Swal.fire({
          title: `Cliente ${action}`,
          text: `Se ha ${action} el cliente`,
          icon: 'success',
          confirmButtonText: 'OK',
          timer: 3000,
          timerProgressBar: true,
          width: 500,
          confirmButtonColor: '#CFAD04'
        });
      }
    } else if (result.logout) {
      setAuthHeader(null);
      setAuthUser(null);
      navigate('/login');
    } else {
      await Swal.fire({
        title: 'Error al guardar',
        text: result.error || result.message || 'Ocurrió un error inesperado al guardar el cliente.',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#CFAD04',
        width: 500,
        allowOutsideClick: false,
        allowEscapeKey: false,
        backdrop: true,
        customClass: {
          container: 'swal-high-zindex'
        },
        didOpen: () => {
          const container = Swal.getContainer();
          if (container) {
            container.style.zIndex = '99999';
          }
          const backdrop = document.querySelector('.swal2-container') as HTMLElement;
          if (backdrop) {
            backdrop.style.zIndex = '99999';
          }
        }
      });
  }
  };

  const handleClose = () => {
    methods.reset();
    resetForm();
    closeModalForm();
  };

  type FormField =
    | "idClient" | "idUser" | "idClientType" | "registrationDate"
    | "phoneNumberContactEmergency" | "nameEmergencyContact" | "signatureImage" | "isDeleted"
    | "idHealthQuestionnaire" | "diabetes" | "hypertension" | "muscleInjuries"
    | "boneJointIssues" | "balanceLoss" | "cardiovascularDisease" | "breathingIssues"
    | "idPerson" | "identificationNumber" | "name" | "firstLastName" | "secondLastName"
    | "birthday" | "idGender" | "email" | "phoneNumber";

  interface StepFields {
    step: number;
    fields: FormField[];
  }

  const inputsByStep: StepFields[] = [
    { step: 1, fields: ['signatureImage']},
    { step: 2, fields: ['idClientType', 'identificationNumber', 'name', 'firstLastName', 'secondLastName', 'birthday', 'idGender'] },
    { step: 3, fields: ['phoneNumber', 'email', 'registrationDate', 'nameEmergencyContact', 'phoneNumberContactEmergency'] },
    { step: 4, fields: ['diabetes', 'hypertension', 'muscleInjuries', 'boneJointIssues', 'balanceLoss', 'cardiovascularDisease', 'breathingIssues'] }
  ];

  const validateStepChange = async () => {
    const current = inputsByStep.find(item => item.step === step);
    if (!current) return false;
    if (methods.formState.isValid) return true;
    return await methods.trigger(current.fields);
  };

  const handleStepChangeByMenu = async (toStep: number) => {
    if (toStep > step) {
      if (await validateStepChange()) {
        setCustomStep(toStep);
      }
    } else {
      setCustomStep(toStep);
    }
  };

  const handleStepChangeByButton = async (stepChange: () => void) => {
    if (await validateStepChange()) {
      stepChange();
    }
  };

  return {
    methods,
    step,
    genders,
    clientTypes,
    activeEditingId,
    submitForm,
    handleClose,
    prevStep,
    nextStep,
    handleStepChangeByMenu,
    handleStepChangeByButton
  };
};
