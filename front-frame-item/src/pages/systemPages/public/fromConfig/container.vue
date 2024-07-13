<template>
  <el-container
    :class="{ 'dr-container': true, 'dr-empty': root && list.length === 0 }"
  >
    <draggable
      tag="div"
      :data-isRegionalGroup="isRegionalGroup"
      ghostClass="dr-placeholder"
      handle=".dr-mover"
      :list="list"
      group="viewer"
      animation="300"
      item-key="type"
      :move="moveCommand"
      @add="addCommand"
      @unchoose="updateDrag"
    >
      <template #item="{ element, index }">
        <div class="dr-container-item">
          <!-- 区域组 -->
          <div
            v-if="element.type === 'layout'"
            :key="element.key"
            class="regionalGroup"
          >
            <p>区域组{{ index }}</p>
            <p>{{ element.placeholder }}</p>
            <el-row
              :class="{
                'dr-area': true,
                'dr-active':
                  data.localSelector && data.localSelector.key === element.key,
              }"
              style="margin: 0"
              :gutter="element.gutter"
              type="flex"
              @click.stop="selectCommand(index)"
            >
              <SvgIcon
                class="dr-mover el-icon-rank"
                svgClass="dynamicFormRank"
                :width="16"
              />
              <SvgIcon
                class="el-icon-document-copy"
                svgClass="dynamicFormCopy"
                :width="16"
                @click="copyCommand(index)"
              />
              <SvgIcon
                class="el-icon-close"
                svgClass="dynamicFormDelete"
                :width="16"
                @click="closeCommand(index)"
              />
              <el-col
                v-for="(it, index) in element.drag"
                :key="index"
                :span="it.span"
              >
                <container
                  :map="map"
                  isRegionalGroup
                  v-model:selector="data.localSelector"
                  :list="it.list"
                />
              </el-col>
            </el-row>
          </div>

          <!-- 动态子组件 -->
          <div v-else :key="element.key" style="margin: 2px">
            <div
              :class="{
                'dr-area mask': true,
                'dr-active':
                  data.localSelector && data.localSelector.key === element.key,
              }"
              style="height: 100%"
              @click.stop="selectCommand(index)"
            >
              <SvgIcon
                class="dr-mover el-icon-rank"
                svgClass="dynamicFormRank"
                :width="16"
              />
              <SvgIcon
                class="el-icon-document-copy"
                svgClass="dynamicFormCopy"
                :width="16"
                @click="copyCommand(index)"
              />
              <SvgIcon
                class="el-icon-close"
                svgClass="dynamicFormDelete"
                :width="16"
                @click="closeCommand(index)"
              />
              <component :is="element.type" :data="element"></component>
            </div>
          </div>
        </div>
      </template>
    </draggable>
  </el-container>
