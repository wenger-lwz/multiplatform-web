<template>
  <div class="commpage">
    <gj-button @click="isShow">癞蛤蟆</gj-button>
    <gj-modal :visible="visible" width="71%">
      <template #title>
        <span class="btitle">我是癞蛤蟆</span>
      </template>
      <div class="content">
        <p>假如我在多思考一点</p>
        <p>假如我在多思考一点</p>
        <p>假如我在多思考一点</p>
        <p>假如我在多思考一点</p>
        <p>假如我在多思考一点</p>
        <p>假如我在多思考一点</p>
        <p>假如我在多思考一点</p>
        <p>假如我在多思考一点</p>
        <p>假如我在多思考一点</p>
        <p>假如我在多思考一点</p>
        <!--你之前装table的容器-->
        <div class="nizhiqian">
          <ModalTableHeight
            @getTableHeight="getTableHeight"
            ref="modalTableHeightRef"
          >
            <template #table>
              <gj-table
                :columns="columns"
                :pagination="false"
                :data-source="tableData"
                :scroll="{ y: tableHeight }"
                bordered
              >
              </gj-table>
            </template>
          </ModalTableHeight>
        </div>
      </div>
    </gj-modal>
  </div>
</template>

<script>
import {
  defineComponent,
  reactive,
  toRefs,
  onBeforeMount,
  onMounted,
  ref,
} from "vue";
const columns = [
  {
    title: "Full Name",
    dataIndex: "name",
  },
  {
    title: "Age",
    dataIndex: "age",
  },
  {
    title: "Column 1",
    dataIndex: "address",
  },
  {
    title: "Column 2",
    dataIndex: "address",
  },
  {
    title: "Column 3",
    dataIndex: "address",
  },
  {
    title: "Column 4",
    dataIndex: "address",
  },
  {
    title: "Column 5",
    dataIndex: "address",
  },
];
import ModalTableHeight from "@/components/ModalTableHeight";

export default defineComponent({
  components: {
    ModalTableHeight,
  },
  setup() {
    const data = reactive({
      visible: false,
      columns,
      tableData: [],
      tableHeight: "40vh",
    });
    const modalTableHeightRef = ref(null);

    const isShow = () => {
      data.visible = !data.visible;
      if (data.visible) {
        modalTableHeightRef.value.setTableHeight();
      }
    };

    onBeforeMount(() => {
      for (let i = 0; i < 1000; i++) {
        data.tableData.push({
          key: i,
          name: `Edrward ${i}`,
          age: i + 1,
          address: `London Park no. ${i}多搞点内容喜喜哈哈恍恍惚惚`,
        });
      }
    });

    const getTableHeight = (val) => {
      console.log("获取到的高度是", val);
      if (val) {
        data.tableHeight = val;
      }
    };

    onMounted(() => {});

    return {
      ...toRefs(data),
      isShow,
      getTableHeight,
      modalTableHeightRef,
    };
  },
});
</script>

<style scoped lang="scss">
.commpage {
  width: 100%;
  height: 100%;
  border: solid 1px red;
}

.content {
  height: calc(100vh - 400px);
}

.nizhiqian {
  height: calc(100vh - 600px);
  border: solid 1px red;
}
</style>
