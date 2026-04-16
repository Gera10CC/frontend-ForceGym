import { createHeaders } from "../utils/authentication";
import Swal from "sweetalert2";

// Variable para evitar múltiples alertas de sesión expirada
let isSessionExpiredAlertShown = false;

export const getData = async (url: string) => {
  const createdHeaders = createHeaders();

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: createdHeaders,
    });

    return manageResponse(res, url);
  } catch (error: any) {
    return { ok: false, error: error.message };
  }
};

export const postData = async (url: string, dataReq: any) => {
  const createdHeaders = createHeaders();

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: createdHeaders,
      body: JSON.stringify(dataReq),
    });

    return manageResponse(res, url);
  } catch (error: any) {
    return { ok: false, error: error.message };
  }
};

export const putData = async (url: string, dataReq: any) => {
  const createdHeaders = createHeaders();

  try {
    const res = await fetch(url, {
      method: "PUT",
      headers: createdHeaders,
      body: JSON.stringify(dataReq),
    });

    return manageResponse(res, url);
  } catch (error: any) {
    return { ok: false, error: error.message };
  }
};

export const deleteData = async (url: string, dataReq: any) => {
  const createdHeaders = createHeaders();

  try {
    const res = await fetch(url, {
      method: "DELETE",
      headers: createdHeaders,
      body: JSON.stringify(dataReq),
    });

    return manageResponse(res, url);
  } catch (error: any) {
    return { ok: false, error: error.message };
  }
};

const manageResponse = async (res: Response, url: string = '') => {
  const code = res.status;

  let result: any = {
    data: "",
    message: "",
  };

  try {
    const text = await res.text();

    if (text) {
      const jsonRes = JSON.parse(text);
      result = {
        ...result,
        data: jsonRes.data ?? "",
        message: jsonRes.message ?? "",
      };
    }
  } catch (error) {
    // Error al parsear JSON
  }

  if ([200, 201, 202].includes(code)) {
    return { ...result, ok: true };
  }

  if ([401, 403].includes(code)) {
    // Evitar múltiples alertas
    if (!isSessionExpiredAlertShown) {
      isSessionExpiredAlertShown = true;
      
      await Swal.fire({
        title: "Sesión expirada",
        text: "Tu sesión ha expirado. Por favor, inicia sesión nuevamente.",
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#CFAD04",
        allowOutsideClick: false,
        allowEscapeKey: false
      });

      // Limpiar todo y redirigir
      localStorage.removeItem("token");
      localStorage.removeItem("authUser");
      localStorage.removeItem("user");
      
      window.location.href = "/login";
    }

    return { ...result, logout: true };
  }

  if ([400, 405, 406, 407, 408].includes(code)) {
    return { ...result, ok: false, error: result.message || "Error en solicitud" };
  }

  if ([500, 501, 502, 503, 504, 505].includes(code)) {
    return { ...result, ok: false, error: result.message || "Error interno del servidor" };
  }

  return { ...result, ok: false };
};