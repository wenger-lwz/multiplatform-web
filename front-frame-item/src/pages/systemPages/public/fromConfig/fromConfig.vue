<template>
  <el-container class="dr-designer">
    <el-aside class="dr-modeler">
      <h3 class="dr-basic-text">基础字段</h3>
      <draggable
        :list="data.modeler.list"
        :group="{ name: 'viewer', pull: 'clone', put: false }"
        :sort="false"
        :move="moveCommand"
        @unchoose="sortDrag"
        item-key="type"
      >
        <template #item="{ element }">
          <div class="dr-module-item">
            <SvgIcon :svgClass="element.svgClass" />
            {{ element.name }}
          </div>
        </template>
      </draggable>
    </el-aside>
    <el-main class="dr-viewer">
      <el-form label-position="top">
        <container
          :map="data.demo.viewer"
          root
          v-model:selector="data.selector"
          style="min-height: 100%"
        />
      </el-form>
    </el-main>

    <el-aside class="dr-parameter" :class="{ hidden: !data.selector }">
      <parameter
        v-if="data.selector"
        v-model:parameterData="data.selector"
        @resetData="resetData"
      />
    </el-aside>
  </el-container>
</template>

<script>
import { reactive, watch } from "vue";
import draggable from "vuedraggable";
import modeler from "./config";
import demo from "./demo1";
import container from "./container";
import parameter from "./parameter";

export default {
  name: "formDesign",
  components: {
    draggable,
    container,
    parameter,
  },
  setup() {
    const data = reactive({
      modeler: new modeler(demo.button, demo.build),
      // 组件模板数据
      demo,
      // 当前选中数据
      selector: undefined,
    });
    watch(
      () => data.selector,
      (val) => {
        console.log(val);
        // 抛出数据
        // emit('activeChange', val)
      }
    );
    const resetData = (type) => {
      const obj = JSON.parse(
        JSON.stringify(
          data.modeler.list.filter((item) => item.type === type)[0]
        )
      );
      obj.key = data.selector.key;
      Object.assign(data.selector, obj);
    };
    // 自定义拖动控制事件
    const moveCommand = (e) => {
      // console.log('eeee', e)
      // console.log('来源', e.draggedContext)
      // 自定义属性取值都会隐士转换为String数据类型 isregionalgroup 是String的'true'和'false'
      // console.log('目标', e.to.dataset.isregionalgroup)
      // 区域组之间不能拖入
      if (
        e.draggedContext.element.type === "layout" &&
        e.to.dataset.isregionalgroup === "true"
      ) {
        return false;
      }
      // 容器之间不能同级拖入
      if (
        e.draggedContext.element.type === "container" &&
        e.relatedContext.element
      ) {
        return false;
      }
      // 其他组件不能与容器同级拖入
      if (e.relatedContext.list) {
        return (
          !e.relatedContext.list.filter((item) => item.type === "container")
            .length > 0
        );
      }
    };
    const sortDrag = (e) => {
      console.log(11111, e);
    };
    return {
      data,
      resetData,
      moveCommand,
      sortDrag,
    };
  },
  computed: {
    json() {
      return JSON.stringify(this.data.list, null, 2);
    },
  },
};
</script>
<style lang="scss" scoped>
.dragArea {
  width: 100%;
  height: 100%;
  background: red;
}
/*=================================== designer =========================================*/
/*整体容器样式*/
.dr-designer {
  // border: 1px solid slategrey;
  width: 100%;
  height: 100vh;
  font-size: 12px;
  display: flex;
}

/*模块面板样式*/

.dr-modeler {
  background: #fff;
  border-radius: 4px 0px 0px 4px;
  width: 260px;
  .dr-basic-text {
    width: 72px;
    height: 26px;
    font-size: 18px;
    font-family: PingFang SC, PingFang SC-Bold;
    font-weight: 700;
    text-align: LEFT;
    color: #000000;
    line-height: 26px;
    margin: 16px 0 16px 16px;
  }
  .dr-module-item {
    width: 106px;
    height: 34px;
    display: inline-block;
    margin: 0px 0px 30px 16px;
    line-height: 34px;
    font-size: 14px;
    .svg {
      position: relative;
      top: 2px;
      margin: 0 4px;
    }
  }
  .dr-module-item:hover {
    background: #edf7ff;
    border-radius: 8px;
  }
}

/*视图面板样式*/
.dr-viewer {
  transition: all 0.2s ease;
  height: 100%;
  overflow: auto;
  background-color: #f6f7f8;
  padding: 16px 133px 0 133px;
  display: flex;
  justify-content: center;
  height: 100%;
  flex: 1;
  form {
    height: 100%;
    flex: 1;
  }
}
/*占位符样式*/
.dr-placeholder {
  background-color: slateblue;
  height: 20px;
  font-size: 0;
  > * {
    display: none;
  }
}
/*参数面板样式*/
.dr-parameter {
  padding: 16px 16px 0 16px;
  background: #fff;
  border-radius: 0px 4px 4px 0px;
  animation-name: in-right;
  width: 270px;
  height: calc(100vh - 60px);
  background: #fff;
  -webkit-animation-duration: 0.2s;
  animation-duration: 0.2s;
  transition: all 0.2s ease;
}
.hidden {
  animation-name: out-right;
  display: none;
}
@keyframes in-right {
  0% {
    width: 0px;
  }
  100% {
    width: 256px;
  }
}

@-webkit-keyframes in-right {
  0% {
    width: 0px;
  }
  100% {
    width: 256px;
  }
}
@keyframes out-right {
  0% {
    width: 256px;
  }
  100% {
    width: 0px;
  }
}

@-webkit-keyframes out-right {
  0% {
    width: 256px;
  }
  100% {
    width: 0px;
  }
}
</style>
