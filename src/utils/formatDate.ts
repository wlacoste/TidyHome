export const formatDate = (date: Date, getSmallYear?: boolean): string => {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // getMonth() returns 0-11
  const year = date.getFullYear();
  const smallyear = date.getFullYear().toString().slice(2);
  return `${day}/${month}/${getSmallYear ? smallyear : year}`;
};
export const getFechaCorta = (date: Date): string => {
  const day = date.getDate().toString();
  const month = (date.getMonth() + 1).toString(); // getMonth() returns 0-11
  return `${day}/${month}`;
};

export const formatDateNormal = (date: Date): string => {
  const day = date.getDate().toString();
  const month = (date.getMonth() + 1).toString(); // getMonth() returns 0-11
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};
