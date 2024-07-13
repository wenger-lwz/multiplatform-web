<template>
  <gj-popover
    class="popover-table-small"
    trigger="click"
    :position="position"
    @popup-visible-change="popupChange"
    :popup-container="popupContainer"
  >
    <slot
      ><span class="popover-table-small-txt"
        >{{ record
        }}<svg-icon class="arrow-icon" svgClass="popclick" :width="12" />
      </span>
    </slot>
    <template #title>
      <div>
        {{ title }}
        <span class="title-suffix">{{ titleSuffix }}</span>
      </div>
    </template>

    <template #content>
      <div>
        <gj-table
          :row-key="rowKey"
          :row-height="32"
          :loading="loading"
          :columns="columns"
          :data-source="tableData"
          :pagination="false"
          :scroll="{ x: 'auto', y: 300 }"
        />
        <div v-if="hasPagination">
          <gj-pagination
            simple
            :total="pagination.total"
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
      default: "",
    },
    position: {
      type: String,
      default: "bottom",
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
      default: null,
    },
    requestFunction: {
      //请求接口的函数
      default: null,
    },
    handlerFunction: {
      //数据处理函数
      type: Function,
      default: null,
    },
    reqUntilShow: {
      type: Boolean,
      default: true,
    },
    hasPagination: {
      type: Boolean,
      default: false,
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
      data.loading = true;
      if (props.requestFunction) {
        const params = {
          ...props.paramObj,
          pageCurrent: props.hasPagination
            ? data.pagination.pageCurrent
            : undefined,
          pageSize: props.hasPagination ? data.pagination.pageSize : undefined,
        };
        props
          .requestFunction(params)
          .then((res) => {
            let _tableData;
            let _total = 0;
            if (props.handlerFunction) {
              const { total, tableData } = props.handlerFunction(res);
              _tableData = tableData;
              _total = total;
            } else {
              _tableData = res.data;
            }
            data.tableData = _tableData;
            data.pagination.total = _total;
          })
          .catch(() => {
            data.tableData = [];
          })
          .finally(() => {
            data.loading = false;
          });
      }
    };
    const popupChange = (bool) => {
      if (bool) {
        if (props.reqUntilShow) {
          clearData();
        }
        getData();
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
.popover-table-small-txt {
  cursor: pointer;
}
.title-suffix {
  font-weight: 400;
}
.arrow-icon {
  vertical-align: middle;
}
</style>
