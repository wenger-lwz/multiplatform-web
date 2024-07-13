/**
 * 初始化 init 的
 * 第一个参数 data[]
 * data = {
 *   title: string,
 *   content: vNode | string,
 *   buttons: button[], 
 *     button = {
        text: string,
        click() {}
       }
 * }

   第二个参数 config: object
   config = {
     loop: boolean,
   }
   
 * 
 */
import { inject, provide, ref, computed, watch } from 'vue';
import { useProvide as hookProvide, TYPE as HookType } from './useHook'
import { addMask, highLight, removeHightLight, addStyleForEl, removeStyleForAdd, clearStyle } from './utils'

export const INJECT_KEY = Symbol('guide');

const defaultConfig = {
  loop: false,
}

export const useProvide = () => {
  const visible = ref(false);
  const step = ref(1);
  const data = ref([]);

  const current = computed(() => data.value[step.value - 1]);
  const total = computed(() => data.value.length);
  
  const { get, set } = hookProvide();

  const runFns = (config, type = HookType.before) => {
    const { el } = config;
    if (type === HookType.before) {
      setTimeout(() => {
        highLight(el); //  高亮（提高层级
        addStyleForEl(el, data.value.find(e => e.el === el)?.elStyle); // 增加样式
      }, 50)
    } else if (type === HookType.after) {
      removeHightLight(el);
      removeStyleForAdd(el) // 移除样式
    }

    const fns = get(el, type);
    if (fns) {
      return Promise.all(fns.map(fn => fn(config)))
    }
  }

  const skip = async () => {
    visible.value = false;
    clearStyle(); // 清空内联样式

    if (current.value) {
      try {
        await runFns(current.value, HookType.after)
      } catch (err) {
        throw new Error(`AN ERROR OCURR` + err)
      }
    }
    step.value = 1;
  }

  const reset = async () => {
    await skip();

    setTimeout(async () => {
      // step.value = 1;
      visible.value = true;

      if (current.value) {
        try {
          await runFns(current.value)
        } catch (err) {
          throw new Error(`AN ERROR OCURR` + err)
        }
      }
    }, 100)
  }


  let config;

  const next = async () => {
    const nextCurrent = data.value[step.value];
    if (nextCurrent) {
      try {
        await runFns(nextCurrent);
      } catch (err) {
        throw new Error(`AN ERROR OCURR` + err)
      }
    }

    let count = step.value + 1;
    if (count > total.value) {
      if (config.loop) {
        reset();
      } else {
        skip()
      }
    } else {
      step.value = count
    }

    const preCurrent = data.value[step.value - 2];
    if (preCurrent) {
      try {
        await runFns(preCurrent, HookType.after)
      } catch (err) {
        throw new Error(`AN ERROR OCURR` + err)
      }
    }
  }

  const back = async () => {
    const preCurrent = data.value[step.value - 2];
    if (preCurrent) {
      try {
        await runFns(preCurrent)
      } catch (err) {
        throw new Error(`AN ERROR OCURR` + err)
      }
    }

    let count = step.value - 1;
    if (count < 1) {
      if (config.loop) {
        step.value = total.value
      } else {
        return;
      }
    } else {
      step.value = count
    }

    const nextCurrent = data.value[step.value + 1];
    if (nextCurrent) {
      try {
        await runFns(nextCurrent, HookType.after)
      } catch (err) {
        throw new Error(`AN ERROR OCURR` + err)
      }
    }
  }

  const init = (d, conf = {}) => {
    console.log('init', d)
    data.value = d;
    config = {
      ...defaultConfig,
    }

    d.forEach((step) => {
      const {el, before, after } = step;
      if (el) {
        if (before && typeof before === 'function') {
          set(el, before)
        }
        if (after && typeof after === 'function') {
          set(el, after, HookType.after)
        }
      }
    })

  }

  watch(() => visible.value, (v) => {
    // 遮罩
    addMask(v);
  })

  const provider = {
    step,
    total,
    current,
    total,
    visible,
    skip,
    reset,
    next,
    back,
    init,
  };
  provide(INJECT_KEY, provider);
  
  return provider;
}


export const useInject = () => {
  return inject(INJECT_KEY)
}

