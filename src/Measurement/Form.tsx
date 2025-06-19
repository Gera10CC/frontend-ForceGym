import { useForm } from "react-hook-form";
import Swal from 'sweetalert2';
import { MeasurementDataForm } from "../shared/types";
import ErrorForm from "../shared/components/ErrorForm";
import useMeasurementStore from "./Store";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { formatDate } from "../shared/utils/format";
import { getAuthUser, setAuthHeader, setAuthUser } from "../shared/utils/authentication";

const MAXDATE = new Date().toUTCString()

function Form() {
    const navigate = useNavigate();
    const location = useLocation();
    const idClient = location.state?.idClient;
    
    const { 
        register, 
        handleSubmit, 
        setValue, 
        formState: { errors }, 
        reset 
    } = useForm<MeasurementDataForm>({
        defaultValues: {
            idClient: idClient || undefined,
            isDeleted: 0
        }
    });

    const { 
        measurements,
        activeEditingId, 
        fetchMeasurements, 
        addMeasurement, 
        updateMeasurement, 
        closeModalForm 
    } = useMeasurementStore();

    const submitForm = async (data: MeasurementDataForm) => {

        const loggedUser = getAuthUser();
        const reqUser = {
            ...data,
            idClient: data.idClient || idClient,
            idUser: loggedUser?.idUser,
            paramLoggedIdUser: loggedUser?.idUser
        };

        console.log("📤 Datos enviados al backend:", reqUser);

        let action = '', result;

        if (activeEditingId === 0) {
            result = await addMeasurement(reqUser);
            action = 'agregado';
        } else {
            result = await updateMeasurement(reqUser);
            action = 'editado';
        }

        closeModalForm();
        reset();

        if (result.ok) {
            const result2 = await fetchMeasurements();

            if (result2.logout) {
                setAuthHeader(null);
                setAuthUser(null);
                navigate('/login', { replace: true });
            } else {
                await Swal.fire({
                    title: `Medida ${action}`,
                    text: `Se ha ${action} la medida`,
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
            const selectedMeasurement = measurements.find(measurement => measurement.idMeasurement === activeEditingId);

            if(selectedMeasurement){
                setValue('idMeasurement', selectedMeasurement.idMeasurement);
                setValue('idClient', selectedMeasurement.idClient || idClient);
                setValue('isDeleted', selectedMeasurement.isDeleted);
                setValue('measurementDate', selectedMeasurement.measurementDate);
                setValue('weight', selectedMeasurement.weight);
                setValue('height', selectedMeasurement.height);
                setValue('muscleMass', selectedMeasurement.muscleMass);
                setValue('backSize', selectedMeasurement.backSize);
                setValue('hipSize', selectedMeasurement.hipSize);
                setValue('bodyFatPercentage', selectedMeasurement.bodyFatPercentage);
                setValue('visceralFatPercentage', selectedMeasurement.visceralFatPercentage);
                setValue('chestSize', selectedMeasurement.chestSize);
                setValue('waistSize', selectedMeasurement.waistSize);
                setValue('leftLegSize', selectedMeasurement.leftLegSize);
                setValue('rightLegSize', selectedMeasurement.rightLegSize);
                setValue('leftCalfSize', selectedMeasurement.leftCalfSize);
                setValue('rightCalfSize', selectedMeasurement.rightCalfSize);
                setValue('leftForeArmSize', selectedMeasurement.leftForeArmSize);
                setValue('rightForeArmSize', selectedMeasurement.rightForeArmSize);
                setValue('leftArmSize', selectedMeasurement.leftArmSize);
                setValue('rightArmSize', selectedMeasurement.rightArmSize);
            }
        }
    }, [activeEditingId]);

    return (
        <form 
            className="bg-white rounded-lg px-5 mb-10 overflow-scroll"
            noValidate
            onSubmit={handleSubmit(submitForm)}
        >
            <legend className="uppercase text-center text-yellow text-2xl font-black border-b-2 py-2 border-yellow">
                {activeEditingId ? 'Actualizar medida corporal' : 'Registrar medida corporal'}
            </legend>

            {/* inputs ocultos para la funcionalidad de actualizar */}
            <input  
                id="idClient" 
                type="hidden"
                value={idClient}
                {...register('idClient')}
            />
            <input  
                id="isDeleted" 
                type="hidden" 
                {...register('isDeleted')}
            />

            <div className="mb-5">
                <label htmlFor="measurementDate" className="text-sm uppercase font-bold">
                    Fecha de registro
                </label>
                <input  
                    id="measurementDate"
                    className="w-full p-3 border border-gray-100"  
                    type="date" 
                    {...register('measurementDate', {
                        required: 'La fecha de registro es obligatoria',
                        max: {
                            value: MAXDATE,
                            message: `Debe ingresar una fecha de registro de máximo ${formatDate(new Date())}`
                        }
                    })}
                />

                {/* mostrar errores del input de la fecha de nacimiento */}
                {errors.measurementDate && 
                    <ErrorForm>
                        {errors.measurementDate.message}
                    </ErrorForm>
                }
            </div>

            <div className="mb-5">
                <label htmlFor="weight" className="text-sm uppercase font-bold">
                    Peso (KG)
                </label>
                <input  
                    id="weight"
                    className="w-full p-3 border border-gray-100"  
                    type="number" 
                    placeholder="Ingrese el peso en kilogramos (KG)" 
                    {...register('weight', {
                        required: 'El peso es obligatorio',
                        min: {
                            value: 1,
                            message: `Debe ingresar un peso valido`
                        }
                    })}
                />

                {/* mostrar errores del input deL voucher */}
                {errors.weight && 
                    <ErrorForm>
                        {errors.weight.message}
                    </ErrorForm>
                }
            </div>

            <div className="mb-5">
                <label htmlFor="height" className="text-sm uppercase font-bold">
                    Altura (CM)
                </label>
                <input  
                    id="height"
                    className="w-full p-3 border border-gray-100"  
                    type="number" 
                    placeholder="Ingrese la Altura en centimetros (CM)" 
                    {...register('height', {
                        required: 'La altura es obligatoria',
                        min: {
                            value: 1,
                            message: `Debe ingresar un valor valido`
                        }
                    })}
                />

                {/* mostrar errores del input del detalle */}
                {errors.height && 
                    <ErrorForm>
                        {errors.height.message}
                    </ErrorForm>
                }
            </div>


            <div className="mb-5">
                <label htmlFor="muscleMass" className="text-sm uppercase font-bold">
                    Masa Muscular
                </label>
                <input  
                    id="muscleMass"
                    className="w-full p-3 border border-gray-100"  
                    type="number" 
                    placeholder="Ingrese la masa muscular" 
                    {...register('muscleMass', {
                        required: 'La masa muscular es obligatoria', 
                        min: {
                            value: 1,
                            message: `Debe ingresar un valor válido`
                        }
                    })}
                />

                {/* mostrar errores del input del monto */}
                {errors.muscleMass && 
                    <ErrorForm>
                        {errors.muscleMass.message}
                    </ErrorForm>
                }
            </div>

            <div className="mb-5">
                <label htmlFor="bodyFatPercentage" className="text-sm uppercase font-bold">
                    Porcentaje Grasa Corporal
                </label>
                <input  
                    id="bodyFatPercentage"
                    className="w-full p-3 border border-gray-100"  
                    type="number" 
                    placeholder="Ingrese la el porcentaje de grasa" 
                    {...register('bodyFatPercentage', {
                        required: 'El porcentaje de grasa es obligatorio', 
                        min: {
                            value: 1,
                            message: `Debe ingresar un valor válido`
                        }
                    })}
                />

                {/* mostrar errores del input del monto */}
                {errors.bodyFatPercentage && 
                    <ErrorForm>
                        {errors.bodyFatPercentage.message}
                    </ErrorForm>
                }
            </div>

            <div className="mb-5">
                <label htmlFor="visceralFatPercentage" className="text-sm uppercase font-bold">
                    Porcentaje Grasa Viceral 
                </label>
                <input  
                    id="visceralFatPercentage"
                    className="w-full p-3 border border-gray-100"  
                    type="number" 
                    placeholder="Ingresar el porcentaje de grasa viceral" 
                    {...register('visceralFatPercentage', {
                        required: 'El porcentaje de grasa viceral es obligatorio', 
                        min: {
                            value: 1,
                            message: `Debe ingresar un valor válido`
                        }
                    })}
                />

                {/* mostrar errores del input del monto */}
                {errors.visceralFatPercentage && 
                    <ErrorForm>
                        {errors.visceralFatPercentage.message}
                    </ErrorForm>
                }
            </div>

            <div className="mb-5">
                <label htmlFor="chestSize" className="text-sm uppercase font-bold">
                    Medida del pecho
                </label>
                <input  
                    id="chestSize"
                    className="w-full p-3 border border-gray-100"  
                    type="number" 
                    placeholder="Ingrese la medida del pecho" 
                    {...register('chestSize', {
                        required: 'La medida del pecho es obligatoria', 
                        min: {
                            value: 1,
                            message: `Debe ingresar un valor válido`
                        }
                    })}
                />

                {/* mostrar errores del input del monto */}
                {errors.chestSize && 
                    <ErrorForm>
                        {errors.chestSize.message}
                    </ErrorForm>
                }
            </div>

            <div className="mb-5">
                <label htmlFor="backSize" className="text-sm uppercase font-bold">
                    Medida de la espalda
                </label>
                <input  
                    id="backSize"
                    className="w-full p-3 border border-gray-100"  
                    type="number" 
                    placeholder="Ingrese la medida de la espalda" 
                    {...register('backSize', {
                        required: 'La medida de la espalda es obligatoria', 
                        min: {
                            value: 1,
                            message: `Debe ingresar un valor válido`
                        }
                    })}
                />

                {/* mostrar errores del input del monto */}
                {errors.backSize && 
                    <ErrorForm>
                        {errors.backSize.message}
                    </ErrorForm>
                }
            </div>

            <div className="mb-5">
                <label htmlFor="hipSize" className="text-sm uppercase font-bold">
                    Medida de la cadera
                </label>
                <input  
                    id="hipSize"
                    className="w-full p-3 border border-gray-100"  
                    type="number" 
                    placeholder="Ingrese la medida de la cadera" 
                    {...register('hipSize', {
                        required: 'La medida de la cadera es obligatoria', 
                        min: {
                            value: 1,
                            message: `Debe ingresar un valor válido`
                        }
                    })}
                />

                {/* mostrar errores del input del monto */}
                {errors.hipSize && 
                    <ErrorForm>
                        {errors.hipSize.message}
                    </ErrorForm>
                }
            </div>

            <div className="mb-5">
                <label htmlFor="waistSize" className="text-sm uppercase font-bold">
                    Medida de la cintura
                </label>
                <input  
                    id="waistSize"
                    className="w-full p-3 border border-gray-100"  
                    type="number" 
                    placeholder="Ingrese la medida de la cintura" 
                    {...register('waistSize', {
                        required: 'La medida de la cintura es obligatoria', 
                        min: {
                            value: 1,
                            message: `Debe ingresar un valor válido`
                        }
                    })}
                />

                {/* mostrar errores del input del monto */}
                {errors.waistSize && 
                    <ErrorForm>
                        {errors.waistSize.message}
                    </ErrorForm>
                }
            </div>

            <div className="mb-5">
                <label htmlFor="leftLegSize" className="text-sm uppercase font-bold">
                    Medida de la pierna izquierda
                </label>
                <input  
                    id="leftLegSize"
                    className="w-full p-3 border border-gray-100"  
                    type="number" 
                    placeholder="Ingrese la medida de la pierna izquierda" 
                    {...register('leftLegSize', {
                        required: 'La medida de la pierna izquierda es obligatoria', 
                        min: {
                            value: 1,
                            message: `Debe ingresar un valor válido`
                        }
                    })}
                />

                {/* mostrar errores del input del monto */}
                {errors.leftLegSize && 
                    <ErrorForm>
                        {errors.leftLegSize.message}
                    </ErrorForm>
                }
            </div>

            <div className="mb-5">
                <label htmlFor="rightLegSize" className="text-sm uppercase font-bold">
                    Medida de la pierna derecha
                </label>
                <input  
                    id="rightLegSize"
                    className="w-full p-3 border border-gray-100"  
                    type="number" 
                    placeholder="Ingrese la medida de la pierna derecha" 
                    {...register('rightLegSize', {
                        required: 'La medida de la pierna derecha es obligatoria', 
                        min: {
                            value: 1,
                            message: `Debe ingresar un valor válido`
                        }
                    })}
                />

                {/* mostrar errores del input del monto */}
                {errors.rightLegSize && 
                    <ErrorForm>
                        {errors.rightLegSize.message}
                    </ErrorForm>
                }
            </div>

            <div className="mb-5">
                <label htmlFor="leftCalfSize" className="text-sm uppercase font-bold">
                    Medida de la pantorrilla izquierda
                </label>
                <input  
                    id="leftCalfSize"
                    className="w-full p-3 border border-gray-100"  
                    type="number" 
                    placeholder="Ingrese la medida de la pantorrilla izquierda" 
                    {...register('leftCalfSize', {
                        required: 'La medida de la pantorrilla izquierda es obligatoria', 
                        min: {
                            value: 1,
                            message: `Debe ingresar un valor válido`
                        }
                    })}
                />

                {/* mostrar errores del input del monto */}
                {errors.leftCalfSize && 
                    <ErrorForm>
                        {errors.leftCalfSize.message}
                    </ErrorForm>
                }
            </div>

            <div className="mb-5">
                <label htmlFor="rightCalfSize" className="text-sm uppercase font-bold">
                    Medida de la pantorrilla derecha
                </label>
                <input  
                    id="rightCalfSize"
                    className="w-full p-3 border border-gray-100"  
                    type="number" 
                    placeholder="Ingrese la medida de la pantorrilla derecha" 
                    {...register('rightCalfSize', {
                        required: 'La medida de la pantorrilla derecha es obligatoria', 
                        min: {
                            value: 1,
                            message: `Debe ingresar un valor válido`
                        }
                    })}
                />

                {/* mostrar errores del input del monto */}
                {errors.rightCalfSize && 
                    <ErrorForm>
                        {errors.rightCalfSize.message}
                    </ErrorForm>
                }
            </div>

            <div className="mb-5">
                <label htmlFor="leftForeArmSize" className="text-sm uppercase font-bold">
                    Medida del antebrazo izquierdo
                </label>
                <input  
                    id="leftForeArmSize"
                    className="w-full p-3 border border-gray-100"  
                    type="number" 
                    placeholder="Ingrese la medida del antebrazo izquierdo" 
                    {...register('leftForeArmSize', {
                        required: 'La medida del antebrazo izquierdo es obligatoria', 
                        min: {
                            value: 1,
                            message: `Debe ingresar un valor válido`
                        }
                    })}
                />

                {/* mostrar errores del input del monto */}
                {errors.leftForeArmSize && 
                    <ErrorForm>
                        {errors.leftForeArmSize.message}
                    </ErrorForm>
                }
            </div>

            <div className="mb-5">
                <label htmlFor="rightForeArmSize" className="text-sm uppercase font-bold">
                    Medida del antebrazo derecho
                </label>
                <input  
                    id="rightForeArmSize"
                    className="w-full p-3 border border-gray-100"  
                    type="number" 
                    placeholder="Ingrese la medida del antebrazo derecho " 
                    {...register('rightForeArmSize', {
                        required: 'La medida del antebrazo derecho es obligatoria', 
                        min: {
                            value: 1,
                            message: `Debe ingresar un valor válido`
                        }
                    })}
                />

                {/* mostrar errores del input del monto */}
                {errors.rightForeArmSize && 
                    <ErrorForm>
                        {errors.rightForeArmSize.message}
                    </ErrorForm>
                }
            </div>

            <div className="mb-5">
                <label htmlFor="leftArmSize" className="text-sm uppercase font-bold">
                    Medida del brazo izquierdo
                </label>
                <input  
                    id="leftArmSize"
                    className="w-full p-3 border border-gray-100"  
                    type="number" 
                    placeholder="Ingrese la medida del brazo izquierdo"
                    {...register('leftArmSize', {
                        required: 'La medida del brazo izquierdo es obligatoria', 
                        min: {
                            value: 1,
                            message: `Debe ingresar un valor válido`
                        }
                    })}
                />

                {/* mostrar errores del input del monto */}
                {errors.leftArmSize && 
                    <ErrorForm>
                        {errors.leftArmSize.message}
                    </ErrorForm>
                }
            </div>

            <div className="mb-5">
                <label htmlFor="rightArmSize" className="text-sm uppercase font-bold">
                    Medida del brazo derecho
                </label>
                <input  
                    id="rightArmSize"
                    className="w-full p-3 border border-gray-100"  
                    type="number" 
                    placeholder="Ingrese la medida del brazo derecho"
                    {...register('rightArmSize', {
                        required: 'La medida del brazo derecho es obligatoria', 
                        min: {
                            value: 1,
                            message: `Debe ingresar un valor válido`
                        }
                    })}
                />

                {/* mostrar errores del input del monto */}
                {errors.rightArmSize && 
                    <ErrorForm>
                        {errors.rightArmSize.message}
                    </ErrorForm>
                }
            </div>

            <input type="submit" className="bg-yellow w-full p-3 text-white uppercase font-bold hover:bg-amber-600 cursor-pointer transition-colors" value={activeEditingId ? 'Actualizar' : 'Registrar'} />
        </form> 
    );
}

export default Form;
