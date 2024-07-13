<template>
  <div class="item-content">
    <slot></slot>
    <div
      v-if="item.isCreated || item.nodeType === 'branch'"
      @click="nodeEdit(item.id)"
    >
      <div v-if="item.nodeType !== 'branch'" class="content-node">
        <div :class="['title', 'title--' + nodeType[item.nodeType].className]">
          {{ item.name }}
          <SvgIcon
            v-if="item.nodeType === 'examineAndApprove'"
            svgClass="approvalNode"
            :width="24"
          />
          <SvgIcon v-else svgClass="fillInNode" :width="24" />
        </div>
        <div
          :class="[
            'personInCharge',
            item.nodeType === 'start' && 'personInCharge-start',
          ]"
        >
          <span v-for="span of item.personInCharge" :key="span.value">{{
            span.label
          }}</span>
          <span v-if="!item.personInCharge || item.personInCharge.length === 0"
            >未设置负责人</span
          >
        </div>
        <div class="operation">
          <div>
            <div>
              <SvgIcon svgClass="field" :width="14" />
              <span>0</span>
            </div>
            <div>
              <SvgIcon svgClass="show" :width="14" />
              <span>0</span>
            </div>
            <div>
              <SvgIcon svgClass="invisible" :width="14" />
              <span>0</span>
            </div>
          </div>
          <div v-if="item.nodeType !== 'start'">
            <SvgIcon
              svgClass="shear"
              :width="14"
              @click.stop="nodeShear(item.id)"
            />
          </div>
        </div>
      </div>
      <div v-else class="branchNode">
        <div class="branchNode-head">所有数据可进入该分支</div>
        <div class="branchNode-foot">
          <el-button type="text">筛选数据</el-button>
        </div>
      </div>
    </div>
    <div v-else class="item-isCreated">
      <div
        :class="[
          'title title-isCreated',
          'title--' + nodeType[item.nodeType].className,
        ]"
      ></div>
      <div>
        <div class="isCreated-name">
          <span>节点名称</span>
          <el-input
            v-model="input"
            placeholder="未命名节点"
            size="small"
            @input="inputChange('name')"
          />
        </div>
        <div class="isCreated-operation">
          <span>负责人</span>
        </div>
      </div>
      <div class="isCreated-btns">
        <slot name="cancel"></slot>
        <el-button size="mini" type="primary" @click.stop="establish(item.id)"
          >创建</el-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, reactive } from "vue";
import { useStore } from "vuex";

export default defineComponent({
  props: {
    item: Object,
  },

  setup(props) {
    const store = useStore();

    const nodeType = reactive({
      start: {
        name: "开始节点",
        className: "start",
      },
      examineAndApprove: {
        name: "审批节点",
        className: "examineAndApprove",
      },
      fillIn: {
        name: "填写节点",
        className: "fillIn",
      },
      branch: {
        name: "分支节点",
        className: "branch",
      },
    });

    const input = ref(props.item.name);
    // const data = reactive({
    //   name: ref(props.item.name),
    // })
    const inputChange = (key) => {
      store.commit("SET_NODE_ATTR", {
        id: props.item.id,
        value: input.value,
        key,
      });
    };

    // 修改节点属性
    const establish = (id) => {
      store.commit("SET_NODE_ATTR", {
        id,
        value: true,
        key: "isCreated",
      });
    };

    // 编辑节点
    const nodeEdit = (id) => {
      store.commit("EDIT_CHILD_NODE", id);
    };

    // 节点剪切 取消剪切
    const nodeShear = (id) => {
      store.commit("SET_PASTE_ID", id);
    };

    return {
      nodeType,
      input,
      establish,
      nodeEdit,
      nodeShear,
      inputChange,
    };
  },
});
</script>

<style scoped lang="scss">
.item-content {
  width: 266px;
  // min-height: 108px;
  flex-shrink: 0;
  text-align: left;
  border-radius: 8px;
  box-shadow: 0px 2px 20px 0px rgba(0, 0, 0, 0.06);
  // background: linear-gradient(90.04deg, #268bfb -16.37%, #33e1ae 137.34%);
  background: #fff;
  &:hover {
    .del-btn-box > .del-btn {
      visibility: visible;
    }
  }
  > div {
    cursor: pointer;
  }
  .content-node {
    > div {
      box-sizing: border-box;
    }
  }
  .del-btn-box {
    position: absolute;
    top: -20px;
    right: -20px;
    z-index: 9;
    width: 30px;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    &:hover > .del-btn {
      visibility: visible;
    }
  }
  .del-btn {
    visibility: hidden;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    color: #fff;
    text-align: center;
    background: #acb3bd;
  }
  .title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 56px;
    padding: 16px;
    box-sizing: border-box;
    border-radius: 8px 8px 0 0;
    text-align: left;
    color: #fff;
    font-size: 16px;
    font-family: PingFang SC, PingFang SC-Bold;
    font-weight: 700;
  }
  .title-isCreated {
    height: 16px;
    padding: 0;
  }
  .title--start,
  .title--fillIn {
    background: linear-gradient(
      90deg,
      #1f6eef 0%,
      rgba(31, 139, 239, 0.67) 100%,
      #65c8ff 100%
    );
  }
  .title--examineAndApprove {
    background: linear-gradient(89deg, #ee8b30 0%, #ffcf52 100%);
  }
  .personInCharge {
    height: 56px;
    padding: 16px;
    font-size: 13px;
    font-weight: 500;
    color: #666666;
    span + span::before {
      content: "、";
      display: inline-block;
    }
  }
  .personInCharge-start {
    height: 40px;
    padding-bottom: 0px;
  }
  .operation {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 52px;
    padding: 16px;
    > div:first-child {
      display: flex;
      justify-content: space-between;
      align-items: center;
      > div {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-right: 8px;
      }
      svg {
        color: rgba(0, 69, 240, 0.15);
      }
      span {
        margin-left: 4px;
        color: #666883;
        font-size: 13px;
        line-height: 13px;
      }
    }
  }
  .item-isCreated {
    cursor: default;
  }
  .isCreated-name,
  .isCreated-operation {
    padding: 0 16px;
    margin: 16px 0;
    > span {
      display: inline-block;
      margin-bottom: 8px;
      font-size: 14px;
      font-family: PingFang SC, PingFang SC-Medium;
      font-weight: 500;
      color: #999999;
      line-height: 22px;
    }
  }
  .isCreated-btns {
    padding: 16px;
    text-align: right;
  }
  .branchNode {
    .branchNode-head {
      padding: 16px;
      font-size: 14px;
      color: #333333;
      line-height: 22px;
    }
    .branchNode-foot {
      // margin: 0 16px;
      padding: 4px 16px;
      font-size: 13px;
      font-family: PingFang SC, PingFang SC-Bold;
      font-weight: 700;
      line-height: 20px;
    }
  }
}
</style>
