<template>
  <div class="session-list-item">
    <div class="top">
      <div class="title">Hannah White</div>
      <div class="transfer">客服1转交</div>
      <div class="time">11:36：00</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
};
</script>

<style scoped lang="scss">
.session-list-item {
  margin: 0 4px;
  padding: 8px 12px;
  &:hover {
    cursor: pointer;
    background: #e8f3ff;
    border-radius: 4px;
  }
  .top {
    display: flex;
  }
}
// .session-list-item + .session-list-item {
//   margin-top: 10px;
// }
</style>
