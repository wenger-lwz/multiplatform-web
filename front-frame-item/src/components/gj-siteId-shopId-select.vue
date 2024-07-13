<template>
  <gj-space>
    <gb-select
      class="search-gb-select"
      placeholder="站点"
      :allow-clear="allowClear"
      v-model="state.siteIds"
      :max-tag-count="1"
      @confirm="handleChangeSiteId($event)"
      @clear="clearSiteId()"
      @remove="removeSiteId()"
    >
      <gb-select-option
        v-for="item in siteIdList"
        :key="item[siteIdValueKey]"
        :value="item[siteIdValueKey]"
      >
        {{ item[siteIdLabelKey] }}
      </gb-select-option>
    </gb-select>
    <gb-select
      class="search-gb-select"
      placeholder="店铺"
      :allow-clear="allowClear"
      v-model="state.shopIds"
      :max-tag-count="1"
      @confirm="handleChangeShopId($event)"
      @clear="clearShopId()"
      @remove="removeShopId()"
    >
      <gb-select-option
        v-for="item in shopIdList"
        :key="item[shopIdValueKey]"
        :value="item[shopIdValueKey]"
      >
        {{ item[shopIdLabelKey] }}
      </gb-select-option>
    </gb-select>
  </gj-space>
</template>
<script>
import { computed, defineComponent, nextTick, reactive, watch } from "vue";
import { useStore } from "vuex";
import { M_T } from "@/store/mutationsTypes.js";
export default defineComponent({
  name: "gjSiteIdShopIdSelect",
  components: {},
  props: {
    siteIds: {
      type: Array,
      default: () => {
        return [];
      },
    },
    shopIds: {
      type: Array,
      default: () => {
        return [];
      },
    },
    params: {
      type: Object,
      default: () => ({}),
    },
    siteIdLabelKey: {
      type: String,
      default: () => "nameEn",
    },
    siteIdValueKey: {
      type: String,
      default: () => "gerpId",
    },
    shopIdLabelKey: {
      type: String,
      default: () => "shopName",
    },
    shopIdValueKey: {
      type: String,
      default: () => "shopId",
    },
    allowClear: {
      type: Boolean,
      default: () => false,
    },
  },
  emits: [
    "update:siteIds",
    "change-object-siteId",
    "update:shopIds",
    "change-object-shopId",
  ],
  setup(props, { emit }) {
    const store = useStore();
    const state = reactive({
      siteIds: props.siteIds,
      shopIds: props.shopIds,
    });

    const getSiteId = () => {
      store.dispatch(M_T.GET_SITEID_LIST, props.params.platformCode);
    };

    getSiteId();
    const siteIdList = computed(() => {
      return store.state.common.siteIdList;
    });

    const getShopId = () => {
      store.dispatch(M_T.GET_SHOPID_LIST, props.params.platformCode);
    };

    getShopId();
    const shopIdList = computed(() => {
      return store.state.common.shopIdList;
    });

    watch(
      () => state.shopIds,
      (val) => {
        emit("update:shopIds", val);
      },
      { deep: true }
    );

    watch(
      () => props.shopIds,
      (val) => {
        state.shopIds = val;
      }
    );
    watch(
      () => state.siteIds,
      (val) => {
        emit("update:siteIds", val);
      },
      { deep: true }
    );

    watch(
      () => props.siteIds,
      (val) => {
        state.siteIds = val;
      }
    );

    const handleChangeSiteId = (val) => {
      nextTick(() => {
        emit("change-object-siteId", val);
      });
    };

    const clearSiteId = () => {
      nextTick(() => {
        emit("change-object-siteId", []);
      });
    };

    const removeSiteId = () => {
      nextTick(() => {
        emit("change-object-siteId", state.siteIds);
      });
    };
    const handleChangeShopId = (val) => {
      nextTick(() => {
        emit("change-object-shopId", val);
      });
    };

    const clearShopId = () => {
      nextTick(() => {
        emit("change-object-shopId", []);
      });
    };

    const removeShopId = () => {
      nextTick(() => {
        emit("change-object-shopId", state.shopIds);
      });
    };
    return {
      state,
      siteIdList,
      shopIdList,
      handleChangeSiteId,
      clearSiteId,
      removeSiteId,
      handleChangeShopId,
      clearShopId,
      removeShopId,
    };
  },
});
</script>
<style lang="scss" scoped>
.market-item-box {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  line-height: 1.1;
  .market-inner {
    max-width: 300px;
    overflow: hidden;
    word-wrap: break-word;
    white-space: pre-wrap;
  }
  .country-inner {
    color: var(--color-grey-6);
    margin-left: 8px;
  }
}
</style>
