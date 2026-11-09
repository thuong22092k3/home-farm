import Cookies from "js-cookie";

const COOKIE_OPTIONS = {
  path: "/",
  expires: 7,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
};

export const setCookie = (key: string, value: string, expires = 7): void => {
  Cookies.set(key, value, { ...COOKIE_OPTIONS, expires });
};

export const getCookie = (key: string): string | undefined => {
  return Cookies.get(key);
};

export const deleteCookie = (key: string): void => {
  Cookies.remove(key, {
    path: "/",
    secure: COOKIE_OPTIONS.secure,
    sameSite: COOKIE_OPTIONS.sameSite,
  });
  // Fallback: force-expire via document.cookie for reliability
  if (typeof document !== "undefined") {
    document.cookie = `${key}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;`;
  }
};
