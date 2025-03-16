export const parseCost = (cost: number): string =>
  cost.toLocaleString("ru-RU", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
