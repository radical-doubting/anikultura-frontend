export const getDaysFromNowToDate = (date: Date): number => {
  const currentDate = new Date();

  const diff = Math.floor(
    (Date.UTC(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate(),
    ) -
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())) /
      (1000 * 60 * 60 * 24),
  );

  return Math.abs(diff);
};
