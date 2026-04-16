export const GetTime = (): Date => {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60000;

  // Retornamos el objeto Date con el ajuste de milisegundos aplicado
  return new Date(now.getTime() - offset);
};
