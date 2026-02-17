import { useState } from 'react';
import { clientPortalService } from './clientPortalService';
import Swal from 'sweetalert2';
import { FaLock, FaTimes } from 'react-icons/fa';
import PasswordInput from '../shared/components/PasswordInput';

interface ChangePasswordModalProps {
    onClose: () => void;
    onSuccess: () => void;
}

function ChangePasswordModal({ onClose, onSuccess }: ChangePasswordModalProps) {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            await Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Las contraseñas nuevas no coinciden'
            });
            return;
        }

        if (newPassword.length < 6) {
            await Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'La contraseña debe tener al menos 6 caracteres'
            });
            return;
        }

        setIsSubmitting(true);

        try {
            await clientPortalService.changePassword(currentPassword, newPassword, confirmPassword);
            await Swal.fire({
                icon: 'success',
                title: 'Contraseña cambiada',
                text: 'Tu contraseña ha sido actualizada exitosamente',
                timer: 2000,
                showConfirmButton: false
            });
            onSuccess();
            onClose();
        } catch (error: any) {
            await Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data?.message || 'Error al cambiar la contraseña'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                    disabled={isSubmitting}
                >
                    <FaTimes size={24} />
                </button>

                <div className="flex items-center gap-3 mb-6">
                    <div className="bg-yellow p-3 rounded-full">
                        <FaLock size={24} />
                    </div>
                    <h2 className="text-2xl font-bold">Cambiar Contraseña</h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                            Contraseña Actual
                        </label>
                        <PasswordInput
                            id="currentPassword"
                            name="currentPassword"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            placeholder="Ingresa tu contraseña actual"
                            required
                            disabled={isSubmitting}
                            className="border border-gray-300 rounded"
                        />
                    </div>

                    <div>
                        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                            Nueva Contraseña
                        </label>
                        <PasswordInput
                            id="newPassword"
                            name="newPassword"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Ingresa tu nueva contraseña"
                            required
                            disabled={isSubmitting}
                            className="border border-gray-300 rounded"
                        />
                        <p className="text-xs text-gray-500 mt-1">Mínimo 6 caracteres</p>
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                            Confirmar Nueva Contraseña
                        </label>
                        <PasswordInput
                            id="confirmPassword"
                            name="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirma tu nueva contraseña"
                            required
                            disabled={isSubmitting}
                            className="border border-gray-300 rounded"
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
                        >
                            {isSubmitting ? 'Cambiando...' : 'Cambiar Contraseña'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ChangePasswordModal;
