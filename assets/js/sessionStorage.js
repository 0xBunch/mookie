export const setCacheInSessionStorage = (type, url, data) => {
  sessionStorage.setItem(`${type}:${url}`, data);
};

export const getCacheInSessionStorage = (type, url) => {
  return sessionStorage.getItem(`${type}:${url}`);
};
