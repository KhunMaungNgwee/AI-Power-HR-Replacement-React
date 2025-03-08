import "react-i18next";

import enTranslation from "./locales/en/translation.json";

// Define the default namespace and resources
declare module "react-i18next" {
  interface Resources {
    translation: typeof enTranslation;
  }
}
