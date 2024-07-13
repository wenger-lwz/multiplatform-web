import { createI18n } from "vue-i18n"; //引入vue-i18n组件
import zh from "./zh-cn/index";
import en from "./en/index";

const language = (
  (navigator.language ? navigator.language : navigator.userLanguage) || "zh"
).toLowerCase();
const i18n = createI18n({
  fallbackLocale: "zh",
  globalInjection: true,
  legacy: false, // you must specify 'legacy: false' option
  locale: language.split("-")[0] || "zh",
  messages: { en, zh },
});

export default i18n;
