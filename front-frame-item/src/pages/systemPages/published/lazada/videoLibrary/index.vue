<template>
  <CommonPage :pageRest="true" @common-page-rest="resetHandler">
    <template #tag-content>
      <TagGroup v-model:list="searchActive" @tag-change="changeFilterSelect" />
    </template>
    <template #filter-content>
      <SelectCondition
        ref="normalFilterRef"
        :titleListOpt="titleListOpt4"
        :showItem="['shopId', 'keyWord', 'videoStatus']"
        @filter-change="filterChange"
        @tag-change="changeList"
      />
    </template>
    <template #operate_bar-content>
      <OperateBar>
        <template #left>
          <gj-button type="primary" @click="uploadVideo">上传视频</gj-button>
          <p class="selection-length">
            已选
            <span>{{ hasSelectLen }}</span>
          </p>
        </template>
      </OperateBar>
    </template>
    <template #table-content>
      <ListPageTable
        ref="pageTableRef"
        :colunms="tableColumns"
        :requestApi="getVideoList"
        v-model:selectRow="selectRow"
      ></ListPageTable>

      <create-upload
        v-if="addVisible"
        :dialogVisible="addVisible"
        :rowData="rowData"
        @tableUplod="tableUplod"
        @cancel="addVisible = false"
      ></create-upload>

      <details-view
        v-if="detailsVisible"
        :dialogVisible="detailsVisible"
        :videoId="videoId"
        @cancel="detailsVisible = false"
      ></details-view>
    </template>
  </CommonPage>
</template>

<script>
import {
  defineComponent,
  computed,
  reactive,
  toRefs,
  ref,
  resolveComponent,
  watch,
} from "vue";
import _ from "lodash";
import { GjMessage } from "@gj/atom";
import {
  specificationList,
  timeOpt2,
  titleListOpt4,
  videoStatusListOpt,
} from "@pagesSystem/published/lazada/config";
import { useChangeList } from "@pagesSystem/published/lazada/hooks";
import { getVideoList, pullVideo } from "@/api/published/lazada";

import { emptyFilter, formatDateTime, emptyValue } from "@/utils/format";

import CommonPage from "@/components/CommonPage.vue";
import TagGroup from "@/components/TagGroup.vue";
import OperateBar from "@/components/OperateBar.vue";
import columnCopy from "@/components/columnCopy.vue";
import SelectCondition from "@pagesSystem/published/lazada/components/common/SelectCondition.vue";
import ListPageTable from "@pagesSystem/published/lazada/components/common/ListPageTable.vue";
import createUpload from "@pagesSystem/published/lazada/components/videoLibrary/createUpload.vue";
import detailsView from "@pagesSystem/published/lazada/components/videoLibrary/details.vue";

