import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { SupportLanguages } from "../utils/appService";

const getEnLocale = () => {
  const locale: any = {};
  const modules = import.meta.glob("/src/**/locales/en.json", {
    import: "default",
    eager: true,
  });

  for (const path in modules) {
    const module = path.split("/")[3];
    locale[module] = modules[path] as string;
  }
  return locale;
};

const resources = {
  [SupportLanguages.EN]: getEnLocale(),
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: SupportLanguages.EN,
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
