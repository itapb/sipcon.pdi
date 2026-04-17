export const TruncateText = (name: string, limit: number = 15) => {
  if (name.length <= limit) return name;

  const start = name.slice(0, 12);
  const end = name.slice(-7);

  return `${start}...${end}`;
};
