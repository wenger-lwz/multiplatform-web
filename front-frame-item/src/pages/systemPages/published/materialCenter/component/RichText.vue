<template>
  <div ref="editor"></div>
</template>

<script>
import { onMounted, onBeforeUnmount, ref } from "vue";
import WangEditor from "wangeditor";
const { BtnMenu } = WangEditor;

export default {
  props: {
    modelValue: {
      type: String,
      default: "",
    },
  },
  emits: ["update:modelValue", "getElems"],
  setup(props, { emit }) {
    const editor = ref();
    let instance;
    onMounted(() => {
      class selfEditPic extends BtnMenu {
        constructor(editor) {
          // data-title属性表示当鼠标悬停在该按钮上时提示该按钮的功能简述
          const $elem = WangEditor.$(
            `<div class="w-e-menu w-e-menu-pic" data-title="pic">
            <button class="w-e-menu-pic-btn"></button>
          </div>`
          );
          super($elem, editor);
        }
        // 自定义菜单点击事件
        clickHandler() {
          console.log("点击了， 可以发送一个事件出去");
        }
      }
      // 注册自定义菜单
      WangEditor.registerMenu("selfPicMenuKey", selfEditPic);

      instance = new WangEditor(editor.value);
      Object.assign(instance.config, {
        height: "auto",
        onchange(val) {
          emit("update:modelValue", val);
        },
      });
      instance.create();
      // 内容初始化
      instance.txt.html(props.modelValue);
      // 获取DOM
      emit("getElems", getElems());
    });

    onBeforeUnmount(() => {
      instance.destroy();
      instance = null;
    });

    const getElems = () => {
      return instance.$textElem.elems[0];
    };

    return {
      editor,
      getElems,
    };
  },
};
</script>

<style lang="scss" scoped>
::v-deep .w-e-text {
  min-height: 300px !important;
}
</style>
