import { createI18n } from 'vue-i18n' //引入vue-i18n组件
import zh from './zh-cn/index'
import en from './en/index'
import { M_T } from '@/store/mutationsTypes'

let language = (
  localStorage.getItem(M_T.LANGUAGE_INFO) || (navigator.language || navigator.userLanguage) || "zh"
)
if (language === 'zh-CN') {
  language = 'zh'
}

const i18n = createI18n({
  fallbackLocale: 'zh',
  globalInjection: true,
  legacy: false,
  locale: language,
  messages: { zh, en }
})

export default i18n