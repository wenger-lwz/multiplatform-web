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
          <gj-form-item
            label="负责人"
            validate-trigger="change"
            required
            field="chargePersonId"
          >
            <select-director
              placeholder="请选择"
              v-model="basicInfo.chargePersonId"
              :cascader-props="cascaderProps"
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
              @change="categoryChange"
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
import { getCategoryList } from "@api/published/common";
import SelectDirector from "@/components/SelectDirector";
export default defineComponent({
  components: {
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
  setup(props) {
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
        categoryName: "",
      },
      rules: {
        chargePersonId: [
          {
            required: true,
            message: "请选择负责人",
            trigger: "change",
          },
        ],
      },
      categoryList: [],
      employeeList: [],
      editData: props.editInfo,
    });

    onMounted(() => {
      getCategoryList().then((res) => {
        data.categoryList = res.data;
      });
    });

    const categoryChange = (val) => {
      data.basicInfo.categoryName =
        data.categoryList.find((it) => it.category === val)?.categoryName || "";
    };

    const submitForm = () => {
      console.log(data[key]);
      categoryChange(data.basicInfo.categoryId);
      return setForm2(proxy, key, data[key], "basicForm");
    };

    watch(
      () => props.editInfo,
      (newValue) => {
        if (JSON.stringify(newValue) != "{}") {
          data.editData = JSON.parse(JSON.stringify(newValue));
          data.basicInfo.chargePersonId = newValue.chargePersonId;
          data.basicInfo.categoryId = newValue.categoryId;
        }
      },
      { deep: true }
    );

    return {
      ...toRefs(data),
      submitForm,
      categoryChange,
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
