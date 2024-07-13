<template>
  <div class="phone-pool-content">
    <div class="phone-type">
      <span class="item dark">未占用</span>
      <span class="item light">预占用</span>
    </div>
    <div class="phone-brand">
      <div class="brand" v-for="(item, index) in phoneData" :key="index">
        <p class="title">
          {{ item.platformCode }}<span>（剩余量{{ item.remainCount }}）</span>
        </p>
        <div class="phone-list">
          <span
            class="item"
            v-for="it in item.codePoolList"
            :key="it.value"
            :class="it.status === 2 ? 'light' : 'dark'"
            >{{ it.code }}</span
          >
        </div>
      </div>
      <gj-empty v-show="phoneData.length === 0" />
    </div>
  </div>
</template>
<script>
import { defineComponent } from "vue";
export default defineComponent({
  name: "poolComponent",
  components: {},
  props: {
    phoneData: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
});
</script>
<style scoped lang="scss">
.phone-pool-content {
  height: calc(100vh - 148px);
  overflow-y: scroll;
  .phone-type {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    align-items: center;
    margin-bottom: 16px;
    padding-left: 12px;
  }
  .item {
    display: flex;
    padding: 8px 12px;
    justify-content: center;
    font-size: 12px;
    border-radius: 4px;
  }
  .light {
    background: #f2f6fe;
    color: #0045f0;
  }
  .dark {
    background: rgba(0, 4, 48, 0.05);
    color: rgba(0, 4, 48, 0.8);
  }
  .phone-brand {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    padding: 0 12px;
    .brand {
      flex: 49%;
      max-width: 49%;
      height: 224px;
      padding: 8px;
      background: #ffffff;
      border: 1px solid #e6e6ed;
      box-sizing: border-box;
      border-radius: 8px;
      .title {
        font-size: 12px;
        color: #000;
        font-weight: 700;
        margin-bottom: 8px;
        span {
          color: #808197;
          font-weight: 400;
        }
      }
    }
  }
  .phone-list {
    flex-wrap: wrap;
    gap: 6px 8px;
    flex-direction: row;
    display: flex;
    overflow-y: auto;
  }
}
</style>
