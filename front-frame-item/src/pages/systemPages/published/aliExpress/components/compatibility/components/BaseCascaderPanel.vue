<script>
import { defineComponent, inject } from "vue";
import CascaderOption from "./CascaderOption.vue";
import { Empty } from "@arco-design/web-vue";
import { Spin } from "@arco-design/web-vue";
import { Input } from "@arco-design/web-vue";
import { getPrefixCls } from "@arco-design/web-vue/es/_utils/global-config";
import { cascaderInjectionKey } from "@arco-design/web-vue/es/cascader/context";
import { carColumns, motorcycleColumns } from "../config";
export default defineComponent({
  name: "AliBaseCascaderPanel",
  props: {
    displayColumns: {
      type: Array,
      required: true,
    },
    selectedPath: {
      type: Array,
      required: true,
    },
    activeKey: String,
    computedKeys: {
      type: Array,
      required: true,
    },
    totalLevel: {
      type: Number,
      required: true,
    },
    expandTrigger: String,
    multiple: Boolean,
    checkStrictly: Boolean,
    loading: Boolean,
    dropdown: Boolean,
  },
  emits: ["input-change"],
  setup(props, { emit, slots }) {
    const prefixCls = getPrefixCls("cascader");
    const cascaderCtx = inject(cascaderInjectionKey, undefined);

    const renderEmpty = () => {
      return slots.empty?.() ?? <Empty />;
    };

    const onInput = (val, level) => {
      emit("input-change", val, level);
    };

    const renderColumn = (column, level = 0) => {
      const columnMap =
        cascaderCtx.modelType === 1
          ? carColumns[level]
          : motorcycleColumns[level];
      const columnPlaceholder = `搜索${columnMap?.dataIndex
        ?.charAt(0)
        .toUpperCase()}${columnMap?.dataIndex?.slice(1)}`;
      return (
        <div
          class={[
            `${prefixCls}-panel-column`,
            {
              "gj-panel-column-no-data": column.length === 0,
              "gj-panel-column-border-right-0": level >= 5,
            },
          ]}
          key={`column-${level}`}
          style={{ zIndex: props.totalLevel - level }}
        >
          <h5 class={`${prefixCls}-panel-column-tit`}>{columnMap?.title}</h5>
          <Input.Search
            modelValue={cascaderCtx.searchValues[`column-${level}`]}
            class="gj-search-input"
            placeholder={columnPlaceholder}
            onInput={(value) => {
              onInput(value, level);
            }}
          />
          {column.length === 0 ? (
            <div class={`${prefixCls}-list-empty`}>{renderEmpty()}</div>
          ) : (
            <ul
              class={[
                `${prefixCls}-list`,
                {
                  [`${prefixCls}-list-multiple`]: Boolean(props?.multiple),
                  [`${prefixCls}-list-strictly`]: Boolean(props?.checkStrictly),
                },
              ]}
            >
              {column.map((item) => {
                return (
                  <CascaderOption
                    key={item.key}
                    option={item}
                    computedKeys={props.computedKeys}
                    active={
                      props.selectedPath.includes(item.key) ||
                      item.key === props.activeKey
                    }
                    multiple={props.multiple}
                    checkStrictly={props.checkStrictly}
                    expandTrigger={props.expandTrigger}
                  />
                );
              })}
            </ul>
          )}
        </div>
      );
    };

    const renderContent = () => {
      if (props.loading) {
        return (
          <div
            key="panel-column-loading"
            class={[
              `${prefixCls}-panel-column`,
              `${prefixCls}-panel-column-loading`,
            ]}
          >
            <Spin />
          </div>
        );
      }
      if (props.displayColumns.length === 0) {
        return (
          <div key="panel-column-empty" class={`${prefixCls}-panel-column`}>
            <div class={`${prefixCls}-list-empty`}>{renderEmpty()}</div>
          </div>
        );
      }
      return props.displayColumns.map((column, index) =>
        renderColumn(column, index)
      );
    };

    return () => (
      <div
        class={[
          `${prefixCls}-panel`,
          {
            [`${prefixCls}-dropdown-panel`]: props.dropdown,
          },
        ]}
      >
        {renderContent()}
      </div>
    );
  },
});
</script>
