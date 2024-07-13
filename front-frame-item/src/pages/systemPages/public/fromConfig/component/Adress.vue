<template>
  <!-- 地址 -->
  <div>
    <el-form-item :label-width="data.labelWidth" :size="data.size">
      <template #label>
        <p class="title-label">
          <span v-show="data.required">*</span>{{ data.name }}
        </p>
        <p class="second-title-label">{{ data.placeholder }}</p>
      </template>
      <div>
        <el-cascader
          :size="data.size"
          :value="data.value"
          :placeholder="data.placeholder"
          :options="data.option"
          clearable
        />
      </div>
      <el-input
        :rows="4"
        type="textarea"
        :value="data.detailAdress"
        :size="data.size"
        placeholder="请输入"
      ></el-input>
    </el-form-item>
  </div>
</template>

<script>
export default {
  name: "adress",
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
