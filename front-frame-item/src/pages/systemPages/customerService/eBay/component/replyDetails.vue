<template>
  <div v-if="list.length" class="replyDetails-list">
    <NewListItem
      v-for="item of list"
      :key="item.id"
      :item="item"
      :sessionType="2"
      :isReplyDetails="true"
    ></NewListItem>
  </div>
</template>

<script>
import { reactive, toRefs } from "vue";
import { getQueryMessageList } from "@/api/customerService/eBay-zh";
import NewListItem from "./newListItem.vue";

export default {
  components: {
    NewListItem,
  },
  props: {
    replyDetailsId: {
      type: String,
      default: () => "",
    },
    selectedValue: {
      type: Object,
      default: () => {},
    },
  },
  setup(props) {
    const data = reactive({
      list: [],
    });

    const getList = () => {
      console.log(props.selectedValue);
      getQueryMessageList({
        parentMessageId: props.replyDetailsId,
        erpShopId: props.selectedValue.erpShopId,
        // sessionId: props.selectedValue.sessionId,
      }).then((res) => {
        if (res.data?.ebayMessageList) {
          data.list = res.data.ebayMessageList;
        }
      });
    };
    getList();

    return {
      ...toRefs(data),
      getList,
    };
  },
};
</script>

<style scoped lang="scss">
.replyDetails-list {
  box-sizing: border-box;
  height: 100%;
  padding: 6px 16px;
  overflow-y: auto;
}
</style>
