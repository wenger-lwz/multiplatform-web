<template>
  <div>
    <keep-alive>
      <order-list></order-list>
    </keep-alive>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import orderList from "./components/orderList.vue";
export default defineComponent({
  name: "",
  components: {
    orderList,
  },
});
</script>

<style></style>
