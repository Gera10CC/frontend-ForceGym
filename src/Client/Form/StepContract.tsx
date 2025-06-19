import React, { useEffect, useRef } from 'react';
import { useFormContext } from 'react-hook-form';
import SignatureCanvas from 'react-signature-canvas';
import ErrorForm from '../../shared/components/ErrorForm';

const CONTRACT_TEXT = `
Con la firma del presente contrato, se aceptan los términos y condiciones estipulados a continuación:
-Force Gym es un Gimnasio Tradicional, en el cual pueden realizarse ejercicios con pesas, discos, barras y máquinas. Por tanto; no están permitidos "El powerlifting" o cualquier otro que conlleve levantar la mayor cantidad de peso posible y altere el orden del establecimiento. 
-Force Gym no será responsable de los problemas de salud que pueda sufrir a consecuencia del uso de sus instalaciones. Con la suscripción del presente contrato se declara que está en buenas condiciones para la realización de ejercicio físico. Será responsabilidad del usuario realizarse periódicamente las debidas evaluaciones médicas mediante las cuales se certifique que su estado de salud es adecuado para la práctica de ejercicio físico.
-El usuario deberá seguir las indicaciones de los instructores durante la clase o sesión de entrenamiento, Force Gym quedará exonerado de responsabilidad, en caso de producirse un accidente por la indebida manipulación de los equipos y elementos que se encuentren dentro de las instalaciones.
-Force Gym no se hace responsable de los objetos personales que puedan extraviarse dentro de las instalaciones.
-Se debe tener respeto y buen trato con los demás usuarios e instructores de Force Gym.
-No se permitirán en ningún caso, las agresiones, insultos, o comportamientos agresivos, ofensivos o inadecuados.
-Debe respetarse el horario de funcionamiento de Force Gym ya establecido.
-Realizar el pago oportuno de la membresía una vez ésta cumpla el término de vigencia y en un solo tracto, no se permite abonos o entregas de dinero por partes. 
-Los menores de 18 años firman este documento a través de su representante legal, respondiendo este último por sus actos.
-Bajo ningún concepto se efectúa la devolución del dinero o transferencia de la mensualidad, de igual manera las mensualidades son individuales, en ningún caso el usuario podrá vender, ceder o transferir los derechos del servicio a otra persona.
-El incumplimiento de estos términos y condiciones podrá dar lugar, según la gravedad, a la expulsión de las instalaciones.
`;

export const StepContract = () => {
  const {
    setValue,
    getValues,
    formState: { errors },
    register,
    trigger
  } = useFormContext();

  const sigCanvasRef = useRef<SignatureCanvas>(null);

  // Registrar el campo signatureImage con validación required
  useEffect(() => {
    register('signatureImage', {
      required: 'La firma es obligatoria'
    });

    // Restaurar la firma previa si existe
    const signatureImage = getValues('signatureImage');
    if (signatureImage && sigCanvasRef.current) {
      sigCanvasRef.current.fromDataURL(signatureImage);
    } else {
      sigCanvasRef.current?.clear();
      setValue('signatureImage', '', { shouldValidate: true });
    }

    // Forzar validación al montar el componente
    trigger('signatureImage');
  }, [register, getValues, setValue, trigger]);

  const handleClear = () => {
    sigCanvasRef.current?.clear();
    setValue('signatureImage', '', { shouldValidate: true });
  };

  const handleSignatureEnd = () => {
    if (sigCanvasRef.current && !sigCanvasRef.current.isEmpty()) {
      try {
        const signatureData = sigCanvasRef.current.getCanvas().toDataURL('image/png');
        setValue('signatureImage', signatureData, { shouldValidate: true });
      } catch (error) {
        setValue('signatureImage', '', { shouldValidate: true });
      }
    } else {
      setValue('signatureImage', '', { shouldValidate: true });
    }
  };

  return (
    <div className="space-y-5">
      <div className="contract-container bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Términos y condiciones</h2>
        <pre className="whitespace-pre-wrap font-sans">{CONTRACT_TEXT}</pre>
      </div>

      <div className="signature-section mt-6">
        <h3 className="text-sm uppercase font-bold mb-2">Firma Digital</h3>
        <div className="border border-gray-300 rounded-md">
          <SignatureCanvas
            ref={sigCanvasRef}
            penColor="black"
            canvasProps={{
              width: 500,
              height: 200,
              className: 'sig-canvas w-full bg-gray-100'
            }}
            onEnd={handleSignatureEnd}
          />
        </div>

        {errors.signatureImage && (
          <ErrorForm>{errors.signatureImage.message?.toString()}</ErrorForm>
        )}

        <div className="flex gap-4 mt-4">
          <button
            type="button"
            onClick={handleClear}
            className="border-2 border-gray-600 text-gray-600 py-2 px-3 uppercase font-bold rounded-md hover:opacity-50 cursor-pointer transition-colors"
          >
            Limpiar Firma
          </button>
        </div>
      </div>
    </div>
  );
};