<template>
  <gj-popover
    title="变体"
    @popup-visible-change="popupChange"
    position="br"
    trigger="click"
  >
    <span class="color1">变体</span>
    <template #title>变体</template>
    <template #content>
      <div class="table-content-pagination">
        <gj-table
          :columns="columnList"
          row-key="index"
          :dataSource="tableData"
          :pagination="false"
          :bordered="true"
          :scroll="scroll"
        >
        </gj-table>
      </div>
    </template>
  </gj-popover>
</template>
<script>
import { defineComponent, reactive, toRefs, watch } from "vue";

export default defineComponent({
  name: "",
  components: {},
  props: {
    title: {
      type: String,
      default: "",
    },

    position: {
      type: String,
      default: () => {
        return "br";
      },
    },
    record: {
      type: Object,
      default: () => {
        return {
          variants: [],
        };
      },
    },
    columnList: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  setup(props) {
    const data = reactive({
      record: props.record,
      columnList: [],
      tableData: [],
      scroll: {
        x: 0,
        y: 514,
      },
    });

    const popupChange = (bool) => {
      if (bool) {
        const otherColumns = data.record?.variants[0]?.variationSkuAttr;
        if (otherColumns.length > 0) {
          data.columnList = [...props.columnList];
          otherColumns.forEach((item) => {
            data.columnList.unshift({
              title: item.attrName ? item.attrName : item.attrId,
              dataIndex: item.attrName,
              width: 100,
            });
          });
        }
        data.tableData = data.record?.variants.map((item, index) => {
          item.variationSkuAttr.forEach((item1) => {
            item[item1.attrName] = item1.attrValueDefinitionName
              ? item1.attrValueDefinitionName
              : item1.attrValueName;
          });
          item.index = index;
          return item;
        });

        // console.log(data.tableData)
        // console.log(data.columnList)
      }
    };
    watch(
      () => props.record,
      (newValue) => {
        data.record = newValue;
      },
      {
        deep: true,
      }
    );
    watch(
      () => props.record,
      (newValue) => {
        data.record = newValue;
      },
      {
        deep: true,
      }
    );
    return {
      popupChange,
      ...toRefs(data),
    };
  },
});
</script>
<style scoped lang="scss">
.table-content-pagination {
  max-width: 600px;
  position: relative;
  :deep(.surely-table) {
    max-height: 300px;
    min-width: 300px;
  }
}
.color1 {
  color: #0045f0;
}
</style>
