<template>
  <gj-popover
    :position="position"
    @popup-visible-change="popupChange"
    :update-at-scroll="true"
    trigger="click"
  >
    <slot
      ><span class="copy-item">{{ record?.publishCount }}</span></slot
    >
    <template #title>
      <div>
        {{ title }}
        <span class="title-suffix">{{ titleSuffix }}</span>
      </div>
    </template>

    <template #content>
      <div class="table-content-pagination">
        <gj-table
          :animateRows="false"
          :row-key="rowKey"
          :loading="loading"
          :scroll="{ x: 'auto', y: 'auto' }"
          :columns="columns"
          :data-source="tableData"
          :bordered="true"
          :pagination="false"
        />
        <div class="paginationBox" v-if="hasPagination">
          <AppPagination
            paginationSize="mini"
            :pagination="pagination"
            @onCurrentChange="pageCurrentChange"
            @onPageSizeChange="pageSizeChange"
          />
        </div>
      </div>
    </template>
  </gj-popover>
</template>
<script>
import { toRefs, reactive, onMounted, defineComponent } from "vue";
import AppPagination from "@/components/AppPagination.vue";
import { getOnLineRecord } from "@api/published/aliexpress";
export default defineComponent({
  components: {
    AppPagination,
  },
  props: {
    title: {
      type: String,
      default: () => {
        return "";
      },
    },
    titleSuffix: {
      type: String,
      default: () => {
        return "";
      },
    },
    rowKey: {
      type: String,
      default: () => {
        return "itemID";
      },
    },
    record: {
      type: Object,
      default: () => {},
    },
    position: {
      type: String,
      default: () => {
        return "br";
      },
    },
    columns: {
      type: Object,
      required: true,
    },
    paramObj: {
      //查询的参数
      type: Object,
      default: () => {
        return null;
      },
    },
    requestFunction: {
      //请求接口的函数
      default: () => {
        return null;
      },
    },
    handlerFunction: {
      //数据处理函数
      type: Function,
      default: () => {
        return null;
      },
    },
    reqUntilShow: {
      type: Boolean,
      default: () => {
        return true;
      },
    },
    hasPagination: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
    productId: {
      type: [String, Number],
      default: () => {
        return "";
      },
    },
  },
  emits: ["popup-close"],
  setup(props, { emit }) {
    const data = reactive({
      tableData: [],
      pagination: {
        pageCurrent: 1,
        pageSize: 20,
        total: 0,
      },
      loading: false,
    });

    const clearData = () => {
      data.tableData = [];
    };

    const getData = () => {
      let params = {
        productId: props.productId,
        pageCurrent: data.pagination.pageCurrent,
        pageSize: data.pagination.pageSize,
        businessType: 1,
      };
      getOnLineRecord(params).then((res) => {
        data.tableData = res.data.records;
      });
    };
    const popupChange = (bool) => {
      if (bool) {
        if (props.reqUntilShow) {
          // 清空其他行的数据
          clearData();
          getData();
        }
      } else {
        emit("popup-close");
      }
    };

    const resetHandler = () => {
      getData();
    };

    const pageCurrentChange = (current) => {
      data.pagination.pageCurrent = current;
      getData();
    };

    const pageSizeChange = (val) => {
      data.pagination.pageSize = val;
      getData();
    };

    onMounted(() => {
      if (!props.reqUntilShow) {
        getData();
      }
    });

    return {
      ...toRefs(data),
      popupChange,
      resetHandler,
      pageCurrentChange,
      pageSizeChange,
    };
  },
});
</script>

<style lang="scss" scoped>
.title-suffix {
  font-weight: 400;
  color: #333659;
}
.copy-item {
  color: #0045f0;
}

.table-content-pagination {
  max-width: 600px;
  position: relative;
  :deep(.surely-table) {
    max-height: 300px;
    min-width: 300px;
  }
}

.paginationBox {
  display: flex;
  position: absolute;
  justify-content: flex-end;
  align-items: center;
  background-color: #fff;
  right: 10px;
  bottom: 0px;
  z-index: 999;
  right: 0px;
  width: 100%;
  height: 45px;
}
</style>
