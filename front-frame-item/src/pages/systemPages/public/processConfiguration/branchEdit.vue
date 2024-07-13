<template>
  <div class="describe">
    <ul>
      <li>
        当关联目标应用的表单字段时，在筛选中选择了表格子字段，则表格中只要有一行满足条件，该数据就会被筛选出来
      </li>
      <li>
        当关联目标应用的表格子字段时，对同一表格进行筛选，可筛选出符合条件的表格行数据
      </li>
    </ul>
  </div>
  <div class="condition" v-for="(item, index) of data.conditions" :key="index">
    <div class="condition-item">
      <el-row
        class="condition-item-row"
        :gutter="20"
        v-for="(row, indexRow) of item.andList"
        :key="indexRow"
      >
        <el-col :span="6">
          <el-select
            v-model="row.andListLeft"
            placeholder="关联应用字段"
            size="small"
          >
            <el-option
              label="张三"
              :value="{ value: 'zhangsan', label: '张三' }"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-select
            v-model="row.logicalJudge"
            multiple
            placeholder="判断符"
            size="small"
          >
            <el-option
              v-for="item of data.logicalJudge"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="3">
          <el-select
            v-model="row.type"
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
        </el-col>
        <el-col :span="7">
          <!-- <el-select
            v-model="row.andListRight"
            multiple
            placeholder="请选择负责人"
            size="small"
          >
            <el-option
              label="张三"
              :value="{ value: 'zhangsan', label: '张三' }"
            ></el-option>
          </el-select> -->
        </el-col>
        <el-col :span="2" @click="delRow(index, indexRow)">删除</el-col>
      </el-row>
      <el-button size="mini" @click="addRow(index)">+ 且条件</el-button>
    </div>
  </div>
  <el-button class="addAnd" size="mini" @click="addCondition"
    >+ 或条件</el-button
  >
  <div class="dialog-footer">
    <el-button size="small" @click="beforeClose">取消</el-button>
    <el-button size="small" type="primary" @click="confirm">确认</el-button>
  </div>
</template>

<script>
import { reactive } from "vue";
import { useStore } from "vuex";
import { andCondition, branchCondition, Condition } from "./nodeModel.js";

export default {
  setup() {
    const store = useStore();

    const data = reactive({
      conditions: JSON.parse(
        JSON.stringify(store.state.processConfiguration.selectedNode.conditions)
      ),
      logicalJudge: [
        { label: "等于", value: "beEqualto" },
        { label: "不等于", value: "onBeEqualto" },
        { label: "包含", value: "contain" },
        { label: "不包含", value: "onContain" },
      ],
    });
    //关闭对话框
    const beforeClose = () => {
      store.commit("EDIT_CLOS");
    };

    //添加或条件
    const addCondition = () => {
      data.conditions.push(new Condition(branchCondition));
      // console.log(store.state.processConfiguration.selectedNode)
    };
    //添加且条件
    const addRow = (index) => {
      data.conditions[index].andList.push(new Condition(andCondition));
    };
    //删除
    const delRow = (index, indexRow) => {
      console.log(index, indexRow);
      if (indexRow === 0 && data.conditions[index].andList.length === 1) {
        data.conditions.splice(index, 1);
      } else {
        data.conditions[index].andList.splice(indexRow, 1);
      }
    };

    const confirm = () => {
      store.commit(
        "SET_BRANCHNODE_CONDITIONS",
        JSON.parse(JSON.stringify(data.conditions))
      );
      beforeClose();
    };

    return {
      data,
      beforeClose,
      addCondition,
      addRow,
      delRow,
      confirm,
    };
  },
};
</script>

<style scoped lang="scss">
.describe {
  box-sizing: border-box;
  height: 68px;
  padding: 9px 16px;
  background: #eef3fb;
  border-radius: 4px;
  font-size: 13px;
  color: #666666;
  line-height: 20px;
  > ul {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
  }
}
.condition {
  .condition-item {
    box-sizing: border-box;
    padding: 16px;
    margin: 16px 0 !important;
    border: 1px solid #e4e7ed;
    border-radius: 4px;
    .condition-item-row {
      margin-bottom: 8px;
    }
  }
}
.condition + .condition {
  &::before {
    content: "或";
    display: block;
    font-size: 14px;
    // font-family: PingFang SC, PingFang SC-Bold;
    font-weight: 700;
    text-align: left;
    color: #666666;
    line-height: 22px;
  }
}
.addAnd {
  margin-left: 16px;
}
.dialog-footer {
  padding-top: 30px;
  text-align: right;
}
</style>
