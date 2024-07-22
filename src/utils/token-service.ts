export const saveAccessToken = (key: string, value: string) => {
  localStorage.setItem(key, value);
};
export const getAccesToken = (key: string) => {
  return localStorage.getItem(key);
};
export const removeAccessToken = (key: string) => {
  localStorage.removeItem(key);
};
