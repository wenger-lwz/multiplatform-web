<template>
  <!-- 日期 -->
  <div>
    <el-form-item :label-width="data.labelWidth" :size="data.size">
      <template #label>
        <p class="title-label">
          <span v-show="data.required">*</span>{{ data.name }}
        </p>
        <p class="second-title-label">{{ data.placeholder }}</p>
      </template>
      <el-date-picker
        :type="data.showType"
        :value="data.value"
        :style="{ width: data.width }"
        :disabled="data.disabled"
      >
      </el-date-picker>
    </el-form-item>
  </div>
</template>

<script>
export default {
  name: "dateTime",
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
