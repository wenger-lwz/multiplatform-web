<template>
  <!-- 起止时间 -->
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
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :style="{ width: data.width }"
        :disabled="data.disabled"
      >
      </el-date-picker>
    </el-form-item>
  </div>
</template>

<script>
export default {
  name: "dateRange",
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
