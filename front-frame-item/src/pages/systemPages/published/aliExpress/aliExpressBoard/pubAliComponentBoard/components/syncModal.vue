<template>
  <gj-modal
    v-model:visible="syncVisible"
    title="同步模板"
    title-align="start"
    :unmount-on-close="true"
    :maskClosable="false"
    :onClose="handleCancel"
    :width="400"
  >
    <gj-form
      :model="form"
      ref="syncForm"
      :label-col-props="{ span: 24 }"
      :wrapper-col-props="{ span: 24 }"
      label-align="left"
    >
      <!-- <gj-form-item
        field="timeZone"
        label="选择时区"
        validate-trigger="input"
        required
      >
        <gj-radio v-model="form.timeZone" :value="1">默认时区(北京)</gj-radio>
      </gj-form-item> -->

      <gj-form-item
        label="店铺"
        validate-trigger="input"
        field="shopId"
        :rules="[
          {
            required: true,
            message: '请选择店铺',
            validator: (value, cb) => validatorShopId(value, cb),
          },
        ]"
      >
        <gb-select
          class="search-gb-select"
          placeholder="店铺"
          :allow-clear="false"
          :max-tag-count="1"
          v-model="form.shopId"
        >
          <gb-select-option
            v-for="item in shopListOpt"
            :key="item.shopId"
            :value="item.shopId"
          >
            {{ item.shopName }}
          </gb-select-option>
        </gb-select>
      </gj-form-item>

      <gj-form-item
        label="类型"
        validate-trigger="input"
        field="componentTypes"
        :rules="[
          {
            required: true,
            message: '请选择模板类型',
            validator: (value, cb) => validatorType(value, cb),
          },
        ]"
      >
        <gb-select
          v-model="form.componentTypes"
          class="search-gb-select"
          placeholder="模板类型"
          :allow-clear="false"
          :max-tag-count="1"
        >
          <gb-select-option
            v-for="item in componentTypeList"
            :key="item.value"
            :value="item.value"
          >
            {{ item.label }}
          </gb-select-option>
        </gb-select>
      </gj-form-item>
    </gj-form>

    <template #footer>
      <div class="dalogFromBtn">
        <gj-button type="outline" @click="handleCancel">取消</gj-button>
        <gj-button type="primary" @click="handleOk"> 确定</gj-button>
      </div>
    </template>
  </gj-modal>
</template>
<script>
import {
  defineComponent,
  reactive,
  toRefs,
  watch,
  getCurrentInstance,
  onMounted,
} from "vue";
import { getListingCommonShop } from "@/api/published/common";
export default defineComponent({
  name: "",
  props: {
    dialogVisible: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
  },
  setup(props, { emit }) {
    const { proxy } = getCurrentInstance();
    const data = reactive({
      syncVisible: props.dialogVisible,
      form: {
        shopId: [],
        componentTypes: [],
      },
      shopListOpt: [],
      componentTypeList: [
        { value: 1, label: "商品分组" },
        { value: 2, label: "产品信息模块" },
        // { value: 3, label: '区域调价模板' },
        { value: 4, label: "车型库模板" },
        { value: 5, label: "尺码模板" },
        { value: 6, label: "运费模板" },
        { value: 7, label: "服务模板" },
      ],
    });

    const handleOk = () => {
      proxy.$refs["syncForm"].validate().then((res) => {
        if (!res) {
          emit("handleOk", data.form);
        }
      });
    };
    const handleCancel = () => {
      emit("handleCancel");
    };
    watch(
      () => props.dialogVisible,
      (newValue) => {
        data.syncVisible = newValue;
      }
    );
    const getShopListReq = () => {
      getListingCommonShop({ platformCode: "ALIEXPRESS" }).then((res) => {
        data.shopListOpt = res.data;
      });
    };

    const validatorType = (value, cb) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          if (data.form.componentTypes.length == 0) {
            cb("请选择模板类型");
          }
          resolve();
        }, 0);
      });
    };

    const validatorShopId = (value, cb) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          if (data.form.shopId.length == 0) {
            cb("请选择店铺");
          }
          resolve();
        }, 0);
      });
    };

    onMounted(() => {
      getShopListReq();
    });
    return {
      ...toRefs(data),
      handleCancel,
      handleOk,
      validatorType,
      validatorShopId,
      // shopIdsChange,
      // componentTypeChange,
    };
  },
});
</script>
<style scoped lang="scss">
/deep/.search-gb-select {
  width: 100%;
}
.dalogFromBtn {
  button {
    margin-left: 12px;
  }
}
</style>
