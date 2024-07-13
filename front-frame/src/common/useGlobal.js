import { getCurrentInstance } from 'vue';
export default function useGlobal () {
  const { appContext: { config: { globalProperties } } } = getCurrentInstance()
  return globalProperties
}
