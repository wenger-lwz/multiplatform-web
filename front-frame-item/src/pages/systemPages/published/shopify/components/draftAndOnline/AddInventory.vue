<template>
  <gj-modal
    v-model:visible="modalVisible"
    :width="500"
    class="inventory-modal"
    title="选择仓库库存"
    title-align="start"
    :unmount-on-close="true"
    :render-to-body="false"
    @cancel="cancel"
    :on-before-ok="ok"
  >
    <gj-form ref="formRef" :model="form" :rules="rules">
      <gj-form-item
        field="manager"
        label="仓库存管理方"
        :label-col-props="{ span: 6 }"
        :wrapper-col-props="{ span: 17 }"
      >
        <gj-select
          v-model="form.manager"
          placeholder="请选择仓库存管理方"
          value-key="id"
          allow-clear
          :trigger-props="{
            updateAtScroll: true,
          }"
          @change="managerChange"
        >
          <gj-option
            v-for="item in warehouseManagers"
            :label="item.name"
            :value="item"
            :key="item.id"
          />
        </gj-select>
      </gj-form-item>
      <gj-form-item
        v-for="warehouseItem in managerWarehouses"
        :key="warehouseItem.shopifyWarehouseId"
        :label="warehouseItem.warehouseName"
        :label-col-props="{ span: 6 }"
        :wrapper-col-props="{ span: 17 }"
      >
        <gj-input-number
          :min="0"
          placeholder="请输入"
          v-model="warehouseItem.productNum"
          allow-clear
        />
      </gj-form-item>
      <gj-empty v-if="form.manager && !managerWarehouses.length"
        >暂无仓库数据</gj-empty
      >
    </gj-form>
  </gj-modal>
</template>

<script>
import {
  defineComponent,
  ref,
  reactive,
  toRefs,
  watch,
  computed,
  inject,
} from "vue";

export default defineComponent({
  name: "AddInventory",
  emits: ["add-inventory"],
  props: {
    rowInventoryInfo: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  setup(props, { emit }) {
    const warehouses = inject("warehouses", []);
    const vs = computed(() => props.visible);
    const modalVisible = ref(props.visible);

    const formRef = ref(null);
    const data = reactive({
      form: {
        manager: null,
        inventoryType: "",
      },
      rules: {
        manager: [
          {
            required: true,
            message: "请选择仓库存管理方",
          },
        ],
        productNum: [
          {
            type: "number",
            min: 0,
          },
        ],
      },
      warehouses: [],
      warehouseManagers: [],
      shopifyWarehouses: [],
      customWarehouses: [],
      managerWarehouses: [],
    });

    const inventoryInfo = computed(() => props.rowInventoryInfo);

    watch(vs, (n) => {
      modalVisible.value = n;
    });

    const getProductNum = (inventoryItems, id) => {
      const f = inventoryItems.find((item) => item.shopifyWarehouseId == id);
      if (f) {
        return f.productNum;
      }
      return null;
    };

    watch(
      () => inventoryInfo.value,
      (n) => {
        const inventoryItems = n?.[0]?.inventoryItems ?? [];
        const inventoryType = n?.[0]?.inventoryType;
        data.form.inventoryType = inventoryType;
        if (inventoryItems.length) {
          if (inventoryType === "0") {
            data.managerWarehouses = data.shopifyWarehouses.map((item) => {
              return {
                warehouseName: item.name,
                shopifyWarehouseId: item.id,
                productNum: getProductNum(inventoryItems, item.id),
              };
            });
            data.form.manager = {
              id: "shopify",
            };
          } else {
            data.managerWarehouses = inventoryItems;
            data.form.manager = {
              id: inventoryItems[0].shopifyWarehouseId,
            };
          }
        }
      },
      {
        deep: true,
      }
    );

    watch(
      () => warehouses,
      (n) => {
        data.warehouses = n;
        init();
      },
      {
        deep: true,
      }
    );

    function init() {
      data.shopifyWarehouses = data.warehouses.filter(
        (warehouse) => !warehouse.legacy
      );
      data.customWarehouses = data.warehouses.filter(
        (warehouse) => warehouse.legacy
      );
      const shopifyManager = [
        {
          id: "shopify",
          name: "Shopify",
          legacy: false,
        },
      ];
      data.warehouseManagers = shopifyManager.concat(data.customWarehouses);
    }

    const managerChange = (warehouse) => {
      if (!warehouse) {
        data.form.inventoryType = "";
        data.managerWarehouses = [];
        return false;
      }
      let managerWarehouses = [];
      data.form.inventoryType = warehouse.legacy ? "1" : "0";
      if (!warehouse.legacy) {
        managerWarehouses = data.shopifyWarehouses;
      } else {
        managerWarehouses = data.customWarehouses.filter(
          (item) => item.id === warehouse.id
        );
      }
      data.managerWarehouses = managerWarehouses.map((item) => {
        return {
          warehouseName: item.name,
          shopifyWarehouseId: item.id,
          productNum: null,
        };
      });
    };

    const ok = async (done) => {
      const errors = await formRef.value.validateField("manager");
      if (errors) {
        done(false);
      } else {
        done();
        emit("add-inventory", data);
      }
      data.form.manager = null;
      data.managerWarehouses = [];
    };

    const cancel = () => {
      data.form.manager = null;
      data.managerWarehouses = [];
    };

    return {
      modalVisible,
      formRef,
      ...toRefs(data),
      managerChange,
      ok,
      cancel,
    };
  },
});
</script>
<style lang="scss" scoped>
:deep(.arco-form-item) {
  margin-bottom: 20px !important;
}
:deep(.arco-form-item.arco-form-item-error) {
  margin-bottom: 0;
}
</style>
