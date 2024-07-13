<template>
  <GjPopover trigger="click" position="bottom">
    <GjButton class="more" type="text">...</GjButton>
    <template #content>
      <li>
        <GjButton
          v-permissions="['Shopee/pubShopeeGoodsInfo/copy']"
          class="block-btn"
          type="text"
          @click="onEditDetails(record)"
        >
          复制
        </GjButton>
      </li>
      <li>
        <GjButton
          v-permissions="['Shopee/pubShopeeGoodsInfo/draft']"
          type="text"
          @click="onCreateDraft(record.id)"
        >
          草稿
        </GjButton>
      </li>
      <GjPopconfirm
        okText="确定"
        cancelText="取消"
        class="remark-pop"
        @ok="onDeleteProduct(record.id)"
      >
        <span
          v-permissions="['Shopee/pubShopeeGoodsInfo/delete']"
          class="delete-btn"
          >删除</span
        >

        <template #content>
          <p>此操作不可逆，是否删除？</p>
        </template>
      </GjPopconfirm>
    </template>
  </GjPopover>
</template>

<script>
import { defineComponent } from "vue";
/* eslint-disable */
import { GjButton, GjDropdown, GjPopconfirm, GjPopover } from "@gj/atom";
/* eslint-enable */

export default defineComponent({
  name: "",
  props: {
    record: {
      type: Object,
      default: () => {
        return null;
      },
    },
    createDrafts: {
      type: Function,
    },
    deleteProduct: {
      type: Function,
    },
    copyProduct: {
      type: Function,
    },
  },
  setup(props) {
    const onCreateDraft = (item) => {
      props.createDrafts(item);
    };

    const onEditDetails = (item) => {
      props.copyProduct(item);
    };

    const onDeleteProduct = (item) => {
      props.deleteProduct(item);
    };

    return {
      onCreateDraft,
      onEditDetails,
      onDeleteProduct,
    };
  },
});
</script>

<style scoped lang="scss">
.more {
  .dot {
    width: 2px;
    height: 2px;
    background: #ffffff;
    border: 1px solid #1f6eef;
    margin-right: 3px;
    border-radius: 4px;
  }
}
.delete-btn {
  display: block;
  height: 32px;
  line-height: 32px;
  padding: 0 12px;
  cursor: pointer;
  color: #0045f0;
  text-align: center;
}
.delete-btn:hover {
  background-color: rgba(0, 69, 240, 0.05);
}
.delete-btn:active {
  color: #0037be;
  font-weight: 600;
  background-color: rgba(0, 69, 240, 0.1);
}

.block-btn {
  display: block;
  width: 100%;
  text-align: center;
}
</style>
