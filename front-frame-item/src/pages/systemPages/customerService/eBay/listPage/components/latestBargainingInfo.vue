<template>
  <div class="detail-descriptions-info">
    <ul class="content-wrap">
      <!-- <li class="w-30">
        <span>退货物流</span>
        <gb-text>{{ '-' }}</gb-text>
      </li> -->
      <li class="w-30">
        <span>议价类型</span>
        <gb-text>{{ allDateDetail?.bestOffer?.discussType || "-" }}</gb-text>
      </li>
      <li class="w-30">
        <span>议价数量</span>
        <gb-text>{{ allDateDetail?.bestOffer?.quantity || "-" }}</gb-text>
      </li>
      <li class="w-40">
        <span>议价金额</span>
        <gb-text>{{ allDateDetail?.bestOffer?.price || "-" }}</gb-text>
      </li>
    </ul>
    <ul class="content-wrap">
      <li class="w-30">
        <span>议价状态</span>
        <gb-text>{{ allDateDetail?.bestOffer?.platformStatus || "-" }}</gb-text>
      </li>
      <li class="w-30">
        <span>剩余处理时间</span>
        <gb-text>{{
          allDateDetail?.bestOffer?.bestOfferValidTimeByHour || "-"
        }}</gb-text>
      </li>
      <li class="w-40">
        <span>创建时间</span>
        <gb-text>{{ allDateDetail?.bestOffer?.createdTime || "-" }}</gb-text>
      </li>
    </ul>
    <ul class="content-wrap">
      <li class="w-100">
        <span>买家留言</span>
        <gb-text>{{ allDateDetail?.bestOffer?.remarks || "-" }}</gb-text>
      </li>
    </ul>
    <!-- <div class="edit-price-content"> -->
    <div class="edit-price-content" v-if="isFlag">
      <gj-form
        ref="priceRef"
        :rules="rules"
        :model="createFrom"
        :auto-label-width="true"
      >
        <gj-form-item label="数量">
          <span>{{ createFrom.counterOfferQuantity }}</span>
        </gj-form-item>
        <gj-form-item
          label="您的还价"
          field="price"
          :validate-trigger="['blur', 'input', 'change']"
        >
          <gj-input-number
            class="input-price-content"
            v-model="createFrom.price"
            placeholder="请输入"
            :precision="2"
            :min="0"
          />
        </gj-form-item>
        <gj-form-item label="您的留言">
          <gj-textarea
            v-model="createFrom.selleerResponse"
            placeholder="请输入"
            :auto-size="true"
            show-word-limit
            :max-length="500"
          />
        </gj-form-item>
      </gj-form>
    </div>
  </div>
</template>

<script>
import {
  defineComponent,
  reactive,
  toRefs,
  getCurrentInstance,
  watchEffect,
} from "vue";
import { setForm } from "@/utils/fnBusiness";
import { reg } from "@/utils/reg.js";

export default defineComponent({
  props: {
    allDateDetail: {
      type: Object,
      default: () => {
        return null;
      },
    },
    isFlag: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
  },
  setup(props) {
    const { proxy } = getCurrentInstance();
    const data = reactive({
      createFrom: {
        selleerResponse: "",
        counterOfferQuantity: 0,
        price: 0,
      },
      rules: {
        price: [
          {
            validator: (value, callback) => {
              const flag = !reg.money.test(value);
              if (
                value === 0 ||
                (value !== null &&
                  value === "undefined" &&
                  value !== "" &&
                  flag)
              ) {
                callback("请输入价格!");
              } else {
                callback();
              }
            },
          },
        ],
      },
    });
    const submitForm = () => {
      return setForm(proxy, "createFrom", data.createFrom, "priceRef");
    };
    watchEffect(() => {
      if (!props.isFlag) {
        data.createFrom.price = 0;
        data.createFrom.selleerResponse = "";
      }
      const { bestOffer } = props.allDateDetail;
      data.createFrom = {
        counterOfferQuantity: bestOffer?.quantity || 0,
        selleerResponse: "",
        price: 0,
      };
    });
    return {
      ...toRefs(data),
      submitForm,
    };
  },
});
</script>

<style lang="scss" scoped>
@import "./index.scss";
.edit-price-content {
  border: 1px solid #e6e6ed;
  border-radius: 4px;
  padding: 24px;
  box-sizing: border-box;
  .input-price-content {
    width: 180px;
  }
}
</style>
