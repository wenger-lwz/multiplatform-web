<template>
  <gj-popover
    class="popover-table-small"
    trigger="click"
    position="br"
    :render-to-body="false"
    @popup-visible-change="popupChange"
  >
    <gj-button type="textPlain" shape="round" size="small"
      >{{ title }}{{ failNum }}/{{ tableData.length }}</gj-button
    >
    <template #title>
      <span class="queue-title">{{ title }}</span>
      <span class="queue-remark"
        >(上传中{{ pendingNum }} 失败{{ failNum }})</span
      >
    </template>
    <template #content>
      <div class="popover-table-content">
        <gj-table
          :rowKey="'productId'"
          :row-height="32"
          :columns="columns"
          :dataSource="tableData"
          :loading="loading"
          :pagination="false"
          :scroll="scroll"
        >
          <template #bodyCell="{ record, column }">
            <template v-if="column.dataIndex === 'title'">
              <gb-text>{{ record.title }}</gb-text>
            </template>
            <template v-if="column.dataIndex === 'sku'">
              <gb-text>{{ record.sku }}</gb-text>
            </template>
            <template v-if="column.dataIndex === 'status'">
              <!-- 进行中 -->
              <div v-if="record.status === 1">
                <gj-spin :size="12" />
              </div>
              <!-- 成功 -->
              <div v-if="record.status === 2">
                <svg-icon svgClass="successIcon" :width="12" />
              </div>
              <!-- 失败 -->
              <div v-if="record.status === 3">
                <svg-icon svgClass="warningIcon" :width="12" />
              </div>
            </template>
          </template>
        </gj-table>
      </div>
    </template>
  </gj-popover>
</template>
<script>
import { defineComponent, reactive, toRefs, computed } from "vue";
import { getQueueInfo } from "@/api/public";
import SvgIcon from "@/components/SvgIcon";

export default defineComponent({
  name: "QueuePopover",
  props: {
    position: {
      type: String,
      default: () => {
        return "br";
      },
    },
    platformCode: {
      type: String,
      default: "",
    },
    businessType: {
      type: Number,
      default: 1,
    },
    title: {
      type: String,
      default: "刊登队列",
    },
  },
  components: {
    SvgIcon,
  },
  setup(props) {
    const data = reactive({
      columns: [
        {
          title: "标题",
          dataIndex: "title",
          width: 220,
        },
        {
          title: "SKU",
          dataIndex: "sku",
          width: 170,
        },
        {
          title: "操作时间",
          dataIndex: "createdTime",
          width: 150,
        },
        {
          title: " ",
          dataIndex: "status",
          width: 50,
        },
      ],
      tableData: [],
      loading: false,
      title: props.title,
      scroll: {
        x: 0,
        y: 514,
      },
      isHover: false,
    });

    const popupChange = (bool) => {
      if (bool) {
        data.loading = true;
        data.isHover = true;
        getQueueInfo({
          platformCode: props.platformCode,
          businessType: props.businessType,
        })
          .then((res) => {
            data.tableData = res.data;
          })
          .finally(() => {
            data.loading = false;
          });
      } else {
        data.isHover = false;
      }
    };

    const failNum = computed(() => {
      return data.tableData.filter((item) => item.status == 3).length;
    });

    const pendingNum = computed(() => {
      return data.tableData.filter((item) => item.status == 1).length;
    });

    getQueueInfo({
      platformCode: props.platformCode,
      businessType: props.businessType,
    })
      .then((res) => {
        data.tableData = res.data;
      })
      .finally(() => {
        data.loading = false;
      });

    return {
      popupChange,
      ...toRefs(data),
      failNum,
      pendingNum,
    };
  },
});
</script>
<style scoped lang="scss">
.popover-table-content {
  width: 600px;
}
.queue-remark {
  font-weight: 400;
}
</style>
