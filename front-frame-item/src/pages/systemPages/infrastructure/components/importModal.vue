<template>
  <gb-import
    v-model:visible="importVisible"
    :title="importType === 1 ? '导入标签' : '导入更新标签'"
    :code="0"
    :data="datas"
    :render-to-body="false"
    :custom-request="customRequest"
    :import-failed-request="importFailedRequest"
    @success="success"
    @error="error"
    @download-template-excel="downloadTemplateExcel"
    @download-failed-excel="downloadFailedExcel"
  />
</template>

<script>
import request from "@/request/index";
import { downFile, downUrlFile } from "@/utils/format";
import { downModule } from "@/api/labelManagement";
import { defineComponent, reactive, toRefs, watchEffect } from "vue";
export default defineComponent({
  props: {
    // 值说明： 1.导入标签、2.导入更新标签
    importType: {
      type: Number,
      default: () => {
        return 1;
      },
    },
  },
  setup(props) {
    const data = reactive({
      modulePrefix: process.env.NODE_ENV === "localhost" ? "" : "/listing",
      importVisible: false,
      datas: {
        operType: 1,
      },
    });
    const customRequest = async (formData) => {
      const action = data.modulePrefix + "/general/labelInfo/import";
      return request({
        method: "post",
        url: action,
        data: formData,
      });
    };

    const importFailedRequest = (url, options) => {
      return request({
        method: "get",
        url: data.modulePrefix + url,
        params: options,
      });
    };

    // 下载模板
    const downloadTemplateExcel = async () => {
      const res = await downModule();
      downFile(res, "导入模板");
    };

    // 下载失败列表
    const downloadFailedExcel = (failedURL) => {
      downUrlFile(failedURL);
    };

    const success = (fileItem) => {
      console.log("success", fileItem);
    };

    const error = (fileItem) => {
      console.log("error", fileItem);
    };

    watchEffect(() => {
      if (data.importVisible) {
        data.datas.operType = props.importType;
      }
    });

    return {
      ...toRefs(data),
      success,
      error,
      importFailedRequest,
      customRequest,
      downloadTemplateExcel,
      downloadFailedExcel,
      downFile,
      downUrlFile,
    };
  },
});
</script>

<style></style>
