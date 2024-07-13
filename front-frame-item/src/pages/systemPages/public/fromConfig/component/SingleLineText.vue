<template>
  <!-- 单行文本 -->
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
import { defineComponent } from "vue";
export default defineComponent({
  name: "singleLineText",
  props: {
    data: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  // setup(props) {
  //   let data = reactive({
  //     data: props.data
  //   })
  //   watch(
  //     () => props.data,
  //     () => {
  //       data.data = props.data
  //     }
  //   )
  //   return {
  //     data
  //   }
  // }
});
</script>
<style lang="scss">
.title-label,
.second-title-label {
  font-size: 14px;
  font-family: PingFang SC, PingFang SC-Bold;
  font-weight: 700;
  text-align: LEFT;
  color: #333333;
  span {
    margin-right: 4px;
    color: red;
  }
}
.second-title-label {
  color: #999999;
}
</style>
