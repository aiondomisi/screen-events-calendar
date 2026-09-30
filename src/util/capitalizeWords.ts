export const capitalizeWords = (text: string) =>
  text.replace(/\b\w/g, (char) => char.toUpperCase());
