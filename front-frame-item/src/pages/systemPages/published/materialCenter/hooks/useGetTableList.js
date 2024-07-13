import { reactive, toRefs } from "vue";
import request from "@/request";
import { GjMessage } from "@gj/atom";
const prefix =
  process.env.NODE_ENV === "localhost" ? "http://172.30.50.6:8081" : "/media";

export default function useGetTableList(options) {
  const data = reactive({
    method: options.method || "post",
    list: [],
    type: options.type || "table",
    pagination: {
      pageCurrent: 1,
      pageSize: 20,
      ...options.pagination,
    },
    total: 0,
    loading: false,
    searchData: {},
  });

  const paginationChange = (newPagination, searchData) => {
    if (searchData) {
      data.searchData = searchData;
    }
    if (newPagination.pageSize) {
      newPagination.pageCurrent = 1;
    }
    data.pagination = {
      ...data.pagination,
      ...newPagination,
    };
    getTableList(data.searchData);
    // Object.assign(data.pagination, newPagination);
  };

  const getTableList = (params) => {
    if (params) {
      data.searchData = params;
    }
    params = { ...data.pagination, ...params };
    if (data.loading === "start") return;
    data.loading = "start";
    let requestData = {
      method: data.method,
      url: prefix + options.url,
    };
    if (data.method === "get") {
      requestData.params = params;
    }
    if (data.method === "post") {
      requestData.data = params;
    }
    request(requestData)
      .then((res) => {
        if (options.callback) {
          options.callback(res.data.records);
        }
        if (data.type === "table") {
          data.list = res.data.records;
        } else {
          data.list = [...data.list, ...res.data.records];
        }
        data.total = res.data.total;
        data.loading = false;
      })
      .catch((e) => {
        data.loading = false;
        throw new TypeError(e);
      });
  };

  const deleteRow = (request_fn, delList) => {
    if (data.loading === "delete") return;
    data.loading = "delete";
    request_fn(delList)
      .then(() => {
        delList.forEach((id) => {
          for (let i = data.list.length - 1; i >= 0; i--) {
            const item = data.list[i];
            if (item.resourceId === id) {
              data.list.splice(i, 1);
            }
          }
        });
        data.loading = false;
        GjMessage.success("删除成功!");
      })
      .catch((e) => {
        data.loading = false;
        throw new TypeError(e);
      });
  };

  return {
    ...toRefs(data),
    paginationChange,
    getTableList,
    deleteRow,
  };
}
