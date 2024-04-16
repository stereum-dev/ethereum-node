import { createI18n } from "vue-i18n";

import en from "../languages/en.json";
import ar from "../languages/ar.json";
import bg from "../languages/bg.json";
import de from "../languages/de.json";
import es from "../languages/es.json";
import fa from "../languages/fa.json";
import fr from "../languages/fr.json";
import it from "../languages/it.json";
import ja from "../languages/ja.json";
import mn from "../languages/mn.json";
import nl from "../languages/nl.json";
import pt from "../languages/pt.json";
import ru from "../languages/ru.json";
import sr from "../languages/sr.json";
import tr from "../languages/tr.json";
import zh from "../languages/zh.json";
import cs from "../languages/cs.json";
import vi from "../languages/vi.json";
import bn from "../languages/bn.json";
import hi from "../languages/hi.json";
import id from "../languages/id.json";
import ko from "../languages/ko.json";
import mr from "../languages/mr.json";
import sw from "../languages/sw.json";
import ta from "../languages/ta.json";
import te from "../languages/te.json";
import ur from "../languages/ur.json";

const i18n = createI18n({
  legacy: false,
  locale: "en", //focus lang
  messages: {
    ar,
    bg,
    de,
    en,
    es,
    fa,
    fr,
    it,
    ja,
    mn,
    nl,
    pt,
    ru,
    sr,
    tr,
    zh,
    cs,
    vi,
    bn,
    hi,
    id,
    ko,
    mr,
    sw,
    ta,
    te,
    ur,
  },
});
export default i18n;
