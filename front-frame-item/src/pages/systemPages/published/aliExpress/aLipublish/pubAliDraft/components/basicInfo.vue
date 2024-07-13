<template>
  <div class="blockBox">
    <div class="title">基础信息</div>
    <gj-form
      :model="basicInfo"
      class="form"
      :rules="rules"
      ref="basicForm"
      :label-col-props="{ span: 24 }"
      :wrapper-col-props="{ span: 24 }"
      label-align="left"
    >
      <gj-row :gutter="24">
        <gj-col :span="8">
          <gj-form-item label="店铺" validate-trigger="change" field="shopId">
            <gj-select
              v-model="basicInfo.shopId"
              placeholder="请选择"
              allow-clear
              @change="change"
              :trigger-props="{
                updateAtScroll: true,
              }"
            >
              <gj-option
                v-for="item in shopList"
                :label="item.shopName"
                :value="item.shopId"
                :key="item.shopId"
              ></gj-option>
            </gj-select>
          </gj-form-item>
        </gj-col>
        <gj-col :span="8">
          <gj-form-item
            label="负责人"
            validate-trigger="change"
            required
            field="chargePersonId"
          >
            <select-director
              v-model="basicInfo.chargePersonId"
              :cascader-props="cascaderProps"
              placeholder="请选择"
              :trigger-props="{
                updateAtScroll: true,
              }"
            />
          </gj-form-item>
        </gj-col>
        <gj-col :span="8">
          <gj-form-item label="产品分类">
            <gj-select
              v-model="basicInfo.categoryId"
              placeholder="请选择"
              allow-clear
              :trigger-props="{
                updateAtScroll: true,
              }"
            >
              <gj-option
                :value="item.category"
                v-for="item in categoryList"
                :key="item.category"
                >{{ item.categoryName }}</gj-option
              >
            </gj-select>
          </gj-form-item>
        </gj-col>
      </gj-row>
    </gj-form>
  </div>
</template>

<script>
import {
  defineComponent,
  reactive,
  toRefs,
  getCurrentInstance,
  onMounted,
  watch,
} from "vue";
import { setForm2 } from "@/utils/fnBusiness";
import { getShopList } from "@api/published/aliexpress";
import { getCategoryList } from "@api/published/common";
import SelectDirector from "@/components/SelectDirector.vue";
export default defineComponent({
  components: {
    // SelectUser,
    SelectDirector,
  },
  props: {
    editInfo: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  setup(props, { emit }) {
    const { proxy } = getCurrentInstance();
    const key = "basicInfo";
    const data = reactive({
      cascaderProps: {
        popupContainer: "#multiplatform-web",
        allowSearch: true,
        allowClear: true,
      },
      basicInfo: {
        chargePersonId: "",
        categoryId: "",
        shopId: "",
      },
      rules: {
        chargePersonId: [
          {
            required: true,
            message: "请选择负责人",
            trigger: "change",
          },
        ],
        shopId: [
          {
            required: true,
            message: "请选择店铺",
            trigger: "change",
          },
        ],
      },
      shopList: [],
      categoryList: [],
      employeeList: [],
      editData: props.editInfo,
    });

    // const onScrollListing = () => {
    //   const scrollDom = document.querySelector('.arco-modal-body')
    //   scrollDom.addEventListener('scroll', (e) => {
    //     document.documentElement.dispatchEvent(new MouseEvent('mousedown'))
    //     document.documentElement.dispatchEvent(new MouseEvent('mouseup'))
    //   })
    // }

    onMounted(() => {
      // onScrollListing()
      getCategoryList().then((res) => {
        data.categoryList = res.data;
      });

      getShopList({ platformCode: "ALIEXPRESS" }).then((res) => {
        data.shopList = res.data;
      });
    });
    const submitForm = () => {
      return setForm2(proxy, key, data[key], "basicForm");
    };

    const change = () => {
      emit("shopIdChange", data.basicInfo.shopId);
    };

    watch(
      () => props.editInfo,
      (newValue) => {
        if (JSON.stringify(newValue) != "{}") {
          data.editData = JSON.parse(JSON.stringify(newValue));
          data.basicInfo.chargePersonId = data.editData.chargePersonId;
          data.basicInfo.categoryId = data.editData.categoryId;
          data.basicInfo.shopId = data.editData.shopId;
        }
      },
      { deep: true }
    );

    return {
      ...toRefs(data),
      submitForm,
      change,
    };
  },
});
</script>
<style lang="scss" scoped>
// /deep/.arco-form-item-label-col {
//   line-height: normal;
// }
.blockBox {
  .title {
    padding: 12px 0 2px 0px;
    font-size: 14px;
    font-weight: 600;
  }
  .form {
    box-sizing: border-box;
    padding: 0 16px 0 8px;
  }
}
</style>
