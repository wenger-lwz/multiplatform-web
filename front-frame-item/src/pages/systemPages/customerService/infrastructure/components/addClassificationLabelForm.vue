<template>
  <gj-form
    ref="from"
    :model="createFrom"
    :rules="rules"
    :label-align="'right'"
    :auto-label-width="true"
  >
    <gj-form-item
      label="标签"
      field="label"
      :validate-trigger="['change', 'input', 'blur']"
    >
      <gj-input
        v-model="createFrom.label"
        placeholder="请输入"
        show-word-limit
        :max-length="100"
      ></gj-input>
    </gj-form-item>

    <!-- <gj-form-item
      label="关键字"
      class="describeContent"
      field="keywords"
      :validate-trigger="['change', 'input', 'blur']"
    >
      <gj-textarea
        v-model="createFrom.describeContent"
        placeholder="请输入"
        :auto-size="true"
        show-word-limit
        :max-length="1000"
      />
    </gj-form-item> -->
    <gj-form-item
      label="关键词"
      field="keywordsList"
      :validate-trigger="['change', 'input', 'blur']"
    >
      <gj-input
        v-model="createFrom.keywordsList"
        placeholder="请输入"
        show-word-limit
        :max-length="200"
        @input="searchKeywords"
      ></gj-input>
      <!-- <gb-input-more
        v-model="createFrom.keywordsList"
        placeholder="请输入"
        style="width: 200px"
        @search="searchKeywords"
      ></gb-input-more> -->
    </gj-form-item>
    <gj-form-item
      label="使用平台"
      :validate-trigger="['change', 'input', 'blur']"
    >
      <gj-select
        v-model="createFrom.platformCodes"
        placeholder="请选择"
        multiple
      >
        <gj-option
          v-for="item in labelTypeList"
          :value="item.codeId"
          :key="item.codeId"
        >
          {{ item.label }}
        </gj-option>
      </gj-select>
    </gj-form-item>
  </gj-form>
</template>

<script>
import {
  defineComponent,
  reactive,
  toRefs,
  getCurrentInstance,
  watchEffect,
} from "vue";
import { setForm } from "@/utils/fnBusiness";
import { reg } from "@/utils/reg.js";
import { platformList } from "../config/classificationLabelList.js";
export default defineComponent({
  props: {
    fromType: {
      type: Number,
      default: () => {
        return 2;
      },
    },
    // 编辑数据
    row: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  setup(props) {
    // 表单验证部分
    const checkLabelCode = (value, callback) => {
      if (!value) {
        callback();
      } else if (
        !reg.shopNameReg.test(value.trim()) ||
        reg.emoji.test(value.trim()) ||
        reg.html.test(value.trim())
      ) {
        callback("标签编码格式错误，且长度在100字以内");
      } else {
        callback();
      }
    };

    const checkTitle = (value, callback) => {
      // if (!value) {
      //   callback()
      // } else if (
      //   !reg.shopNameReg.test(value.trim()) ||
      //   reg.emoji.test(value.trim()) ||
      //   reg.html.test(value.trim())
      // ) {
      //   callback('标签名称格式错误，且长度在200字以内')
      // } else {
      //   callback()
      // }
      callback();
    };

    const { proxy } = getCurrentInstance();
    const key = "createFrom";

    const data = reactive({
      labelTypeList: platformList, // 标签列表
      // 创建/ 编辑标签
      createFrom: {
        label: "", // 标签code
        platformCodes: [], // 标签类型 // 1 订单标签 ; 2 图片标签
        // keywordsList: {
        //   inputValue: '',
        //   moreValue: [],
        // }, // 标签名称
        keywordsList: "",
        keywords: [],
      },
      rules: {
        label: [
          {
            required: true,
            message: "标签内容必填",
          },
          {
            min: 1,
            max: 100,
            message: "标签编码在1-100个字符之间",
          },
          { validator: checkLabelCode },
        ],
        platformCodes: [
          {
            required: true,
            message: "请选择标签分类",
          },
        ],
        keywordsList: [
          {
            required: true,
            message: "标签名称必填",
          },
          {
            min: 1,
            max: 200,
            message: "标签名称在1-200个字符之间",
          },
          { validator: checkTitle },
        ],
      },
    });

    const submitForm = () => {
      return setForm(proxy, key, data[key], "from");
    };

    const resetForm = () => {
      proxy.$refs["from"].resetFields();
    };
    const searchKeywords = (val) => {
      data.createFrom.keywords = [];
      let paramsList = val.split(";");
      let newlist = new Array();
      if (paramsList.length >= 1) {
        paramsList.forEach((element) => {
          if (element.indexOf("；") > -1) {
            newlist.push.apply(newlist, element.split("；"));
          } else {
            newlist.push(element);
          }
        });
      }
      data.createFrom.keywords = newlist
        .map((it) => it.trim())
        .filter((item) => {
          if (item) {
            return item;
          }
        });
    };

    watchEffect(() => {
      // 新建
      if (props.fromType === 2) {
        data.createFrom.label = "";
        data.createFrom.platformCodes = [];
        // data.createFrom.keywordsList = {
        //   inputValue: '',
        //   moreValue: [],
        // }
        data.createFrom.keywordsList = "";
      } else {
        // 编辑
        const { labelName, keyWords, platforms } = props.row;
        data.createFrom = {
          ...data.createFrom,
          label: labelName,
          keywordsList:
            keyWords.length > 0
              ? keyWords.map((item) => item.name).join(";")
              : "",
          keywords: keyWords.map((item) => item.name),
          platformCodes: platforms.map((item) => item.platformId),
        };
      }
    });
    return {
      ...toRefs(data),
      submitForm,
      resetForm,
      searchKeywords,
    };
  },
});
</script>

<style lang="scss" scoped>
.describeContent {
  :deep(.arco-form-item-wrapper-col) {
    min-height: 60px;
  }
}
</style>
