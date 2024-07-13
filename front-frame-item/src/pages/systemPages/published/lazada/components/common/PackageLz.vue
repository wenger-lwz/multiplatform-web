<template>
  <div class="packaging-lz" id="package-lz">
    <h2 class="title">包装信息</h2>
    <gj-form
      ref="packageFormRef"
      :model="packageLz"
      class="packaging-form"
      :label-col-props="{ span: 24 }"
      :wrapper-col-props="{ span: 24 }"
    >
      <gj-row>
        <gj-col :span="24">
          <gj-form-item
            field="hazmat"
            :label-col-style="{ 'justify-content': 'flex-start' }"
            label="危险物品"
          >
            <gj-checkbox-group v-model="packageLz.hazmat">
              <gj-checkbox
                v-for="it in packageLz.warrantyTypeOpt"
                :value="it.name"
                :key="it.name"
                >{{ it.name }}</gj-checkbox
              >
            </gj-checkbox-group>
          </gj-form-item>
        </gj-col>
      </gj-row>
      <gj-row>
        <gj-col :span="24">
          <gj-form-item
            field="packageContent"
            :label-col-style="{ 'justify-content': 'flex-start' }"
            label="包装内容"
          >
            <gj-textarea
              v-model="packageLz.packageContent"
              placeholder="Please enter something"
              :max-length="1000"
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
import { reactive, toRefs, watch, getCurrentInstance } from "vue";
import { useStore } from "vuex";
import { setForm2 } from "@/utils/fnBusiness";

export default {
  setup() {
    const key = "packageLz";
    const { proxy } = getCurrentInstance();
    const store = useStore();
    const data = reactive({
      [key]: {
        hazmat: [],
        packageContent: "",
        warrantyTypeOpt: [],
      },
    });

    watch(
      () => store.getters.getProperty,
      (val) => {
        const packageItem = val?.packageItem || [];
        data[key].warrantyTypeOpt =
          packageItem.find((item) => item.name === "Hazmat")?.options || [];
      }
    );
    const submitForm = () => {
      return setForm2(proxy, key, data[key], "packageFormRef");
    };

    const setPageData = (respData) => {
      data[key].hazmat = respData.hazmat?.split(",") || [];
      data[key].packageContent = respData.packageContent;
    };
    return {
      ...toRefs(data),
      submitForm,
      setPageData,
    };
  },
};
</script>

<style lang="scss" scoped>
.packaging-lz {
  .title {
    padding: 16px 0 2px 0px;
    font-size: 14px;
  }
  .packaging-form {
    box-sizing: border-box;
    padding: 0 16px 0 8px;
  }

  :deep(.arco-textarea-wrapper) textarea {
    height: 64px;
  }
  :deep(.arco-form-item) {
    margin-bottom: 10px;
  }
}
</style>
