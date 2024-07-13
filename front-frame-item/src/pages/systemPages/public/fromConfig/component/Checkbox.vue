<template>
  <!-- 多项选择 -->
  <div>
    <el-form-item :label-width="data.labelWidth" :size="data.size">
      <template #label>
        <p class="title-label">
          <span v-show="data.required">*</span>{{ data.name }}
        </p>
        <p class="second-title-label">{{ data.placeholder }}</p>
      </template>
      <el-checkbox-group :style="{ width: data.width }" :value="data.value">
        <el-checkbox
          v-for="o in data.option"
          :disabled="o.disabled"
          :label="o.value"
          :key="o.value"
          >{{ o.label }}</el-checkbox
        >
      </el-checkbox-group>
    </el-form-item>
  </div>
</template>

<script>
export default {
  name: "checkbox",
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
