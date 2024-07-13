<template>
  <CommonPageAction currentRouterPermission="PLAT/PhonePool/view">
    <div class="phone-pool">
      <div class="tab-btn">
        <gj-button
          type="primary"
          @click="add"
          v-permissions="['PLAT/PhonePool/add']"
          >添加号码</gj-button
        >
      </div>
      <gj-tabs v-model="activityName" @change="handleClick">
        <gj-tab-pane key="1" title="UPC">
          <pool-component :phoneData="phonePoolData" :key="1"></pool-component>
        </gj-tab-pane>
        <gj-tab-pane key="2" title="EAN">
          <pool-component :phoneData="phonePoolData" :key="2"></pool-component>
        </gj-tab-pane>
        <gj-tab-pane key="3" title="ISBN">
          <pool-component :phoneData="phonePoolData" :key="3"></pool-component>
        </gj-tab-pane>
        <gj-tab-pane key="4" title="GTIN">
          <pool-component :phoneData="phonePoolData" :key="4"></pool-component>
        </gj-tab-pane>
      </gj-tabs>
      <gj-modal
        @cancel="resetForm('poolForm')"
        v-model:visible="visible"
        :title="formTitle"
        :unmount-on-close="true"
        :render-to-body="false"
        :closable="false"
      >
        <template #title>
          <div class="modal-title">
            <h4>添加号码</h4>
            <SvgIcon svgClass="close" :width="16" @click="resetForm" />
          </div>
        </template>
        <gj-form
          ref="poolForm"
          :model="addForm"
          :rules="rules"
          auto-label-width
          layout="vertical"
        >
          <gj-form-item field="codeType" hide-asterisk>
            <template #label>
              <span>号码类型</span>
              <span style="color: red; position: relative; top: 3px">*</span>
            </template>
            <gj-radio-group v-model="addForm.codeType">
              <gj-radio
                v-for="o in phoneTypeList"
                :value="o.value"
                :key="o.value"
                >{{ o.label }}</gj-radio
              >
            </gj-radio-group>
          </gj-form-item>
          <gj-form-item label="号码池" field="phonePool">
            <gj-textarea
              v-model="addForm.phonePool"
              :auto-size="{ minRows: 10, maxRows: 20 }"
              placeholder="多个号码用Enter换行"
            />
          </gj-form-item>
        </gj-form>
        <template #footer>
          <div class="footer-btn">
            <gj-button @click="resetForm" type="plain" status="normal"
              >取消</gj-button
            >
            <gj-button type="primary" @click="submitForm">确认</gj-button>
          </div>
        </template>
      </gj-modal>
    </div>
  </CommonPageAction>
</template>
<script>
import { defineComponent, ref, reactive, toRefs, onMounted } from "vue";
import CommonPageAction from "@/components/CommonPageAction.vue";
import PoolComponent from "./components/poolComponent.vue";
import SvgIcon from "@/components/SvgIcon.vue";
import {
  getPhonePoolList,
  savePhonePoolData,
} from "@/api/published/generalTools";
import { GjMessage } from "@gj/atom";
export default defineComponent({
  name: "PhonePool",
  components: {
    CommonPageAction,
    PoolComponent,
    SvgIcon,
  },
  setup() {
    const poolForm = ref();
    const data = reactive({
      activityName: "1",
      phonePoolData: [],
      visible: false,
      formTitle: "添加",
      addForm: {
        codeType: "1",
        phonePool: "",
      },
      phoneTypeList: [
        { value: "1", label: "UPC" },
        { value: "2", label: "EAN" },
        { value: "3", label: "ISBN" },
        { value: "4", label: "GTIN" },
      ],
      rules: {
        codeType: [{ required: true, message: "号码类型不能为空" }],
      },
    });
    const getList = () => {
      let params = {
        codeType: data.activityName,
      };
      getPhonePoolList(params)
        .then((res) => {
          console.log(res.data);
          data.phonePoolData = res.data;
        })
        .catch(() => {});
    };
    const handleClick = (newVal) => {
      data.activityName = newVal;
      getList();
    };
    const add = () => {
      data.visible = true;
    };
    const resetForm = () => {
      data.visible = false;
      poolForm.value.resetFields();
    };
    const submitForm = () => {
      poolForm.value.validate().then((valid) => {
        if (!valid) {
          // 请求接口
          submit();
        }
      });
    };
    const submit = () => {
      const codeList = data.addForm.phonePool
        .split(/\n/)
        .reduce((prev, cur) => {
          if (cur) {
            prev.push(cur);
          }
          return prev;
        }, []);
      let params = {
        codeType: data.addForm.codeType,
        codeList: codeList,
      };
      savePhonePoolData(params).then(() => {
        GjMessage.success("添加成功");
        data.addForm = {
          codeType: "1",
          phonePool: "",
        };
        data.visible = false;
        getList();
      });
    };
    onMounted(() => {
      getList();
    });
    return {
      ...toRefs(data),
      poolForm,
      handleClick,
      add,
      resetForm,
      submitForm,
    };
  },
});
</script>
<style scoped lang="scss">
.phone-pool {
  :deep(.arco-tabs-nav::before) {
    height: 1px;
  }
  .tab-btn {
    padding: 8px 12px;
    border-bottom: 1px solid var(--color-neutral-3);
  }
}
.modal-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  h4 {
    font-size: 14px;
  }
  svg {
    cursor: pointer;
  }
}
.footer-btn {
  display: flex;
  justify-content: end;
  gap: 8px;
}
</style>
