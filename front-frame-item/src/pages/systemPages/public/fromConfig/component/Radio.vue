<template>
  <!-- 单项选择 -->
  <div>
    <el-form-item :label-width="data.labelWidth" :size="data.size">
      <template #label>
        <p class="title-label">
          <span v-show="data.required">*</span>{{ data.name }}
        </p>
        <p class="second-title-label">{{ data.placeholder }}</p>
      </template>
      <el-radio-group :value="data.value">
        <el-radio
          v-for="o in data.option"
          :disabled="o.disabled"
          :label="o.label"
          :key="o.value"
        />
      </el-radio-group>
    </el-form-item>
  </div>
</template>

<script>
export default {
  name: "radio",
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
