import { nanoid } from "nanoid";
import validator from "validator";

export const generateShortCode = (): string => {
  return nanoid(8);
};

export const validateUrl = (url: string): boolean => {
  return validator.isURL(url, {
    protocols: ["http", "https"],
    require_protocol: true,
  });
};

export const validateShortCode = (code: string): boolean => {
  return /^[a-zA-Z0-9]{3,20}$/.test(code);
};

export const getExpirationDate = (minutes: number): Date => {
  const date = new Date();
  date.setMinutes(date.getMinutes() + minutes);
  return date;
};

export const getFullShortUrl = (shortCode: string): string => {
  const port = process.env.PORT || 3000;
  return `http://localhost:${port}/${shortCode}`;
};

export const getIpInfo = async (ip: string): Promise<object> => {
  // Placeholder for IP location detection.
  // In a real application, you would use a service like MaxMind or ip-api.com
  return {
    city: "Unknown",
    country: "Unknown",
  };
};
