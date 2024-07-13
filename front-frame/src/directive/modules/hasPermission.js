import store from '@/store';

export default (app) => {
  app.directive('permissions', {
    mounted (el, binding) {
      const has = binding.value;
      const hasArr = store.getters.auth || [];
      if (has && !hasArr.includes(has)) {
        el.parentNode.removeChild(el);
      }
    }
  });
};
