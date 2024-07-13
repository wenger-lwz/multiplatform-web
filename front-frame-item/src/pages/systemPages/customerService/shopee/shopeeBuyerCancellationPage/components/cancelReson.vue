<template>
  <gb-multi-cascader
    :trigger-props="triggerProps"
    v-bind="$attrs"
    v-model="checked"
    :options="directorOptions"
    :format-label="format"
    size="medium"
    @clear="clear"
    @change="change"
    @ok="ok"
    @popup-visible-change="popupVisibleChange"
  />
</template>

<script>
import { defineComponent, ref, computed, watch } from "vue";
import { getShopeeCancelReason } from "@/api/customerService/shopee.js";
export default defineComponent({
  name: "SelectDirector",
  props: {
    modelValue: {
      type: [String, Number, Array],
      default: undefined,
    },
    multiple: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["update:modelValue", "clear", "change", "ok", "popup-visible-change"],
  setup(props, { emit }) {
    const directorOptions = ref([]);
    const computedChecked = computed(() => props.modelValue);
    const checked = ref(props.modelValue);
    const triggerProps = {
      contentClass: "select-director",
    };

    const leafOptionMap = new Map();

    watch(computedChecked, (curValue, preValue) => {
      if (curValue !== preValue) {
        checked.value = curValue;
      }
    });

    const getKey = (prefix, id) => {
      return `${prefix}-${id}`;
    };

    const createTree = (nodes = [], members = [], key = "node") => {
      const noNodes = !Array.isArray(nodes) || !nodes?.length;
      const noMembers = !Array.isArray(members) || !members?.length;
      if (noNodes && noMembers) {
        return null;
      }
      if (noNodes) {
        nodes = [];
      }
      if (noMembers) {
        members = [];
      }
      nodes = nodes.concat(members);
      let id = 0;
      return nodes.map((item) => {
        const nodeKey = getKey(key, ++id);

        const isLeaf = item?.cancelReason && item?.cancelReasonName;
        if (isLeaf) {
          leafOptionMap.set(item.cancelReason, {
            value: item.cancelReason,
            label: item.cancelReasonName,
          });
        }
        return {
          value: item?.cancelCategory
            ? item?.cancelCategory
            : item.cancelReason,
          label: item.cancelCategoryName
            ? item?.cancelCategoryName
            : item.cancelReasonName,
          isLeaf: item.memberId ? true : false,
          children: createTree(item?.cancelReasons, [], nodeKey),
        };
      });
    };

    getShopeeCancelReason().then((res) => {
      const data = res?.data ?? [];
      const options = createTree(data);
      directorOptions.value = options;
    });

    const format = (values) => {
      const labels = values.map((option) => option.label);
      return labels.pop();
    };

    const getSelectedRows = (value) => {
      const selectedRows = [];
      const isMultiple = Array.isArray(value);
      if (!isMultiple) {
        value = [value];
      }
      for (let userId of value) {
        const leafOption = leafOptionMap.get(userId);
        if (leafOption) {
          selectedRows.push(leafOption);
        }
      }
      return isMultiple ? selectedRows : selectedRows?.[0];
    };

    const clear = () => {
      emit("clear");
    };

    const change = (value) => {
      emit("update:modelValue", value);
      const selectedRows = getSelectedRows(value);
      emit("change", selectedRows);
    };

    const ok = (value) => {
      const selectedRows = getSelectedRows(value);
      emit("ok", selectedRows);
    };

    const popupVisibleChange = (visible) => {
      emit("popup-visible-change", visible);
    };

    return {
      checked,
      directorOptions,
      triggerProps,
      format,
      clear,
      change,
      ok,
      popupVisibleChange,
    };
  },
});
</script>
