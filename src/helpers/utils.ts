import crypto from 'crypto';

export const valueToString = (value: any): string => {
    if (typeof value === 'string') return value;
    if (typeof value === 'object' && value !== null) {
      return JSON.stringify(value); 
    }
    return String(value);
}

export const generateRandomHex = (size = 16) => {
  return crypto.randomBytes(size).toString('hex');
};