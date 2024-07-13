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
      <gj-tabs
        v-model="activeKey"
        type="card-gutter"
        :editable="true"
        @add="handleAdd"
        @delete="handleDelete"
        @change="onChange"
        show-add-button
        class="tabs-box"
      >
        <gj-tab-pane
          v-for="item of productDescription.desc"
          :key="item.key"
          :title="item.title"
        >
          <gj-textarea
            :ref="`area${activeKey}`"
            v-model="item.content"
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
        desc: [
          {
            key: "1",
            title: "001",
            content: "描述1",
          },
        ],
      },
      dialogVisible: false,
      activeKey: 1,
    });

    let count = 1;

    const handleAdd = (event, val) => {
      if (val) {
        val.map((item) => {
          count++;

          data[key].desc.push({
            key: `${count}`,
            title: `00${count}`,
            content: item,
          });
        });
      } else {
        count++;

        data[key].desc.push({
          key: `${count}`,
          title: `00${count}`,
          content: `描述 ${count}`,
        });
      }
    };

    const handleDelete = (key) => {
      data["productDescription"].desc = data["productDescription"].desc.filter(
        (item) => item.key !== key
      );
    };

    const validate = () => {
      return proxy.$refs.productDescriptionFormRef.validate();
    };

    const resetFields = () => {
      proxy.$refs.productDescriptionFormRef.resetFields();
    };

    const onOpenMaterialCenter = () => {
      data.dialogVisible = true;
    };

    const onChange = (key) => {
      data.activeKey = key;
      // console.log(proxy.$refs[`area${data.activeKey}`]);
    };

    const confirm = (val) => {
      if (val.length > 0) {
        // const v = data[key].desc.filter((item) => item.key == data.activeKey);
        let arr = [];
        val.map((item) => arr.push(item.content));
        handleAdd(event, arr);

        // console.log(v[0].content, '过滤出来后的值');

        // data[key].desc.forEach((item) => {
        // 替换
        /* if (item.key == data.activeKey) {
            item.content = x;
          } */

        // 追加
        /* if (item.key == data.activeKey) {
            item.content = v[0].content + x;
            return;
          }
        }); */
        // v.content = val
        /*  console.log(x.join(''), '++');
        v.content = x.join(''); */
        // console.log(data[key].desc, '追加完成后的值');
        /* val.forEach((item) => {
          data[key].desc.content = item.content;
          proxy.$refs[`area${data.activeKey}`];
        }); */
      }
      data.dialogVisible = false;
    };

    const cancel = () => {
      data.dialogVisible = false;
    };

    const setPageData = (aData) => {
      if (aData.descriptions && aData.descriptions.length > 0) {
        let arr = [];
        arr = aData.descriptions.map((item, index) => {
          return {
            key: index + 1,
            title: "00" + (index + 1),
            content: item,
          };
        });
        data.productDescription.desc = arr;
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
      handleAdd,
      handleDelete,
      validate,
      resetFields,
      submitForm,
      onOpenMaterialCenter,
      confirm,
      cancel,
      onChange,
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
.tabs-box {
  /deep/.arco-tabs-content {
    border: 1px solid #e5e6e8;
    box-sizing: border-box;
    border-radius: 0px 4px 4px 4px;
    padding: 12px;
  }
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
  /deep/.arco-textarea {
    height: 120px;
    background: rgba(0, 4, 48, 0.05);
    border-radius: 4px;
    color: #333659;
    font-size: 12px;
  }
}
</style>
