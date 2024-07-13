<template>
  <!-- 下拉选择 -->
  <div>
    <el-form-item
      :label-width="data.labelWidth"
      :size="data.size"
      :required="data.required"
    >
      <template #label>
        <p class="title-label">
          <span v-show="data.required">*</span>{{ data.name }}
        </p>
        <p class="second-title-label">{{ data.placeholder }}</p>
      </template>
      <el-select
        :multiple="data.multiple"
        :style="{ width: data.width }"
        :disabled="data.disabled"
        :value="data.value"
      >
        <el-option
          v-for="item in data.option"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
    </el-form-item>
  </div>
</template>

<script>
export default {
  name: "select",
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
