import { useForm } from "react-hook-form";
import Swal from 'sweetalert2';
import { EconomicExpenseDataForm } from "../shared/types";
import ErrorForm from "../shared/components/ErrorForm";
import { useCommonDataStore } from "../shared/CommonDataStore";
import useEconomicExpenseStore from "./Store";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { getAuthUser, setAuthHeader, setAuthUser } from "../shared/utils/authentication";
import { formatDate } from "../shared/utils/format";
import { FaSpinner } from 'react-icons/fa';

const MAXLENGTH_VOUCHER = 100;
const MAXLENGTH_DETAIL = 100;
const MINLENGTH_DETAIL = 5;
const CASH_PAYMENT_ID = 2;
const MIXED_PAYMENT_ID = 3;
const MAXDATE = new Date().toUTCString();

function Form() {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { meansOfPayment, categories } = useCommonDataStore();

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
        reset,
        watch
    } = useForm<EconomicExpenseDataForm>();

    const {
        economicExpenses,
        activeEditingId,
        fetchEconomicExpenses,
        addEconomicExpense,
        updateEconomicExpense,
        closeModalForm
    } = useEconomicExpenseStore();

    const idMeanOfPayment = watch("idMeanOfPayment") ? Number(watch("idMeanOfPayment")) : null;
    const voucherNumber = watch("voucherNumber");
    const amount = watch("amount");
    const isCashPayment = idMeanOfPayment === CASH_PAYMENT_ID;
    const isMixedPayment = idMeanOfPayment === MIXED_PAYMENT_ID;

    // Estados para pago mixto
    const [sinpeAmount, setSinpeAmount] = useState<number>(0);
    const [cashAmount, setCashAmount] = useState<number>(0);

    // Calcular el monto total cuando es pago mixto
    useEffect(() => {
        if (isMixedPayment) {
            const total = (sinpeAmount || 0) + (cashAmount || 0);
            setValue("amount", total);
        }
    }, [sinpeAmount, cashAmount, isMixedPayment, setValue]);

    // Resetear montos cuando cambia el medio de pago
    useEffect(() => {
        if (!isMixedPayment) {
            setSinpeAmount(0);
            setCashAmount(0);
        }
    }, [isMixedPayment]);

    const submitForm = async (data: EconomicExpenseDataForm) => {
        
        if (isCashPayment && data.voucherNumber) {
            return Swal.fire({
                title: 'Error',
                text: 'No se puede ingresar número de comprobante cuando el medio de pago es Efectivo',
                icon: 'error'
            });
        }

        if (isMixedPayment) {
            if (sinpeAmount <= 0 || cashAmount <= 0) {
                return Swal.fire({
                    title: "Error",
                    text: "Para pago mixto, ambos montos (Sinpe y Efectivo) deben ser mayores a cero",
                    icon: "error",
                });
            }
        }

        const selectedDate = new Date(data.registrationDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (selectedDate > today) {
            return Swal.fire({
                title: 'Error',
                text: 'No se pueden registrar gastos con fecha futura',
                icon: 'error'
            });
        }

        if (data.amount <= 0) {
            return Swal.fire({
                title: 'Error',
                text: 'El monto debe ser mayor a cero',
                icon: 'error'
            });
        }

        setIsSubmitting(true);
        try {
            let action = '';
            const loggedUser = getAuthUser();
            
            // Verificar que el usuario esté logueado
            if (!loggedUser || !loggedUser.idUser) {
                await Swal.fire({
                    title: 'Sesión expirada',
                    text: 'Por favor inicie sesión nuevamente',
                    icon: 'warning'
                });
                setAuthHeader(null);
                setAuthUser(null);
                navigate('/login');
                return;
            }

            const reqUser = {
                ...data,
                idUser: Number(loggedUser.idUser),
                paramLoggedIdUser: Number(loggedUser.idUser)
            };

            let result;

            if (activeEditingId === 0) {
                result = await addEconomicExpense(reqUser as EconomicExpenseDataForm);
            action = 'agregado';
        } else {
            result = await updateEconomicExpense(reqUser as EconomicExpenseDataForm);
            action = 'editado';
        }

        if (result.ok) {
            const result2 = await fetchEconomicExpenses();

            if (result2.logout) {
                setAuthHeader(null);
                setAuthUser(null);
                navigate('/login', { replace: true });
            } else {
                closeModalForm();
                reset();
                await Swal.fire({
                    title: `Gasto económico ${action}`,
                    text: `Se ha ${action} el gasto`,
                    icon: 'success',
                    confirmButtonColor: '#CFAD04',
                    timer: 3000
                });
            }
        } else if (result.logout) {
            setAuthHeader(null);
            setAuthUser(null);
            navigate('/login');
        } else {
            // Mostrar mensaje de error
            await Swal.fire({
                title: "Error",
                text: result.error || result.message || "Ocurrió un error al procesar la solicitud",
                icon: "error",
                confirmButtonColor: "#CFAD04",
            });
        }
        } finally {
            setIsSubmitting(false);
        }
        } finally {
            setIsSubmitting(false);
        }
    };

