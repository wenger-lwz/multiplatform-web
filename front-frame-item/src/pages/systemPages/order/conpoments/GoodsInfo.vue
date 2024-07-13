<template>
  <div class="goods-info">
    <gj-table
      :data-source="goodsData"
      :columns="columns"
      :pagination="false"
      rowKey="rowKeyId"
      class="table-wrap"
    >
      <template #bodyCell="{ column, record }">
        <!-- 图片 -->
        <template v-if="column.dataIndex === 'productMainImageUrl'">
          <gb-image
            :src="record?.productMainImageUrl"
            :popover-src="record?.productMainImageUrl"
            :size="36"
          ></gb-image>
        </template>
        <!-- 商品名、msku、产品id -->
        <template v-if="column.dataIndex === 'productName'">
          <div>
            <gb-text
              class="shop-theme_title"
              @click="openHelp(record?.listingUrl)"
              >{{ record.productName || "-" }}</gb-text
            >
            <div class="shop-theme_content">
              <span class="shop-theme_content_left" v-if="record.productId">
                <columnCopy
                  :textValue="record.productId"
                  :openUrl="record?.listingUrl"
                />
              </span>
              <span class="shop-theme_content_rigth" v-if="record.msku">
                <columnCopy :isAnchor="false" :textValue="record.msku" />
              </span>
            </div>
          </div>
        </template>
        <!-- 产品信息/sku -->
        <template v-if="column.dataIndex === 'skuName'">
          <div v-if="record.skuName || record.sku">
            <gb-text> {{ record.skuName }}{{ record.sku }} </gb-text>
          </div>
          <span v-else>-</span>
        </template>
        <!-- 变体 -->
        <template v-if="column.dataIndex === 'variationAttrValue'">
          <div
            v-if="
              record?.productVariations && record?.productVariations?.length
            "
          >
            <gb-text>
              {{ getProductVariations(record) }}
            </gb-text>
          </div>
          <span v-else>-</span>
        </template>
        <!-- 商品单价 -->
        <template v-if="column.dataIndex === 'productUnitPrice'">
          <div v-show="record?.productUnitPrice">
            <span>{{ record?.currency }}&nbsp;</span>
            <span>{{ formatAmt(record?.productUnitPrice) }}</span>
          </div>
          <span v-show="!record?.productUnitPrice">-</span>
        </template>
        <!-- 物品所在地 -->
        <template v-if="column.dataIndex === 'goodsLocation'">
          <gb-text>
            {{ record.goodsLocation || "-" }}
          </gb-text>
        </template>
        <!--买家选中物流 -->
        <template v-if="column.dataIndex === 'buyerChooseLogistics'">
          <span>{{ record?.buyerChooseLogistics || "-" }}</span>
        </template>
        <!-- 标发数量 -->
        <!-- <template v-if="column.dataIndex === 'markShippedNumber'">
          <approverTable
            v-if="record.lineMarkShipments?.length"
            :name="record.markShippedNumber"
            :tableData="record.lineMarkShipments"
            :columns="markShippedColumns"
          ></approverTable>
        </template> -->
        <!--  包裹装入数-->
        <!-- <template v-if="column.dataIndex === 'packageLoadedNumber'">
          <approverTable
            v-if="record.loadedPackages?.length"
            :name="record.packageLoadedNumber"
            :tableData="record.loadedPackages"
            :columns="packageLoadedColumns"
          ></approverTable>
        </template> -->
        <!-- 发货状态lineDeliveryStatusName -->
        <!-- <template v-if="column.dataIndex === 'lineDeliveryStatusName'">
          <gj-badge
            v-show="record?.lineDeliveryStatusName === '已发货'"
            status="success"
            :text="record?.lineDeliveryStatusName"
          />
          <gj-badge
            v-show="record?.lineDeliveryStatusName === '未发货'"
            status="normal"
            :text="record?.lineDeliveryStatusName"
          />
          <span v-show="!record?.lineDeliveryStatusName">-</span>
        </template> -->
        <!-- 跟踪号 -->
        <!-- <template v-if="column.dataIndex === 'logisticsTrackingNumbers'">
          <span>
            <gj-tooltip
              v-if="
                record.logisticsTrackingNumbers &&
                record.logisticsTrackingNumbers.length
              "
            >
              <template #content>
                <div
                  v-for="(item, indexs) in record.logisticsTrackingNumbers"
                  :key="item + indexs"
                >
                  <span>{{ item }}</span>
                </div>
              </template>
              <span
                v-for="(item, indexs) in record.logisticsTrackingNumbers"
                :key="item + indexs"
              >
                <span>{{ item }}</span>
              </span>
            </gj-tooltip>
            <span
              v-show="
                !(
                  record.logisticsTrackingNumbers &&
                  record.logisticsTrackingNumbers.length
                )
              "
              >-</span
            >
          </span>
        </template> -->
      </template>
    </gj-table>
  </div>
