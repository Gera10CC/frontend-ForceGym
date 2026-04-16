// Monitor para detectar cambios inesperados en el token
let lastToken: string | null = null;

export const startTokenMonitoring = () => {
    // Verificar el token cada segundo
    setInterval(() => {
        const currentToken = localStorage.getItem("token");
        
        if (lastToken !== currentToken) {
            lastToken = currentToken;
        }
    }, 1000);
    
    // También monitorear eventos de storage
    window.addEventListener('storage', (e) => {
        if (e.key === 'token') {
            // Token modificado desde otra pestaña
        }
    });
};
