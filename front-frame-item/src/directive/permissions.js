/**
 * 按钮权限设置
 * @method v-permissions
 * @param {Object} app  - vue页面根元素实例化的vue对象
 * @example
 * <gj-button type="primary" v-permissions="['/market/add']">权限按钮</gj-button>
 */
import store from "@/store";

export default (app) => {
  app.directive("permissions", (el, binding) => {
    const { value } = binding;
    if (!value) {
      return;
    }
    const roles = store.getters.getPermissions;
    if (value.length > 1) {
      let isRemove = true;
      value.forEach((item) => {
        if (roles[item]) {
          isRemove = false;
        }
      });
      if (isRemove) {
        // el.parentNode && el.parentNode.removeChild(el);
      }
    } else {
      if (!roles[value[0]]) {
        // el.parentNode && el.parentNode.removeChild(el);
      }
    }
  });
};
