<template>
  <div>
    <p>级联全路劲</p>
    <a-space direction="vertical" size="large">
      <!-- <gj-cascader
        :options="options"
        :style="{ width: '320px' }"
        placeholder="Please select ..."
        :format-label="format"
      />
      <gj-cascader
        :options="options"
        default-value="datunli"
        expand-trigger="hover"
        :style="{ width: '320px' }"
        placeholder="Please select ..."
        :format-label="format"
      /> -->
      <p>--------------------官网的--------------</p>
      <!-- <a-cascader
        :options="options"
        :default-value="[['10000342', '10000363', '10000540']]"
        :default-input-value="'王世充 / 张自忠 / 马超'"
        :style="{ width: '320px' }"
        placeholder="Please select ..."
        path-mode
        :load-more="loadMore"
        @change="handleChange"
      /> -->
      <p>-----------------自身的-------------</p>
      <gj-cascader
        path-mode
        :options="options"
        v-model="testValue"
        :input-value="'Digital Goods / Gift Cards / Activities and Entertainment'"
        expand-trigger="hover"
        :style="{ width: '320px' }"
        placeholder="Please select ..."
        :load-more="loadMore"
        @change="handleChange"
        :format-label="format"
      />
    </a-space>
  </div>
</template>

<script>
import { defineComponent, reactive, toRefs, onBeforeMount } from "vue";
import { getCategoryById } from "@/api/published/lazada";
export default defineComponent({
  setup() {
    const data = reactive({
      options: [],
      testValue: [1001, 1002, 1003],
      params: {},
    });

    const handleChange = (path) => {
      console.log("这里包含选择的ID，提交给后台的就是数组的最后一个", path);
      data.params["id"] = path[path.length - 1];
    };

    const format = (options) => {
      console.log("111这里面包含选择的所有数据", options);
      const labels = options.map((option) => option.label);
      const laeblsSelect = options.map((item) => {
        return {
          label: item.label,
          value: item.lazadaCategoryId,
        };
      });
      // 这个字段 前后端自行商议，各个平台希望保持统一
      data.params["labels"] = JSON.stringify(laeblsSelect);
      data.params["other"] = "其他参数集合";
      console.log("提交的参数", data.params);
      return labels.join("/");
    };

    const formatCateList = (result) => {
      return result.map((item) => {
        return {
          ...item,
          value: item.lazadaCategoryId,
          label: item.categoryName,
          isLeaf: item.leaf,
        };
      });
    };

    const getData = async (parentId) => {
      const rsp = await getCategoryById({
        siteId: "my",
        parentId: parentId || "0",
      });
      return rsp.data;
    };

    const loadMore = async (option, done) => {
      const result = await getData(option.value);
      const nodes = formatCateList(result);
      done(nodes);
    };

    onBeforeMount(async () => {
      const result = await getData("0");
      console.log("result", result);
      data.options = formatCateList(result);
    });

    return {
      ...toRefs(data),
      handleChange,
      format,
      loadMore,
    };
  },
});
</script>
