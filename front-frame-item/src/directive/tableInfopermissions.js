/**
 * 处理table表格里面的 链接打开详情的控制权限
 * @method v-tableInfopermissions
 * @param {Object} app  - vue页面根元素实例化的vue对象
 * @example
 * <gj-button type="primary" v-tableInfopermissions="['/market/add']">权限按钮</gj-button>
 */
import store from "@/store";

export default (app) => {
  app.directive("tableInfopermissions", (el, binding) => {
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
        el && el.setAttribute("disabled", "disabled");
      }
    } else {
      if (!roles[value[0]]) {
        el && el.setAttribute("disabled", "disabled");
      }
    }
  });
};
