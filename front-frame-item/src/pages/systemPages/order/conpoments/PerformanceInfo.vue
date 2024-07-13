<template>
  <div class="send-info">
    <div class="info-content" v-for="(item, index) in detailList" :key="index">
      <span class="info-title">FO单号：{{ item.fo }}</span>
      <gj-steps
        label-placement="vertical"
        :current="item.active"
        class="info-steps"
        :small="true"
      >
        <gj-step
          v-for="(subItem, indexs) in item.stepOption"
          :key="indexs"
          :title="subItem.title"
          :description="subItem.time"
        >
        </gj-step>
      </gj-steps>
      <gj-table
        :columns="item.columns"
        :data="item.tableData"
        :pagination="false"
      >
      </gj-table>
    </div>
  </div>
</template>

<script>
import { defineComponent, reactive, toRefs } from "vue";
export default defineComponent({
  components: {},
  setup() {
    const data = reactive({
      detailList: [
        {
          fo: "FXPK202113021220",
          active: 2,
          stepOption: [
            {
              title: "待处理",
              time: "2022-01-02 12:12:12",
            },
            {
              title: "待审核",
              time: "2022-01-02 12:12:12",
            },
            {
              title: "已审核",
              time: "2022-01-02 12:12:12",
            },
            {
              title: "通知配货",
              time: "未完成",
            },
            {
              title: "发货中",
              time: "未完成",
            },
            {
              title: "已发货",
              time: "未完成",
            },
            {
              title: "已出运",
              time: "未完成",
            },
            {
              title: "已取消",
              time: "未完成",
            },
          ],
          columns: [
            { title: "包裹号", dataIndex: "num" },
            { title: "SKU*数量", dataIndex: "number" },
            { title: "预估/称重重量(g)", dataIndex: "weight" },
            { title: "发货仓库", dataIndex: "send" },
            { title: "操作费（CNY）", dataIndex: "money" },
            { title: "邮寄方式", dataIndex: "way" },
            { title: "跟踪号", dataIndex: "number2" },
            { title: "预估运费（CNY）", dataIndex: "money1" },
            { title: "实际运费（CNY）", dataIndex: "money2" },
            { title: "包裹状态", dataIndex: "type" },
          ],
          tableData: [
            {
              num: "123213213",
              number: "123",
              weight: "810",
              send: "海外仓",
              money: "10",
              way: "请求评论",
              number2: "1232",
              result: "成功",
              money1: "10",
              money2: "10",
              type: "发送中",
            },
          ],
        },
        {
          fo: "FXPK202113021220",
          active: 2,
          stepOption: [
            {
              title: "待处理",
              time: "2022-01-02 12:12:12",
            },
            {
              title: "待审核",
              time: "2022-01-02 12:12:12",
            },
            {
              title: "已审核",
              time: "2022-01-02 12:12:12",
            },
            {
              title: "通知配货",
              time: "未完成",
            },
            {
              title: "发货中",
              time: "未完成",
            },
            {
              title: "已发货",
              time: "未完成",
            },
            {
              title: "已出运",
              time: "未完成",
            },
            {
              title: "已取消",
              time: "未完成",
            },
          ],
          columns: [
            { title: "包裹号", dataIndex: "num" },
            { title: "SKU*数量", dataIndex: "number" },
            { title: "预估/称重重量(g)", dataIndex: "weight" },
            { title: "发货仓库", dataIndex: "send" },
            { title: "操作费（CNY）", dataIndex: "money" },
            { title: "邮寄方式", dataIndex: "way" },
            { title: "跟踪号", dataIndex: "way" },
            { title: "预估运费（CNY）", dataIndex: "name" },
            { title: "实际运费（CNY）", dataIndex: "name" },
            { title: "包裹状态", dataIndex: "type" },
          ],
          tableData: [
            {
              num: "123213213",
              number: "123",
              weight: "810",
              send: "海外仓",
              money: "10",
              way: "请求评论",
              number2: "1232",
              result: "成功",
              money1: "10",
              money2: "10",
              type: "发送中",
            },
          ],
        },
      ],
    });
    return {
      ...toRefs(data),
    };
  },
});
</script>

<style lang="scss" scoped>
.send-info {
  padding: 0 20px;
  .info-content {
    margin-bottom: 32px;
    .info-title {
      font-size: 14px;
      font-weight: 700;
      color: rgba(0, 4, 48, 0.8);
    }
    .info-steps {
      padding: 8px 0;
      margin: 16px 0;
      background: #fafafb;
      border-radius: 8px;
    }
  }
  .info-content:last-child {
    margin-bottom: 0px;
  }
}
</style>
