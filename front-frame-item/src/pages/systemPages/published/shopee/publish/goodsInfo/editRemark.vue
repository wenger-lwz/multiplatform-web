<template>
  <div class="remark-wrap">
    <gj-tooltip :content="record.remark" v-if="record?.remark?.length >= 10">
      <span class="remark-text ellipsis">{{ record.remark }}</span>
    </gj-tooltip>
    <span class="remark-text ellipsis" v-else>{{ record.remark }}</span>

    <GjPopconfirm
      okText="保存"
      cancelText="取消"
      class="remark-pop"
      @ok="onSaveRemark(record, remark)"
    >
      <div v-if="record.remark" class="remark-content">
        <SvgIcon
          svgClass="editRemark"
          @click="onEditRemark(record.remark)"
        ></SvgIcon>
      </div>
      <span class="add-remark" v-else>添加</span>

      <template #content>
        <gj-input
          v-model="remark"
          placeholder="请输入"
          :max-length="50"
          allow-clear
          show-word-limit
          :ref="'remarkPopover' + record.id"
        />
      </template>
    </GjPopconfirm>
  </div>
</template>

<script>
import { defineComponent, reactive, toRefs } from "vue";
import SvgIcon from "@/components/SvgIcon";
/* eslint-disable */
import { GjPopconfirm } from "@gj/atom";
/* eslint-enable */

export default defineComponent({
  name: "",
  emits: ["showEditRemark", "saveRemark"],
  props: {
    record: {
      type: Object,
      default: () => {
        return null;
      },
    },
    remarkVal: {
      type: String,
      default: () => {
        return null;
      },
    },
    saveRemark: {
      type: Function,
    },
    showEditRemark: {
      type: Function,
    },
  },
  components: {
    SvgIcon,
  },
  setup(props, { emit }) {
    const data = reactive({
      remark: props.remarkVal,
    });

    // 编辑备注
    const onEditRemark = (item) => {
      data.remark = item;
      emit("showEditRemark", item);
    };

    // 保存备注
    const onSaveRemark = (record, item) => {
      emit("saveRemark", record, item);
    };

    return {
      ...toRefs(data),
      onEditRemark,
      onSaveRemark,
    };
  },
});
</script>

<style scoped lang="scss">
.remark-wrap {
  display: flex;
}

.editRemark {
  cursor: pointer;
  margin-left: 3px;
}
.add-remark {
  display: block;
  width: 40px;
  line-height: 24px;
  border-radius: 16px;
  text-align: center;
  color: #0045f0;
  cursor: pointer;
}

.add-remark:hover {
  background-color: #e6ecfe;
  color: #003ed7;
}

.remark-content {
  display: inline-block;
  align-items: center;
}

.remark-text {
  display: inline-block;
  max-width: 135px;
}

.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
<style lang="scss">
.remark-pop
  .arco-popconfirm-popup-content
  .arco-popconfirm-body
  .arco-popconfirm-icon {
  display: none;
}
</style>
