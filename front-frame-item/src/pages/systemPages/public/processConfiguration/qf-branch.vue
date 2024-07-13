<template>
  <div :class="isLc ? 'qf-branch-lc' : 'qf-branch'">
    <div v-if="!isLc && isStart" class="top-left"></div>
    <div v-if="!isLc && isStart" class="lower-left"></div>
    <div v-if="!isLc && isEnd" class="top-right"></div>
    <div v-if="!isLc && isEnd" class="lower-right"></div>
    <div
      v-for="(item, itmeIndex) of list"
      :key="item.id"
      :class="[
        'qf-branch-item',
        item.nodeType === 'branch' && 'branch-item_branch',
      ]"
    >
      <template v-if="item.children">
        <div
          v-if="!isLc"
          class="add-branch flex-center"
          @click="addChildNode(item.id)"
        >
          <SvgIcon svgClass="add" />
        </div>
        <qf-branch
          :list="item.children"
          :isLc="!isLc"
          :isStart="itmeIndex === 0"
          :isEnd="itmeIndex === list.length - 1"
          :pid="isLc ? item.id : pid"
          :pIndex="itmeIndex"
        ></qf-branch>
      </template>
      <div v-else class="item-box">
        <div v-if="isLc && itmeIndex === 0" class="top-left"></div>
        <div v-if="isLc && itmeIndex === 0" class="lower-left"></div>
        <div
          v-if="isLc && itmeIndex === list.length - 1"
          class="top-right"
        ></div>
        <div
          v-if="isLc && itmeIndex === list.length - 1"
          class="lower-right"
        ></div>
        <div class="item-line"></div>
        <div class="paste-box">
          <div class="paste-mask" v-if="pasteId === item.id">
            <el-button type="primary" @click="nodeShear">取消剪切</el-button>
          </div>
          <item :item="item">
            <div
              v-if="
                (item.nodeType !== 'start' && item.isCreated) ||
                item.nodeType === 'branch'
              "
              class="del-btn-box"
            >
              <el-popconfirm
                title="是否确认删除节点?"
                @confirm="removeChildNode(item.id, itmeIndex, isLc)"
              >
                <template #reference>
                  <div class="del-btn">
                    <SvgIcon svgClass="delete" :width="14" />
                  </div>
                </template>
              </el-popconfirm>
            </div>
            <template v-slot:cancel>
              <el-button
                size="mini"
                @click="removeChildNode(item.id, itmeIndex, isLc)"
                >取消</el-button
              >
            </template>
          </item>
        </div>
        <div class="item-line-box">
          <!-- <el-button class="add-btn" @click="openPopover"> + </el-button> -->
          <el-popover placement="right" :width="100" trigger="click">
            <template #reference>
              <el-button class="add-btn">
                <SvgIcon svgClass="add" />
              </el-button>
            </template>
            <div>
              <el-button
                type="success"
                @click="
                  insertChildNode(
                    isLc ? item.id : item.parentId,
                    itmeIndex,
                    'fillIn'
                  )
                "
                >审批节点</el-button
              >
            </div>
            <div style="margin-top: 10px">
              <el-button
                type="warning"
                @click="
                  insertChildNode(
                    isLc ? item.id : item.parentId,
                    itmeIndex,
                    'branch'
                  )
                "
                >创建子分支</el-button
              >
            </div>
            <div style="margin-top: 10px" v-if="pasteId">
              <el-button
                type="warning"
                @click="
                  insertChildNode(
                    isLc ? item.id : item.parentId,
                    itmeIndex,
                    'paste'
                  )
                "
                >粘贴</el-button
              >
            </div>
          </el-popover>
        </div>
      </div>
    </div>
  </div>
  <div v-if="isLc" class="lc-line-box line-box">
    <div class="item-line"></div>
    <div class="item-line-box">
      <!-- <el-button class="add-btn"> + </el-button> -->
      <el-popover
        v-model:visible="popoverVisible"
        placement="right"
        :width="100"
        trigger="click"
      >
        <template #reference>
          <el-button class="add-btn">
            <SvgIcon svgClass="add" />
          </el-button>
        </template>
        <el-button
          type="success"
          @click="insertChildNode(pid, pIndex, 'fillIn')"
          >审批节点</el-button
        >
        <el-button
          type="warning"
          @click="insertChildNode(pid, pIndex, 'branch')"
          >创建子分支</el-button
        >
        <div style="margin-top: 10px" v-if="pasteId">
          <el-button
            type="warning"
            @click="insertChildNode(pid, pIndex, 'paste')"
            >粘贴</el-button
          >
        </div>
      </el-popover>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, computed } from "vue";
