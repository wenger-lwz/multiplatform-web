<template>
  <div class="repair-service" id="repairService-lz">
    <h2 class="title">保修服务</h2>
    <gj-form
      ref="repairFormRef"
      :model="repairServiceLz"
      :rules="rules"
      class="repair-service-form"
      :label-col-props="{ span: 24 }"
      :wrapper-col-props="{ span: 24 }"
    >
      <gj-row :gutter="24">
        <gj-col :span="8">
          <gj-form-item
            field="warrantyType"
            :label-col-style="{ 'justify-content': 'flex-start' }"
            label="保修类型"
            :validate-trigger="validateTriggerOpt"
          >
            <gj-select
              placeholder="请选择"
              allow-clear
              :trigger-props="{
                updateAtScroll: true,
              }"
              v-model="repairServiceLz.warrantyType"
            >
              <gj-option
                v-for="it in warrantyTypeOpt"
                :value="it.name"
                :key="it.name"
                >{{ it.name }}</gj-option
              >
            </gj-select>
          </gj-form-item>
        </gj-col>
        <gj-col :span="8">
          <gj-form-item
            field="warrantyTime"
            :label-col-style="{ 'justify-content': 'flex-start' }"
            label="保修期"
          >
            <gj-select
              placeholder="请选择"
              allow-clear
              :trigger-props="{
                updateAtScroll: true,
              }"
              v-model="repairServiceLz.warrantyTime"
            >
              <gj-option
                v-for="it in warrantyTimeOpt"
                :value="it.name"
                :key="it.name"
                >{{ it.name }}</gj-option
              >
            </gj-select>
          </gj-form-item>
        </gj-col>
        <gj-col :span="8">
          <gj-form-item
            field="people"
            :label-col-style="{ 'justify-content': 'flex-start' }"
            label="保修政策"
          >
            <gj-input
              v-model="repairServiceLz.warrantyPolicy"
              :max-length="255"
              placeholder="请输入"
              allow-clear
              show-word-limit
            />
          </gj-form-item>
        </gj-col>
      </gj-row>
    </gj-form>
  </div>
</template>

<script>
import {
  reactive,
  toRefs,
  watch,
  getCurrentInstance,
  onBeforeMount,
} from "vue";
import { useStore } from "vuex";
import { setForm2 } from "@/utils/fnBusiness";
import { validateTriggerOpt } from "@common";

export default {
  props: {
    rulesObj: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  setup(props) {
    const key = "repairServiceLz";
    const { proxy } = getCurrentInstance();
    const store = useStore();
    const data = reactive({
      [key]: {
        warrantyType: "",
        warrantyTime: "",
        warrantyPolicy: "",
      },
      rules: {},
      warrantyTypeOpt: [],
      warrantyTimeOpt: [],
      validateTriggerOpt,
    });

    watch(
      () => store.getters.getProperty,
      (val) => {
        data.warrantyItem = val?.warrantyItem || [];
        data.warrantyTypeOpt =
          data.warrantyItem.find((item) => item.name === "warranty_type")
            ?.options || [];
        data.warrantyTimeOpt =
          data.warrantyItem.find((item) => item.name === "warranty")?.options ||
          [];
      }
    );

    const submitForm = () => {
      return setForm2(proxy, key, data[key], "repairFormRef");
    };

    const setPageData = (respData) => {
      data[key].warrantyType = respData.warrantyType;
      data[key].warrantyTime = respData.warranty;
      data[key].warrantyPolicy = respData.productWarranty;
    };

    onBeforeMount(() => {
      props.rulesObj.forEach((item) => {
        data.rules[item.id] = [{ required: true, message: item.message }];
      });
    });

    return {
      ...toRefs(data),
      submitForm,
      setPageData,
    };
  },
};
</script>

<style lang="scss" scoped>
.repair-service {
  .title {
    padding: 16px 0 2px 0px;
    font-size: 14px;
  }
  .repair-service-form {
    box-sizing: border-box;
    padding: 0 16px 0 8px;
  }
}
</style>
