import { createI18n } from "vue-i18n";

import en from "../languages/en.json";
import de from "../languages/de.json";
import fa from "../languages/fa.json";

const i18n = createI18n({
  locale: "", //focus lang
  messages: {
    en,
    de,
    fa,
  },
});
export default i18n;
