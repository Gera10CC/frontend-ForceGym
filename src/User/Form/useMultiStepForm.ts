import { useForm } from "react-hook-form";
import Swal from 'sweetalert2';
import { useMemo } from "react";
import { useNavigate } from "react-router";
import { UserDataForm } from "../../shared/types";
import { getAuthUser, setAuthHeader, setAuthUser } from "../../shared/utils/authentication";
import useUserStore from "../Store";
import { useCommonDataStore } from "../../shared/CommonDataStore";
import { useUserForm } from "./Context";

export const useMultiStepForm = () => {
  const navigate = useNavigate();
  const { roles, genders } = useCommonDataStore();
  const { users, activeEditingId, fetchUsers, addUser, updateUser, closeModalForm } = useUserStore();
  const { step, nextStep, prevStep, setCustomStep, resetForm } = useUserForm();

  const getDefaultValues = (): UserDataForm => ({
    idUser: 0,
    idRole: 0,
    idGender: 0,
    idPerson: 0,
    identificationNumber: '',
    name: '',
    firstLastName: '',
    secondLastName: '',
    phoneNumber: '',
    birthday: new Date(),
    email: '',
    username: '',
    password: '',
    isDeleted: 0,
    confirmPassword: ''
  });

  const getEditingValues = (): UserDataForm => {
    if (!activeEditingId) return getDefaultValues();
    
    const activeEditingUser = users.find(user => user.idUser === activeEditingId);
    if (!activeEditingUser) return getDefaultValues();

    return {
      idUser: activeEditingUser.idUser,
      idRole: activeEditingUser.role.idRole,
      idGender: activeEditingUser.person.gender.idGender,
      idPerson: activeEditingUser.person.idPerson,
      identificationNumber: activeEditingUser.person.identificationNumber,
      name: activeEditingUser.person.name,
      firstLastName: activeEditingUser.person.firstLastName,
      secondLastName: activeEditingUser.person.secondLastName,
      phoneNumber: activeEditingUser.person.phoneNumber,
      birthday: activeEditingUser.person.birthday,
      email: activeEditingUser.person.email,
      username: activeEditingUser.username,
      password: '',
      isDeleted: Number(activeEditingUser.isDeleted),
      confirmPassword: ''
    };
  };

  const defaultValues = useMemo(getEditingValues, [activeEditingId, users]);
  const methods = useForm<UserDataForm>({ 
    defaultValues,
    mode: 'onChange',
    reValidateMode: 'onChange',
    shouldFocusError: true,
    shouldUnregister: false
  });

  const submitForm = async (data: UserDataForm) => {
    let action = '', result;
    const loggedUser = getAuthUser();
    
    const isSelfEditing = activeEditingId !== 0 && loggedUser?.idUser === data.idUser;
    const reqUser: UserDataForm & { paramLoggedIdUser?: number } = {
      ...data,
      username: activeEditingId === 0 ? data.username : (isSelfEditing ? data.username : defaultValues.username),
      password: activeEditingId === 0 ? data.password : (isSelfEditing ? data.password : ''),
      paramLoggedIdUser: loggedUser?.idUser
    };

    delete (reqUser as any).confirmPassword;

    if (activeEditingId === 0) {
      result = await addUser(reqUser);
      action = 'agregado';
    } else {
      result = await updateUser(reqUser);
      action = 'editado';
    }
    
    if (result.ok) {
      const result2 = await fetchUsers();
      if (result2.logout) {
        setAuthHeader(null);
        setAuthUser(null);
        navigate('/login', { replace: true });
        
      } else {
        handleClose();

        await Swal.fire({
          title: `Usuario ${action}`,
          text: `Ha ${action} al usuario ${reqUser.username}`,
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
        title: 'Error',
        text: result.error || result.message || 'Ocurrió un error al guardar el usuario',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#CFAD04'
      });
    }
  };

  const handleClose = () => {
    methods.reset();
    resetForm();
    closeModalForm();
  };

  type FormField = 
    | "idUser" | "username" | "isDeleted" | "idRole" | "idPerson" 
    | "name" | "firstLastName" | "secondLastName" | "birthday" 
    | "identificationNumber" | "email" | "phoneNumber" 
    | "confirmPassword" | "idGender" | "password";

  interface StepFields {
    step: number;
    fields: FormField[];
  }

  const inputsByStep: StepFields[] = [
    {step: 1, fields: ['identificationNumber', 'name', 'firstLastName', 'secondLastName', 'birthday', 'idGender']},
    {step: 2, fields: ['phoneNumber', 'email']},
    {step: 3, fields: ['idRole', 'username', 'password', 'confirmPassword']}
  ];

  const validateStepChange = async () => {
    try {
      const matchingItem = inputsByStep.find(item => item.step === step);
      if (!matchingItem) {
        return false; 
      }
      
      if (methods.formState.isValid) return true;
      
      return await methods.trigger(matchingItem.fields);
    } catch (error) {
      console.error('Validation failed:', error);
      return false;
    }
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
    roles,
    genders,
    activeEditingId,
    submitForm,
    handleClose,
    prevStep,
    nextStep,
    handleStepChangeByMenu,
    handleStepChangeByButton
  };
};