export default defineComponent({
  name: "LZD_PubLazadaVideoLibrary",
  components: {
    CommonPage,
    TagGroup,
    OperateBar,
    /* eslint-disable */
    columnCopy,
    /* eslint-enable */
    SelectCondition,
    ListPageTable,
    createUpload,
    detailsView,
  },
  setup() {
    const data = reactive({
      searchActive: [],
      selectRow: [],
      rowData: {},
      addVisible: false,
      detailsVisible: false,
      syncVisibleRow: {},
      videoId: "",
    });
    const normalFilterRef = ref();
    const pageTableRef = ref();
    const hasSelectLen = computed(() => data.selectRow.length);

    const GbImage = resolveComponent("GbImage");
    const GbText = resolveComponent("GbText");
    const GjButton = resolveComponent("GjButton");
    const GjPopconfirm = resolveComponent("GjPopconfirm");

    const getData = (filterData) => {
      const keyMap = {
        1: "title",
        2: "videoId",
      };
      const parmasObj = {
        shopIds: filterData.shopId,
        [keyMap[filterData.keyWordType]]: filterData.keyWord,
        platformState: filterData.videoStatus,
      };
      pageTableRef.value?.getTableData(parmasObj, true);
    };
    const filterChange = _.debounce(getData, 200);

    const tableColumns = [
      {
        title: "视频",
        dataIndex: "coverUrl",
        fixed: "left",
        width: 120,
        customRender: ({ record }) => (
          <GbImage
            src={record.coverUrl}
            popover-src={record.coverUrl}
            size="36"
          ></GbImage>
        ),
      },
      {
        title: "标题/ID",
        dataIndex: "title",
        minWidth: 180,
        fixed: "left",
        customRender: ({ record }) => {
          const copyNode = record.videoId ? (
            <columnCopy isAnchor={false} textValue={record.videoId} />
          ) : (
            <span>{emptyValue}</span>
          );
          return (
            <div>
              <GbText>{emptyFilter(record.title)}</GbText>
              <div>{copyNode}</div>
            </div>
          );
        },
      },
      {
        title: "店铺",
        dataIndex: "shopName",
        minWidth: 150,
        resizable: true,
        customRender: ({ record }) => {
          return <span>{emptyFilter(record.shopName)}</span>;
        },
      },
      {
        title: "状态",
        dataIndex: "platformState",
        minWidth: 140,
        customRender: ({ record }) => {
          const target = videoStatusListOpt.find(
            (item) => item.value === record.platformState
          );
          return <span>{emptyFilter(target?.label)}</span>;
        },
      },
      {
        title: "上传时间",
        dataIndex: "uploadTime",
        minWidth: 160,
        customRender: ({ record }) => (
          <GbText>{formatDateTime(record.uploadTime)}</GbText>
        ),
      },
      {
        title: "操作",
        dataIndex: "action",
        fixed: "right",
        width: 130,
        customRender: ({ record }) => {
          return (
            <div>
              <GjButton
                type="text"
                size="small"
                onClick={() => detailsViewFun(record)}
              >
                详情
              </GjButton>
              <GjPopconfirm
                content="即将同步，是否确认?"
                popupVisible={data.syncVisibleRow[record.id]}
                onOk={() => handleOk(record)}
                onCancel={handleCancel}
              >
                <GjButton
                  type="text"
                  size="small"
                  onClick={() => {
                    data.syncVisibleRow[record.id] = true;
                  }}
                >
                  同步
                </GjButton>
              </GjPopconfirm>
            </div>
          );
        },
      },
    ];

    const uploadVideo = () => {
      data.addVisible = true;
    };

    const detailsViewFun = (val) => {
      data.videoId = val.videoId;
      data.detailsVisible = true;
    };

    const handleCancel = () => {
      data.syncVisibleRow = {};
    };

    const handleOk = (record) => {
      data.syncVisibleRow = {};
      let params = {
        shopId: record.shopId,
        videoId: record.videoId,
      };
      pullVideo(params).then(() => {
        GjMessage.success("同步任务已提交，请稍后查看！");
      });
      // .catch(() => {
      //   GjMessage.error("同布任务提交失败，请重试！");
      // });
    };

    const tableUplod = () => {
      data.addVisible = false;
      pageTableRef.value?.getTableData(null, true);
    };

    /**
     * tag
     */
    const resetHandler = () => {
      data.detailsVisible = false;
      data.addVisible = false;
      data.syncVisibleRow = {};
      normalFilterRef.value?.resetHandler();
      pageTableRef.value?.resetTableField();
    };
    const changeFilterSelect = (id) => {
      normalFilterRef.value?.changeFilterCondition(id);
    };

    /**
     * select
     */
    const changeList = (target) => {
      data.searchActive = useChangeList(target, data.searchActive);
    };

    const onRecalculateWh = () => {
      const fn = pageTableRef.value?.commonTableRef?.calculateWH;
      fn && fn();
    };

    watch(
      () => data.searchActive.length,
      () => {
        onRecalculateWh();
      }
    );

    return {
      ...toRefs(data),
      specificationList,
      timeOpt2,
      titleListOpt4,
      getVideoList,
      normalFilterRef,
      pageTableRef,
      hasSelectLen,
      tableColumns,
      filterChange,
      uploadVideo,
      tableUplod,
      resetHandler,
      changeFilterSelect,
      changeList,
    };
  },
});
</script>

<style lang="scss" scoped>
.selection-length {
  color: #86909c;
  font-size: 12px;
  font-weight: 400;
  span {
    color: #0045f0;
  }
}
</style>
