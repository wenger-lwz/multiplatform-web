<template>
  <base-cascader-panel
    :display-columns="customDisplayColumns"
    :selected-path="selectedPath"
    :active-key="activeKey"
    :computed-keys="computedKeys"
    :multiple="multiple"
    :expand-trigger="expandTrigger"
    :total-level="totalLevel"
    :check-strictly="checkStrictly"
    @input-change="inputSearchChange"
  >
    <template v-if="$slots.empty" #empty>
      <slot name="empty" />
    </template>
  </base-cascader-panel>
</template>

<script>
import {
  computed,
  defineComponent,
  provide,
  reactive,
  ref,
  toRefs,
  watch,
} from "vue";
import BaseCascaderPanel from "./BaseCascaderPanel.vue";
import { cascaderInjectionKey } from "@arco-design/web-vue/es/cascader/context";
import {
  isArray,
  isNull,
  isUndefined,
} from "@arco-design/web-vue/es/_utils/is";
import {
  getKeysFromValue,
  getLeafOptionKeys,
} from "@arco-design/web-vue/es/cascader/utils";
import { useSelectedPath } from "@arco-design/web-vue/es/cascader/hooks/use-selected-path";
import { getOptionInfos } from "./utils";

export default defineComponent({
  name: "AliCascaderPanel",
  components: {
    BaseCascaderPanel,
  },
  props: {
    modelType: {
      type: Number,
      default: 1,
      required: true,
    },
    defaultExpandKeys: {
      type: String,
      default: "",
    },
    pathMode: {
      type: Boolean,
      default: false,
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    modelValue: {
      type: [String, Number, Array],
    },
    defaultValue: {
      type: [String, Number, Array],
      default: (props) =>
        props.multiple ? [] : props.pathMode ? undefined : "",
    },
    options: {
      type: Array,
      default: () => [],
    },
    expandTrigger: {
      type: String,
      default: "click",
    },
    checkStrictly: {
      type: Boolean,
      default: false,
    },
    loadMore: {
      type: Function,
    },
    fieldNames: {
      type: Object,
    },
  },
  emits: ["update:modelValue", "change"],
  setup(props, { emit, slots }) {
    const {
      options,
      checkStrictly,
      loadMore,
      modelValue,
      modelType,
      defaultExpandKeys,
    } = toRefs(props);
    const _value = ref(props.defaultValue);

    watch(modelValue, (value) => {
      if (isUndefined(value) || isNull(value)) {
        _value.value = props.multiple ? [] : undefined;
      }
    });

    const optionInfos = ref([]);
    const totalLevel = ref(1);

    const optionMap = reactive(new Map());
    const leafOptionMap = reactive(new Map());
    const leafOptionValueMap = reactive(new Map());
    const leafOptionSet = reactive(new Set());

    const lazyLoadOptions = reactive({});

    const addLazyLoadOptions = (children, key) => {
      lazyLoadOptions[key] = children;
    };

    const DEFAULT_FIELD_NAMES = {
      value: "value",
      label: "label",
      disabled: "disabled",
      children: "children",
      tagProps: "tagProps",
      render: "render",
      isLeaf: "isLeaf",
    };

    const mergedFieldNames = computed(() => ({
      ...DEFAULT_FIELD_NAMES,
      ...props.fieldNames,
    }));

    watch(
      [options, lazyLoadOptions, mergedFieldNames],
      ([_options, _lazyLoadOptions, _fieldNames]) => {
        optionMap.clear();
        leafOptionMap.clear();
        leafOptionValueMap.clear();
        leafOptionSet.clear();

        optionInfos.value = getOptionInfos(_options ?? [], {
          enabledLazyLoad: Boolean(props.loadMore),
          lazyLoadOptions: _lazyLoadOptions,
          optionMap,
          leafOptionSet,
          leafOptionMap,
          leafOptionValueMap,
          totalLevel,
          checkStrictly,
          fieldNames: _fieldNames,
        });
      },
      {
        immediate: true,
      }
    );

    const computedKeys = computed(() =>
      getKeysFromValue(props.modelValue ?? _value.value, {
        pathMode: props.pathMode,
        leafOptionMap,
        leafOptionValueMap,
      })
    );

    const filteredLeafOptions = computed(() =>
      props.checkStrictly
        ? Array.from(optionMap.values())
        : Array.from(leafOptionSet)
    );

    const updateValue = (options) => {
      let value;
      let objValue;
      if (!options) {
        if (!props.pathMode) {
          value = "";
        }
        setSelectedPath();
        setActiveKey();
      } else if (isArray(options)) {
        value = options.map((item) => {
          if (!props.pathMode) {
            return item.value;
          }
          return item.path.map((item) => item.value); // !!
        });

        objValue = options.map((item) => {
          // !!
          return item.path.map((item) => item);
        });
      } else if (!props.pathMode) {
        value = options.value;
      } else {
        value = options.path.map((item) => item.value);
      }

      _value.value = value;
      emit("update:modelValue", value);
      // emit('change', value);
      emit("change", objValue);
    };

    const selectSingle = (option) => {
      updateValue(option);
    };

    const selectMultiple = (option, checked) => {
      const leafOptionKeys = props.checkStrictly
        ? [option.key]
        : getLeafOptionKeys(option);
      const newKeys = checked
        ? computedKeys.value.concat(
            leafOptionKeys.filter((item) => !computedKeys.value.includes(item))
          )
        : computedKeys.value.filter((item) => !leafOptionKeys.includes(item));
      updateValue(newKeys.map((key) => leafOptionMap.get(key)));
    };

    const handleClickOption = (option, checked) => {
      if (props.multiple) {
        selectMultiple(option, checked ?? true);
      } else {
        selectSingle(option);
      }
    };

    const {
      activeKey,
      selectedPath,
      displayColumns,
      setActiveKey,
      setSelectedPath,
    } = useSelectedPath(optionInfos, {
      optionMap,
      filteredLeafOptions,
    });

    const searchValues = ref({});

    const inputSearchChange = (inputValue, level) => {
      searchValues.value[`column-${level}`] = inputValue;
    };

    const customDisplayColumns = ref([]);

    const resetSearchValue = (nextCulumnLevel, totalColumns) => {
      if (nextCulumnLevel <= totalColumns) {
        delete searchValues.value[`column-${nextCulumnLevel}`];
        resetSearchValue(nextCulumnLevel + 1, totalColumns);
      }
    };

    const resetInputValue = (level) => {
      const totalColumns = displayColumns.value.length;
      resetSearchValue(level + 1, totalColumns - 1);
    };

    watch(
      [displayColumns, searchValues],
      (
        [newColumns, newSearchValues] // eslint-disable-line
      ) => {
        customDisplayColumns.value = [];
        if (Object.values(newSearchValues).length === 0) {
          customDisplayColumns.value = [...newColumns];
        } else {
          const newDisplayColumns = [];
          newColumns.forEach((column, idx) => {
            const val = newSearchValues[`column-${idx}`] ?? "";
            if (val) {
              const result = column.filter((item) =>
                item.label
                  ?.toLocaleLowerCase()
                  .includes(val?.toLocaleLowerCase())
              );
              newDisplayColumns.push(result);
            } else {
              newDisplayColumns.push(column);
            }
          });
          customDisplayColumns.value = newDisplayColumns;
        }
      },
      {
        deep: true,
        immediate: true,
      }
    );

    watch(
      defaultExpandKeys,
      (newKey) => {
        if (newKey) {
          const option = leafOptionMap.get(newKey);
          if (option && option.key !== activeKey.value) {
            setSelectedPath(option.key);
            setActiveKey(option.key);
          }
        }
      },
      {
        deep: true,
        immediate: true,
      }
    );

    provide(
      cascaderInjectionKey,
      reactive({
        onClickOption: handleClickOption,
        setActiveKey,
        setSelectedPath,
        loadMore,
        addLazyLoadOptions,
        slots,
        // add
        modelType,
        searchValues,
        resetInputValue,
      })
    );

    return {
      inputSearchChange,
      customDisplayColumns,
      optionInfos,
      computedKeys,
      filteredLeafOptions,
      selectedPath,
      activeKey,
      totalLevel,
    };
  },
});
</script>
