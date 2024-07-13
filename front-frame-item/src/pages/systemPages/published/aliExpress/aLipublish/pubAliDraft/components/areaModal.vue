<template>
  <gj-modal
    v-model:visible="areaVisible"
    title="请选择"
    @ok="handleOk"
    @cancel="handleCancel"
    title-align="start"
    :unmount-on-close="true"
    :width="800"
    :maskClosable="false"
  >
    <div class="content">
      <div class="search">
        <gj-input-search
          v-model="keyword"
          @search="searchKeyword"
          @keyup.enter="searchKeyword"
        ></gj-input-search>
      </div>
      <div class="checkBoxCon">
        <div class="all" @change="allChange">
          <gj-checkbox v-model="allCheck" :indeterminate="indeterminate"
            >全选</gj-checkbox
          >
        </div>
        <div class="group">
          <gj-checkbox-group v-model="areaData">
            <gj-checkbox
              :value="item.value"
              class="item"
              v-for="(item, index) in areaList"
              :key="index"
              >{{ item.label }}</gj-checkbox
            >
          </gj-checkbox-group>
        </div>
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
    areaList: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  setup(props, { emit }) {
    const data = reactive({
      areaVisible: props.visible,
      allCheck: false,
      areaList: props.areaList,
      copyAreaList: JSON.parse(JSON.stringify(props.areaList)),
      indeterminate: false,
      areaData: [],
      keyword: "",
    });

    const handleOk = () => {
      emit("handleOk", data.areaData);
    };
    const handleCancel = () => {
      emit("handleCancel");
    };

    const searchKeyword = () => {
      if (!data.keyword) {
        data.areaList = [...data.copyAreaList];
      } else {
        data.areaList = data.areaList.filter(
          (item) =>
            item.label.toUpperCase().indexOf(data.keyword.toUpperCase()) > -1
        );
      }

      // data.allCheck = false
      // data.indeterminate = false
      // data.areaData = []
    };

    const allChange = () => {
      if (data.allCheck) {
        data.areaData = data.areaList.map((item) => item.value);
      } else {
        data.areaData = [];
      }
      console.log(data.allCheck);
    };

    const updataCheck = (arr) => {
      data.areaData = arr;
    };
    watch(
      () => props.visible,
      (newValue) => {
        data.areaVisible = newValue;
        data.copyAreaList = JSON.parse(JSON.stringify(props.areaList));
      }
    );

    watch(
      () => data.areaData.length,
      (newValue) => {
        if (newValue === 0) {
          data.indeterminate = false;
          data.allCheck = false;
        } else if (newValue > 0 && newValue < data.copyAreaList.length) {
          data.indeterminate = true;
          data.allCheck = false;
        } else if (newValue > 0 && newValue == data.copyAreaList.length) {
          data.indeterminate = false;
          data.allCheck = true;
        }
      }
    );

    return {
      ...toRefs(data),
      handleCancel,
      handleOk,
      allChange,
      searchKeyword,
      updataCheck,
    };
  },
});
</script>
<style scoped lang="scss">
.content {
  // padding: 16px;
  padding-right: 0;
  .search {
    width: 300px;
    margin-bottom: 16px;
  }
  .checkBoxCon {
    display: flex;
    .all {
      width: 62px;
      margin-right: 16px;
    }
    .group {
      display: flex;
      flex: 1;
      flex-wrap: wrap;

      .item {
        min-width: 160px;
        margin-right: 16px;
        margin-bottom: 8px;
      }
    }
  }
}
</style>
