<template>
  <div class="basic-info" id="basicInfo-lz">
    <h2 class="title">搜索引擎优化（SEO）</h2>
    <gj-form
      ref="searchEngineOptRef"
      :model="searchEngineOpt"
      class="basic-info-form"
      :label-col-props="{ span: 24 }"
      :wrapper-col-props="{ span: 24 }"
    >
      <gj-row :gutter="24">
        <gj-col :span="24">
          <gj-form-item
            :label-col-style="{ 'justify-content': 'flex-start' }"
            field="titleDesc"
            label="产品标题"
          >
            <gj-input
              v-model="searchEngineOpt.titleDesc"
              :max-length="70"
              placeholder="请输入"
              allow-clear
              show-word-limit
            />
          </gj-form-item>
          <gj-form-item
            :label-col-style="{ 'justify-content': 'flex-start' }"
            field="sourceDesc"
            label="元描述"
          >
            <gj-textarea
              style="height: 64px"
              v-model="searchEngineOpt.sourceTitleDesc"
              :max-length="320"
              placeholder="请输入"
              auto-size
              allow-clear
              show-word-limit
            />
          </gj-form-item>
          <gj-form-item
            v-if="detailType === 'draft'"
            :label-col-style="{ 'justify-content': 'flex-start' }"
            field="url"
            label="URL"
          >
            <gj-input
              placeholder="请输入"
              v-model="searchEngineOpt.url"
              allow-clear
            >
              <template #prepend>
                {{ searchEnginePrefix }}
              </template>
              <template #append>
                <gj-button type="text" size="mini" @click="copyURL"
                  >复制</gj-button
                >
              </template>
            </gj-input>
          </gj-form-item>
        </gj-col>
      </gj-row>
    </gj-form>
  </div>
</template>

<script>
import {
  defineComponent,
  getCurrentInstance,
  reactive,
  toRefs,
  watch,
  inject,
} from "vue";
import { useStore } from "vuex";
import { setForm2 } from "@/utils/fnBusiness";
import { M_T } from "@/store/mutationsTypes";
import { copy } from "@common";
import { getSearchEnginePrefix } from "@/api/published/shopify";

export default defineComponent({
  name: "ShopifySearchEngineOpt",
  components: {},
  props: {
    detailType: {
      type: String,
      default: "product",
    },
  },
  setup(props) {
    const $store = useStore();
    const { proxy } = getCurrentInstance();
    const key = "searchEngineOpt";
    const data = reactive({
      [key]: {
        titleDesc: "",
        sourceTitleDesc: "",
        url: "",
      },
      searchEnginePrefix: "-",
    });

    if (props.detailType === "draft") {
      const shopId = inject("shopId");
      watch(
        () => shopId.value,
        (newShopId) => {
          if (!newShopId) {
            data.searchEnginePrefix = "-";
          } else {
            getSearchEnginePrefix({
              shopId: newShopId,
            })
              .then((res) => {
                data.searchEnginePrefix = res.data;
              })
              .catch(() => {
                data.searchEnginePrefix = "-";
              });
          }
        }
      );
    }

    watch(
      () => data[key],
      () => {
        const params = {
          [key]: data[key],
        };
        $store.dispatch(M_T.PARAMS_QUERY, params);
      },
      {
        deep: true,
      }
    );

    const copyURL = () => {
      const url = data[key].url;
      if (url) {
        copy(url);
      }
    };

    const submitForm = () => {
      return setForm2(proxy, key, data[key], "searchEngineOpt");
    };

    const validate = () => {
      return proxy.$refs.searchEngineOpt.validate();
    };

    const resetFields = () => {
      proxy.$refs.searchEngineOpt.resetFields();
    };

    const setPageData = (aData) => {
      data[key].titleDesc = aData.searchEngineTitle;
      data[key].sourceTitleDesc = aData.searchEngineDesc;
      data[key].url = aData.searchEngineUrl;
    };

    return {
      ...toRefs(data),
      validate,
      resetFields,
      submitForm,
      setPageData,
      copyURL,
    };
  },
});
</script>
