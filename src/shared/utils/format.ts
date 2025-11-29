export const formatDate = (date: Date) => {
    const localDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
    return new Intl.DateTimeFormat('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }).format(localDate);
}

export const formatDateForParam = (date: Date): string => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); 
    const day = date.getDate().toString().padStart(2, '0'); 
    
    return `${year}-${month}-${day}`;
}

export const formatCurrentDateWithHourForTitle = () => {
    const now = new Date();

    const offsetCR = -6; 
    now.setHours(now.getUTCHours() + offsetCR);
    
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0'); 
    const year = now.getFullYear();
        
    return `${hours}.${minutes}h ${day}.${month}.${year}`;
}

export const formatCurrentDateForDocument = () => {
    const now = new Date();

    const offsetCR = -6; 
    now.setHours(now.getUTCHours() + offsetCR);
    
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0'); 
    const year = now.getFullYear();
        
    return `${day}/${month}/${year}`;
}

export const formatCurrentHourForDocument = () => {
    const now = new Date();

    const offsetCR = -6; 
    now.setHours(now.getUTCHours() + offsetCR);
    
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
        
    return `${hours}:${minutes}`;
}

export const formatAmountToCRC = (amount: number) => {
    return `CRC ${amount.toLocaleString('es-CR', { minimumFractionDigits: 2 })}`;
  };  

export const formatNullable = (value: any, fallback = "No disponible") => {
    return value === null || value === undefined || value === "" ? fallback : value;
};
