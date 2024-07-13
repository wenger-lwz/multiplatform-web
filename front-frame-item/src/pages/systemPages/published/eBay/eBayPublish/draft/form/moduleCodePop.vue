<template>
  <!-- 列表变体信息 -->
  <gj-popover
    position="rt"
    @popup-visible-change="popupChangeTable"
    trigger="click"
  >
    <span :class="textClass ? 'title-text' : ''"
      >{{ record?.complete || "--" }}
    </span>
    <SvgIcon
      svgClass="popclick"
      :class="textClass ? 'title-text' : ''"
      :width="12"
    ></SvgIcon>
    <template #content>
      <ul class="table-pop-box">
        <li v-for="item in record?.completeDetails" :key="item.moduleCode">
          <i :class="item.moduleEnable ? 'hot2' : 'hot3'"></i>
          <span v-if="item.moduleCode == 'base_info'">基础信息</span>
          <span v-if="item.moduleCode == 'product_info'">产品信息</span>
          <span v-if="item.moduleCode == 'product_attr'">产品属性</span>
          <span v-if="item.moduleCode == 'compatible'">配件兼容性</span>
          <span v-if="item.moduleCode == 'picture_video'">图片视频</span>
          <span v-if="item.moduleCode == 'description'">产品描述</span>
          <span v-if="item.moduleCode == 'sell_info'">销售信息</span>
          <span v-if="item.moduleCode == 'location'">物品所在地</span>
          <span v-if="item.moduleCode == 'shipping'">物流政策</span>
          <span v-if="item.moduleCode == 'return_policy'">退货政策</span>
          <span v-if="item.moduleCode == 'payment'">付款信息</span>
          <span v-if="item.moduleCode == 'buyer_requirement'">买家要求</span>
        </li>
      </ul>
    </template>
  </gj-popover>
</template>

<script>
import { defineComponent, reactive, toRefs } from "vue";
import SvgIcon from "@/components/SvgIcon";
export default defineComponent({
  components: {
    SvgIcon,
  },
  props: {
    record: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  setup() {
    const data = reactive({
      textClass: false,
    });
    const popupChangeTable = (val) => {
      if (val) {
        data.textClass = true;
      } else {
        data.textClass = false;
      }
    };

    return {
      ...toRefs(data),
      popupChangeTable,
    };
  },
});
</script>
<style lang="scss" scoped>
.hot1,
.hot2,
.hot3 {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  display: inline-block;
  position: relative;
  top: -3px;
  right: 5px;
}
.hot1 {
  background: #0045f0;
}
.hot2 {
  background: #2da641;
}
.hot3 {
  background: #ff5c5c;
}
.table-pop-box {
  width: 180px;
  li {
    display: inline-block;
    width: 50%;
    height: 30px;
    line-height: 30px;
    text-align: center;
  }
}

.title-text {
  color: rgb(0, 69, 240);
}
</style>
