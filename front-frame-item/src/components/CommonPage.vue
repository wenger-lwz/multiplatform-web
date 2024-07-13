<template>
  <!--  v-if="permissionsList[currentRouterPermission]" -->
  <div class="common-pages">
    <div id="layoutHeader" class="layout-header">
      <div class="filter-content">
        <slot name="filter-content"></slot>
        <div class="ml-8">
          <gj-popconfirm
            content-class="advanceSearch-content"
            :ok-button-props="{
              shape: 'square',
            }"
            :cancel-button-props="{
              shape: 'square',
            }"
            :render-to-body="false"
            @popup-visible-change="popconfirmVisibleChange"
            @ok="popconfirmOk"
            @cancel="popconfirmCancel"
          >
            <span v-if="advanceSearch">
              <SvgIcon
                :class="isVector && 'vector-active'"
                svgClass="vector"
                :width="32"
              />
            </span>
            <template #content>
              <div class="advanceSearch-content-container">
                <slot name="advanceSearchContent"></slot>
              </div>
            </template>
          </gj-popconfirm>
        </div>
        <gj-button
          :class="!advanceSearch ? 'search-reset' : ''"
          type="textPlain"
          @click="commonPageRest"
          v-if="pageRest"
          >重置</gj-button
        >
      </div>

      <div class="tags-content">
        <slot name="tag-content" />
      </div>
    </div>
    <div class="layout-content">
      <div class="comtent-wrap">
        <div id="layoutContentOperate" class="operate-bar-content">
          <slot name="operate_bar-content" />
        </div>
        <div class="table-content-wrap">
          <slot name="table-content" />
        </div>
      </div>
    </div>
  </div>
  <!-- <noPermissionPage v-else></noPermissionPage> -->
</template>

<script>
import { defineComponent, reactive, toRefs } from "vue";
import SvgIcon from "@/components/SvgIcon.vue";
import store from "@/store";
// import noPermissionPage from "@/pages/noPermissionPage.vue";
export default defineComponent({
  name: "CommonPage",
  components: {
    SvgIcon,
    // noPermissionPage,
  },
  props: {
    // 是否展示高级查询
    advanceSearch: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
    // 是否展示重置
    pageRest: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
    currentRouterPermission: {
      type: String,
      default: () => {
        return "";
      },
    },
  },
  emits: [
    "common-page-rest",
    "advance-search-handler",
    "popconfirmVisibleChange",
    "popconfirmOk",
    "popconfirmCancel",
  ],
  setup(props, { emit }) {
    const data = reactive({
      isVector: false,
      permissionsList: store.getters.getPermissions,
    });
    const popconfirmVisibleChange = (val) => {
      data.isVector = val;
      emit("popconfirmVisibleChange", val);
    };

    const popconfirmOk = () => {
      emit("popconfirmOk");
    };
    const popconfirmCancel = () => {
      emit("popconfirmCancel");
    };
    //重置
    const commonPageRest = () => {
      emit("common-page-rest");
    };
    return {
      ...toRefs(data),
      commonPageRest,
      popconfirmOk,
      popconfirmVisibleChange,
      popconfirmCancel,
    };
  },
});
</script>
<style lang="scss">
.advanceSearch-content {
  padding-right: 11px;
  .arco-popconfirm-body {
    .arco-popconfirm-icon {
      display: none;
    }
    .advanceSearch-content-container {
      min-width: 120px;
      max-height: 436px;
      overflow-y: auto;
      overflow-x: hidden;
      padding-right: 5px;
    }
  }
  .arco-popconfirm-footer {
    padding-right: 5px;
  }
}
</style>
<style lang="scss" scoped>
.common-pages {
  box-sizing: border-box;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 100%;

  :deep(.arco-select-view-tag) {
    height: auto;
    min-height: 20px;
    max-width: 60px;
    overflow: hidden;
    height: 24px;
    line-height: 24px;
    display: inline-block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding: 0 5px;
    margin: 0px;
  }
  :deep(.arco-input-tag-tag) {
    height: auto;
    min-height: 20px;
    max-width: 60px;
    overflow: hidden;
    height: 24px;
    line-height: 24px;
    display: inline-block;
    overflow: hidden;
    // text-overflow: ellipsis;
    // white-space: nowrap;
    padding: 0 5px;
    margin: 0px;
  }

  .layout-header {
    padding: 20px 20px 12px 20px;
  }

  .layout-content {
    background: #eff2f5;
    padding: 12px;
    height: 100%;
    overflow: hidden;
    .comtent-wrap {
      height: 100%;
      display: flex;
      flex-direction: column;
      background: #ffffff;
      border: 1px solid #e6e6ed;
      border-radius: 4px;
      .table-content-wrap {
        position: relative;
        flex: 1 0 auto;
        // height: calc(100% - 56px); //  导出 刷新区域的高度
        border-top: 1px solid #e6e6ed;
      }
    }
  }

  .filter-content {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    justify-content: flex-start;
    gap: 12px 8px;

    .vector {
      // width: 32px;
      // height: 32px;
      // font-size: 12px;
      // padding: 7px;
      // background: transparent;
      border-radius: 4px;
      color: #4e5969;
      cursor: pointer;
      &:hover {
        background: #f2f3f5;
        border-radius: 4px;
      }
      &:focus {
        //清楚默认边框
        outline: -webkit-focus-ring-color auto 0px;
      }
      &:active {
        background: #e5e6eb;
        border-radius: 4px;
        color: #0045f0;
      }
    }
    .vector-active {
      background: #e5e6eb;
      border-radius: 4px;
      color: #0045f0;
    }

    .vector-box-up {
      width: 32px;
      height: 32px;
      font-size: 12px;
      padding: 7px;
      background: transparent;
      border-radius: 4px;
      color: #4e5969;
      &:hover {
        background: #f2f3f5;
      }
    }
    .vector-box-down {
      width: 32px;
      height: 32px;
      font-size: 12px;
      padding: 7px 0px;
      background: transparent;
      border-radius: 4px;
      // vertical-align: middle;
      color: #0045f0;
      background: #e5e6eb;
      // transform: rotate(-45deg);
      &:hover {
        background: #f2f3f5;
      }
    }
  }
  // :deep(.arco-btn-text):hover {
  //   background: #fff;
  // }
  .ml-8 {
    margin-left: 8px;
  }
  .search-reset {
    margin-left: -8px;
  }
}
</style>
