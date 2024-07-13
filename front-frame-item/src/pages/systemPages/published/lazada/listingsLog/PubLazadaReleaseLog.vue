<template>
  <CommonLog
    :platformCode="platformCode"
    :columnsLsit="columns"
    :requestApi="requestApi"
  >
  </CommonLog>
</template>

<script>
import { defineComponent, reactive, toRefs, h } from "vue";
import CommonLog from "./components/CommonLog.vue";
import { publishLog } from "@/api/public";
export default defineComponent({
  name: "",
  components: {
    CommonLog,
  },
  setup() {
    const data = reactive({
      platformCode: "LAZADA",
      columns: [
        {
          title: "标题",
          dataIndex: "title",
        },
        {
          title: "SPU/SKU",
          dataIndex: "sku",
        },
        {
          title: "店铺",
          dataIndex: "shopName",
        },
        {
          title: "站点",
          dataIndex: "stationName",
        },

        {
          title: "店铺sku",
          dataIndex: "shopSku",
        },

        {
          title: "负责人",
          dataIndex: "responsibleName",
        },
        {
          title: "发布人",
          dataIndex: "publisherName",
        },
        {
          title: "发布时间",
          dataIndex: "createdTime",
        },
        {
          title: "发布方式",
          dataIndex: "publishWay",
        },
        {
          title: "结果",
          dataIndex: "publishResult",
          fixed: "right",
          width: 200,
          render: (record) => {
            let text = "";
            let color = "";
            if (record.record.publishResult === 1) {
              text = <span>发布成功</span>;
              color = "color:green";
            } else if (record.record.publishResult === 2) {
              const failedReason = record.record.failedReason;
              text = (
                <gj-popover position="left" content={failedReason}>
                  <span>发布失败</span>
                </gj-popover>
              );
              color = "color:red";
            }
            return h(
              "span",
              {
                calss: ["publishResultStatus"],
                style: color,
              },
              text
            );
          },
        },
      ],
      requestApi: publishLog,
    });
    return {
      ...toRefs(data),
    };
  },
});
</script>

<style scoped lang="scss"></style>
