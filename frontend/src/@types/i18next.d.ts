// import the original type declarations
import "i18next";
import auth from "../modules/auth/locales/en.json";
import common from "../common/locales/en.json";

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: "common";
    resources: {
      common: typeof common;
      auth: typeof auth;
    };
  }
}
