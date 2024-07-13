<template>
  <CommonLog
    :platformCode="platformCode"
    :columnsLsit="columns"
    :requestApi="requestApi"
  >
    <template #loaddingPageStyle>
      <publishlLogDetail
        :isVisible="visible"
        @setVisible="getVisible"
      ></publishlLogDetail>
    </template>
  </CommonLog>
</template>

<script>
import { defineComponent, reactive, toRefs, h } from "vue";
import CommonLog from "./components/CommonLog.vue";
import { onlineLog } from "@/api/public";
import publishlLogDetail from "./components/publishlLogDetail.vue";

export default defineComponent({
  name: "",
  components: {
    CommonLog,
    publishlLogDetail,
  },
  setup() {
    const data = reactive({
      platformCode: "LAZADA",
      visible: false,
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
          title: "更新人",
          dataIndex: "publisherName",
        },
        {
          title: "更新时间",
          dataIndex: "createdTime",
        },
        {
          title: "结果",
          dataIndex: "publishResult",
          render: (record) => {
            let text = "";
            let color = "";
            if (record.record.publishResult === 1) {
              text = <span>更新成功</span>;
              color = "color:green";
            } else if (record.record.publishResult === 2) {
              const failedReason = record.record.failedReason;
              text = (
                <gj-popover position="left" content={failedReason}>
                  <span>更新失败</span>
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
        {
          title: "操作",
          dataIndex: "Action",
          fixed: "right",
          width: 60,
          render: (record) =>
            h("span", null, [
              h(
                "span",
                {
                  onClick: () => {
                    lookDetailPage(record);
                  },
                },
                <gj-button type="text">详情</gj-button>
              ),
            ]),
        },
      ],
      requestApi: onlineLog,
    });
    // 详情页
    const lookDetailPage = (e) => {
      console.log("详情页数据", e);
      data.visible = true;
    };
    // 弹框显示
    const getVisible = (val) => {
      data.visible = val;
    };
    return {
      ...toRefs(data),
      lookDetailPage,
      getVisible,
    };
  },
});
</script>

<style scoped lang="scss"></style>
