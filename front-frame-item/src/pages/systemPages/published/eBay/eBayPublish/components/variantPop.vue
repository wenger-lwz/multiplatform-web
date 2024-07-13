<template>
  <!-- 列表变体信息 -->
  <gj-popover
    position="bottom"
    :title="popObj.title"
    @popup-visible-change="popupChangeTable"
    trigger="click"
  >
    <span :class="textClass ? 'title-text' : ''"
      >{{ popObj.btnNmam }}
      <SvgIcon
        svgClass="popclick"
        :class="textClass ? 'title-text' : ''"
        :width="12"
      ></SvgIcon>
    </span>
    <template #content>
      <div class="table-content-pagination">
        <gj-table
          row-key="id"
          :loading="popLoading"
          :scroll="{ y: 'auto' }"
          bordered
          :columns="columnsPop"
          :data-source="tableDataPop"
          :pagination="false"
        />
        <div
          class="paginationBox"
          v-if="hasPagination"
          :class="hasPagination ? 'paginationBox-page' : ''"
        >
          <gj-pagination
            show-total
            show-page-size
            simple
            size="mini"
            :page-size-options="[20, 50, 100, 200, 500]"
            :total="poPpagination.total"
            :current="poPpagination.pageCurrent"
            :page-size="poPpagination.pageSize"
            @change="pageCurrentChange"
          />
        </div>
      </div>
    </template>
  </gj-popover>
</template>

<script>
import { defineComponent, reactive, toRefs } from "vue";
import SvgIcon from "@/components/SvgIcon";
import {
  getVariationLists,
  getdraftVariationLists,
  getEbayGenerallisting,
} from "@api/published/ebay.js";
export default defineComponent({
  name: "",
  components: {
    SvgIcon,
  },
  props: {
    popObj: {
      type: Object,
      default: () => {
        return {
          title: "变体信息",
          btnNmam: "变体",
          type: "btxx",
        };
      },
    },
    popRecord: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  setup(props) {
    const data = reactive({
      tableDataPop: [],
      columnsPop: [],
      textClass: false,
      popLoading: false,
      hasPagination: false,
      poPpagination: {
        //分页
        pageCurrent: 1,
        pageSize: 20,
        total: 0,
      },
    });

    const popupChangeTable = (val) => {
      if (val) {
        data.popLoading = true;
        data.textClass = true;
        if (props.popObj.type == "btxx") {
          getBtxxlist(props.popRecord);
        }
        if (props.popObj.type == "draftbtxx") {
          getdarftBtxxList(props.popRecord);
        }
        if (props.popObj.type == "zxsu") {
          getZxslList(props.popRecord);
        }
      } else {
        data.textClass = false;
      }
    };
    // 商品变体信息
    const getBtxxlist = (row) => {
      getVariationLists(row.id)
        .then((res) => {
          if (res.data?.length > 20) {
            data.hasPagination = true;
            data.poPpagination = {
              //分页
              pageCurrent: 1,
              pageSize: 20,
              total: res.data.length,
            };
          } else {
            data.hasPagination = false;
          }
          if (res.data.length !== 0) {
            let b = res.data[0].skuAttrs;
            let getCol = b.map((item) => {
              return {
                title: item.attrName,
                dataIndex: item.attrName,
              };
            });
            let initcol = [
              {
                title: "建议售价",
                dataIndex: "recommendPrice",
              },
            ];
            data.columnsPop = [...getCol, ...initcol];
            data.tableDataPop = res.data.map((item, index) => {
              let obj = item.skuAttrs;
              let cunt = [];
              Object.keys(obj).forEach((key) => {
                let str = {
                  [obj[key].attrName]: obj[key].attrValue,
                };
                cunt.push(str);
              });

              let tempObj = {};
              cunt.reduce((prev, cur) => {
                Object.assign(prev, cur);
                return prev;
              }, tempObj);
              return {
                ...tempObj,
                recommendPrice: `${item.recommendPrice} ${
                  item.priceUnit ? item.priceUnit : ""
                }`,
                id: index,
              };
            });
          }
        })
        .finally(() => {
          data.popLoading = false;
        });
    };
    // 草稿变体信息
    const getdarftBtxxList = (row) => {
      getdraftVariationLists(row.id)
        .then((res) => {
          if (res.data.length !== 0) {
            data.hasPagination = true;
            data.poPpagination = {
              //分页
              pageCurrent: 1,
              pageSize: 20,
              total: res.data.length,
            };
          } else {
            data.hasPagination = false;
          }

          let b = res.data[0].skuAttrs;
          let getCol = b.map((item) => {
            return {
              title: item.attrName,
              dataIndex: item.attrName,
            };
          });
          let initcol = [
            {
              title: "建议售价",
              dataIndex: "recommendPrice",
            },
          ];
          data.columnsPop = [...getCol, ...initcol];
          data.tableDataPop = res.data.map((item, index) => {
            let obj = item.skuAttrs;
            let cunt = [];
            Object.keys(obj).forEach((key) => {
              let str = {
                [obj[key].attrName]: obj[key].attrValue,
              };
              cunt.push(str);
            });

            let tempObj = {};
            cunt.reduce((prev, cur) => {
              Object.assign(prev, cur);
              return prev;
            }, tempObj);
            return {
              ...tempObj,
              recommendPrice: `${item.recommendPrice} ${
                item.priceUnit ? item.priceUnit : ""
              }`,
              id: index,
            };
          });
        })
        .finally(() => {
          data.popLoading = false;
        });
    };
    // 商品在线数量
    const getZxslList = (row) => {
      let params = {
        pageCurrent: "1",
        pageSize: "20",
        productId: row.id,
        businessType: 1,
      };
      getEbayGenerallisting(params).then((res) => {
        console.log(res, row);
      });
    };
    // 草稿在线数量
    const getdarftZxslList = (row) => {
      getdraftVariationLists().then((res) => {
        console.log(res.data.listingRecord, row);
      });
    };

    const pageCurrentChange = (val) => {
      console.log(val);
    };

    return {
      ...toRefs(data),
      getBtxxlist,
      getZxslList,
      getdarftBtxxList,
      getdarftZxslList,
      popupChangeTable,
      pageCurrentChange,
      getEbayGenerallisting,
    };
  },
});
</script>
<style lang="scss" scoped>
.table-content-pagination {
  max-width: 600px;
  min-width: 320px;
  position: relative;
  :deep(.surely-table) {
    max-height: 300px;
    min-width: 300px;
  }
}
.title-text {
  color: rgb(0, 69, 240);
}
.popclick {
  vertical-align: middle;
}

.paginationBox-page {
  :deep(.surely-table-wrapper) {
    padding-bottom: 45px;
  }
}
.paginationBox {
  display: flex;
  position: absolute;
  justify-content: flex-end;
  align-items: center;
  background-color: #fff;
  right: 10px;
  bottom: 0px;
  z-index: 999;
  right: 0px;
  width: 100%;
  height: 45px;
}
</style>
