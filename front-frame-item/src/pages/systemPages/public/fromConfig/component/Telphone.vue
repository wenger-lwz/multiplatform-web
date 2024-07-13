<template>
  <!-- 电话 -->
  <div>
    <el-form-item :label-width="data.labelWidth" :size="data.size">
      <template #label>
        <p class="title-label">
          <span v-show="data.required">*</span>{{ data.name }}
        </p>
        <p class="second-title-label">{{ data.placeholder }}</p>
      </template>
      <el-input
        :input-style="{ width: data.width }"
        :value="data.value"
        :disabled="data.disabled"
      />
    </el-form-item>
  </div>
</template>

<script>
export default {
  name: "telphone",
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
