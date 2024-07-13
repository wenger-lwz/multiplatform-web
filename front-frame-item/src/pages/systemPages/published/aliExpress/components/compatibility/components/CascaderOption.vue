<script>
import { watch } from "vue";
import { computed, defineComponent, inject, ref } from "vue";
import { Checkbox } from "@arco-design/web-vue";
import { getPrefixCls } from "@arco-design/web-vue/es/_utils/global-config";
import IconRight from "@arco-design/web-vue/es/icon/icon-right";
import IconLoading from "@arco-design/web-vue/es/icon/icon-loading";
import { cascaderInjectionKey } from "@arco-design/web-vue/es/cascader/context";
import { getCheckedStatus, getOptionLabel } from "./utils";
import { isFunction } from "@arco-design/web-vue/es/_utils/is";

export default defineComponent({
  name: "AliCascaderOption",
  props: {
    option: {
      type: Object,
      required: true,
    },
    computedKeys: {
      type: Array,
      required: true,
    },
    active: Boolean,
    multiple: Boolean,
    expandTrigger: String,
    checkStrictly: Boolean,
    searchOption: Boolean,
    pathLabel: Boolean,
  },
  setup(props) {
    const prefixCls = getPrefixCls("cascader-option");
    const cascaderCtx = inject(cascaderInjectionKey, undefined);

    const isLoading = ref(false);
    const events = {};

    const handlePathChange = (ev, isQueryAll = false, checked) => {
      if (isFunction(cascaderCtx?.loadMore) && !props.option.isLeaf) {
        const { isLeaf, children, key } = props.option;
        if (isQueryAll) {
          const isAllLeaf = children?.every((child) => child.isLeaf);
          if (checked && !isAllLeaf) {
            isLoading.value = true;
            new Promise((resolve) => {
              cascaderCtx?.loadMore(props.option, resolve, isQueryAll);
            }).then((children) => {
              isLoading.value = false;
              if (children) {
                cascaderCtx?.addLazyLoadOptions(children, key);
              }
            });
          }
        } else {
          if (!isLeaf && !children) {
            isLoading.value = true;
            new Promise((resolve) => {
              cascaderCtx?.loadMore(props.option, resolve);
            }).then((children) => {
              isLoading.value = false;
              if (children) {
                cascaderCtx?.addLazyLoadOptions(children, key);
              }
            });
          }
        }
      }
      cascaderCtx?.setSelectedPath(props.option.key);
      cascaderCtx?.resetInputValue(props.option.level);
    };

    if (!props.option.disabled) {
      events.onMouseenter = [() => cascaderCtx?.setActiveKey(props.option.key)];
      events.onMouseleave = () => cascaderCtx?.setActiveKey();

      if (props.option.isLeaf && !props.multiple) {
        events.onClick = (ev) => {
          handlePathChange(ev);
          cascaderCtx?.onClickOption(props.option);
        };
      } else if (props.expandTrigger === "hover") {
        events.onMouseenter.push((ev) => handlePathChange(ev));
      } else {
        events.onClick = (ev) => handlePathChange(ev);
      }
    }

    const cls = computed(() => [
      prefixCls,
      {
        [`${prefixCls}-active`]: props.active,
        [`${prefixCls}-disabled`]: props.option.disabled,
      },
    ]);

    let checkedKeysMap = {};

    const checkedStatus = computed(() => {
      if (props.checkStrictly) {
        return {
          checked: props.computedKeys.includes(props.option.key),
          indeterminate: false,
        };
      }
      return getCheckedStatus(props.option, props.computedKeys, checkedKeysMap);
    });

    watch(
      () => props.computedKeys,
      () => {
        checkedKeysMap = {};
      }
    );

    const renderLabelContent = () => {
      if (props.pathLabel) {
        return (
          cascaderCtx?.formatLabel?.(props.option.path) ??
          getOptionLabel(props.option)
        );
      }
      if (cascaderCtx?.slots.option) {
        return cascaderCtx.slots.option({ data: props.option });
      }
      if (isFunction(props.option.render)) {
        return props.option.render();
      }
      return props.option.label;
    };

    const renderIcon = () => {
      if (isLoading.value) {
        return <IconLoading />;
      }
      if (!props.searchOption && !props.option.isLeaf) {
        return <IconRight />;
      }
      return null;
    };

    const renderRight = () => {
      const n = checkedStatus.value.checkedChildNumbers;
      if (n > 0) {
        return <span class="selected-num">{n}项</span>;
      }
      return renderIcon();
    };

    return () => (
      <li class={cls.value} {...events}>
        {props.multiple && props.option.level > 1 && (
          <Checkbox
            modelValue={checkedStatus.value.checked}
            indeterminate={checkedStatus.value.indeterminate}
            disabled={props.option.disabled}
            uninjectGroupContext
            onClick={(ev) => {
              ev.stopPropagation();
            }}
            onChange={(value, ev) => {
              ev.stopPropagation();
              handlePathChange(ev, true, !checkedStatus.value.checked);
              cascaderCtx?.onClickOption(
                props.option,
                !checkedStatus.value.checked
              );
            }}
          />
        )}
        <div class={`${prefixCls}-label`}>
          {renderLabelContent()}
          {renderRight()}
        </div>
      </li>
    );
  },
});
</script>
