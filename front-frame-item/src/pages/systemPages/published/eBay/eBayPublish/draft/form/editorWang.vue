<template>
  <div ref="editorRef"></div>
</template>

<script>
import {
  defineComponent,
  reactive,
  toRefs,
  onMounted,
  ref,
  onBeforeUnmount,
  getCurrentInstance,
  watch,
  nextTick,
} from "vue";
import E from "wangeditor";
const { BtnMenu } = E;
import xss from "xss";
// import { useI18n } from 'vue-i18n'
// import i18next from 'i18next'
// import _ from 'lodash'
import { editConfig } from "@pagesSystem/published/lazada/config";
// import localZh from './locale_zh'
// import localeEn from './locale_en'

export default defineComponent({
  components: {},
  props: {
    currentRow: {
      type: Array,
      default: () => {
        return [];
      },
    },
    tabsActive: {
      type: [String, Number],
      default: () => {
        return "";
      },
    },
  },
  setup(props, context) {
    // const { locale } = useI18n()
    const { proxy } = getCurrentInstance();
    const editorRef = ref();
    let contentValue = "";
    let instance = null;
    const data = reactive({});

    function createEditInstance() {
      class selfEditPic extends BtnMenu {
        constructor(editor) {
          // data-title属性表示当鼠标悬停在该按钮上时提示该按钮的功能简述
          const $elem = E.$(
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
      E.registerMenu("selfPicMenuKey", selfEditPic);

      instance = new E(editorRef.value);
      // set cnfig
      Object.keys(editConfig).forEach((key) => {
        instance.config[key] = editConfig[key];
      });
      instance.config.placeholder = proxy.$t(instance.config.placeholder);

      instance.config.onchange = function (newHtml) {
        console.log("change 之后最新的 html", xss(newHtml));
        context.emit("change", xss(newHtml));
      };

      instance.config.linkImgCallback = function (src, alt, href) {
        console.log("图片 src ", src);
        console.log("图片文字说明", alt);
        console.log("跳转链接", href);
      };

      instance.config.onlineVideoCallback = function (video) {
        // 自定义回调内容，内容成功插入后会执行该函数
        console.log("插入视频内容", video);
      };

      instance.config.linkImgCheck = function (imgSrc, alt, href) {
        // 以下情况，请三选一
        // 1. 返回 true ，说明检查通过
        console.log(imgSrc, alt, href);
        return true;

        // // 2. 返回一个字符串，说明检查未通过，编辑器会阻止图片插入。会 alert 出错误信息（即返回的字符串）
        // return '图片 src 有 xxx 错误'
        // 3. 返回 undefined（即没有任何返回），说明检查未通过，编辑器会阻止图片插入。
        // 此处，你可以自定义提示错误信息，自由发挥
      };

      instance.config.onlineVideoCheck = function (video) {
        // 编辑器会根据返回的内容做校验：比如以下几种情况
        // 1. 返回 true ，说明检查通过
        console.log(video);
        return true;

        // 2. 返回一个字符串，说明检查未通过，编辑器会阻止视频插入。会 alert 出错误信息（即返回的字符串）
        // return '插入的视频 有 xxx 错误'
        // 3. 返回 undefined（即没有任何返回），说明检查未通过，编辑器会阻止视频插入。
        // 此处，你可以自定义提示错误信息，自由发挥
      };

      // instance.config.uploadImgServer = '/upload-img'
      instance.config.uploadImgFromMedia = function () {
        // 1.调用自己的媒体库并显示UI页面方法
        const imgUrl = "";
        // ...
        // 2.将媒体库返回的图片地址插入到编辑器中,假设imgUrl为媒体返回的图片地址变量
        instance.cmd.do(
          "insertHTML",
          `<img src="${imgUrl}" style="max-width:100%;"/>`
        );
      };

      // set lang
      // instance.config.lang = locale.value.indexOf('zh') > -1 ? 'zh-CN' : 'en'
      // instance.i18next = i18next
      // instance.config.languages['zh-CN'] = {
      //   wangEditor: getDeepMinxin(localZh, instance.config.languages['zh-CN'].wangEditor)
      // }
      // instance.config.languages['en'] = {
      //   wangEditor: getDeepMinxin(localeEn, instance.config.languages['en'].wangEditor)
      // }
      instance.create();
      instance.txt.html(contentValue);
    }

    const editDestroy = () => {
      instance.destroy();
      instance = null;
    };

    onMounted(() => {
      createEditInstance();
    });

    watch(
      () => props.tabsActive,
      (val) => {
        nextTick(() => {
          let index = val - 1;
          contentValue =
            props.currentRow.length !== 0
              ? props.currentRow[index].descValue
              : "";
          instance.txt.html(contentValue);
        });
      },
      {
        immediate: true,
      }
    );
    const getHtml = () => {
      return xss(instance.txt.html());
    };
    onBeforeUnmount(() => {
      editDestroy();
    });

    return {
      ...toRefs(data),
      getHtml,
      editDestroy,
      editorRef,
    };
  },
});
</script>
