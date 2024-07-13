<template>
  <div class="pictureSearch">
    <div class="pictureSearch-item search-group">
      <el-select v-model="data.selectKey" placeholder="Select" size="small">
        <el-option
          v-for="item in data.selectOption"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <el-input
        v-model="data.selectValue"
        :placeholder="data.placeholder[data.selectKey]"
        size="small"
      />
    </div>
    <div class="pictureSearch-item">
      <el-select v-model="data.tag" placeholder="请选择产品分类" size="small">
        <el-option
          v-for="item in data.tagOption"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
    </div>
    <el-button type="primary" size="small" @click="pictureSearch"
      >搜索</el-button
    >
  </div>
</template>

<script>
import { reactive } from "vue";

export default {
  emits: ["search"],
  setup(props, { emit }) {
    const data = reactive({
      selectKey: "SKU",
      selectOption: [
        {
          label: "SKU/SPU",
          value: "SKU",
        },
        {
          label: "产品名称",
          value: "productName",
        },
      ],
      placeholder: {
        SKU: "请输入SKU/SPU编码",
        productName: "请输入产品名称",
      },
      selectValue: "",
      tag: "",
      tagOption: [
        {
          label: "标签一号",
          value: "b1",
        },
      ],
    });

    const pictureSearch = () => {
      const searchData = {
        tag: data.tag,
      };
      searchData[data.selectKey] = data.selectValue;
      emit("search", searchData);
    };

    return {
      data,
      pictureSearch,
    };
  },
};
</script>
<style scoped lang="scss">
::v-deep .el-input__suffix,
::v-deep .el-select .el-input__inner:focus,
::v-deep .el-select .el-input.is-focus .el-input__inner {
  z-index: 5;
}
::v-deep .search-group :first-child .el-input__inner {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}
::v-deep .search-group :nth-child(2) .el-input__inner {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}

::v-deep .el-input__inner {
  border-radius: 2px;
}
.pictureSearch {
  padding-bottom: 16px;
}
.pictureSearch,
.pictureSearch-item {
  display: flex;
  align-items: center;
}
.search-group {
  width: 290px;
  position: relative;
  > div {
    position: absolute;
    :hover {
      z-index: 1;
    }
  }
  > :first-child {
    width: 120px;
  }
  > :nth-child(2) {
    width: 170px;
    left: 119px;
  }
}
.pictureSearch-item {
  margin-right: 12px;
}
</style>