</template>

<script>
import { defineComponent, reactive, toRefs, watchEffect } from "vue";
// import approverTable from './approverTable.vue'
import columnCopy from "@/components/columnCopy.vue";
import { formatAmt } from "@/utils/format";
import { openHelp } from "@pagesSystem/order/utils/orderUtil";
import { createUuid } from "@/utils/common";
export default defineComponent({
  components: {
    // approverTable,
    columnCopy,
  },
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
    // const { proxy } = getCurrentInstance()
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
          dataIndex: "productMainImageUrl",
          width: 60,
          fixed: "left",
        },
        {
          title: "商品名/商品ID/MSKU",
          dataIndex: "productName",
          width: 200,
          fixed: "left",
        },
        {
          title: "产品信息",
          dataIndex: "skuName",
          width: 140,
          fixed: "left",
        },
        {
          title: "变体信息",
          dataIndex: "variationAttrValue",
          width: 160,
          ...overflowEllipsis,
        },
        {
          title: "商品单价",
          dataIndex: "productUnitPrice",
          width: 120,
        },
        {
          title: "物品所在地",
          dataIndex: "goodsLocation",
          width: 140,
        },
        {
          title: "买家选择物流",
          dataIndex: "buyerChooseLogistics",
          width: 140,
        },
        {
          title: "购买数量",
          dataIndex: "buyQuantity",
          width: 100,
        },
        // {
        //   title: "标发数量",
        //   dataIndex: "markShippedNumber",
        //   width: 100,
        // },
        // {
        //   title: "包裹装入数",
        //   dataIndex: "packageLoadedNumber",
        //   width: 100,
        // },
        // {
        //   title: "发货状态",
        //   dataIndex: "lineDeliveryStatusName",
        //   width: 100,
        // },
        // {
        //   title: "标发跟踪号",
        //   dataIndex: "logisticsTrackingNumbers",
        //   width: 160,
        //   ...overflowEllipsis,
        // },
      ],
      markShippedColumns: [
        {
          title: "标发跟踪号",
          dataIndex: "logisticsOrderNo",
          width: 200,
        },
        {
          title: "标发数量",
          dataIndex: "quantity",
          width: 200,
        },
      ],
      packageLoadedColumns: [
        {
          title: "包裹号",
          dataIndex: "packageNumber",
          width: 200,
        },
        {
          title: "跟踪号",
          dataIndex: "trackingNumber",
          width: 200,
        },
        {
          title: "包裹装入号",
          dataIndex: "number",
          width: 200,
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
      if (props?.allDateDetail?.orderLines?.length) {
        props.allDateDetail.orderLines.forEach((item) => {
          item.rowKeyId = createUuid();
        });
        data.goodsData = props.allDateDetail.orderLines;
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
@import "@pagesSystem/order/css/orderPublic.scss";
.goods-info {
  margin-bottom: 12px;
}
:deep(.surely-table) {
  border: 1px solid #e6e6ed;
  box-sizing: border-box;
  border-radius: 4px;
}
</style>
