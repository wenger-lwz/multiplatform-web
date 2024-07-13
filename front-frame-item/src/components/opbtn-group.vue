<!-- 表格下拉框附带气泡卡片 -->
<template>
  <div class="opbtn-group">
    <div v-if="outsideList.length" class="opbtn-group_oustside">
      <span v-for="(item, index) in outsideList" :key="index">
        <gj-popconfirm
          v-if="item.isPopConfirm"
          trigger="click"
          :content="item.tooltipContent"
          content-class="pop-confirm-content"
          position="lt"
          :ok-button-props="item.isDel ? okButtonProps : {}"
          @ok="handClick(item)"
        >
          <!-- <template #content>
            <div class="pop-confirm-content">
              {{ item.tooltipContent }}
            </div>
          </template> -->
          <gj-button
            type="text"
            class="mr-4"
            v-permissions="
              Array.isArray(item?.permission)
                ? item.permission
                : item?.permission
                ? [item.permission]
                : ''
            "
            :disabled="item.disabled ? item.disabled(row) : false"
          >
            {{ item.label }}
          </gj-button>
        </gj-popconfirm>
        <gj-button
          type="text"
          class="mr-4"
          v-permissions="
            Array.isArray(item?.permission)
              ? item.permission
              : item?.permission
              ? [item.permission]
              : ''
          "
          :disabled="item.disabled ? item.disabled(row) : false"
          v-else
          @click="handClick(item)"
        >
          {{ item.label }}
        </gj-button>
      </span>
    </div>
    <div v-if="popoverList.length" class="opbtn-group_popover">
      <gj-popover
        :append-to-body="false"
        content-class="opbtn-group-popper-class"
        position="bottom"
        width="60px"
        trigger="click"
      >
        <gj-button
          type="text"
          v-permissions="permissionList"
          class="moreEllipseNBtn"
        >
          <div class="more-wrap">
            <SvgIcon svgClass="more-ellipse" :width="16" />
          </div>
        </gj-button>

        <template #content>
          <div class="popper-container">
            <div
              v-for="(item, index) in popoverList"
              :key="index"
              class="popper-item"
            >
              <gj-popconfirm
                position="lt"
                trigger="click"
                :content="item.tooltipContent"
                content-class="pop-confirm-content"
                @ok="handClick(item)"
                v-if="item.isPopConfirm"
                :ok-button-props="item.isDel ? okButtonProps : {}"
              >
                <gj-button
                  class="custom-btn"
                  v-permissions="
                    Array.isArray(item?.permission)
                      ? item.permission
                      : item?.permission
                      ? [item.permission]
                      : ''
                  "
                  :type="item.isDel ? 'text' : 'textPlain'"
                  :status="item.isDel ? 'danger' : ''"
                  :disabled="item.disabled ? item.disabled(row) : false"
                >
                  {{ item.label }}
                </gj-button>
              </gj-popconfirm>
              <gj-button
                class="custom-btn"
                :type="item.isDel ? 'text' : 'textPlain'"
                :status="item.isDel ? 'danger' : ''"
                v-permissions="
                  Array.isArray(item?.permission)
                    ? item.permission
                    : item?.permission
                    ? [item.permission]
                    : ''
                "
                :disabled="item.disabled ? item.disabled(row) : false"
                @click="handClick(item)"
                v-else
              >
                {{ item.label }}
              </gj-button>
            </div>
          </div>
        </template>
      </gj-popover>
    </div>
  </div>
</template>
<script>
import { defineComponent, reactive, watch, toRefs } from "vue";
import SvgIcon from "@/components/SvgIcon.vue";

export default defineComponent({
  name: "operateBtn",
  components: {
    SvgIcon,
  },
  props: {
    btnList: {
      type: Array,
      default: () => [],
    },
    permissionsList: {
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
    const data = reactive({
      outsideList: [],
      popoverList: [],
      permissionList: [],
      okButtonProps: {
        status: "danger",
      },
    });
    const getOutSideList = (arr) => arr.filter((v) => v.outside);
    const getPopoverList = (arr) => arr.filter((v) => !v.outside);
    const getShowList = (v) => {
      return !v.show || v.show(props.row);
    };

    const getEndList = () => {
      const arrs = props.btnList.filter(getShowList);
      if (!arrs.length) return;
      data.outsideList = getOutSideList(arrs);
      data.popoverList = getPopoverList(arrs);
      if (!data.outsideList.length) {
        if (data.popoverList.length) {
          data.outsideList.push(data.popoverList[0]);
          data.popoverList.splice(0, 1);
        }
      }
      data.popoverList.forEach((item) => {
        if (item.permission) {
          data.permissionList.push(item.permission[0]);
        }
      });
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
      ...toRefs(data),
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
    background: inherit;
    margin-left: 5px;
    .svg {
      margin-right: 2px;
    }
  }
  .custom-btn-outside {
    padding: 0;
    min-height: 0;
  }
  .more-wrap {
    height: 16px;
    width: 16px;
    line-height: 16px;
    // margin-top: 4px;
    text-align: center;
    color: #0045f0;
    cursor: pointer;
    // &:hover {
    //   background: #f2f3f5;
    //   border-radius: 4px;
    // }
    // &:active {
    //   background: #e5e6eb;
    //   border-radius: 4px;
    // }
  }
  .mr-4 {
    margin-right: 4px;
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
        width: 100%;
        text-align: left;
        // padding: 7px 8px;
        // min-height: 0;
        // color: #000430;
        // box-sizing: border-box;
        // border-radius: 4px;
        // background: #fff;
      }
      .custom-btn:hover {
        // background: #f2f3f5;
      }
      .popover_label_style {
        color: #ff5c5c;
      }
      .popover_label_style:hover {
        // background: #ffe7e7;
      }
    }
  }
}
.pop-confirm-content {
  color: #1d2129;
  max-width: 240px;
}
.moreEllipseNBtn {
  display: flex;
  padding: 8px;
}
.moreEllipseNBtn:hover {
  background: inherit;
}
</style>
