import { createHeaders } from "../utils/authentication";
import Swal from "sweetalert2";

export const getData = async (url: string) => {
  const createdHeaders = createHeaders();

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: createdHeaders,
    });

    return manageResponse(res);
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

    return manageResponse(res);
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

    return manageResponse(res);
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

    return manageResponse(res);
  } catch (error: any) {
    return { ok: false, error: error.message };
  }
};

const manageResponse = async (res: Response) => {
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
    console.warn("Error al parsear JSON:", error);
  }

  if ([200, 201, 202].includes(code)) {
    return { ...result, ok: true };
  }

  if ([401, 403].includes(code)) {
    await Swal.fire({
      title: "Sesión expirada",
      text: "Debe iniciar sesión",
      icon: "error",
      confirmButtonText: "OK",
      confirmButtonColor: "#CFAD04",
    });

    return { ...result, logout: true };
  }

  if ([400, 405, 406, 407, 408].includes(code)) {
    await Swal.fire({
      title: "Error",
      text: result.message || "Error en solicitud",
      icon: "error",
      confirmButtonColor: "#CFAD04",
    });

    return { ...result, ok: false };
  }

  if ([500, 501, 502, 503, 504, 505].includes(code)) {
    await Swal.fire({
      title: "Error en el servidor",
      text: result.message || "Error interno del servidor",
      icon: "error",
      confirmButtonColor: "#CFAD04",
    });

    return { ...result, ok: false };
  }

  return { ...result, ok: false };
};