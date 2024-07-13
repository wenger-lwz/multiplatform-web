<template>
  <!-- 数字 -->
  <div class="numberComp">
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
      >
        <template #prefix>
          <span>{{ units }}</span>
        </template>
      </el-input>
    </el-form-item>
  </div>
</template>

<script>
export default {
  name: "number",
  props: {
    data: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  computed: {
    units() {
      return (
        this.data.option.filter(
          (item) => item.value === this.data.limitUnits
        )[0].icon || "￥"
      );
    },
  },
};
</script>

<style lang="scss">
.numberComp {
  .el-form-item {
    .el-form-item__content {
      .el-input {
        .el-input__prefix {
          .el-input__prefix-inner {
            align-items: center;
          }
        }
      }
    }
  }
}
</style>
