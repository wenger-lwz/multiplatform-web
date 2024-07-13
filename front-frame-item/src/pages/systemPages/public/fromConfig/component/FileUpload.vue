<template>
  <!-- 附件上传 -->
  <div>
    <el-form-item :label-width="data.labelWidth" :size="data.size">
      <template #label>
        <p class="title-label">
          <span v-show="data.required">*</span>{{ data.name }}
        </p>
        <p class="second-title-label">{{ data.placeholder }}</p>
      </template>
      <el-row>
        <el-col :span="12">
          <div class="default-file">
            <span>***图片</span>
            <span>上传</span>
          </div>
        </el-col>
        <el-col :span="12" v-for="(item, index) in data.option" :key="index">
          <div class="default-file new-file">
            <img :src="item.url || '#'" alt="" />
            <span>{{ item.label }}</span>
          </div>
        </el-col>
      </el-row>
    </el-form-item>
  </div>
</template>

<script>
export default {
  name: "fileUpload",
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

<style scoped>
.default-file {
  width: 100%;
  height: 40px;
  line-height: 40px;
  color: #c0c0c0;
}
</style>
