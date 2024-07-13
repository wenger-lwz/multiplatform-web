<template>
  <gj-space>
    <gj-select
      v-model="fromData.name"
      placeholder="请选择模板"
      class="rightBoxSelect"
      @popup-visible-change="getTemplate"
    >
      <gj-option v-for="item in nameList" :key="item.id" :value="item.id">{{
        item.name
      }}</gj-option>
    </gj-select>
    <gj-button type="text" @click="saveTemplate">另存为模板</gj-button>
  </gj-space>
</template>

<script>
import { defineComponent, reactive, toRefs, onBeforeMount } from "vue";
// import { clearStoreData } from './index.js'
export default defineComponent({
  name: "rightBox",
  components: {},
  emits: ["save_template"],
  props: {
    propOptions: {
      type: Array,
      default: () => {
        return [];
      },
    },
    action: {
      type: Function,
      default: () => {
        return () => {};
      },
    },
    parmas: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  setup(props, { emit }) {
    const datas = reactive({
      fromData: {
        name: "",
      }, // 查询参数
      nameList: [],
    });
    const saveTemplate = () => {
      emit("save_templateInfo", props.parmas, datas.fromData.name);
    };
    const getTemplate = (val) => {
      if (val) {
        // 获取列表数据
        const actions = props.action;
        const list = {
          url: props.parmas.url,
          params: {
            ...datas.fromData,
          },
        };
        actions(list).then((res) => {
          datas.nameList = res.data.records;
        });
      }
    };

    onBeforeMount(() => {});
    return {
      ...toRefs(datas),
      saveTemplate,
      getTemplate,
    };
  },
});
</script>

<style scoped lang="scss">
.search-gb-select {
  width: 180px;
}
:deep(.rightBoxSelect) {
  @extend .search-gb-select;
}
</style>
