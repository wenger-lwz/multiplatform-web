<template>
  <div>
    <div class="search-sku">
      <gj-input
        v-model="skuCode"
        placeholder="请输入SKU编码"
        size="small"
      ></gj-input>
      <gj-button type="primary" size="small" @click="searchSku">搜索</gj-button>
    </div>
    <gj-table
      :data-source="tableData"
      :columns="columns"
      :pagination="false"
      row-key="id"
      :scroll="scroll"
    >
      <!-- 表体单元格 -->
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <gj-radio v-model="isSelected" :value="record?.id">
            {{ isSelected === record?.id ? "已选中" : "选择" }}
          </gj-radio>
        </template>
      </template>
    </gj-table>
    <div class="dalogFromBtn">
      <gj-button type="plain" @click="cancelSelect">取消</gj-button>
      <gj-button type="primary" @click="submitSelect">确定</gj-button>
    </div>
  </div>
</template>
<script>
import { defineComponent, reactive, toRefs } from "vue";
import { getSkuListByCondition } from "@/api/published/generalTools";
export default defineComponent({
  emits: ["closeSelectSku", "chooseSkuCb"],
  setup(props, { emit }) {
    const data = reactive({
      tableData: [],
      columns: [
        {
          title: "SKU",
          dataIndex: "sku",
        },
        {
          title: "产品名称",
          dataIndex: "skuName",
        },
        {
          title: "操作",
          key: "action",
        },
      ],
      skuCode: "",
      isSelected: "",
      scroll: {
        x: 0,
        y: 320,
      },
    });
    const cancelSelect = () => {
      data.skuCode = "";
      emit("closeSelectSku");
    };
    const submitSelect = () => {
      let val = data.tableData.filter((item) => item.id === data.isSelected)[0]
        ?.sku;
      emit("chooseSkuCb", val);
    };
    const searchSku = () => {
      getSkuListByCondition({ sku: data.skuCode }).then((res) => {
        data.tableData = res.data;
      });
    };
    return {
      ...toRefs(data),
      searchSku,
      cancelSelect,
      submitSelect,
    };
  },
});
</script>
<style scoped lang="scss">
.search-sku {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  /deep/ .arco-input {
    width: 250px;
  }
}
.dalogFromBtn {
  margin-top: 16px;
  display: flex;
  justify-content: end;
  gap: 12px;
}
</style>
