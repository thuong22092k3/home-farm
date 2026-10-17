import enCommon from "./locales/en/common.json";
import enEnum from "./locales/en/enum.json";
import viCommon from "./locales/vi/common.json";
import viEnum from "./locales/vi/enum.json";

export const resources = {
  vi: { common: viCommon, enum: viEnum, form: viCommon.form },
  en: { common: enCommon, enum: enEnum, form: enCommon.form },
} as const;

export type Locale = keyof typeof resources;
export const locales: Locale[] = ["vi", "en"];
