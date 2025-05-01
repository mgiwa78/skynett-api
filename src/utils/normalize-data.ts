export const normalizeEmail = (email: string): string => {
  return email.trim().toLowerCase();
};

export const normalizeString = (input: string): string => {
  return input.trim();
};
