export const dateFormatter = (date: string | undefined) => {
  const datetime = date ? new Date(date) : new Date();
  return datetime.toLocaleTimeString("es-CO", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};
