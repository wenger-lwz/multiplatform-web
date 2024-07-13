<template>
  <gj-modal
    :visible="visible"
    modal-class="skuShowRelatedInfo"
    :unmount-on-close="true"
    :render-to-body="false"
    :hide-cancel="true"
    @ok="modalClose"
    @before-cancel="modalClose"
  >
    <template #title>
      <span class="skuShowRelatedInfo-title">关联信息</span>
      <gj-tabs @change="tabsChange">
        <gj-tab-pane
          v-for="item of columnsArr"
          :key="item.key"
          :title="item.title"
        ></gj-tab-pane>
      </gj-tabs>
    </template>
    <gj-table
      class="relatedInfo-table"
      :pagination="false"
      :columns="columns"
      :data-source="tableData"
      :scroll="scroll"
      rowKey="id"
    />
  </gj-modal>
</template>

<script>
import { reactive, toRefs, watch } from "vue";
import { getBindInfoList } from "@/api/published/materialCenter";

export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    resourceId: {
      type: String,
      default: "",
    },
    popupContainer: {
      type: String,
      default: "body",
    },
  },

  emits: ["update:visible"],
  setup(props, { emit }) {
    const columnsArr = [
      {
        key: 1,
        title: "产品",
        columns: [
          {
            title: "SPU/SKU",
            dataIndex: "sku",
          },
          {
            title: "产品名称",
            dataIndex: "title",
          },
        ],
      },
      {
        key: 2,
        title: "商品资料",
        columns: [
          {
            title: "SPU/SKU",
            dataIndex: "sku",
          },
          {
            title: "标题",
            dataIndex: "title",
          },
        ],
      },
      {
        key: 3,
        title: "listing",
        columns: [
          {
            title: "平台",
            dataIndex: "platform",
          },
          {
            title: "item Id",
            dataIndex: "itemId",
          },
          {
            title: "标题",
            dataIndex: "title",
          },
        ],
      },
      {
        key: 4,
        title: "详情模板",
        columns: [
          {
            title: "平台",
            dataIndex: "platform",
          },
          {
            title: "标题",
            dataIndex: "title",
          },
        ],
      },
    ];
    const data = reactive({
      columns: columnsArr[0].columns,
      tableData: [],
      scroll: {
        y: 360,
      },
    });

    const modalClose = () => {
      emit("update:visible", false);
    };

    watch(
      () => props.resourceId,
      () => {
        tabsChange(columnsArr[0].key);
      }
    );

    const tabsChange = (val) => {
      data.columns = columnsArr[val - 1].columns;
      getBindInfoList({ businessType: val, resourceId: props.resourceId }).then(
        (res) => {
          data.tableData = res.data;
        }
      );
    };

    return {
      modalClose,
      columnsArr,
      ...toRefs(data),
      tabsChange,
    };
  },
};
</script>

<style lang="scss">
.skuShowRelatedInfo {
  .relatedInfo-table {
    height: 400px;
    border: 1px solid #dadde2;
    border-radius: 4px;
  }
  .arco-modal-header,
  .arco-modal-footer {
    padding-top: 0;
    border: 0;
  }
  .arco-modal-header {
    height: 40px;
  }
  .arco-modal-header .arco-modal-title {
    justify-content: center;
  }
  .arco-modal-title {
    position: relative;
    .skuShowRelatedInfo-title {
      position: absolute;
      left: 0;
      font-size: 14px;
      font-weight: bold;
      color: #333659;
    }
    .arco-tabs-nav::before {
      height: 0;
    }
  }
  .arco-tabs-content {
    display: none;
  }
}
</style>
