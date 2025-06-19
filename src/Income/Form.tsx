import { useForm } from "react-hook-form";
import Swal from 'sweetalert2';
import Select from 'react-select';
import { EconomicIncomeDataForm } from "../shared/types";
import ErrorForm from "../shared/components/ErrorForm";
import useEconomicIncomeStore from "./Store";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { formatDate } from "../shared/utils/format";
import { getAuthUser, setAuthHeader, setAuthUser } from "../shared/utils/authentication";
import { useCommonDataStore } from "../shared/CommonDataStore";

const MAXLENGTH_VOUCHER = 100;
const MINLENGTH_VOUCHER = 5;
const MAXLENGTH_DETAIL = 100;
const MINLENGTH_DETAIL = 5;
const CASH_PAYMENT_ID = 2; // Asumiendo que 2 es el ID para Efectivo
const MAXDATE = new Date().toUTCString();

function Form() {
    const navigate = useNavigate();
    const { register, handleSubmit, setValue, formState: { errors }, reset, watch } = useForm<EconomicIncomeDataForm>();
    const { } = register('idClient');
    const { meansOfPayment, activityTypes, allClients, fetchAllClients } = useCommonDataStore();
    const { economicIncomes, activeEditingId, fetchEconomicIncomes, addEconomicIncome, updateEconomicIncome, closeModalForm } = useEconomicIncomeStore();

    // Observamos los valores relevantes
    const idMeanOfPayment = watch("idMeanOfPayment") ? Number(watch("idMeanOfPayment")) : null;
    const voucherNumber = watch("voucherNumber");
    const amount = watch("amount");
    const isCashPayment = idMeanOfPayment === CASH_PAYMENT_ID;
    const hasDelay = watch('hasDelay');
    const idClient = watch("idClient");
    const idActivityType = watch("idActivityType");

    const submitForm = async (data: EconomicIncomeDataForm) => {
        // Validación adicional para cliente
        if (!data.idClient) {
            Swal.fire({
                title: 'Error',
                text: 'Debe seleccionar un cliente',
                icon: 'error',
                confirmButtonText: 'OK'
            });
            return;
        }

        // Validación adicional para voucher con efectivo
        if (isCashPayment && data.voucherNumber) {
            Swal.fire({
                title: 'Error',
                text: 'No se puede ingresar número de comprobante cuando el medio de pago es Efectivo',
                icon: 'error',
                confirmButtonText: 'OK'
            });
            return;
        }

        // Validación adicional para monto negativo
        if (data.amount <= 0) {
            Swal.fire({
                title: 'Error',
                text: 'El monto debe ser mayor a cero',
                icon: 'error',
                confirmButtonText: 'OK'
            });
            return;
        }

        let action = '', result;
        const loggedUser = getAuthUser();
        const reqUser = {
            ...data,
            paramLoggedIdUser: loggedUser?.idUser,
            delayDays: data.hasDelay ? data.delayDays : null
        };

        if (activeEditingId === 0) {
            result = await addEconomicIncome(reqUser);
            action = 'agregado';
        } else {
            result = await updateEconomicIncome(reqUser);
            action = 'editado';
        }

        if (result.ok) {
            const result2 = await fetchEconomicIncomes();

            if (result2.logout) {
                setAuthHeader(null);
                setAuthUser(null);
                navigate('/login', { replace: true });
            } else {
                closeModalForm();
                reset();

                await Swal.fire({
                    title: `Ingreso económico ${action}`,
                    text: `Se ha ${action} el ingreso`,
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
        fetchAllClients();
    }, []);

    useEffect(() => {
        if (activeEditingId) {
            const activeIncome = economicIncomes.find(income => income.idEconomicIncome === activeEditingId);
            if (activeIncome) {
                setValue('idEconomicIncome', activeIncome.idEconomicIncome);
                setValue('idClient', activeIncome.client.idClient);
                setValue('isDeleted', activeIncome.isDeleted);
                setValue('registrationDate', activeIncome.registrationDate);
                setValue('amount', activeIncome.amount);
                setValue('detail', activeIncome.detail);
                setValue('voucherNumber', activeIncome.voucherNumber);
                setValue('idMeanOfPayment', activeIncome.meanOfPayment.idMeanOfPayment);
                setValue('idActivityType', activeIncome.activityType.idActivityType);
                setValue('hasDelay', activeIncome.delayDays != null || false);
                setValue('delayDays', activeIncome.delayDays || null);
            }
        } else {
            setValue('hasDelay', false);
            setValue('delayDays', null);
        }
    }, [activeEditingId]);

    useEffect(() => {
        if (idClient && idActivityType && activeEditingId==0) {
            // 1. Obtener el tipo de cliente seleccionado
            const selectedClient = allClients.find(client => client.value === idClient);
            const clientTypeId = selectedClient?.idClientType;

            // 2. Obtener la actividad seleccionada
            const selectedActivity = activityTypes.find(activity => activity.idActivityType === Number(idActivityType));

            if (clientTypeId && selectedActivity) {
                // 3. Buscar la tarifa correspondiente
                const matchingFee = selectedActivity.fees.find(fee =>
                    fee.idClientType.includes(clientTypeId)
                );

                // 4. Actualizar el monto si se encontró una tarifa
                if (matchingFee) {
                    setValue('amount', matchingFee.amount);
                } else {
                    // Resetear el monto si no hay tarifa definida
                    setValue('amount', 0);
                }
            }
        }
    }, [idClient, idActivityType, allClients, activityTypes, setValue]);

    // Efecto para limpiar voucherNumber cuando se selecciona Efectivo
    useEffect(() => {
        if (isCashPayment && voucherNumber) {
            setValue('voucherNumber', '');
        }
    }, [isCashPayment, voucherNumber]);

    // Efecto para prevenir valores negativos en el monto
    useEffect(() => {
        if (amount !== undefined && amount < 0) {
            setValue('amount', 0);
        }
    }, [amount]);

    return (
        <form
            className="bg-white rounded-lg px-5 mb-10 overflow-scroll"
            noValidate
            onSubmit={handleSubmit(submitForm)}
        >
            <legend className="uppercase text-center text-yellow text-2xl font-black border-b-2 py-2 border-yellow">
                {activeEditingId ? 'Actualizar ingreso' : 'Registrar ingreso'}
            </legend>

            {/* inputs ocultos para la funcionalidad de actualizar */}
            <input
                id="idEconomicIncome"
                type="hidden"
                {...register('idEconomicIncome')}
            />
            <input
                id="isDeleted"
                type="hidden"
                {...register('isDeleted')}
            />

            <div className="mb-5">
                <label htmlFor="idClient" className="text-sm uppercase font-bold">
                    Cliente
                </label>
                {allClients.length > 0 ? (
                    <Select
                        id="idClient"
                        className="w-full"
                        onChange={(selectedOption) => {
                            if (selectedOption) {
                                setValue("idClient", selectedOption.value, { shouldValidate: true });
                            }
                        }}
                        options={allClients}
                        value={allClients.find((client) => client.value === idClient) || null}
                        required
                    />
                ) : (
                    <p>Cargando clientes...</p>
                )}
                {errors.idClient && <ErrorForm>{errors.idClient.message}</ErrorForm>}
            </div>

            <div className="my-5">
                <label htmlFor="idActivityType" className="text-sm uppercase font-bold">
                    Actividad
                </label>
                <select
                    id="idActivityType"
                    className="w-full p-3 border border-gray-100"
                    {...register("idActivityType", {
                        required: 'La actividad es obligatoria'
                    })}
                >
                    <option value="">Seleccione una actividad</option>
                    {activityTypes.map((activity) => (
                        <option key={activity.idActivityType} value={activity.idActivityType}>
                            {activity.name}
                        </option>
                    ))}
                </select>
                {errors.idActivityType &&
                    <ErrorForm>
                        {errors.idActivityType.message}
                    </ErrorForm>
                }
            </div>

            <div className="mb-5">
                <label htmlFor="registrationDate" className="text-sm uppercase font-bold">
                    Fecha
                </label>
                <input
                    id="registrationDate"
                    className="w-full p-3 border border-gray-100"
                    type="date"
                    {...register('registrationDate', {
                        required: 'La fecha de registro es obligatoria',
                        max: {
                            value: MAXDATE,
                            message: `Debe ingresar una fecha de registro de máximo ${formatDate(new Date())}`
                        }
                    })}
                />
                {errors.registrationDate && <ErrorForm>{errors.registrationDate.message?.toString()}</ErrorForm>}
            </div>

            <div className="my-4">
                <label htmlFor="delayDays" className="text-sm uppercase font-bold">
                    Días de atraso
                </label>
                <br />
                <label className="flex items-center mt-2">
                    ¿Hubo días de atraso?
                    <input
                        type="checkbox"
                        id="hasDelay"
                        className="ml-2"
                        {...register('hasDelay')}
                    />
                </label>
            </div>

            {hasDelay && (
                <div className="mt-4">
                    <label htmlFor="delayDays" className="text-sm uppercase font-bold">
                        Cantidad de días de atraso
                    </label>
                    <input
                        id="delayDays"
                        type="number"
                        min="1"
                        className="w-full p-3 border border-gray-100 mt-2"
                        {...register('delayDays', {
                            required: 'Debe especificar el número de días de atraso',
                            min: {
                                value: 1,
                                message: 'El número de días debe ser positivo'
                            },
                            valueAsNumber: true
                        })}
                    />
                    {errors.delayDays &&
                        <ErrorForm>
                            {errors.delayDays.message}
                        </ErrorForm>
                    }
                </div>
            )}

            <div className="my-5">
                <label htmlFor="idMeanOfPayment" className="text-sm uppercase font-bold">
                    Medio de Pago
                </label>
                <select
                    id="idMeanOfPayment"
                    className="w-full p-3 border border-gray-100"
                    {...register("idMeanOfPayment", {
                        required: 'El medio de pago es obligatorio'
                    })}
                >
                    <option value="">Seleccione un medio de pago</option>
                    {meansOfPayment.map((meanOfPayment) => (
                        <option key={meanOfPayment.idMeanOfPayment} value={meanOfPayment.idMeanOfPayment}>
                            {meanOfPayment.name}
                        </option>
                    ))}
                </select>
                {errors.idMeanOfPayment &&
                    <ErrorForm>
                        {errors.idMeanOfPayment.message}
                    </ErrorForm>
                }
            </div>

            <div className="mt-2 mb-5">
                <label htmlFor="voucherNumber" className="text-sm uppercase font-bold">
                    Voucher
                </label>
                <input
                    id="voucherNumber"
                    className={`w-full p-3 border ${isCashPayment ? 'bg-gray-100' : 'border-gray-100'}`}
                    type="text"
                    placeholder={isCashPayment ? 'No aplica para efectivo' : 'Ingrese el voucher'}
                    disabled={isCashPayment}
                    {...register('voucherNumber', {
                        required: idMeanOfPayment === 1 ? 'El voucher es obligatorio' : false,
                        minLength: {
                            value: MINLENGTH_VOUCHER,
                            message: `Debe ingresar un voucher de mínimo ${MINLENGTH_VOUCHER} carácteres`
                        },
                        maxLength: {
                            value: MAXLENGTH_VOUCHER,
                            message: `Debe ingresar un voucher de máximo ${MAXLENGTH_VOUCHER} carácteres`
                        },
                        validate: (value) => {
                            if (isCashPayment && value) {
                                return 'No se puede ingresar voucher con pago en efectivo';
                            }
                            return true;
                        }
                    })}
                />
                {errors.voucherNumber &&
                    <ErrorForm>
                        {errors.voucherNumber.message}
                    </ErrorForm>
                }
            </div>

            <div className="mb-5">
                <label htmlFor="detail" className="text-sm uppercase font-bold">
                    Detalle
                </label>
                <input
                    id="detail"
                    className="w-full p-3 border border-gray-100"
                    type="text"
                    placeholder="Ingrese el detalle"
                    {...register('detail', {
                        required: 'El detalle es obligatorio',
                        minLength: {
                            value: MINLENGTH_DETAIL,
                            message: `Debe ingresar un detalle de mínimo ${MINLENGTH_DETAIL} carácteres`
                        },
                        maxLength: {
                            value: MAXLENGTH_DETAIL,
                            message: `Debe ingresar un detalle de máximo ${MAXLENGTH_DETAIL} carácteres`
                        }
                    })}
                />
                {errors.detail &&
                    <ErrorForm>
                        {errors.detail.message}
                    </ErrorForm>
                }
            </div>

            <div className="mb-5">
                <label htmlFor="amount" className="text-sm uppercase font-bold">
                    Monto
                </label>
                <input
                    id="amount"
                    className="w-full p-3 border border-gray-100"
                    type="number"
                    min="0"
                    step="1"
                    placeholder="Ingrese el monto"
                    onWheel={(e) => {
                        // Prevenir el cambio de valor con la rueda del mouse
                        e.preventDefault();
                        e.currentTarget.blur();
                    }}
                    onKeyDown={(e) => {
                        // Prevenir la entrada de caracteres no deseados
                        if (e.key === '-' || e.key === 'e' || e.key === 'E') {
                            e.preventDefault();
                        }
                    }}
                    {...register('amount', {
                        required: 'El monto es obligatorio',
                        min: {
                            value: 0,
                            message: 'El monto debe ser mayor a cero'
                        },
                        valueAsNumber: true
                    })}
                />
                {errors.amount &&
                    <ErrorForm>
                        {errors.amount.message}
                    </ErrorForm>
                }
            </div>

            <input
                type="submit"
                className="bg-yellow w-full p-3 text-white uppercase font-bold hover:bg-amber-600 cursor-pointer transition-colors"
                value={activeEditingId ? 'Actualizar' : 'Registrar'}
            />
        </form>
    );
}

export default Form;