import { createI18n } from "vue-i18n";

import en from "../languages/en.json";
import de from "../languages/de.json";
import fa from "../languages/fa.json";
import es from "../languages/es.json";
import ar from "../languages/ar.json";
import fr from "../languages/fr.json";
import du from "../languages/du.json";
import bg from "../languages/bg.json";
import mo from "../languages/mo.json";
import ru from "../languages/ru.json";
import po from "../languages/po.json";
import jp from "../languages/jp.json";
import tr from "../languages/tr.json";
import ch from "../languages/ch.json";
import it from "../languages/it.json";

const i18n = createI18n({
  locale: "en", //focus lang
  messages: {
    en,
    de,
    fa,
    es,
    ar,
    fr,
    tr,
    du,
    po,
    jp,
    it,
    ru,
    ch,
    bg,
    mo,
  },
});
export default i18n;
