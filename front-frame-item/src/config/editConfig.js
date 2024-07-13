import { GjMessage } from "@gj/atom";
export const editConfig = {
  height: "auto", //编辑区域高度默认为 300px
  zIndex: 100, //编辑器 z-index 默认为 10000
  showFullScreen: false, //全屏功能按钮 默认是true
  customAlert: function (s, t) {
    const messageConfig = {
      content: s,
      closable: true,
    };
    switch (t) {
      case "success":
        GjMessage.success(messageConfig);
        break;
      case "info":
        GjMessage.info(messageConfig);
        break;
      case "warning":
        GjMessage.warning(messageConfig);
        break;
      case "error":
        GjMessage.error(messageConfig);
        break;
      default:
        GjMessage.info(messageConfig);
        break;
    }
  },
};
