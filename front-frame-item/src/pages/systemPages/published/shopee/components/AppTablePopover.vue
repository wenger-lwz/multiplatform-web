<template>
  <gj-popover
    :position="position"
    @popup-visible-change="popupChange"
    content-class="pop"
    :popup-container="popupContainer"
    trigger="click"
  >
    <slot name="default"
      ><span class="copy-item">{{ record }}</span></slot
    >
    <template #title>
      <div class="tit">
        {{ title }}
        <span class="title-suffix">{{ titleSuffix }}</span>
      </div>
    </template>

    <span style="color: rgb(0, 69, 240)">
      <SvgIcon
        svgClass="popclick"
        style="vertical-align: middle; color: rgb(0, 69, 240)"
        :width="12"
      ></SvgIcon>
    </span>
    <template #content>
      <div class="table-content-pagination">
        <gj-table
          :row-key="rowKey"
          :loading="loading"
          :height="300"
          :columns="columns"
          :data-source="tableData"
          :pagination="false"
        />
        <div class="paginationBox" v-if="hasPagination">
          <gj-pagination
            :total="pagination.total"
            simple
            @change="pageCurrentChange"
          />
        </div>
      </div>
    </template>
  </gj-popover>
</template>
<script>
import { toRefs, reactive, onMounted, defineComponent } from "vue";
import SvgIcon from "@/components/SvgIcon";

export default defineComponent({
  components: {
    SvgIcon,
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
      default: "id",
    },
    record: {
      type: [String, Number],
      default: () => {
        return "";
      },
    },
    position: {
      type: String,
      default: () => {
        return "br";
      },
    },
    popupContainer: {
      type: [String, Object],
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
    resData: {
      type: Object,
      default: () => {
        return {};
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
      let _tableData;
      let _total = 0;

      if (props.handlerFunction) {
        const { total, tableData } = props.handlerFunction(
          props.resData.variants
        );
        _tableData = tableData;
        _total = total;
      } else {
        _tableData = props.resData.variants;
      }
      data.tableData = _tableData;
      data.pagination.total = _total;
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
      console.log(current);
      data.pagination.pageCurrent = current;
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
    };
  },
});
</script>

<style lang="scss" scoped>
.tit {
  line-height: 32px;
  padding: 0 16px;
}
.title-suffix {
  font-weight: 400;
  color: #333659;
}
.copy-item {
  color: #0045f0;
}

.table-content-pagination {
  position: relative;
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
