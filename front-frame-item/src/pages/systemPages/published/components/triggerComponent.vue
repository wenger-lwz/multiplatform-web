<template>
  <div class="gj-common-trigger" :style="{ width: width, height: height }">
    <div class="header">
      <slot name="header"></slot>
    </div>
    <div class="content">
      <slot name="content"></slot>
      <slot>
        <gj-table
          :columns="columns"
          :data="tableData"
          :pagination="false"
          :scroll="scroll"
        />
      </slot>
    </div>
    <div v-if="showFooter" class="footer">
      <slot name="footer"></slot>
      <slot>
        <gj-pagination
          :total="tableData.length"
          size="small"
          simple
          @change="changePage"
        />
      </slot>
    </div>
  </div>
</template>
<script>
import { defineComponent, reactive, toRefs, onMounted } from "vue";
export default defineComponent({
  name: "triggerComponent",
  props: {
    width: {
      type: String,
      default: "600px",
    },
    height: {
      type: String,
      default: "400px",
    },
    scroll: {
      type: Object,
      default: () => {
        return {
          x: 0,
          y: 320,
        };
      },
    },
    showFooter: {
      type: Boolean,
      default: true,
    },
    columns: {
      type: Array,
      default: () => [],
    },
    getList: {
      type: Function,
      default: () => {
        return () => {};
      },
    },
  },
  setup(props, context) {
    const data = reactive({
      tableData: [],
      total: 0,
      pageSize: 10,
      current: 1,
    });
    const changePage = (val) => {
      context.emit("changePage", val);
    };
    onMounted(() => {
      // props
      //   .getList()
      //   .then((res) => {
      //     console.log(res)
      //   })
      //   .catch((err) => {
      //     console.log(err)
      //   })
      setTimeout(() => {
        data.tableData = [
          {
            key: "1",
            name: "Jane Doe",
            salary: 23000,
            address: "32 Park Road, London",
            email: "jane.doe@example.com",
          },
          {
            key: "2",
            name: "Alisa Ross",
            salary: 25000,
            address: "35 Park Road, London",
            email: "alisa.ross@example.com",
          },
          {
            key: "3",
            name: "Kevin Sandra",
            salary: 22000,
            address: "31 Park Road, London",
            email: "kevin.sandra@example.com",
          },
          {
            key: "4",
            name: "Ed Hellen",
            salary: 17000,
            address: "42 Park Road, London",
            email: "ed.hellen@example.com",
          },
          {
            key: "5",
            name: "William Smith",
            salary: 27000,
            address: "62 Park Road, London",
            email: "william.smith@example.com",
          },
          {
            key: "1",
            name: "Jane Doe",
            salary: 23000,
            address: "32 Park Road, London",
            email: "jane.doe@example.com",
          },
          {
            key: "2",
            name: "Alisa Ross",
            salary: 25000,
            address: "35 Park Road, London",
            email: "alisa.ross@example.com",
          },
          {
            key: "3",
            name: "Kevin Sandra",
            salary: 22000,
            address: "31 Park Road, London",
            email: "kevin.sandra@example.com",
          },
          {
            key: "4",
            name: "Ed Hellen",
            salary: 17000,
            address: "42 Park Road, London",
            email: "ed.hellen@example.com",
          },
          {
            key: "5",
            name: "William Smith",
            salary: 27000,
            address: "62 Park Road, London",
            email: "william.smith@example.com",
          },
        ];
      }, 1000);
    });
    return {
      ...toRefs(data),
      changePage,
    };
  },
});
</script>
<style scoped lang="scss">
.gj-common-trigger {
  background: #fff;
  border-radius: 4px;
  box-shadow: 1px 0px 10px 4px #0000001a;
  .header {
    height: 32px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 16px;
  }
  .footer {
    position: absolute;
    left: 0;
    bottom: 0;
    height: 32px;
    padding: 4px 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    background: #fff;
  }
}
</style>
