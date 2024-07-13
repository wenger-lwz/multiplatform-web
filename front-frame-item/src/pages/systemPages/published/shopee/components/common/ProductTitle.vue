<template>
  <div class="squre-line" v-bind="$attrs">
    <div
      class="title-form-item"
      v-for="(item, index) in productInfo.titleList"
      :key="index"
    >
      <gj-form-item
        :label-col-style="{ 'justify-content': 'flex-start' }"
        field="titleDescript"
        :rules="index >= 1 ? undefined : titleRules"
      >
        <template #label>
          <span v-if="index <= 0">
            产品标题
            <gj-button type="text" @click="openMtCenterTitle"
              >素材中心</gj-button
            >
          </span>
          <span v-else> </span>
        </template>
        <gj-input
          @input="validateTriggeHandler"
          @blur="validateTriggeHandler"
          v-model="item.titleDesc"
          :max-length="255"
          placeholder="请输入"
          allow-clear
          show-word-limit
        />
      </gj-form-item>
      <template
        v-if="productInfo.titleList.length >= MAX_KEY_LENGTH && showTooltip"
      >
        <div class="btn-svg">
          <gj-tooltip
            content="当前只能添加20个标题，需删除一个方可添加"
            position="top"
            background-color="#fdf2ea"
            :content-style="{
              color: '#ee7c30',
            }"
          >
            <SvgIcon
              svgClass="addTitle"
              :width="24"
              v-show="index === productInfo.titleList.length - 1"
              @click="addTitile"
            ></SvgIcon
            ><SvgIcon
              v-show="productInfo.titleList.length > 1"
              svgClass="subtract"
              :width="24"
              @click="removeTitile(index)"
            ></SvgIcon>
          </gj-tooltip>
        </div>
      </template>
      <template v-if="productInfo.titleList.length < MAX_KEY_LENGTH">
        <div class="btn-svg">
          <SvgIcon
            svgClass="addTitle"
            :width="24"
            v-show="index === productInfo.titleList.length - 1"
            @click="addTitile"
          ></SvgIcon
          ><SvgIcon
            v-show="productInfo.titleList.length > 1"
            svgClass="subtract"
            :width="24"
            @click="removeTitile(index)"
          ></SvgIcon>
        </div>
      </template>
    </div>
  </div>
  <mtCenterTitle
    v-if="dialogVisible"
    v-model:visible="dialogVisible"
    @confirm="confirm"
    @close="cancel"
  />
</template>

<script>
import { reactive, toRefs, getCurrentInstance, watch, nextTick } from "vue";
import { validateTriggerOpt } from "@common";
import mtCenterTitle from "@pagesSystem/published/materialCenter/modal/title.vue";
import SvgIcon from "@/components/SvgIcon";
const MAX_KEY_LENGTH = 20;

export default {
  props: {
    titleList: {
      type: Array,
      default: () => [],
    },
  },
  emits: ["update:titleList"],
  components: {
    SvgIcon,
    mtCenterTitle,
  },
  setup(props, { emit }) {
    const key = "productInfo";
    const { proxy } = getCurrentInstance();
    const data = reactive({
      validateTriggerOpt,
      [key]: {
        titleList: props.titleList,
      },
      dialogVisible: false,
      MAX_KEY_LENGTH,
      showTooltip: false,
    });
    const addTitile = () => {
      if (data[key].titleList?.length >= MAX_KEY_LENGTH) {
        return;
      }
      data[key].titleList.push({ titleDesc: "" });
      emit("update:titleList", data[key].titleList);
      nextTick(() => {
        data.showTooltip = true;
      });
    };
    const removeTitile = (index) => {
      data[key].titleList[index].titleDesc = "";
      data[key].titleList.splice(index, 1);
      validateTriggeHandler();
      emit("update:titleList", data[key].titleList);
    };
    const titleRules = [
      {
        required: true,
        message: "标题必填",
        validator: (value, cb) => {
          return new Promise((resolve) => {
            setTimeout(() => {
              if (!data[key].titleList.find((item) => item.titleDesc.trim())) {
                cb("标题必填");
              }
              resolve();
            }, 0);
          });
        },
      },
    ];
    watch(
      () => props.titleList,
      () => {
        data[key].titleList = props.titleList;
      },
      { deep: true }
    );
    const validateTriggeHandler = () => {
      proxy.$parent.validateField(["titleDescript"]);
    };

    const openMtCenterTitle = () => {
      data.dialogVisible = true;
    };

    const confirm = (val) => {
      if (val.length > 0) {
        val.forEach((item) => {
          data[key].titleList.push({ titleDesc: item.content });
        });
      }
      emit("update:titleList", data[key].titleList);
      data.dialogVisible = false;
    };

    const cancel = () => {
      data.dialogVisible = false;
    };

    return {
      ...toRefs(data),
      titleRules,
      addTitile,
      removeTitile,
      validateTriggeHandler,
      openMtCenterTitle,
      confirm,
      cancel,
    };
  },
};
</script>
<style lang="scss" scoped>
@import "./index.scss";
.title-form-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
  &:first-child {
    .btn-svg {
      padding-top: 35px;
      align-items: flex-start;
    }
  }
  &:last-child {
    margin-bottom: 0;
  }
}
</style>
