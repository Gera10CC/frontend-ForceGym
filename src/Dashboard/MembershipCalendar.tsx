import { useState, useEffect, Fragment } from 'react';
import { getData } from '../shared/services/gym';
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';
import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react';
import { MdOutlineCancel } from 'react-icons/md';

interface ClientExpiration {
  idClient: number;
  name: string;
  phone: string;
  email: string;
  expirationDate: string;
  clientType: string;
}

interface ExpirationData {
  clientsByDay: Record<number, ClientExpiration[]>;
  year: number;
  month: number;
  totalClients: number;
}

const MONTHS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const DAYS_OF_WEEK = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

function MembershipCalendar() {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth() + 1);
  const [expirationData, setExpirationData] = useState<ExpirationData | null>(null);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchExpirations();
  }, [currentYear, currentMonth]);

  const fetchExpirations = async () => {
    setLoading(true);
    try {
      const result = await getData(`${import.meta.env.VITE_URL_API}client/membership-expirations?year=${currentYear}&month=${currentMonth}`);
      if (result.ok && result.data) {
        setExpirationData(result.data);
      }
    } catch (error) {
      console.error('Error fetching expirations:', error);
    } finally {
      setLoading(false);
    }
  };

  const goToPreviousMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
    setSelectedDay(null);
  };

  const goToNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
    setSelectedDay(null);
  };

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month - 1, 1).getDay();
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
    const days = [];

    // Días vacíos antes del primer día del mes
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-10 sm:h-12"></div>);
    }

    // Días del mes
    for (let day = 1; day <= daysInMonth; day++) {
      const clientsForDay = expirationData?.clientsByDay[day] || [];
      const hasExpirations = clientsForDay.length > 0;
      const isToday = day === today.getDate() && 
                      currentMonth === today.getMonth() + 1 && 
                      currentYear === today.getFullYear();
      const isSelected = selectedDay === day;

      days.push(
        <div
          key={day}
          onClick={() => hasExpirations && setSelectedDay(day)}
          className={`
            h-10 sm:h-12 flex flex-col items-center justify-center rounded-lg text-sm
            transition-all duration-200 relative
            ${hasExpirations ? 'cursor-pointer hover:bg-yellow-100' : ''}
            ${isSelected ? 'bg-yellow-400 text-black font-bold' : ''}
            ${isToday && !isSelected ? 'border-2 border-yellow-500' : ''}
            ${hasExpirations && !isSelected ? 'bg-red-100 text-red-800 font-semibold' : ''}
          `}
        >
          <span>{day}</span>
          {hasExpirations && (
            <span className={`
              text-xs px-1.5 py-0.5 rounded-full mt-0.5
              ${isSelected ? 'bg-black text-yellow-400' : 'bg-red-500 text-white'}
            `}>
              {clientsForDay.length}
            </span>
          )}
        </div>
      );
    }

    return days;
  };

  const selectedClients = selectedDay && expirationData?.clientsByDay[selectedDay] || [];

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
      <h2 className="text-lg sm:text-xl font-semibold text-center mb-4">
        Vencimientos de Membresía
      </h2>

      {/* Navegación del mes */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={goToPreviousMonth}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <IoChevronBack className="text-xl" />
        </button>
        <h3 className="text-lg font-medium">
          {MONTHS[currentMonth - 1]} {currentYear}
        </h3>
        <button
          onClick={goToNextMonth}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <IoChevronForward className="text-xl" />
        </button>
      </div>

      {/* Resumen */}
      {expirationData && (
        <div className="text-center text-sm text-gray-600 mb-3">
          Total de vencimientos este mes: <span className="font-bold text-red-600">{expirationData.totalClients}</span>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
        </div>
      ) : (
        <>
          {/* Días de la semana */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {DAYS_OF_WEEK.map(day => (
              <div key={day} className="text-center text-xs font-semibold text-gray-500 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendario */}
          <div className="grid grid-cols-7 gap-1">
            {renderCalendar()}
          </div>

          {/* Leyenda */}
          <div className="flex justify-center gap-4 mt-4 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-red-100 rounded"></div>
              <span>Con vencimientos</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 border-2 border-yellow-500 rounded"></div>
              <span>Hoy</span>
            </div>
          </div>
        </>
      )}

      {/* Modal de clientes del día seleccionado */}
      <Transition appear show={selectedDay !== null && selectedClients.length > 0} as={Fragment}>
        <Dialog as="div" className="fixed inset-0 z-[9999]" onClose={() => setSelectedDay(null)}>
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/60" />
          </TransitionChild>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <TransitionChild
                as={Fragment}
                enter="ease-out duration-200"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-150"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <DialogPanel className="w-full max-w-md bg-white rounded-2xl shadow-xl relative overflow-hidden">
                  {/* Botón cerrar */}
                  <button
                    onClick={() => setSelectedDay(null)}
                    className="absolute top-3 right-3 text-3xl text-gray-600 hover:text-yellow transition z-10"
                    aria-label="Cerrar"
                  >
                    <MdOutlineCancel />
                  </button>

                  {/* Header */}
                  <div className="bg-yellow text-black px-6 py-4 pr-12">
                    <h3 className="font-bold text-lg">
                      Vencimientos del {selectedDay} de {MONTHS[currentMonth - 1]}
                    </h3>
                    <p className="text-sm opacity-80 mt-1">
                      {selectedClients.length} cliente{selectedClients.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  
                  {/* Lista de clientes */}
                  <div className="max-h-[50vh] overflow-y-auto">
                    {selectedClients.map((client, index) => (
                      <div
                        key={client.idClient}
                        className={`p-4 ${index !== selectedClients.length - 1 ? 'border-b border-gray-200' : ''}`}
                      >
                        <div className="font-semibold text-gray-800">{client.name}</div>
                        <div className="text-sm text-gray-600 mt-2 space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-base">📱</span>
                            <span>{client.phone || 'Sin teléfono'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-base">📧</span>
                            <span>{client.email || 'Sin correo'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-base">🏷️</span>
                            <span>{client.clientType}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}

export default MembershipCalendar;