import { useStore } from "vuex";
import item from "./qf-branch-item.vue";

export default defineComponent({
  name: "qf-branch",
  props: {
    list: {
      type: Array,
    },
    isLc: [Boolean, Number],
    isStart: Boolean,
    isEnd: Boolean,
    pid: String,
    pIndex: Number,
  },
  components: {
    item,
  },
  setup() {
    const store = useStore();
    const popoverVisible = ref(false);
    // 添加分支
    const addChildNode = (id) => {
      store.commit("ADD_CHILD_NODE", id);
    };
    // 插入节点
    const insertChildNode = (id, index, type) => {
      popoverVisible.value = false;
      store.commit("INSERT_CHIILD_NODE", { id, index, type });
      store.commit("SET_PASTE_ID");
    };
    // 删除节点
    const removeChildNode = (id, index, isLc) => {
      store.dispatch("removeChildNode", { id, index, isLc });
    };

    //取消剪切
    const nodeShear = () => {
      store.commit("SET_PASTE_ID");
    };

    return {
      pasteId: computed(() => store.state.processConfiguration.pasteId),
      popoverVisible,
      addChildNode,
      insertChildNode,
      removeChildNode,
      nodeShear,
    };
  },
});
</script>
<style lang="scss">
.add-btn {
  span {
    height: 23px;
    font-size: 23px;
  }
}
</style>
<style scoped lang="scss">
.item-content:hover {
  .del-btn-box > .del-btn {
    visibility: visible;
  }
}
.flex-center-xs {
  display: flex;
  justify-content: space-between;
  padding: 0 20px;
}
.qf-branch {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  > .qf-branch-item:last-child {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
}
.qf-branch-item {
  position: relative;
}
.qf-branch-lc {
  position: relative;
  display: flex;
  justify-content: center;
  border-bottom: 1px solid #9cccff;
  border-top: 1px solid #9cccff;
}
.add-branch {
  position: absolute;
  top: -12.5px;
  left: calc(50% - 12.5px);
  z-index: 11;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 25px;
  height: 25px;
  // margin: 0 auto;
  border-radius: 50%;
  background-color: #1f6eef;
  font-size: 19px;
  color: #fff;
  cursor: pointer;
}
.top-left,
.top-right,
.lower-left,
.lower-right {
  position: absolute;
  height: 3px;
  width: 50%;
  background: #f2f6fe;
}
.top-left {
  top: -2px;
  left: -0.5px;
}
.top-right {
  top: -2px;
  right: -0.5px;
}
.lower-left {
  bottom: -2px;
  left: -0.5px;
}
.lower-right {
  bottom: -2px;
  right: -0.5px;
}
.item-box,
.line-box {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.item-box {
  padding: 0 20px;
  height: 100%;
  box-sizing: border-box;
}
.branch-item_branch > .item-box {
  padding-top: 20px;
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
  text-align: center;
  color: rgba(0, 4, 48, 0.4);
  background: #fff;
}
.item-line-box {
  padding: 32px 20px 28px 20px;
  z-index: 1;
}
.item-line {
  position: absolute;
  top: 0;
  z-index: 0;
  width: 1px;
  height: 100%;
  background-color: #9cccff;
}
.line-box {
  flex: 1;
}
.line {
  width: 1px;
  height: 20px;
  background-color: #ccd4e0;
}

.add-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 37px;
  height: 37px;
  min-height: 30px;
  padding: 0;
  border: 1px solid #9cccff;
  border-radius: 50%;
  background-color: #fff;
  color: #1f6eef;
  cursor: pointer;
  box-shadow: 0px 2px 20px 0px rgba(0, 0, 0, 0.06);
  &:hover {
    background-color: #edf7ff;
  }
}
.paste-box {
  position: relative;
  z-index: 1;
  .paste-mask {
    position: absolute;
    z-index: 10;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    background: rgba(43, 52, 65, 0.6);
    cursor: pointer;
    // &:hover {
    //   background: rgba(43, 52, 65, 0.6);
    // }
  }
}
</style>
