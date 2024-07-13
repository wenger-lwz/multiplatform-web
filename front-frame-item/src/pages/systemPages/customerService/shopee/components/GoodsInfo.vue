<template>
  <div class="detail-descriptions-info">
    <gj-table
      :data-source="goodsData"
      :columns="columns"
      :pagination="false"
      rowKey="rowKeyId"
      class="table-wrap"
    >
      <template #bodyCell="{ column, record, text }">
        <!-- 图片 -->
        <template v-if="column.dataIndex === 'images'">
          <gj-space v-if="record?.images.length">
            <div v-for="(item, index) in record?.images" :key="index">
              <gb-image :src="item" :popover-src="item" :size="36"></gb-image>
            </div>
          </gj-space>
          <gb-image
            v-else
            :src="record?.images"
            :popover-src="record?.images"
            :size="36"
          ></gb-image>
        </template>

        <template v-else>
          <span>{{ text || "-" }}</span>
        </template>
      </template>
    </gj-table>
  </div>
</template>

<script>
import { defineComponent, reactive, toRefs, watchEffect } from "vue";
import { formatAmt } from "@/utils/format";
import { openHelp } from "@pagesSystem/order/utils/orderUtil";
import { createUuid } from "@/utils/common";
export default defineComponent({
  components: {},
  props: {
    allDateDetail: {
      type: Object,
      default: () => {
        return null;
      },
    },
  },
  setup(props) {
    const overflowEllipsis = {
      ellipsis: {
        showTitle: false,
      },
      showTooltip: true,
    };
    const data = reactive({
      formatAmt,
      goodsData: [],
      scroll: {
        x: 2000,
        y: 400,
      },
      columns: [
        {
          title: "图片",
          dataIndex: "images",
          width: 60,
          fixed: "left",
        },
        {
          title: "商品名称",
          dataIndex: "itemName",
          width: 200,
          fixed: "left",
        },
        {
          title: "单价",
          dataIndex: "itemPrice",
          width: 140,
          fixed: "left",
        },
        {
          title: "数量",
          dataIndex: "quantity",
          width: 160,
          ...overflowEllipsis,
        },
        {
          title: "金额",
          dataIndex: "itemTotalAmount",
          width: 120,
        },
      ],
    });

    const getProductVariations = (recode) => {
      let res = "";
      if (!(recode && recode?.productVariations?.length)) return;
      recode.productVariations.forEach((subItem) => {
        let name = "";
        if (subItem.variationAttrName) {
          name +=
            subItem.variationAttrName +
            "：" +
            subItem.variationAttrValue +
            "；";
        } else {
          name += subItem.variationAttrValue + "；";
        }
        res += name;
      });
      res = res.substring(0, res.length - 1);
      return res;
    };

    watchEffect(() => {
      if (props?.allDateDetail?.shopeeItemInfo?.length) {
        props.allDateDetail.shopeeItemInfo.forEach((item) => {
          item.rowKeyId = createUuid();
        });
        data.goodsData = props.allDateDetail?.shopeeItemInfo;
      }
    });

    return {
      ...toRefs(data),
      openHelp,
      createUuid,
      getProductVariations,
    };
  },
});
</script>
<style lang="scss" scoped>
@import "./index.scss";
:deep(.surely-table) {
  border: 1px solid #e6e6ed;
  box-sizing: border-box;
  border-radius: 4px;
}
</style>
