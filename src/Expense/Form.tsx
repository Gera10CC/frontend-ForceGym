import { useForm } from "react-hook-form";
import Swal from 'sweetalert2';
import { EconomicExpenseDataForm } from "../shared/types";
import ErrorForm from "../shared/components/ErrorForm";
import { useCommonDataStore } from "../shared/CommonDataStore";
import useEconomicExpenseStore from "./Store";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { getAuthUser, setAuthHeader, setAuthUser } from "../shared/utils/authentication";
import { formatDate } from "../shared/utils/format";

const MAXLENGTH_VOUCHER = 100;
const MAXLENGTH_DETAIL = 100;
const MINLENGTH_DETAIL = 5;
const CASH_PAYMENT_ID = 2;
const MAXDATE = new Date().toUTCString();

function Form() {
    const navigate = useNavigate();
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

    // Valores observados
    const idMeanOfPayment = watch("idMeanOfPayment") ? Number(watch("idMeanOfPayment")) : null;
    const voucherNumber = watch("voucherNumber");
    const amount = watch("amount");
    const isCashPayment = idMeanOfPayment === CASH_PAYMENT_ID;

    // SUBMIT
    const submitForm = async (data: EconomicExpenseDataForm) => {
        
        if (isCashPayment && data.voucherNumber) {
            return Swal.fire({
                title: 'Error',
                text: 'No se puede ingresar número de comprobante cuando el medio de pago es Efectivo',
                icon: 'error'
            });
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

        let action = '';
        const loggedUser = getAuthUser();

        const reqUser = {
            ...data,
            idUser: loggedUser?.idUser,
            paramLoggedIdUser: loggedUser?.idUser
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
        }
    };

    // Cargar datos para edición
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

    // Limpiar voucher cuando es efectivo
    useEffect(() => {
        if (isCashPayment && voucherNumber) {
            setValue('voucherNumber', '');
        }
    }, [isCashPayment, voucherNumber]);

    // Evitar negativos en monto
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

            {/* Ocultos */}
            <input type="hidden" {...register('idUser')} />
            <input type="hidden" {...register('idEconomicExpense')} />
            <input type="hidden" {...register('isDeleted')} />

            {/* CATEGORÍA */}
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

            {/* FECHA */}
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

            {/* MEDIO DE PAGO */}
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

            {/* VOUCHER */}
            <div>
                <label className="text-sm uppercase font-bold">Voucher</label>
                <input
                    type="text"
                    placeholder={isCashPayment ? "No aplica para efectivo" : "Ingrese voucher"}
                    disabled={isCashPayment}
                    className={`
                        w-full p-3 border rounded-md mt-1 
                        ${isCashPayment ? "bg-gray-100 border-gray-300" : "border-gray-200"}
                    `}
                    {...register("voucherNumber", {
                        required: isCashPayment ? false : 'El voucher es obligatorio',
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

            {/* DETALLE */}
            <div>
                <label className="text-sm uppercase font-bold">Detalle</label>
                <input
                    type="text"
                    placeholder="Ingrese el detalle"
                    className="w-full p-3 border border-gray-200 rounded-md mt-1"
                    {...register("detail", {
                        required: 'El detalle es obligatorio',
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

            {/* MONTO */}
            <div>
                <label className="text-sm uppercase font-bold">Monto</label>
                <input
                    type="number"
                    min="0"
                    step="1"
                    placeholder="Ingrese el monto"
                    className="w-full p-3 border border-gray-200 rounded-md mt-1"
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
            </div>

            {/* SUBMIT */}
            <input
                type="submit"
                value={activeEditingId ? "Actualizar" : "Registrar"}
                className="
                    bg-yellow text-black w-full p-3 rounded-md 
                    uppercase font-bold hover:bg-amber-500 mt-4 
                    transition-colors cursor-pointer
                "
            />
        </form>
    );
}

export default Form;