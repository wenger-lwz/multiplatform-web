<template>
  <div ref="editor"></div>
</template>

<script>
import { onMounted, onBeforeUnmount, ref, defineComponent } from "vue";
import WangEditor from "wangeditor";
import { editConfig } from "@config/editConfig.js";

export default defineComponent({
  props: {
    modelValue: {
      type: String,
      default: "",
    },
    hasUploadVideo: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["update:modelValue", "getElems", "material-center"],
  setup(props, { emit }) {
    const editor = ref();
    const instance = ref(null);
    const { BtnMenu } = WangEditor;
    onMounted(() => {
      class selfPicMenu extends BtnMenu {
        constructor(editor) {
          // data-title属性表示当鼠标悬停在该按钮上时提示该按钮的功能简述
          const $elem = WangEditor.$(
            `<div class="w-e-menu w-e-menu-pic" data-title="pic">
            <button class="material-center-btn"></button>
          </div>`
          );
          super($elem, editor);
        }
        // 菜单点击事件
        clickHandler() {
          emit("material-center");
          // 做任何你想做的事情
          console.log("点击了， 可以发送一个事件出去");
        }
        // 菜单是否被激活（如果不需要，这个函数可以空着）
        // 1. 激活是什么？光标放在一段加粗、下划线的文本时，菜单栏里的 B 和 U 被激活，如下图
        // 2. 什么时候执行这个函数？每次编辑器区域的选区变化（如鼠标操作、键盘操作等），都会触发各个菜单的 tryChangeActive 函数，重新计算菜单的激活状态
      }

      if (props.hasUploadVideo) {
        class selfVideoMenu extends BtnMenu {
          constructor(editor) {
            // data-title属性表示当鼠标悬停在该按钮上时提示该按钮的功能简述
            const $elem = WangEditor.$(
              `<div class="w-e-menu w-e-menu-pic" data-title="video">
            <button class="w-e-menu-video-btn"></button>
          </div>`
            );
            super($elem, editor);
          }
          // 菜单点击事件
          clickHandler() {
            emit("material-upload-video");
            // 做任何你想做的事情
            console.log("点击了， 可以上传视频");
          }
        }
        // 注册上传视频
        WangEditor.registerMenu("selfVideoMenuKey", selfVideoMenu);
      }

      // 注册自定义菜单
      WangEditor.registerMenu("selfPicMenuKey", selfPicMenu);

      instance.value = new WangEditor(editor.value);
      // set config
      Object.keys(editConfig).forEach((key) => {
        instance.value.config[key] = editConfig[key];
      });
      Object.assign(instance.value.config, {
        onchange(val) {
          emit("update:modelValue", val);
        },
      });

      instance.value.create();
      // 内容初始化
      instance.value.txt.html(props.modelValue);
      // 获取DOM
      emit("getElems", getElems());
    });

    const setHtml = (value) => {
      instance.value.txt.html(value);
    };

    const cmdInsertImage = (arr) => {
      let imageStr = "";
      arr.forEach((item) => {
        imageStr += `<img src="${item.resource}" style="max-width:100%;"/>`;
      });
      if (imageStr) {
        instance.value.cmd.do("insertHTML", imageStr);
      }
    };

    const getElems = () => {
      return instance.value.$textElem.elems[0];
    };

    onBeforeUnmount(() => {
      instance.value.destroy();
      instance.value = null;
    });

    return {
      editor,
      setHtml,
      cmdInsertImage,
      getElems,
    };
  },
});
</script>

<style lang="scss" scoped>
::v-deep .w-e-text {
  min-height: 300px !important;
}
::v-deep .material-center-btn {
  border: none;
  cursor: pointer;
  width: 12px;
  height: 12px;
  background: url("../svg/materialCenter.svg") no-repeat center;
}
</style>
