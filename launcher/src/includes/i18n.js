import { createI18n } from "vue-i18n";

import en from "../languages/en-US.json";
import de from "../languages/de-GR.json";
import fa from "../languages/fa-IR.json";

const i18n = createI18n({
  locale: "en-US", //focus lang
  messages: {
    "en-US": en,
    "de-GR": de,
    "fa-IR": fa,
  },
});
export default i18n;
