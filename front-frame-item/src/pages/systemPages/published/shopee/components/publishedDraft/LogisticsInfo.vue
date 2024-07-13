<template>
  <div class="logistics-info" id="logistics-info">
    <h2 class="title">物流信息</h2>
    <gj-form
      ref="logisticsInfoFormRef"
      :model="logisticsInfo"
      class="logistics-info-form"
      :label-col-props="{ span: 24 }"
      :wrapper-col-props="{ span: 24 }"
      :rules="rules"
    >
      <gj-row :gutter="24">
        <gj-col :span="8">
          <gj-form-item
            class="mb8"
            field="weight"
            :label-col-style="{ 'justify-content': 'flex-start' }"
            label="重量"
            :validate-trigger="['change', 'blur']"
          >
            <gj-input-number
              v-model="logisticsInfo.weight"
              placeholder="请输入"
              allow-clear
              min="0"
            >
              <template #suffix>Kg</template>
            </gj-input-number>
          </gj-form-item>
        </gj-col>
        <gj-col :span="8">
          <gj-form-item
            class="mb8"
            :label-col-style="{ 'justify-content': 'flex-start' }"
            label="包装尺寸(单位：CM)"
          >
            <gj-input-number
              :hide-button="true"
              placeholder="请输入"
              v-model="logisticsInfo.long"
              min="0"
            >
              <template #prefix>长</template>
            </gj-input-number>
            <span class="input-seperate">*</span>
            <gj-input-number
              :hide-button="true"
              placeholder="请输入"
              v-model="logisticsInfo.wide"
              min="0"
            >
              <template #prefix>宽</template>
            </gj-input-number>
            <span class="input-seperate">*</span>
            <gj-input-number
              :hide-button="true"
              placeholder="请输入"
              v-model="logisticsInfo.high"
              min="0"
            >
              <template #prefix>高</template>
            </gj-input-number>
          </gj-form-item>
        </gj-col>
      </gj-row>
      <gj-row :gutter="24">
        <gj-col>
          <div class="logistics-box">
            <h5 class="header">物流方式</h5>

            <div
              v-for="(item, index) in logisticsInfo.logisticsData"
              :key="index"
              class="logistics-content"
            >
              <gj-row :gutter="24">
                <gj-col :span="6">
                  <gj-form-item
                    field="logisticsMode"
                    :label-col-style="{ 'justify-content': 'flex-start' }"
                  >
                    <template #label>
                      <template v-if="index == 0">
                        物流方式
                        <span class="sync-logistics" @click="syncLogistics"
                          >同步shopee物流</span
                        >
                      </template>
                      <template v-else></template>
                    </template>
                    <gj-select
                      v-model="item.logisticsListVal"
                      placeholder="请选择"
                      allow-clear
                    >
                      <gj-option
                        v-for="item in logisticsListOpt"
                        :key="item.logistics_channel_id"
                        :value="item.logistics_channel_name"
                        >{{ item.logistics_channel_name }}</gj-option
                      >
                    </gj-select>
                  </gj-form-item>
                </gj-col>
                <gj-col :span="6">
                  <gj-form-item
                    field="freight"
                    :label="index >= 1 ? '' : '运费'"
                    :label-col-style="{ 'justify-content': 'flex-start' }"
                  >
                    <div class="freight-text">根据重量或大小自动计算</div>
                  </gj-form-item>
                </gj-col>
                <gj-col :span="6">
                  <gj-form-item
                    field="freeShipping"
                    :label="index >= 1 ? '' : '免邮'"
                    :label-col-style="{ 'justify-content': 'flex-start' }"
                  >
                    <div>
                      <gj-switch
                        v-model="item.isFreeShipping"
                        size="small"
                      ></gj-switch>
                      <div class="freeshipping-text">
                        <span v-if="item.isFreeShipping == true">已开启</span>
                        <span v-else>已关闭</span>
                      </div>
                    </div>
                  </gj-form-item>
                </gj-col>
                <gj-col :span="6">
                  <gj-form-item
                    field="action"
                    :label="index >= 1 ? '' : '&nbsp;'"
                    :label-col-style="{ 'justify-content': 'flex-end' }"
                  >
                    <div class="action-columns">
                      <SvgIcon
                        svgClass="addTitle"
                        :width="24"
                        @click="addLogistics"
                        v-show="
                          index === logisticsInfo.logisticsData.length - 1
                        "
                      ></SvgIcon>
                      <SvgIcon
                        v-show="logisticsInfo.logisticsData.length > 1"
                        svgClass="subtract"
                        :width="24"
                        @click="removeLogistics(index)"
                      ></SvgIcon>
                    </div>
                  </gj-form-item>
                </gj-col>
              </gj-row>
            </div>
          </div>
        </gj-col>
      </gj-row>
    </gj-form>
  </div>
