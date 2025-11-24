export const getUrlApi = () => {
  return typeof import.meta !== 'undefined' && import.meta.env
  ? import.meta.env.VITE_URL_API
  : process.env.VITE_URL_API;
}
