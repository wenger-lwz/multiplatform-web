<template>
  <gj-form
    ref="from"
    :model="createFrom"
    :rules="rules"
    :label-align="'right'"
    :auto-label-width="true"
  >
    <!-- <gj-form-item
      label="标签编码"
      field="labelCode"
      :validate-trigger="['change', 'input', 'blur']"
    >
      <gj-input
        v-model="createFrom.labelCode"
        placeholder="请输入"
        show-word-limit
        :max-length="100"
        :disabled="fromType === 1"
      ></gj-input>
    </gj-form-item> -->

    <gj-form-item
      label="平台"
      :validate-trigger="['change', 'input', 'blur']"
      field="platformId"
    >
      <gj-select v-model="createFrom.platformId" placeholder="请选择">
        <gj-option
          v-for="item in labelTypeList"
          :value="item.codeId"
          :key="item.codeId"
        >
          {{ item.label }}
        </gj-option>
      </gj-select>
    </gj-form-item>
    <gj-form-item
      label="店铺"
      :validate-trigger="['change', 'input', 'blur']"
      field="erpShopId"
    >
      <gj-select
        v-model="createFrom.erpShopId"
        placeholder="请选择"
        @change="getErpShopId"
      >
        <gj-option v-for="item in shopsList" :value="item.id" :key="item.id">
          {{ item.name }}
        </gj-option>
      </gj-select>
    </gj-form-item>
    <gj-form-item
      label="客服"
      :validate-trigger="['change', 'input', 'blur']"
      field="customerServerId"
    >
      <!-- <gj-select
        v-model="createFrom.customerServerId"
        placeholder="请选择"
        :disabled="fromType === 1"
      >
        <gj-option
          v-for="item in labelTypeList"
          :value="item.value"
          :key="item.value"
        >
          {{ item.label }}
        </gj-option>
      </gj-select> -->
      <customerSelectDirector
        placeholder="客服"
        popup-container="#multiplatform-web"
        v-model="createFrom.customerServerId"
        @change="getCustomerServerId($event)"
      ></customerSelectDirector>
    </gj-form-item>
    <!-- 
    <gj-form-item
      label="标签名称"
      field="title"
      :validate-trigger="['change', 'input', 'blur']"
    >
      <gj-input
        v-model="createFrom.title"
        placeholder="请输入"
        show-word-limit
        :max-length="200"
      ></gj-input>
    </gj-form-item>

    <gj-form-item
      label="描述"
      class="describeContent"
      field="describeContent"
      :validate-trigger="['change', 'input', 'blur']"
    >
      <gj-textarea
        v-model="createFrom.describeContent"
        placeholder="请输入"
        show-word-limit
        :max-length="1000"
      />
    </gj-form-item> -->
  </gj-form>
</template>

<script>
import {
  defineComponent,
  reactive,
  toRefs,
  getCurrentInstance,
  watchEffect,
  onMounted,
} from "vue";
import { setForm } from "@/utils/fnBusiness";
import { labelTypeList } from "../config/allocationRulesPage";
import { getAllocationRuleshopsList } from "@/api/customerService/infrastructure.js";
import customerSelectDirector from "@/components/customerSelectDirector.vue";

export default defineComponent({
  components: { customerSelectDirector },
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
    rulesData: {
      type: String,
      default: () => {
        return "1";
      },
    },
  },
  setup(props) {
    const { proxy } = getCurrentInstance();
    const key = "createFrom";

    const data = reactive({
      labelTypeList: labelTypeList, // 标签列表
      shopsList: [],
      departmentList: [],
      // 创建/ 编辑标签
      createFrom: {
        erpShopName: null, //店铺名称
        erpShopId: null, //店铺
        customerServerId: null, //客服id
        customerServerName: null, //客服名称
        platformId: null, // 平台
        allocationRule: props.rulesData, // 分配规则 1:按店铺;2:按商品目录3:按消息（23后续迭代）
      },
      rules: {
        platformId: [
          {
            required: true,
            message: "请完成必填项输入",
          },
        ],
        erpShopId: [
          {
            required: true,
            message: "请完成必填项输入",
          },
        ],
        customerServerId: [
          {
            required: true,
            message: "请完成必填项输入",
          },
        ],
      },
    });

    const submitForm = () => {
      return setForm(proxy, key, data[key], "from");
    };

    const resetForm = () => {
      proxy.$refs["from"].resetFields();
    };
    // 获取店铺数据
    const allocationRuleshopsList = () => {
      data.shopsList = [];
      getAllocationRuleshopsList().then((item) => {
        data.shopsList = item.data;
      });
    };

    const getErpShopId = (val) => {
      data.createFrom.erpShopName = "";
      if (data.shopsList && data.shopsList.length > 0) {
        data.shopsList.forEach((res) => {
          if (res.id === val) {
            data.createFrom.erpShopName = res.name;
          }
        });
      }
    };
    const getCustomerServerId = (val) => {
      data.createFrom.customerServerName = "";
      if (val.toString() !== "[object, Object]") {
        data.createFrom.customerServerName = val?.label;
      }
    };
    onMounted(() => {
      allocationRuleshopsList();
    });

    watchEffect(() => {
      // 新建
      if (props.fromType === 2) {
        data.createFrom.erpShopName = null;
        data.createFrom.erpShopId = null;
        data.createFrom.customerServerId = null;
        data.createFrom.customerServerName = null;
        data.createFrom.platformId = null;
        data.createFrom.allocationRule = props.rulesData;
      } else {
        // 编辑
        const {
          erpShopName,
          erpShopId,
          customerServerId,
          customerServerName,
          platformId,
          allocationRule,
        } = props.row;
        data.createFrom = {
          ...data.createFrom,
          erpShopName,
          erpShopId,
          customerServerId,
          customerServerName,
          platformId,
          allocationRule,
        };
      }
    });

    return {
      ...toRefs(data),
      submitForm,
      resetForm,
      getErpShopId,
      getCustomerServerId,
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
