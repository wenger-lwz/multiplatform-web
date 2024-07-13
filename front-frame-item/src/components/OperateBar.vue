<template>
  <div class="operate-bar">
    <div class="operate-bar-left">
      <slot name="left"></slot>
    </div>
    <div class="operate-bar-right">
      <slot name="right"></slot>

      <gj-tooltip content="刷新" v-if="refreshShow">
        <SvgIcon @click="refresh" svgClass="refresh" :width="32" />
      </gj-tooltip>

      <gj-tooltip content="进程" v-if="taskProcessShow">
        <SvgIcon @click="taskProcess" svgClass="taskProcess" :width="32" />
      </gj-tooltip>

      <gj-tooltip content="设置自定义列" v-if="setCustomVisiable">
        <SvgIcon @click="setting" svgClass="setting" :width="32" />
      </gj-tooltip>

      <gj-dropdown @select="settingSubTable" v-if="subTableCustomVisiable">
        <span class="setting-sub">
          <gj-tooltip content="设置自定义列">
            <SvgIcon svgClass="setting" :width="32" style="cursor: pointer" />
          </gj-tooltip>
        </span>
        <template #content>
          <gj-doption value="ParentTable">设置父表格自定义列 </gj-doption>
          <gj-doption value="SubTabl">设置子表格自定义列 </gj-doption>
        </template>
      </gj-dropdown>

      <gj-tooltip content="帮助文档" v-if="documentShow">
        <SvgIcon @click="openHelp" svgClass="document" :width="32" />
      </gj-tooltip>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import SvgIcon from "@/components/SvgIcon.vue";
export default defineComponent({
  name: "OperateBar",
  components: {
    SvgIcon,
  },
  props: {
    // 是否刷新
    refreshShow: {
      type: Boolean,
      default: () => {
        return false;
      },
    },

    // 是否显示任务进度
    taskProcessShow: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
    // 是否显示自定义列
    setCustomVisiable: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
    // 是否显示付子自定义列
    subTableCustomVisiable: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
    // 是否显示文档图标
    documentShow: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
  },
  setup(props, { emit }) {
    const handleExprot = (val) => {
      emit("handleExprot", val);
    };
    const openHelp = () => {
      window.open("http://help.gerpgo.com/web/#/26/1210");
    };
    const refresh = () => {
      emit("operate-rest");
    };
    const setting = () => {
      emit("setting");
    };
    const taskProcess = () => {
      emit("taskProcess");
    };
    const settingSubTable = (val) => {
      emit("settingSubTable", val);
    };
    return {
      openHelp,
      handleExprot,
      refresh,
      setting,
      taskProcess,
      settingSubTable,
    };
  },
});
</script>

<style lang="scss" scoped>
.operate-bar {
  display: flex;
  height: 56px;
  padding: 0 16px;
  justify-content: space-between;

  .operate-bar-left {
    align-items: center;
    display: flex;
    gap: 0 8px;
  }

  .operate-bar-right {
    align-items: center;
    display: flex;
    gap: 0 8px;
    .btn-groups-item {
      margin-left: 12px;
      display: inline-block;
    }
  }
}

.setting-sub {
  display: inline-block;
  height: 32px;
}
.setting {
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
    // color: #0045f0;
  }
}
.refresh {
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
    // color: #0045f0;
  }
}
.document {
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
    // color: #0045f0;
  }
}

.taskProcess {
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
    // color: #0045f0;
  }
}
</style>
