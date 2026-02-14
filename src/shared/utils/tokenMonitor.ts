// Monitor para detectar cambios inesperados en el token
let lastToken: string | null = null;

export const startTokenMonitoring = () => {
    // Verificar el token cada segundo
    setInterval(() => {
        const currentToken = localStorage.getItem("token");
        
        if (lastToken !== currentToken) {
            if (lastToken && !currentToken) {
                console.error('🚨 ALERTA: Token fue eliminado inesperadamente!');
                console.trace('Stack trace del momento de la detección:');
            } else if (!lastToken && currentToken) {
                console.log('✅ Token guardado correctamente');
            } else if (lastToken && currentToken && lastToken !== currentToken) {
                console.log('🔄 Token actualizado');
            }
            
            lastToken = currentToken;
        }
    }, 1000);
    
    // También monitorear eventos de storage
    window.addEventListener('storage', (e) => {
        if (e.key === 'token') {
            console.log('📦 Evento storage detectado para token:');
            console.log('  - Valor anterior:', e.oldValue?.substring(0, 30) + '...');
            console.log('  - Valor nuevo:', e.newValue?.substring(0, 30) + '...');
            console.log('  - URL:', e.url);
        }
    });
    
    console.log('👁️ Monitoreo de token iniciado');
};
