<template>
  <!-- 图片选择 -->
  <div>
    <el-form-item :label-width="data.labelWidth" :size="data.size">
      <template #label>
        <p class="title-label">
          <span v-show="data.required">*</span>{{ data.name }}
        </p>
        <p class="second-title-label">{{ data.placeholder }}</p>
      </template>
      <div v-for="(item, index) in data.option" :key="index">
        <div>
          <img :src="item.url || '#'" alt="" />
          <el-checkbox :checked="item.checked" :label="item.label" />
        </div>
      </div>
    </el-form-item>
  </div>
</template>

<script>
export default {
  name: "imageSelect",
  props: {
    data: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
};
</script>

<style scoped lang="scss"></style>
