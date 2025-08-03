// src/utils/validators.js

export const isValidMobile = (number) => {
  return /^[6-9]\d{9}$/.test(number);
};

export const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const isValidPostalCode = (code) => {
  return /^\d{6}$/.test(code);
};




