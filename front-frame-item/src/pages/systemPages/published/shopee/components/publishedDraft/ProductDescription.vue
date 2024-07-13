<template>
  <div class="productDescription" id="productDescription">
    <h2 class="title mb12">
      产品描述<span class="material-title" @click="onOpenMaterialCenter()"
        >素材中心</span
      >
    </h2>
    <gj-form
      ref="productDescriptionFormRef"
      :model="form"
      class="productDescription-form"
      :label-col-props="{ span: 24 }"
      :wrapper-col-props="{ span: 24 }"
      :rules="rules"
    >
      <gj-tabs v-model="activeKey" class="tabs-box">
        <gj-tab-pane>
          <gj-textarea
            v-model="productDescription.desc"
            placeholder="请输入描述"
            :max-length="3000"
            show-word-limit
            class="des-textarea"
          />
        </gj-tab-pane>
      </gj-tabs>
    </gj-form>
  </div>

  <mtCenterText
    v-model:visible="dialogVisible"
    @confirm="confirm"
    @close="cancel"
  />
</template>

<script>
import { reactive, toRefs, getCurrentInstance, watch } from "vue";
import { useStore } from "vuex";
import { setForm2 } from "@/utils/fnBusiness";
import { M_T } from "@/store/mutationsTypes";
import mtCenterText from "@pagesSystem/published/materialCenter/modal/text.vue";

export default {
  components: {
    mtCenterText,
  },
  setup() {
    const { proxy } = getCurrentInstance();
    const store = useStore();
    const key = "productDescription";
    const data = reactive({
      [key]: {
        desc: "",
      },
      dialogVisible: false,
      activeKey: 1,
    });

    const validate = () => {
      return proxy.$refs.productDescriptionFormRef.validate();
    };

    const resetFields = () => {
      proxy.$refs.productDescriptionFormRef.resetFields();
    };

    const onOpenMaterialCenter = () => {
      data.dialogVisible = true;
    };

    const confirm = (val) => {
      if (val.length > 0) {
        console.log(val.at(-1), "val.at(-1)");
        data.productDescription.desc = val.at(-1).content;
      }
      data.dialogVisible = false;
    };

    const cancel = () => {
      data.dialogVisible = false;
    };

    const setPageData = (aData) => {
      if (aData.description) {
        data.productDescription.desc = aData.description;
      }
    };

    const submitForm = () => {
      return setForm2(proxy, key, data[key], "productDescriptionFormRef");
    };

    watch(
      () => data[key],
      () => {
        const params = {
          [key]: data[key],
        };
        store.dispatch(M_T.PARAMS_QUERY, params);
      },
      { deep: true }
    );

    return {
      ...toRefs(data),
      validate,
      resetFields,
      submitForm,
      onOpenMaterialCenter,
      confirm,
      cancel,
      setPageData,
    };
  },
};
</script>

<style lang="scss" scoped>
.productDescription {
  .mb8 {
    margin-bottom: 8px;
  }
  .mb12 {
    margin-bottom: 12px;
  }
  .title {
    padding: 12px 0 2px 0px;
    font-size: 14px;
    .material-title {
      margin-left: 12px;
      font-size: 12px;
      font-weight: normal;
      color: #0045f0;
      cursor: pointer;
    }
  }
  .productDescription-form {
    box-sizing: border-box;
    padding: 0 16px 0 8px;
  }
}
/deep/.arco-tabs-nav {
  display: none;
}
/deep/.arco-tabs-content {
  padding-top: 0;
}
.tabs-box {
  /* /deep/.arco-tabs-content {
    border: 1px solid #e5e6e8;
    box-sizing: border-box;
    border-radius: 0px 4px 4px 4px;
    padding: 12px;
  } */
  /deep/.arco-tabs-nav-type-card-gutter .arco-tabs-tab {
    border-bottom: 0;
  }
  /deep/.arco-tabs-nav-type-card-gutter .arco-tabs-tab {
    height: 32px;
    font-size: 12px;
    background-color: #f7f8fa;
    color: #333659;
  }
  /deep/.arco-tabs-nav-type-card-gutter .arco-tabs-tab-active {
    background-color: #fff;
    color: #0045f0;
  }
}
/deep/.arco-tabs-nav::before {
  display: none;
}
.des-textarea {
  border: 0;
  /deep/.arco-textarea {
    height: 120px;
    background: rgba(0, 4, 48, 0.05);
    border-radius: 4px;
    color: #333659;
    font-size: 12px;
    resize: none;
  }
}
</style>
