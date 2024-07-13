<template>
  <order-list></order-list>
</template>

<script>
import { defineComponent } from "vue";
import orderList from "./components/orderList.vue";
export default defineComponent({
  name: "ShopeeAllOrder",
  components: {
    orderList,
  },
});
</script>

<style></style>
