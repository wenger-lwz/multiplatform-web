<template>
  <!-- <gb-default-view
    id="videoManagement"
    :get-list="getList"
    :post-list="postList"
    :query-map="queryMap"
    @del-query-condition="delQueryCondition"
    @change-query-list="changeQueryList"
  >
  </gb-default-view>
  <gj-divider /> -->
  <gj-space>
    <gb-select-input2
      v-model="selectInput"
      inputMore
      :options="options"
      @search="gbSearch"
    ></gb-select-input2>
    <gj-input-search
      v-model="searchData.name"
      placeholder="请输入视频名称"
      @search="search"
      @press-enter="search"
    />
    <gj-tree-select
      v-if="!defaultView"
      v-model="treeSelectValue"
      :fieldNames="{
        key: 'category',
        title: 'categoryName',
      }"
      :data="treeData"
      placeholder="请选择分类"
      style="width: 260px"
      @change="treeSelectValueChange"
    ></gj-tree-select>
    <gj-button type="textPlain" @click="commonPageRest">重置</gj-button>
  </gj-space>
</template>
<script>
import { defineComponent, reactive, toRefs } from "vue";

export default defineComponent({
  props: {
    defaultView: {
      type: Boolean,
      default: true,
    },
    treeData: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  emits: ["search", "treeSelect"],
  setup(props, { emit }) {
    const defaultData = {
      selectInput: {
        selectValue: "0",
        inputValue: "",
        moreValue: [],
      },
      searchData: {
        name: "",
      },
    };
    const data = reactive({
      getList: () => {
        return new Promise((resolve) => {
          const params = {
            code: 0,
            message: "ok",
            data: {
              viewList: JSON.stringify([
                {
                  viewName: "默认视图",
                  viewCode: "1",
                  isEdit: false,
                  queryList: [],
                },
              ]),
            },
          };
          resolve(params);
        });
      },
      postList: () => {},
      queryMap: {
        key: "",
        value: "",
        connectCode: "",
        code: "",
        cascadeKey: "",
      },
      options: [
        { value: "0", label: "SPU/SKU" },
        { value: "1", label: "Item ID" },
      ],
      selectInput: JSON.parse(JSON.stringify(defaultData.selectInput)),
      searchData: JSON.parse(JSON.stringify(defaultData.searchData)),
      treeSelectValue: "",
    });

    const treeSelectValueChange = (val) => {
      emit("treeSelect", [val]);
    };

    const changeQueryCondition = (params) => {
      Object.assign(data.queryMap, params);
      console.log(data.queryMap);
    };

    const gbSearch = (val) => {
      data.selectInput = val;
      search();
    };

    // 列表搜索
    const search = (val) => {
      let params = {};
      params.item = data.selectInput.selectValue;
      if (data.selectInput.moreValue.length) {
        params.itemContent = data.selectInput.moreValue.map((item) => {
          return item.trim();
        });
      }
      if (data.selectInput.inputValue) {
        params.itemContent = [data.selectInput.inputValue.trim()];
      }
      if (val === "commonPageRest") {
        params.category = "";
      }
      emit("search", {
        ...params,
        ...data.searchData,
        name: data.searchData.name.trim(),
      });
    };
    const changeName = () => {
      const params = {
        key: "名称",
        value: data.searchData.name,
        connectCode: "name",
        code: "",
        cascadeKey: "",
      };
      changeQueryCondition(params);
      emit("search", data.searchData);
    };

    // 重置
    const commonPageRest = () => {
      data.selectInput = JSON.parse(JSON.stringify(defaultData.selectInput));
      data.searchData = JSON.parse(JSON.stringify(defaultData.searchData));
      search("commonPageRest");
    };

    // 组件删除label回调事件
    const delQueryCondition = (code) => {
      data.searchData[code] = "";
    };
    const resetSearchData = () => {
      Object.keys(data.searchData).forEach((key) => {
        data.searchData[key] = "";
      });
    };
    // 切换视图回调事件
    const changeQueryList = (list) => {
      // 1、重置方法
      resetSearchData();
      // 2、重新赋值
      list.forEach((item) => {
        if (item.code) {
          data.searchData[item.connectCode] = item.code;
        } else {
          data.searchData[item.connectCode] = item.value;
        }
      });
    };
    return {
      ...toRefs(data),
      treeSelectValueChange,
      gbSearch,
      search,
      commonPageRest,
      delQueryCondition,
      changeQueryList,
      changeName,
    };
  },
});
</script>
