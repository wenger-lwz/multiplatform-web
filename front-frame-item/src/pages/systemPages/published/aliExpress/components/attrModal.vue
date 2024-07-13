<template>
  <gj-modal
    v-model:visible="modalVisable"
    @ok="handleOk"
    @cancel="handleCancel"
    :width="800"
  >
    <template #title> 请选择 </template>
    <gj-checkbox
      v-model="allCheck"
      @change="allChange"
      :indeterminate="indeterminate"
      class="item"
      >全选</gj-checkbox
    >
    <div class="attrModelconten">
      <div v-for="item in checkOption" :key="item.id">
        <!-- <gj-checkbox
          v-if="item.visible"
          :value="item.id"
          v-model="item.check"
          class="item"
          >{{ item.zhName }}</gj-checkbox
        > -->
        <gj-checkbox
          :value="item.id"
          @change="selectchange"
          v-model="item.check"
          class="item"
          >{{ item.zhName }}</gj-checkbox
        >
      </div>
    </div>
  </gj-modal>
</template>
<script>
import { defineComponent, reactive, toRefs, watch } from "vue";
export default defineComponent({
  name: "",
  props: {
    visible: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
    option: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  setup(props, { emit }) {
    const data = reactive({
      modalVisable: props.visible,
      checkOption: [],
      allCheck: false,
      indeterminate: false,
    });
    const handleCancel = () => {
      emit("handleCancel");
    };
    const handleOk = () => {
      emit("handleOk", data.checkOption);
    };

    const selectchange = () => {
      let checkArr = [];
      data.checkOption.forEach((item) => {
        if (item.check) {
          checkArr.push(item);
        }
      });
      if (checkArr.length == 0) {
        data.allCheck = false;
        data.indeterminate = false;
      } else if (
        checkArr.length > 0 &&
        checkArr.length < data.checkOption.length
      ) {
        data.allCheck = false;
        data.indeterminate = true;
      } else {
        data.allCheck = true;
        data.indeterminate = false;
      }
    };

    const allChange = (val) => {
      data.indeterminate = false;
      data.checkOption.forEach((item) => {
        item.check = val;
      });
    };
    watch(
      () => props.visible,
      (newValue) => {
        data.modalVisable = newValue;
      }
    );
    watch(
      () => props.option,
      (newValue) => {
        data.checkOption = [...newValue].map((item) =>
          JSON.parse(JSON.stringify(item))
        );

        selectchange();
      },
      {
        deep: true,
      }
    );
    return {
      ...toRefs(data),
      handleCancel,
      handleOk,
      selectchange,
      allChange,
    };
  },
});
</script>
<style scoped lang="scss">
.attrModelconten {
  display: flex;
  flex: 1;
  flex-wrap: wrap;
}
.item {
  min-width: 160px;
  margin-right: 16px;
  margin-bottom: 8px;
}
</style>