</template>

<script>
import {
  getCurrentInstance,
  reactive,
  toRefs,
  onMounted,
  defineComponent,
} from "vue";
import { useStore } from "vuex";
import { setForm2 } from "@/utils/fnBusiness";
import { M_T } from "@/store/mutationsTypes";
import SvgIcon from "@/components/SvgIcon";
import { validateTriggerOpt } from "@common";
import { getLogistics } from "@/api/published/shopee";

export default defineComponent({
  name: "LogisticsInfo",
  inheritAttrs: false,
  props: {},
  components: {
    SvgIcon,
  },
  setup() {
    const store = useStore();
    const key = "logisticsInfo";
    const { proxy } = getCurrentInstance();
    const data = reactive({
      [key]: {
        weight: "",
        long: "",
        wide: "",
        high: "",
        logisticsVal: "",
        logisticsData: [{ id: 0, isFreeShipping: false, logisticsListVal: "" }],
      },
      logisticsListOpt: [],
      shopId: "",
    });

    const rules = {
      weight: [{ required: true, message: "重量必填" }],
    };

    // 根据店铺shopId同步物流信息
    const syncLogistics = async () => {
      const id = store.getters?.getParams?.basicInfo?.shopId || data.shopId;

      if (id) {
        await getLogistics({ shopId: id }).then((res) => {
          if (res.code === 0) {
            data.logisticsListOpt = res.data;
          }
        });
      }
    };

    // 添加物流方式
    const addLogistics = () => {
      let num = data.logisticsInfo.logisticsData.length;
      data.logisticsInfo.logisticsData.push({
        id: num++,
        isFreeShipping: false,
        logisticsListVal: "",
      });
      data.logisticsInfo.logisticsData = [...data.logisticsInfo.logisticsData];
    };

    // 删除物流方式
    const removeLogistics = (index) => {
      data.logisticsInfo.logisticsData.splice(index, 1);
    };

    const submitForm = () => {
      return setForm2(proxy, key, data[key], "logisticsInfoFormRef");
    };
    const validate = () => {
      return proxy.$refs.logisticsInfoFormRef.validate();
    };
    const resetFields = () => {
      proxy.$refs.logisticsInfoFormRef.resetFields();
    };

    const saveDataStore = () => {
      const params = {
        [key]: data[key],
      };
      store.dispatch(M_T.PARAMS_QUERY, params);
    };

    const setPageData = (respData) => {
      data.shopId = respData.shopId;
      if (respData.dimension) {
        data[key].weight = respData.weight;
        data[key].high = respData.dimension.height;
        data[key].long = respData.dimension.length;
        data[key].wide = respData.dimension.width;
      }

      if (respData.logisticList && respData.logisticList.length > 0) {
        const d = respData.logisticList.map((item) => {
          return {
            id: item.logisticId,
            logisticsListVal: item.logisticName,
            isFreeShipping: item.free,
          };
        });

        data[key].logisticsData = d;
      }
      syncLogistics();
      saveDataStore();
    };

    onMounted(() => {
      // syncLogistics();
    });

    return {
      ...toRefs(data),
      validateTriggerOpt,
      rules,
      validate,
      resetFields,
      submitForm,
      setPageData,
      syncLogistics,
      addLogistics,
      removeLogistics,
    };
  },
});
</script>

<style lang="scss" scoped>
@import "../common/index.scss";
.addTitle {
  margin-right: 8px;
}
.logistics-content {
  margin-bottom: 8px;
  margin-top: 10px;
  /deep/.arco-form-item-label {
    color: #000430;
  }
}
.freight-text {
  width: 100%;
  line-height: 30px;
  padding-left: 12px;
  border: 1px dashed #cccdd6;
  border-radius: 4px;
  background-color: #fafafb;
  color: #808197;
}
.freeshipping-text {
  display: inline-block;
  padding-left: 4px;
  color: #333659;
}

.action-columns {
  justify-content: flex-end;
  width: 100%;
  display: flex;
}
</style>
