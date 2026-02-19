import { useForm } from "react-hook-form";
import Swal from 'sweetalert2';
import ErrorForm from "../shared/components/ErrorForm";
import useActivityTypeStore from "./Store";
import { useEffect, useState } from "react";
import { getAuthUser, setAuthHeader, setAuthUser } from "../shared/utils/authentication";
import { useNavigate } from "react-router";
import { ActivityType } from "../shared/types";
import Select from 'react-select';
import { useCommonDataStore } from "../shared/CommonDataStore";

interface Fee {
  idClientType: number[];
  amount: number;
}

type ClientTypeOption = {
    value: number; 
    label: string;
};

function Form() {
    const navigate = useNavigate();
    const { clientTypes } = useCommonDataStore();
    const [feeLines, setFeeLines] = useState<{id: number, fee: Fee}[]>([{ 
        id: 1, 
        fee: { idClientType: [], amount: 0 } 
    }]);
    const [clientTypesOptions, setClientTypesOptions] = useState<ClientTypeOption[]>([]);
    
    const { 
        register, 
        handleSubmit, 
        formState: { errors }, 
        reset,
    } = useForm<ActivityType>({
        mode: 'onChange'
    });

    const { 
        activityTypes,
        activeEditingId, 
        fetchActivityTypes, 
        addActivityType, 
        updateActivityType, 
        closeModalForm 
    } = useActivityTypeStore();

    const submitForm = async (data: ActivityType) => {
        let action = '', result;
        const loggedUser = getAuthUser();
        
        // Preparar los fees en el formato correcto
        const fees = feeLines.map(line => ({
            idClientType: line.fee.idClientType,
            amount: line.fee.amount
        }));

        const reqUser = {
            ...data, 
            fees,
            idUser: loggedUser?.idUser, 
            paramLoggedIdUser: loggedUser?.idUser
        };
        
        if (activeEditingId === 0) {
            result = await addActivityType(reqUser);
            action = 'agregado';
        } else {
            result = await updateActivityType(reqUser);
            action = 'editado';
        }
        closeModalForm();
        reset();

        if (result.ok) {
            const fetchResult = await fetchActivityTypes();

            if (fetchResult.logout) {
                setAuthHeader(null);
                setAuthUser(null);
                navigate('/login', { replace: true });
            } else {
                await Swal.fire({
                    title: `Tipo de actividad ${action}`,
                    text: `Se ha ${action} el tipo de actividad`,
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
            const activeActivityType = activityTypes.find(ct => ct.idActivityType === activeEditingId);
            if (activeActivityType) {
                reset({
                    idActivityType: activeActivityType.idActivityType,
                    name: activeActivityType.name,
                    durationDays: activeActivityType.durationDays || 0,
                    isDeleted: activeActivityType.isDeleted
                });
                
                // Inicializar las líneas de tarifas si existen
                if (activeActivityType.fees && activeActivityType.fees.length > 0) {
                    const initialFeeLines = activeActivityType.fees.map((fee, index) => ({
                        id: index + 1,
                        fee: {
                            idClientType: fee.idClientType,
                            amount: fee.amount
                        }
                    }));
                    setFeeLines(initialFeeLines);
                }
            }
        } else {
            reset({
                idActivityType: 0,
                name: '',
                durationDays: 0,
                isDeleted: 0 
            });
            setFeeLines([{ id: 1, fee: { idClientType: [], amount: 0 } }]);
        }
    }, [activeEditingId, activityTypes, reset]);

    // Mapear tipos de cliente para opciones
    useEffect(() => {
        const getMappedClientTypes = () => {
            const mappedClientTypesOptions = clientTypes?.map((type) => ({
                value: type.idClientType,
                label: type.name
            })) || [];
            setClientTypesOptions(mappedClientTypesOptions);
        };

        getMappedClientTypes();
    }, [clientTypes]);

    // Obtener los tipos de clientes ya seleccionados en otras líneas
    const getAvailableClientTypes = (currentLineId: number): ClientTypeOption[] => {
        const selectedTypes = feeLines
          .filter(line => line.id !== currentLineId)
          .flatMap(line => line.fee.idClientType);
        
        return clientTypesOptions.filter(type => !selectedTypes.includes(type.value));
    };

    const addNewLine = () => {
        const newId = feeLines.length > 0 ? Math.max(...feeLines.map(line => line.id)) + 1 : 1;
        setFeeLines([...feeLines, { id: newId, fee: { idClientType: [], amount: 0 } }]);
    };

    const removeLine = (id: number) => {
        if (feeLines.length > 1) {
            setFeeLines(feeLines.filter(line => line.id !== id));
        }
    };

    const handleClientTypeChange = (id: number, selectedOptions: readonly ClientTypeOption[]) => {
        const selectedValues = selectedOptions?.map(option => option.value) || [];
        
        setFeeLines(feeLines.map(line => 
            line.id === id ? { 
                ...line, 
                fee: {
                    ...line.fee,
                    idClientType: selectedValues
                }
            } : line
        ));
    };

    const handleAmountChange = (id: number, value: string) => {
        const amountValue = value === '' ? 0 : parseInt(value);
        
        setFeeLines(feeLines.map(line => 
            line.id === id ? { 
                ...line, 
                fee: {
                    ...line.fee,
                    amount: amountValue
                }
            } : line
        ));
    };

    return (
        <form 
            className="bg-white rounded-lg px-5 mb-10"
            noValidate
            onSubmit={handleSubmit(submitForm)}
        >
            <legend className="uppercase text-center text-yellow text-2xl font-black border-b-2 py-2 border-yellow">
                {activeEditingId ? 'Actualizar tipo de actividad' : 'Crear tipo de actividad'}
            </legend>

            {/* Campos ocultos */}
            <input id="idActivityType" type="hidden" {...register('idActivityType')} />
            <input id="isDeleted" type="hidden" {...register('isDeleted')} />

            <div className="my-5">
                <label htmlFor="name" className="text-sm uppercase font-bold">
                    Nombre del Tipo de Actividad
                </label>
                <input  
                    id="name"
                    className="w-full p-3 border border-gray-100"  
                    type="text" 
                    placeholder="Ingrese el nombre de la actividad" 
                    {...register('name', {
                        required: 'El nombre es obligatorio',
                        minLength: {
                            value: 3,
                            message: 'El nombre debe tener al menos 3 carácteres'
                        },
                        maxLength: {
                            value: 50,
                            message: 'El nombre no puede exceder los 50 carácteres'
                        }
                    })}
                />
                {errors.name && <ErrorForm>{errors.name.message}</ErrorForm>}
            </div>

            <div className="my-5">
                <label htmlFor="durationDays" className="text-sm uppercase font-bold">
                    Duración en días (para membresías)
                </label>
                <input  
                    id="durationDays"
                    className="w-full p-3 border border-gray-100"  
                    type="number" 
                    min="0"
                    placeholder="Ej: 30 para mensual, 15 para quincenal, 7 para semanal" 
                    {...register('durationDays', {
                        min: {
                            value: 0,
                            message: 'La duración no puede ser negativa'
                        },
                        max: {
                            value: 365,
                            message: 'La duración no puede exceder 365 días'
                        }
                    })}
                />
                {errors.durationDays && <ErrorForm>{errors.durationDays.message}</ErrorForm>}
                <p className="text-xs text-gray-500 mt-1">Si es 0, no actualizará la fecha de expiración del cliente al registrar pagos</p>
            </div>
            
            <div className="mb-5">
                <label className="text-sm uppercase font-bold">
                    Tarifas por tipo de cliente
                </label>
                
                {feeLines.map((line) => {
                    const availableClientTypes = getAvailableClientTypes(line.id);
                    const currentValues = clientTypesOptions.filter(type => 
                        line.fee.idClientType.includes(type.value)
                    );
                    
                    return (
                        <div key={line.id} className="mb-5 border-b pb-4">
                            <div className="flex justify-between items-center my-2">
                                <span className="text-sm font-medium">Tarifa {line.id}</span>
                                {feeLines.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeLine(line.id)}
                                        className="text-red-500 text-xs hover:scale-110 cursor-pointer"
                                    >
                                        Eliminar
                                    </button>
                                )}
                            </div>

                            <div className="mb-3">
                                <label htmlFor="clientType" className="text-sm">
                                    Tipo de Cliente
                                </label>
                                <Select
                                    id={`clientType-${line.id}`}
                                    className="w-full"
                                    options={availableClientTypes}
                                    onChange={(selectedOptions: readonly ClientTypeOption[]) => 
                                        handleClientTypeChange(line.id, selectedOptions)
                                    }
                                    value={currentValues}
                                    isMulti
                                    isDisabled={availableClientTypes.length === 0}
                                    placeholder={availableClientTypes.length === 0 ? 
                                        "No hay más tipos disponibles" : "Seleccione..."}
                                    required
                                />
                                {line.fee.idClientType.length === 0 && (
                                    <ErrorForm>Debe seleccionar al menos un tipo de cliente</ErrorForm>
                                )}
                            </div>

                            <div className="mb-3">
                                <label htmlFor="amount" className="text-sm">
                                    Monto
                                </label>
                                <input
                                    id={`amount-${line.id}`}
                                    className="w-full p-3 border border-gray-100"
                                    type="number"
                                    min="0"
                                    step="1"
                                    placeholder="Ingrese el monto"
                                    value={line.fee.amount || ''}
                                    onChange={(e) => handleAmountChange(line.id, e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === '-' || e.key === 'e' || e.key === 'E') {
                                            e.preventDefault();
                                        }
                                    }}
                                    required
                                />
                                {line.fee.amount <= 0 && (
                                    <ErrorForm>El monto debe ser mayor a cero</ErrorForm>
                                )}
                            </div>
                        </div>
                    );
                })}

                {/* Solo se pueden añadir tantas tarifas como tipos de clientes */}
                {feeLines.length < clientTypesOptions.length && (
                    <div className="mb-5">
                        <button
                            type="button"
                            onClick={addNewLine}
                            disabled={getAvailableClientTypes(0).length === 0}
                            className={`px-4 py-2 text-sm rounded outline-2 hover:opacity-50 ${
                                getAvailableClientTypes(0).length === 0 ? 
                                'cursor-not-allowed' : ' hover:cursor-pointer'
                            }`}
                        >
                            + Añadir otra línea
                        </button>
                    </div>
                )}
                
            </div>

            <input 
                type="submit" 
                className="bg-yellow w-full p-3 text-white uppercase font-bold hover:bg-amber-600 cursor-pointer transition-colors" 
                value={activeEditingId ? 'Actualizar' : 'Registrar'} 
            />
        </form>
    );
};

export default Form;