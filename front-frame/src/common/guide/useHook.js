import { inject, provide, reactive } from 'vue';

export const INJECT_KEY = Symbol('useBeforeHook');

const _beforeFunctions = {}
const _afterFunctions = {}

export const TYPE = {
  before: 'before',
  after: 'after'
}

function getType (type = TYPE.before) {
  if (type === TYPE.before) {
    return _beforeFunctions
  } else if (type === TYPE.after) {
    return _afterFunctions
  }
}

export const useProvide = () => {
  const set = (el, fn, type = TYPE.before) => {
    if (!el) return false;
    const _oldFn = getType(type)[el] || [];
    getType(type)[el] = [..._oldFn, fn]
    return true;
  }

  const get = (el, type = TYPE.before) => {
    if (el) {
      return getType(type)[el]
    }
    return getType(type)
  }


  const returns = reactive({
    get,
    set,
  });

  provide(INJECT_KEY, returns)
  return returns
}

export const useInject = () => {
  return inject(INJECT_KEY);
}