<template>
  <div class="opbtn-group">
    <div v-if="datas.outsideList.length" class="opbtn-group_oustside">
      <div v-for="(item, index) in datas.outsideList" :key="index">
        <gj-button
          class="custom-btn-outside"
          type="text"
          @click="handClick(item)"
        >
          {{ item.label && $t(item.label) }}
        </gj-button>
      </div>
    </div>
    <div v-if="datas.popoverList.length" class="opbtn-group_popover">
      <gj-popover
        :append-to-body="false"
        content-class="opbtn-group-popper-class"
        position="bottom"
        width="60px"
        trigger="click"
      >
        <gj-button type="text" style="display: flex">
          <div style="cursor: pointer">
            <SvgIcon svgClass="ellipse" :width="2" :height="2" />
            <SvgIcon svgClass="ellipse" :width="2.5" :height="2.5" />
            <SvgIcon svgClass="ellipse" :width="2" :height="2" />
          </div>
        </gj-button>

        <template #content>
          <div class="popper-container">
            <div
              v-for="(item, index) in datas.popoverList"
              :key="index"
              class="popper-item"
            >
              <gj-button
                class="custom-btn"
                :class="item.isDel ? 'popover_label_style' : ''"
                v-permissions="
                  Array.isArray(item?.permission)
                    ? item.permission
                    : item?.permission
                    ? [item.permission]
                    : ''
                "
                :disabled="item.disabled ? item.disabled(row) : false"
                @click="handClick(item)"
              >
                {{
                  item.label
                    ? item.label && $t(item.label)
                    : row?.status === 0
                    ? $t("disable")
                    : $t("enable")
                }}
              </gj-button>
            </div>
          </div>
        </template>
      </gj-popover>
    </div>
  </div>
</template>
<script>
import { defineComponent, reactive, watch } from "vue";
// import { accessControl, isMeaningful } from "@/utils";
import SvgIcon from "@/components/SvgIcon.vue";

export default defineComponent({
  name: "ActionColumn",
  components: {
    SvgIcon,
  },
  props: {
    btnList: {
      type: Array,
      default: () => [],
    },
    row: {
      type: Object,
      default: () => ({}),
    },
    isrefresh: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const datas = reactive({
      outsideList: [],
      popoverList: [],
    });
    const getOutSideList = (arr) => arr.filter((v) => v.outside);
    const getPopoverList = (arr) => arr.filter((v) => !v.outside);
    const getShowList = (v) => {
      return !v.show || v.show(props.row);
    };

    const getEndList = () => {
      const arrs = props.btnList.filter(getShowList);
      if (!arrs.length) return;
      datas.outsideList = getOutSideList(arrs);
      datas.popoverList = getPopoverList(arrs);
      if (!datas.outsideList.length) {
        if (datas.popoverList.length) {
          datas.outsideList.push(datas.popoverList[0]);
          datas.popoverList.splice(0, 1);
        }
      }
    };
    watch(
      () => props.row,
      () => {
        getEndList();
      },
      { immediate: true, deep: true }
    );

    const handClick = (item) => {
      item.click && item.click(props.row);
    };
    return {
      datas,
      handClick,
    };
  },
});
</script>
<style scoped lang="scss">
.opbtn-group {
  display: flex;
  align-items: center;
  .opbtn-group_popover {
    margin-left: 5px;
    .svg {
      margin-right: 2px;
    }
  }
  .custom-btn-outside {
    padding: 0;
    min-height: 0;
  }
}
</style>
<style lang="scss">
.opbtn-group-popper-class {
  min-width: auto !important;
  padding: 0 10px;
  box-sizing: border-box;
  width: auto !important;
  .popper-container {
    .popper-item {
      color: var(--color-grey-8);
      font-size: 12px;
      padding: 6px 0;
      cursor: pointer;
      &:hover {
        opacity: 0.8;
      }
      .custom-btn {
        padding: 7px 8px;
        min-height: 0;
        color: #000430;
        box-sizing: border-box;
        border-radius: 4px;
        background: #fff;
      }
      .custom-btn:hover {
        background: #f2f3f5;
      }
      .popover_label_style {
        color: #ff5c5c;
      }
      .popover_label_style:hover {
        background: #ffe7e7;
      }
    }
  }
}
</style>
