<template>
  <div class="detail-descriptions-info">
    <h4>订单信息</h4>
    <ul class="content-wrap">
      <li class="w-100">
        <span class="labelStyle">订单编号</span>
        <gj-button
          v-if="allDateDetail?.platformOrderId"
          class="tableInfopermissionsBtn"
          type="text"
          @click="lookOrderId"
        >
          <columnCopy
            :isAnchor="false"
            :textValue="allDateDetail?.platformOrderId"
          >
          </columnCopy>
        </gj-button>
      </li>
    </ul>
    <h4>买家信息</h4>
    <ul class="content-wrap" v-if="allDateDetail?.proofImages?.length">
      <li class="w-100">
        <div class="buyerInfo">
          <gj-avatar :size="50" shape="square">
            <img
              v-if="allDateDetail?.buyerPortrait"
              alt="avatar"
              :src="allDateDetail?.buyerPortrait"
            />
          </gj-avatar>
          <div class="buyerInfo_content">
            <gb-text>{{ allDateDetail?.buyerName || "-" }}</gb-text>
            <gb-text>{{ allDateDetail?.buyerEmail || "-" }}</gb-text>
          </div>
        </div>
      </li>
    </ul>
    <h4>买家收货信息</h4>
    <ul class="content-wrap">
      <li class="w-100" v-for="(item, index) in buyerReceiveInfo" :key="index">
        <span>{{ item?.name }}</span>
        <gb-text>{{
          allDateDetail?.buyerReceiveInfo?.[item.value] || "-"
        }}</gb-text>
      </li>
    </ul>
  </div>
</template>

<script>
import { defineComponent, reactive, toRefs } from "vue";
import columnCopy from "@/components/columnCopy.vue";

export default defineComponent({
  components: { columnCopy },
  emits: ["look-orderId-detail"],
  props: {
    allDateDetail: {
      type: Object,
      default: () => {
        return null;
      },
    },
  },
  setup(props, { emit }) {
    const data = reactive({
      buyerReceiveInfo: [
        {
          name: "买家名称",
          value: "name",
        },
        {
          name: "手机号",
          value: "phone",
        },
        {
          name: "国家",
          value: "region",
        },
        {
          name: "城市",
          value: "city",
        },
        {
          name: "区域",
          value: "district",
        },
        {
          name: "街道",
          value: "town",
        },
        {
          name: "地址",
          value: "address",
        },
        {
          name: "邮编",
          value: "zipcode",
        },
      ],
    });
    const lookOrderId = () => {
      emit("look-orderId-detail");
    };
    return {
      ...toRefs(data),
      lookOrderId,
    };
  },
});
</script>

<style lang="scss" scoped>
@import "./index.scss";
.buyerInfo {
  display: flex;
  gap: 11px;
  .buyerInfo_content {
    display: flex;
    flex-direction: column;
    row-gap: 9px;
  }
}
.detail-descriptions-info {
  row-gap: 8px;
  .content-wrap {
    display: flex;
    flex-direction: column;
    row-gap: 8px;
    li {
      span {
        width: 50px;
        text-align: left;
      }
      span.labelStyle {
        width: 70px;
      }
    }
  }
}

.tableInfopermissionsBtn.arco-btn-size-medium {
  height: max-content;
}
.tableInfopermissionsBtn {
  padding: 0px;
  width: 100%;
  .table-column-copy-content-1:hover .copy {
    top: 0;
  }
  :deep(.gb-text-ellipsis) {
    overflow: visible;
  }
}
:deep(.arco-modal-body) {
  overflow-x: hidden;
  overflow-y: hidden;
}
</style>
