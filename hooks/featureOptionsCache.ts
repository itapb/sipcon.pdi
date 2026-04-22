// Cache simple para evitar peticiones duplicadas de listas
let optionsCache: { [key: number]: any[] } = {};

export const getCachedOptions = (featureId: number) => optionsCache[featureId];
export const setCachedOptions = (featureId: number, options: any[]) => {
  optionsCache[featureId] = options;
};

export const clearCache = () => {
  optionsCache = {};
};