</template>
<script>
import { reactive } from "vue";
import { useStore } from "vuex";
import draggable from "vuedraggable";
import OUtil from "./utils/objects";
import SingleLineText from "./component/SingleLineText";
import Adress from "./component/Adress";
import Checkbox from "./component/Checkbox";
import DateTime from "./component/DateTime";
import DateRange from "./component/DateRange";
import Email from "./component/Email";
import FileUpload from "./component/FileUpload";
import ImageSelect from "./component/ImageSelect";
import LinkSrc from "./component/LinkSrc";
import MultiLineText from "./component/MultiLineText";
import Number from "./component/Number";
import Radio from "./component/Radio";
import RichText from "./component/RichText";
import Select from "./component/Select";
import Telphone from "./component/Telphone";
export default {
  name: "container",
  components: {
    draggable,
    SingleLineText,
    Adress,
    Checkbox,
    DateTime,
    DateRange,
    Email,
    FileUpload,
    ImageSelect,
    LinkSrc,
    MultiLineText,
    Number,
    Radio,
    RichText,
    Select,
    Telphone,
  },
  props: {
    // list: {
    //   type: Array,
    //   required: true
    // },
    selector: Object,
    root: Boolean,
    isRegionalGroup: {
      type: Boolean,
      default() {
        return false;
      },
    },
    map: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  computed: {
    list: {
      get() {
        return this.$store.state.dynamicFrom.list;
      },
      set(value) {
        this.$store.commit("DYNAMIC_FROM", value);
      },
    },
  },
  setup(props) {
    const store = useStore();
    console.log("store", store);

    const data = reactive({
      localSelector: props.selector,
      outil: new OUtil((key, source) => {
        // 重新分配key
        if (key === "key") {
          return `${source.split("_")[0]}_${new Date().getTime()}`;
        }
      }),
      local: {
        checkbox: [],
        radio: [],
      },
    });
    // 拖动的自定义控制
    const moveCommand = (e) => {
      // console.log('来源', e.draggedContext.element)
      // console.log('目标', e.relatedContext)
      // 区域组不能拖入区域组
      if (
        e.draggedContext.element.type === "layout" &&
        e.to.dataset.isregionalgroup === "true"
      ) {
        return false;
      }
      // 目标是容器不可拖入
      if (
        e.relatedContext.element &&
        e.relatedContext.element.type === "container"
      ) {
        return false;
      }

      // 布局容器不允许容器停靠
      if (
        e.draggedContext.element.type === "container" &&
        e.relatedContext.element
      ) {
        return false;
      }
    };
    // 元素添加事件
    const addCommand = (e) => {
      // console.log('我是add 方法')
      const newIndex = e.newIndex;
      const local = store.state.dynamicFrom.list[newIndex];
      local.key = `${local.type}_${new Date().getTime()}`;
      if (e.pullMode === "clone") {
        let arr = store.state.dynamicFrom.list;
        arr[newIndex] = data.outil.agn(store.state.dynamicFrom.list[newIndex]);
      }
      data.localSelector = store.state.dynamicFrom.list[newIndex];
    };
    // 元素选中事件
    const selectCommand = (index) => {
      data.localSelector = store.state.dynamicFrom.list[index];
    };
    // 复制模板元素
    const copyCommand = (index) => {
      let arr = store.state.dynamicFrom.list;
      arr.splice(index, 0, data.outil.agn(store.state.dynamicFrom.list[index]));
    };
    // 删除模板元素
    const closeCommand = (index) => {
      let arr = store.state.dynamicFrom.list;
      arr.splice(index, 1);
    };
    // 元素开始拖动事件
    const startCommand = (e) => {
      console.log("移动中....", e);
    };
    // 元素结束拖动事件
    const endCommand = (e) => {
      console.log("结束移动...", e);
    };
    const updateDrag = (e) => {
      console.log(2222222, e);
    };
    return {
      data,
      moveCommand,
      addCommand,
      selectCommand,
      copyCommand,
      closeCommand,
      startCommand,
      endCommand,
      updateDrag,
    };
  },
  watch: {
    selector(val) {
      this.data.localSelector = val;
    },
    "data.localSelector": {
      handler(val) {
        this.$emit("update:selector", val);
      },
      deep: true,
    },
  },
};
</script>
<style lang="scss" scoped>
/*=================================== container =========================================*/
/*整体布局*/
.dr-container {
  padding: 4px;
  // outline: 2px dashed #95a3b7;
  border-radius: 10px;
  box-shadow: 0 4px 10px 0 #ccc;
  // background: #fff;
  position: relative;
  min-height: 80px;
  > div {
    min-width: 100%;
  }
}

/*空白时显示拖拽提示*/
.dr-empty::before {
  content: "请拖入组件";
  position: absolute;
  top: 50%;
  width: 100%;
  text-align: center;
  font-size: 25px;
  color: #e5e5e5;
  z-index: 1;
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
/*蒙版*/
.mask {
  position: relative;
}

.mask::before {
  content: "";
  position: absolute;
  top: 0;
  bottom: 0px;
  left: 0;
  right: 0;
  z-index: 100;
}
/*拖拽域*/
.dr-area {
  > .el-icon-rank,
  .el-icon-document-copy,
  .el-icon-close {
    display: none;
  }
  min-height: 25px;
  // outline: 1px dashed #95a3b7;
  width: 100%;
  > .el-col {
    padding: 4px 0;
    > section {
      min-height: 200px;
      outline: 2px dashed #95a3b7;
      height: 100%;
    }
  }
}
::v-deep .dr-area div > .el-form-item {
  padding: 24px 19px 16px 27px;
  margin: 0;
  // width: calc(100% - 10px);
  > .el-form-item__label,
  > .el-form-item__content {
    line-height: 20px;
  }
}
/*激活域*/
.dr-active {
  // outline: 1px solid #0d95e8;
  // border: 1px solid #0d95e8;
  background: #edf7ff;
  position: relative;
  > .el-icon-rank,
  > .el-icon-document-copy,
  > .el-icon-close {
    z-index: 100;
    color: white;
    background-color: #0d95e8;
    position: absolute;
    font-size: 14px;
    width: 16px;
    height: 16px;
    line-height: 16px;
    text-align: center;
  }
  > .el-icon-rank {
    cursor: move;
    display: block;
    left: 50%;
    top: -4px;
  }
  > .el-icon-document-copy {
    cursor: pointer;
    display: block;
    right: 14px;
    top: -2px;
  }
  > .el-icon-close {
    cursor: pointer;
    display: block;
    right: -2px;
    top: -2px;
  }
}
.dr-container-item {
  &:hover {
    border-radius: 5px;
    background: #fafafb;
  }
}
.regionalGroup {
  text-align: left;
  padding-bottom: 18px;
  > p {
    font-size: 14px;
    color: #333;
    font-weight: 700;
    margin-bottom: 8px;
  }
}
</style>
