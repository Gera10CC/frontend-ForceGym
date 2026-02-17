export const setAuthHeader = (token: string | null) => {
  if (token) {
    console.log('💾 Guardando token:', token.substring(0, 30) + '...');
    localStorage.setItem("token", token);
  } else {
    console.log('🗑️ Eliminando token');
    localStorage.removeItem("token");
  }
};

export const getAuthUser = () => {
  const authUser = localStorage.getItem("authUser");
  return authUser ? JSON.parse(authUser) : null;
};

export const setAuthUser = (user: any | null) => {
  if (user) {
    console.log('💾 Guardando usuario:', user.username || user.person?.name);
    localStorage.setItem("authUser", JSON.stringify(user));
  } else {
    console.log('🗑️ Eliminando usuario');
    localStorage.removeItem("authUser");
  }
};

export const createHeaders = () => {
  const token = localStorage.getItem("token");
  
  if (token) {
    console.log('🔑 Token encontrado:', token.substring(0, 30) + '...');
  } else {
    console.warn('⚠️ No hay token en localStorage');
  }

  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
};