<template>
  <div class="detail-descriptions-info">
    <ul class="content-wrap">
      <li class="w-30">
        <span>申请编号</span>
        <gb-text>{{ allDateDetail?.returnPlatformOrderId || "-" }}</gb-text>
      </li>
      <li class="w-70">
        <span>退款金额</span>
        <gb-text>{{ allDateDetail?.refundAmount || "-" }}</gb-text>
      </li>
    </ul>
    <ul class="content-wrap">
      <li class="w-30">
        <span>状态</span>
        <gb-text>{{ allDateDetail?.returnStatusName || "-" }}</gb-text>
      </li>
      <li class="w-70">
        <span>店铺名称</span>
        <gb-text>{{ allDateDetail?.erpShopName || "-" }}</gb-text>
      </li>
    </ul>
    <ul class="content-wrap">
      <li class="w-30">
        <span>处理期限</span>
        <gb-text>{{ allDateDetail?.dueDate || "-" }}</gb-text>
      </li>
      <li class="w-70">
        <span>创建时间</span>
        <gb-text>{{ allDateDetail?.returnCreateTime || "-" }}</gb-text>
      </li>
    </ul>
    <ul class="content-wrap">
      <li class="w-30">
        <span>更新时间</span>
        <gb-text>{{ allDateDetail?.returnUpdateTime || "-" }}</gb-text>
      </li>
      <li class="w-70">
        <span>备注</span>
        <gb-popover-edit
          title="备注"
          :value="remarkValue"
          placeholder="请输入"
          @ok="editRemark($event)"
        >
          <gb-text>{{ remarkValue || "-" }}</gb-text>
        </gb-popover-edit>
      </li>
    </ul>
    <ul class="content-wrap">
      <li class="w-100">
        <span>申请原因</span>
        <gb-text>{{ allDateDetail?.reason || "-" }}</gb-text>
      </li>
    </ul>
    <ul class="content-wrap" v-if="allDateDetail?.proofImages?.length">
      <li class="w-100">
        <span></span>
        <gj-space size="small" class="imgsSpace">
          <div v-for="(item, index) in allDateDetail?.proofImages" :key="index">
            <gb-image :src="item" :popoverSrc="item" :size="36" />
          </div>
        </gj-space>
      </li>
    </ul>
  </div>
</template>

<script>
import { defineComponent, reactive, toRefs } from "vue";
import { formatDateTime } from "@/utils/common";
import { getShopeeReturnShopRemark } from "@/api/customerService/shopee.js";
import { GjMessage } from "@gj/atom";
export default defineComponent({
  props: {
    allDateDetail: {
      type: Object,
      default: () => {
        return null;
      },
    },
  },
  setup(props) {
    const data = reactive({
      remarkValue: props.allDateDetail?.remark || "",
    });
    const editRemark = async (val) => {
      data.remarkValue = val;
      const params = {
        returnPlatformOrderId: props.allDateDetail?.returnPlatformOrderId,
        remark: val,
      };
      await getShopeeReturnShopRemark(params);
      GjMessage.success("操作成功");
    };
    return {
      ...toRefs(data),
      formatDateTime,
      editRemark,
    };
  },
});
</script>

<style lang="scss" scoped>
@import "./index.scss";
.imgsSpace {
  height: 36px;
}
</style>