useEffect(() => {
        if (activeEditingId) {
            const activeExpense = economicExpenses.find(expense => expense.idEconomicExpense === activeEditingId);
            if (activeExpense) {
                setValue('idEconomicExpense', activeExpense.idEconomicExpense);
                setValue('isDeleted', activeExpense.isDeleted);
                setValue('registrationDate', activeExpense.registrationDate);
                setValue('amount', activeExpense.amount);
                setValue('detail', activeExpense.detail);
                setValue('voucherNumber', activeExpense.voucherNumber);
                setValue('idMeanOfPayment', activeExpense.meanOfPayment.idMeanOfPayment);
                setValue('idCategory', activeExpense.category.idCategory);
            }
        }
    }, [activeEditingId]);

    useEffect(() => {
        if (isCashPayment && voucherNumber) {
            setValue('voucherNumber', '');
        }
    }, [isCashPayment, voucherNumber]);

    useEffect(() => {
        if (amount !== undefined && amount < 0) {
            setValue('amount', 0);
        }
    }, [amount]);

    return (
        <form
            onSubmit={handleSubmit(submitForm)}
            noValidate
            className="
                bg-white rounded-lg max-h-[80vh] overflow-y-auto px-4 sm:px-8 py-6 
                w-full space-y-5
            "
        >
            <legend className="
                uppercase text-center text-yellow text-xl sm:text-2xl font-black 
                border-b-2 border-yellow pb-2
            ">
                {activeEditingId ? 'Actualizar gasto' : 'Registrar gasto'}
            </legend>

            <input type="hidden" {...register('idUser')} />
            <input type="hidden" {...register('idEconomicExpense')} />
            <input type="hidden" {...register('isDeleted')} />

            <div>
                <label className="text-sm uppercase font-bold">Categoría</label>
                <select
                    className="w-full p-3 border border-gray-200 rounded-md mt-1"
                    {...register("idCategory", {
                        required: 'La categoría es obligatoria'
                    })}
                >
                    <option value="">Seleccione una categoría</option>
                    {categories.map(c => (
                        <option key={c.idCategory} value={c.idCategory}>
                            {c.name}
                        </option>
                    ))}
                </select>
                {errors.idCategory && <ErrorForm>{errors.idCategory.message}</ErrorForm>}
            </div>

            <div>
                <label className="text-sm uppercase font-bold">Fecha</label>
                <input
                    type="date"
                    className="w-full p-3 border border-gray-200 rounded-md mt-1"
                    {...register("registrationDate", {
                        required: 'La fecha es obligatoria',
                        max: {
                            value: MAXDATE,
                            message: `Debe ingresar una fecha máxima ${formatDate(new Date())}`
                        }
                    })}
                />
                {errors.registrationDate && <ErrorForm>{errors.registrationDate.message as string}</ErrorForm>}
            </div>

            <div>
                <label className="text-sm uppercase font-bold">Medio de pago</label>
                <select
                    className="w-full p-3 border border-gray-200 rounded-md mt-1"
                    {...register("idMeanOfPayment", {
                        required: 'El medio de pago es obligatorio'
                    })}
                >
                    <option value="">Seleccione un medio de pago</option>
                    {meansOfPayment.map(mp => (
                        <option key={mp.idMeanOfPayment} value={mp.idMeanOfPayment}>
                            {mp.name}
                        </option>
                    ))}
                </select>
                {errors.idMeanOfPayment && <ErrorForm>{errors.idMeanOfPayment.message}</ErrorForm>}
            </div>

            <div>
                <label className="text-sm uppercase font-bold">Voucher (Opcional)</label>
                <input
                    type="text"
                    placeholder={
                        isCashPayment 
                            ? "No aplica para efectivo" 
                            : isMixedPayment
                            ? "Voucher de Sinpe (opcional)"
                            : "Voucher (opcional)"
                    }
                    disabled={isCashPayment}
                    className={`
                        w-full p-3 border rounded-md mt-1 
                        ${isCashPayment ? "bg-gray-100 border-gray-300" : "border-gray-200"}
                    `}
                    {...register("voucherNumber", {
                        required: false,
                        maxLength: {
                            value: MAXLENGTH_VOUCHER,
                            message: `Máximo ${MAXLENGTH_VOUCHER} caracteres`
                        },
                        validate: (value) =>
                            isCashPayment && value ? 'No corresponde voucher para efectivo' : true
                    })}
                />
                {errors.voucherNumber && <ErrorForm>{errors.voucherNumber.message}</ErrorForm>}
            </div>

            <div>
                <label className="text-sm uppercase font-bold">Detalle (Opcional)</label>
                <input
                    type="text"
                    placeholder="Ingrese el detalle (opcional)"
                    className="w-full p-3 border border-gray-200 rounded-md mt-1"
                    {...register("detail", {
                        required: false,
                        minLength: {
                            value: MINLENGTH_DETAIL,
                            message: `Mínimo ${MINLENGTH_DETAIL} caracteres`
                        },
                        maxLength: {
                            value: MAXLENGTH_DETAIL,
                            message: `Máximo ${MAXLENGTH_DETAIL} caracteres`
                        }
                    })}
                />
                {errors.detail && <ErrorForm>{errors.detail.message}</ErrorForm>}
            </div>

            {/* Campos para Pago Mixto */}
            {isMixedPayment && (
                <>
                    <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
                        <h3 className="text-sm uppercase font-bold text-blue-800 mb-3">
                            Desglose de Pago Mixto
                        </h3>
                        
                        <div className="space-y-3">
                            <div>
                                <label className="text-sm font-semibold text-gray-700">
                                    Monto Sinpe Móvil
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    placeholder="₡0.00"
                                    value={sinpeAmount || ""}
                                    onChange={(e) => setSinpeAmount(parseFloat(e.target.value) || 0)}
                                    className="w-full p-3 border border-blue-300 rounded-md mt-1 focus:ring-2 focus:ring-blue-500"
                                    onWheel={(e) => e.currentTarget.blur()}
                                    onKeyDown={(e) => {
                                        if (["-", "e", "E"].includes(e.key)) e.preventDefault();
                                    }}
                                />
                            </div>

                            <div>
                                <label className="text-sm font-semibold text-gray-700">
                                    Monto Efectivo
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    placeholder="₡0.00"
                                    value={cashAmount || ""}
                                    onChange={(e) => setCashAmount(parseFloat(e.target.value) || 0)}
                                    className="w-full p-3 border border-blue-300 rounded-md mt-1 focus:ring-2 focus:ring-blue-500"
                                    onWheel={(e) => e.currentTarget.blur()}
                                    onKeyDown={(e) => {
                                        if (["-", "e", "E"].includes(e.key)) e.preventDefault();
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </>
            )}

            <div>
                <label className="text-sm uppercase font-bold">
                    Monto {isMixedPayment && "Total"}
                </label>
                <input
                    type="number"
                    min="0"
                    step="1"
                    placeholder="Ingrese el monto"
                    readOnly={isMixedPayment}
                    className={`w-full p-3 border rounded-md mt-1 ${
                        isMixedPayment 
                            ? "bg-gray-100 border-gray-300 font-bold text-lg" 
                            : "border-gray-200"
                    }`}
                    onWheel={(e) => e.currentTarget.blur()}
                    onKeyDown={(e) => {
                        if (e.key === '-' || e.key === 'e' || e.key === 'E') e.preventDefault();
                    }}
                    {...register("amount", {
                        required: 'El monto es obligatorio',
                        min: { value: 0, message: 'Debe ser mayor a cero' },
                        valueAsNumber: true
                    })}
                />
                {errors.amount && <ErrorForm>{errors.amount.message}</ErrorForm>}
                {isMixedPayment && (
                    <p className="text-xs text-gray-600 mt-1">
                        Calculado automáticamente: ₡{sinpeAmount.toLocaleString("es-CR")} (Sinpe) + ₡{cashAmount.toLocaleString("es-CR")} (Efectivo)
                    </p>
                )}
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full p-3 rounded-md uppercase font-bold mt-4 transition-colors flex items-center justify-center gap-2 ${
                    isSubmitting
                        ? 'bg-gray-400 cursor-not-allowed text-gray-700'
                        : 'bg-yellow text-black hover:bg-amber-500 cursor-pointer'
                }`}
            >
                {isSubmitting ? (
                    <>
                        <FaSpinner className="animate-spin" />
                        {activeEditingId ? "Actualizando..." : "Registrando..."}
                    </>
                ) : (
                    activeEditingId ? "Actualizar" : "Registrar"
                )}
            </button>
        </form>
    );
}

export default Form;