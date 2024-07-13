<template>
  <div class="formHeader" :class="rigthBox ? 'marginBtom18' : 'marginBtom12'">
    <gj-row type="flex" class="row-bg" justify="end">
      <gj-col :span="rigthBox ? 12 : 24">
        <div class="titleName">
          {{ $t(title) }}
        </div>
      </gj-col>
      <gj-col :span="12" v-if="rigthBox">
        <div class="text_rigth">
          <slot name="rigthBox"></slot>
        </div>
      </gj-col>
    </gj-row>
  </div>
</template>

<script>
import { defineComponent, reactive, toRefs } from "vue";

export default defineComponent({
  name: "CommonFormHeader",
  components: {},
  props: {
    title: {
      type: String,
      default: () => {
        return "";
      },
    },
    rigthBox: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
  },
  setup(prop) {
    const data = reactive({
      isRigthBox: prop.rigthBox,
      basicInfo: {
        associatedSKU: "",
      },
      locationData: [
        {
          platformName: "全部",
          platformCode: "",
        },
        {
          platformName: "美国",
          platformCode: "USA",
        },
      ],
    });
    return {
      ...toRefs(data),
    };
  },
});
</script>

<style scoped lang="scss">
.formHeader {
  width: 100%;
  font-size: 14px;
  font-weight: 700;
  color: #000;
  .row-bg {
    height: 32px;
  }

  .titleName {
    height: 32px;
    display: flex;
    align-items: center;
  }
  .lineStyle {
    width: 4px;
    height: 14px;
    background: #1f6eef;
    margin-right: 8px;
    display: inline-block;
    position: relative;
    top: 2px;
  }
  .text_rigth {
    width: 100%;
    display: flex;
    justify-content: flex-end;
  }
}
.marginBtom12 {
  margin-bottom: 8px;
}
.marginBtom18 {
  margin-bottom: 12px;
}
</style>
