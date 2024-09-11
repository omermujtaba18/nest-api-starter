export const generateSecret = (): string => {
  return crypto.randomUUID();
};
