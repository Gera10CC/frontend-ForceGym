import { useForm } from "react-hook-form";
import Swal from 'sweetalert2';
import { ClientTypeDataForm } from "../shared/types";
import ErrorForm from "../shared/components/ErrorForm";
import useClientTypeStore from "./Store";
import { useEffect } from "react";
import { getAuthUser, setAuthHeader, setAuthUser } from "../shared/utils/authentication";
import { useNavigate } from "react-router";

function Form() {
    const navigate = useNavigate();
    
    const { 
        register, 
        handleSubmit, 
        setValue, 
        formState: { errors }, 
        reset 
    } = useForm<ClientTypeDataForm>();

    const { 
        clientTypes,
        activeEditingId, 
        fetchClientTypes, 
        addClientType, 
        updateClientType, 
        closeModalForm 
    } = useClientTypeStore();

    const submitForm = async (data: ClientTypeDataForm) => {
        let action = '', result;
        const loggedUser = getAuthUser();
        const reqUser = {
            ...data, 
            idUser: loggedUser?.idUser, 
            paramLoggedIdUser: loggedUser?.idUser
        };
        
        if (activeEditingId === 0) {
            result = await addClientType(reqUser);
            action = 'agregado';
        } else {
            result = await updateClientType(reqUser);
            action = 'editado';
        }
        closeModalForm();
        reset();

        if (result.ok) {
            const fetchResult = await fetchClientTypes();

            if (fetchResult.logout) {
                setAuthHeader(null);
                setAuthUser(null);
                navigate('/login', { replace: true });
            } else {
                await Swal.fire({
                    title: `Tipo de cliente ${action}`,
                    text: `Se ha ${action} el tipo de cliente`,
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
        }
    };
    useEffect(() => {
        if (activeEditingId) {
            const activeClientType = clientTypes.find(ct => ct.idClientType === activeEditingId);
            if (activeClientType) {
                setValue('idClientType', activeClientType.idClientType);
                setValue('name', activeClientType.name);
                setValue('isDeleted', activeClientType.isDeleted);
            }
        } else {
            reset({
                idClientType: 0,
                name: '',
                isDeleted: 0 
            });
        }
    }, [activeEditingId, clientTypes, setValue, reset]);

    return (
        <form 
            className="bg-white rounded-lg px-5 mb-10"
            noValidate
            onSubmit={handleSubmit(submitForm)}
        >
            <legend className="uppercase text-center text-yellow text-2xl font-black border-b-2 py-2 border-yellow">
                {activeEditingId ? 'Actualizar tipo de cliente' : 'Crear tipo de cliente'}
            </legend>

            <input  
                id="idClientType" 
                type="hidden" 
                {...register('idClientType')}
            />

            <input  
                id="isDeleted" 
                type="hidden" 
                {...register('isDeleted')}
            />

            <div className="mb-5">
                <label htmlFor="name" className="text-sm uppercase font-bold">
                    Nombre del Tipo de Cliente
                </label>
                <input  
                    id="name"
                    className="w-full p-3 border border-gray-100"  
                    type="text" 
                    placeholder="Ej: Cliente Premium, Cliente Regular" 
                    {...register('name', {
                        required: 'El nombre es obligatorio',
                        minLength: {
                            value: 3,
                            message: 'El nombre debe tener al menos 3 caracteres'
                        },
                        maxLength: {
                            value: 100,
                            message: 'El nombre no puede exceder los 100 caracteres'
                        }
                    })}
                />

                {errors.name && 
                    <ErrorForm>
                        {errors.name.message}
                    </ErrorForm>
                }
            </div>

            <input 
                type="submit" 
                className="bg-yellow w-full p-3 text-white uppercase font-bold hover:bg-amber-600 cursor-pointer transition-colors" 
                value={activeEditingId ? 'Actualizar' : 'Guardar'} 
            />
        </form> 
    );
}

export default Form;