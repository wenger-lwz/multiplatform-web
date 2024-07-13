<template>
  <gj-modal
    :visible="visible"
    class="gj-skySelect"
    :width="700"
    :unmount-on-close="true"
    :render-to-body="false"
    :footer="false"
    title="选择SPU"
    @before-cancel="modalClose"
  >
    <div class="searchSku">
      <gj-input-search
        v-model="skuCode"
        placeholder="SPU/产品名称"
        @search="searchSku"
        @press-enter="searchSku"
      ></gj-input-search>
    </div>
    <div class="selected">
      已选：<span>{{ selectCode }}</span>
    </div>
    <div class="table-box">
      <gj-table
        :columns="columns"
        :data-source="tableData"
        :pagination="false"
        :scroll="scroll"
        :row-height="50"
        rowKey="spu"
      >
        <template #bodyCell="{ record, column }">
          <template v-if="column.dataIndex === 'spu'">
            <gj-radio v-model="selectCode" :value="record.spu"
              ><div class="fontNoWrap-1">{{ record.spu }}</div></gj-radio
            >
          </template>
          <template v-if="column.dataIndex === 'spuName'">
            <div class="fontNoWrap-1">{{ record.spuName }}</div>
          </template>
        </template>
      </gj-table>
    </div>

    <div class="dalogFromBtn">
      <gj-button type="outline" size="small" @click="modalClose" shape="round"
        >取消</gj-button
      >
      <gj-button type="primary" size="small" @click="submitSelect" shape="round"
        >确定</gj-button
      >
    </div>
  </gj-modal>
</template>
<script>
import { defineComponent, reactive, toRefs } from "vue";
import { spuInfoList } from "@/api/published/materialCenter";
export default defineComponent({
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    defaultValue: {
      type: String,
      default: "",
    },
  },
  emits: ["update:visible", "confirm"],
  setup(props, { emit }) {
    const data = reactive({
      columns: [
        {
          title: "SPU",
          dataIndex: "spu",
        },
        {
          title: "产品名称",
          dataIndex: "spuName",
        },
      ],
      tableData: [],
      scroll: {
        x: 0,
        y: 345,
      },
      skuCode: "",
      selectCode: "",
    });

    if (props.defaultValue) {
      // eslint-disable-next-line
      data.selectCode = props.defaultValue;
    }

    const modalClose = () => {
      emit("update:visible", false);
      data.skuCode = "";
      data.selectCode = "";
      searchSku();
    };

    const submitSelect = () => {
      emit("confirm", data.selectCode);
      modalClose();
    };
    const searchSku = () => {
      spuInfoList({ spu: data.skuCode }).then((res) => {
        data.tableData = res.data;
      });
    };
    searchSku();
    return {
      ...toRefs(data),
      modalClose,
      searchSku,
      submitSelect,
    };
  },
});
</script>
<style lang="scss">
.gj-skySelect {
  .arco-modal-body {
    display: flex;
    flex-direction: column;
    padding: 0;
    min-height: 500px;
    .table-box {
      flex: 1;
    }
  }
}
</style>
<style scoped lang="scss">
.searchSku {
  width: 170px;
  padding: 10px 8px;
  padding-bottom: 0;
}
.selected {
  padding: 8px;
  color: #999bac;
  > span {
    color: #0045f0;
  }
}
.dalogFromBtn {
  padding: 8px 16px;
  border-top: 1px solid #e6e6ed;
  text-align: right;
  .arco-btn + .arco-btn {
    margin-left: 10px;
  }
}
</style>
