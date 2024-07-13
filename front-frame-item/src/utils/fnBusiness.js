/// 功能业务函数
import store from "@/store";

// 动态路由功能函数
export const addRouteFilterFn = (
  systemRouter = [],
  permissionsKeyList = []
) => {
  for (let index = 0; index < systemRouter.length; index++) {
    if (
      permissionsKeyList.indexOf(systemRouter[index].path.replace("/", "")) < 0
    ) {
      // 删除第一层不存在的
      systemRouter.splice(index, 1);
      index--;
    } else {
      // 删除第二层
      for (let i = 0; i < systemRouter[index].children.length; i++) {
        if (
          permissionsKeyList.indexOf(
            systemRouter[index].children[i].path.replace("/", "")
          ) < 0
        ) {
          systemRouter[index].children.splice(i, 1);
          i--;
        }
      }
    }
  }
  return systemRouter;
};
// 抽离form表单的函数
export const setForm = (proxy, key, data, formName) => {
  let isSubmit = proxy.$refs[formName].validate().then((valid) => {
    if (valid) {
      return (isSubmit = "404");
    } else {
      const params = store.getters.getParams;
      params[key] = data;
      store.dispatch(proxy.$mt.PARAMS_QUERY, params);
      return (isSubmit = "200");
    }
  });
  return isSubmit;
};

// 抽离form表单的函数
export const setForm2 = (proxy, key, data, formName) => {
  return new Promise((resolove) => {
    const cb = () => {
      const params = store.getters.getParams;
      params[key] = data;
      store.dispatch(proxy.$mt.PARAMS_QUERY, params);
      resolove(true);
    };
    if (!proxy.$refs[formName]) {
      cb();
      return;
    }
    proxy.$refs[formName].validate().then((res) => {
      if (res) {
        resolove(false);
      } else {
        cb();
      }
    });
  });
};
