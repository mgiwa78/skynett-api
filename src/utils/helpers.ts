export const generateProductCode = () => {
  return "PRD" + Math.random().toString(36).substring(2, 15);
};

export const generateOrderRef = () => {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const rand = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `ORD-${date}-${rand}`;
};

export const generatePaymentRef = () => {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const rand = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `PAY-${date}-${rand}`;
};
