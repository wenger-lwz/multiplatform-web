<template>
  <div>
    <div class="bargaining-title">商品信息</div>
    <div class="bargaining-product">
      <gj-image width="62" :src="item.itemImgUrl" />
      <div class="bargaining-product-name">
        <p>产品名称</p>
        <p>产品ID</p>
        <p>SKU</p>
        <p>MSKU</p>
        <p>产品金额</p>
      </div>
      <div class="bargaining-product-vlaue">
        <gb-text class="product-vlaue-item">{{
          item.itemTitle || "-"
        }}</gb-text>
        <gb-text class="product-vlaue-item">{{ item.itemId || "-" }}</gb-text>
        <ColumnCopy
          class="product-vlaue-item"
          :isAnchor="false"
          :textValue="item.itemSku || '-'"
        ></ColumnCopy>
        <ColumnCopy
          class="product-vlaue-item"
          :isAnchor="false"
          :textValue="item.itemMsku || '-'"
        ></ColumnCopy>
        <gb-text class="product-vlaue-item"
          >$ {{ item.itemPrice || "-" }}</gb-text
        >
      </div>
    </div>
    <div class="bargaining-title">议价信息</div>
    <div class="bargaining-info">
      <div class="bargaining-info-name">
        <p>议价类型</p>
        <p>议价金额</p>
        <p>议价数量</p>
        <p>买家留言</p>
        <p>议价状态</p>
        <p>剩余处理时间</p>
        <p>创建时间</p>
      </div>
      <div class="bargaining-info-vlaue">
        <gb-text class="bargaining-vlaue-item">{{
          item.platformDiscussType || "-"
        }}</gb-text>
        <gb-text class="bargaining-vlaue-item">{{ item.price || "-" }}</gb-text>
        <gb-text class="bargaining-vlaue-item">{{
          item.quantity || "-"
        }}</gb-text>
        <gb-text class="bargaining-vlaue-item">{{
          item.remarks || "-"
        }}</gb-text>
        <gb-text
          :class="[
            'bargaining-vlaue-item',
            status[item.status]?.color || 'c-4',
          ]"
          >{{ status[item.status]?.name || "-" }}</gb-text
        >
        <gb-text class="bargaining-vlaue-item">{{
          item.bestOfferValidTimeByHour || "-"
        }}</gb-text>
        <gb-text class="bargaining-vlaue-item">{{
          item.createdTime || "-"
        }}</gb-text>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs } from "vue";
import ColumnCopy from "@/components/columnCopy.vue";

export default {
  components: {
    ColumnCopy,
  },
  props: {
    item: {
      type: Object,
      default: () => {},
    },
  },
  setup() {
    const data = reactive({
      status: {
        0: {
          color: "c-2",
          name: "待处理",
        },
        4: {
          color: "c-3",
          name: "接受",
        },
        5: {
          color: "c-5",
          name: "拒绝",
        },
        6: {
          color: "c-4",
          name: "过期",
        },
        3: {
          color: "c-4",
          name: "撤回议价",
        },
        1: {
          color: "c-4",
          name: "还价",
        },
        2: {
          color: "c-2",
          name: "等待买家付款",
        },
      },
    });

    return {
      ...toRefs(data),
    };
  },
};
</script>

<style scoped lang="scss">
.c-2 {
  color: #ff7d00;
}
.c-3 {
  color: #00b42a;
}
.c-4 {
  color: #1d2129;
}
.c-5 {
  color: #f53f3f;
}
.bargaining-title {
  margin-bottom: 8px;
  font-size: 12px;
  line-height: 18px;
  color: #1d2129;
}
.bargaining-product {
  display: flex;
  margin-bottom: 12px;
  font-size: 12px;
  line-height: 18px;
  .bargaining-product-name {
    min-width: 48px;
    color: #86909c;
    margin-left: 12px;
    margin-right: 8px;
    p + p {
      margin-top: 8px;
    }
  }
  .bargaining-product-vlaue {
    color: #1d2129;
    word-break: break-all;
    .gb-text {
      display: block;
    }
    .product-vlaue-item + .product-vlaue-item {
      margin-top: 8px;
    }
    .gb-text:first-child {
      color: #0045f0;
    }
  }
}
.bargaining-info {
  display: flex;
  font-size: 12px;
  line-height: 18px;
  .bargaining-info-name {
    min-width: 72px;
    color: #86909c;
    margin-left: 12px;
    margin-right: 8px;
    p + p {
      margin-top: 8px;
    }
  }
  .bargaining-info-vlaue {
    color: #1d2129;
    word-break: break-all;
    .gb-text {
      display: block;
    }
    .bargaining-vlaue-item + .bargaining-vlaue-item {
      margin-top: 8px;
    }
  }
}
</style>
