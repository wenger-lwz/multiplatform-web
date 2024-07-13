<template>
  <div
    class="header"
    :class="['title--' + nodeType[selectedNode.nodeType].className]"
  >
    <div class="header-title">
      <div v-show="showTitle">
        <span>
          {{ selectedNode.name }}
        </span>
        <SvgIcon svgClass="field" :width="16" @click="showTitle = false" />
      </div>
      <div v-show="!showTitle">
        <el-input v-model="selectedNode.name"></el-input>
        <el-button type="success" @click="showTitle = true">确定</el-button>
      </div>
    </div>
    <div v-if="selectedNode.nodeType !== 'start'" class="header-right">
      <div class="header-type">
        <span>节点类型：</span>
        <el-dropdown trigger="click">
          <span class="el-dropdown-link">
            {{ nodeType[selectedNode.nodeType].name }}
            <div class="el-dropdown-icon"></div>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item
                @click="
                  nodeEdit(selectedNode.id, 'nodeType', 'examineAndApprove')
                "
                >审批节点</el-dropdown-item
              >
              <el-dropdown-item
                @click="nodeEdit(selectedNode.id, 'nodeType', 'fillIn')"
                >填写节点</el-dropdown-item
              >
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
      <div class="del-node">
        <el-popconfirm title="是否确认删除节点?" @confirm="removeChildNode">
          <template #reference>
            <SvgIcon svgClass="delete" :width="18" />
          </template>
        </el-popconfirm>
      </div>
    </div>
  </div>
  <!-- {{ $store.state.selectedNode }} -->
  <!-- <el-input v-model="selectedNode.name"></el-input> -->
  <div class="content">
    <div v-if="selectedNode.nodeType !== 'start'" class="personInCharge">
      <div class="personInCharge-title">负责人</div>
      <el-select
        v-model="selectedNode.personInCharge"
        multiple
        placeholder="请选择负责人"
        size="small"
      >
        <el-option
          label="张三"
          :value="{ value: 'zhangsan', label: '张三' }"
        ></el-option>
        <el-option
          label="李四"
          :value="{ value: 'lisi', label: '李四' }"
        ></el-option>
      </el-select>
    </div>
    <div class="basicSettings">
      <div class="node-edit-title">基础设置</div>
      <div :style="'height:' + switchHeight" class="basicSettings-switch">
        <div class="switch-item" v-for="item of switchs" :key="item.key">
          <div>
            <div>
              <p class="switch-item-title">{{ item.title }}</p>
              <p class="switch-item-describe">{{ item.describe }}</p>
            </div>
            <el-switch v-model="selectedNode[item.key]" />
          </div>
          <div v-if="item.key === 'back'" class="switch-item-details">
            <div>回退范围 之前的所有节点</div>
            <div>被回退的数据重新提交后 按流程顺序审批</div>
          </div>
        </div>
      </div>
      <div
        class="switch-open"
        @click="switchHeight = switchHeight ? '' : '440px'"
      ></div>
    </div>
    <div class="fieldPermissions">
      <div class="node-edit-title">字段权限</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showTitle: true,
      nodeType: {
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
      },
      switchHeight: "",
      switchs: [
        {
          title: "处理反馈",
          describe:
            "节点负责人处理待办时可以填写处理反馈，处理反馈将显示在流程日志中",
          key: "processFeedback",
        },
        {
          title: "流程撤回",
          describe: "节点负责人可对已处理过的待办数据进行撤回",
          key: "withdraw",
        },
        {
          title: "流程日志",
          describe: "允许查看流程日志",
          key: "viewLog",
        },
        {
          title: "待办转交",
          describe: "节点负责人可将待办事项转交给其他成员处理",
          key: "transfer",
        },
        {
          title: "流程回退",
          describe: "节点负责人可将流程回退到之前的节点，仅审批节点可用",
          key: "back",
        },
        {
          title: "流程驳回",
          describe:
            "节点负责人可以驳回该流程（驳回后流程直接结束，标记为已驳回）",
          key: "reject",
        },
      ],
    };
  },
  computed: {
    selectedNode() {
      return this.$store.state.processConfiguration.selectedNode;
    },
  },
  methods: {
    nodeEdit(id, key, value) {
      this.$store.commit("SET_NODE_ATTR", { id, key, value });
    },
    // 删除节点
    removeChildNode() {
      this.$store.commit("EDIT_CLOS");
      // this.$store.dispatch('removeChildNode', { id, index, isLc })
    },
  },
};
</script>

<style scoped lang="scss">
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  height: 55px;
  padding: 16px;
  background: linear-gradient(90.04deg, #268bfb -16.37%, #33e1ae 137.34%);
  .header-title {
    font-size: 18px;
    font-weight: 700;
    color: #ffffff;
    line-height: 26px;
    > div {
      display: flex;
      align-items: center;
    }
    span {
      margin-right: 10px;
    }
    svg {
      cursor: pointer;
    }
  }
  .header-right {
    display: flex;
    align-items: center;
  }
  .header-type {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    width: 184px;
    height: 36px;
    padding: 0 15px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 32px;
    font-size: 14px;
    font-weight: 500;
    color: #ffffff;
    .el-dropdown-link {
      cursor: pointer;
    }
  }
  .del-node {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 36px;
    height: 36px;
    margin-left: 15px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 24px;
    color: #fff;
    cursor: pointer;
  }
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
.content {
  padding: 16px;
  .personInCharge {
    .personInCharge-title {
      margin-bottom: 8px;
      font-size: 14px;
      font-weight: 500;
      color: #333333;
      line-height: 22px;
    }
  }
  .node-edit-title {
    display: flex;
    align-items: center;
    font-size: 18px;
    font-family: PingFang SC, PingFang SC-Bold;
    font-weight: 700;
    color: #000000;
    line-height: 26px;
    &::before {
      content: "";
      box-sizing: border-box;
      display: block;
      width: 4px;
      height: 18px;
      margin-right: 8px;
      background: #1f6eef;
    }
  }
  .basicSettings {
    position: relative;
    padding: 20px 0 24px 0;
    .basicSettings-switch {
      box-sizing: border-box;
      overflow: hidden;
      height: 194px;
      margin-top: 16px;
      padding: 14px 12px 0 12px;
      border: 1px solid #e4e7ed;
      border-radius: 4px;
      transition: height 0.3s;
      .switch-item {
        margin-bottom: 14px;
        > div:first-child {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        &-title {
          margin: 0;
          margin-bottom: 4px;
          font-size: 14px;
          color: #333333;
          line-height: 22px;
        }
        &-describe {
          margin: 0;
          font-size: 12px;
          color: #999999;
          line-height: 18px;
        }
        &-details {
          box-sizing: border-box;
          width: 510px;
          height: 60px;
          margin: 8px 0 0 21px;
          padding: 8px;
          background: #eef3fb;
          border-radius: 4px;
        }
      }
    }
    .switch-open {
      position: absolute;
      box-sizing: border-box;
      left: 50%;
      bottom: 14px;
      width: 19px;
      height: 20px;
      background: #fff;
      border-radius: 50%;
      border: 2px solid #e4e7ed;
      cursor: pointer;
    }
  }
}
.el-dropdown-link {
  display: flex;
  align-items: center;
  color: #fff;
}
.el-dropdown-icon {
  margin-top: 8px;
  margin-left: 6px;
  border: 7px solid rgba(255, 255, 255, 0.01);
  border-top-color: #fff;
}
</style>
