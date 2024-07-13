<template>
  <!-- 多行文本 -->
  <div>
    <el-form-item :label-width="data.labelWidth" :size="data.size">
      <template #label>
        <p class="title-label">
          <span v-show="data.required">*</span>{{ data.name }}
        </p>
        <p class="second-title-label">{{ data.placeholder }}</p>
      </template>
      <el-input
        :input-style="{ width: data.width, height: data.height }"
        :disabled="data.disabled"
        :value="data.value"
        type="textarea"
        :rows="2"
      />
    </el-form-item>
  </div>
</template>

<script>
export default {
  name: "multiLineText",
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
