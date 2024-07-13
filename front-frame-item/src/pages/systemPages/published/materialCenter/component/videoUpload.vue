<template>
  <gj-form ref="formRef" :model="form" layout="vertical" @submit="handleSubmit">
    <gj-form-item>
      <gj-tree-select
        v-if="showTreeSelect"
        v-model="treeSelectValue"
        :fieldNames="{
          key: 'id',
          title: 'name',
        }"
        :data="treeSelectList"
        :disabled="treeSelectDisabled"
        placeholder="请选择上传目录"
        style="width: 300px"
        @change="treeSelectValueChange"
      ></gj-tree-select>
    </gj-form-item>
    <gj-form-item
      field="resourceId"
      label="视频"
      required
      validate-trigger="input"
      :rules="[{ required: true, message: '视频不能为空' }]"
    >
      <gb-upload-video
        :limit="1"
        :start-upload="initiateMultipartUpload"
        :video-upload="videoUpload"
        :end-upload="completeMultipartUpload"
        :videoMax="102400000"
        :code="0"
        @uploadSuccess="uploadSuccess"
        @play="videoPlay"
        @beforeRemove="beforeRemove"
      ></gb-upload-video>
    </gj-form-item>
    <gj-form-item
      field="title"
      label="视频标题"
      :rules="[{ required: true, message: '标题不能为空' }]"
      :validate-trigger="['change', 'input']"
    >
      <gj-input v-model="form.title" placeholder="请输入" />
    </gj-form-item>
    <gj-form-item
      field="coverUrl"
      label="封面图"
      required
      validate-trigger="input"
      :rules="[{ required: true, message: '封面图不能为空' }]"
    >
      <gb-upload-image
        :limitNum="1"
        :uploadData="{
          name: createUuid() + '.jpeg',
        }"
        :code="0"
        :imgExceeding="5"
        :fileListData="fileListData"
        :interfaceMethod="uploadCoverImage_c"
        @onSuccessCallback="onSuccessCallback"
        @onFailedCallback="onFailedCallback"
        @onRemoveImage="onRemoveImage"
      >
      </gb-upload-image>
    </gj-form-item>
    <gj-form-item field="description" label="视频描述">
      <gj-textarea
        v-model="form.description"
        :auto-size="{ minRows: 3 }"
        placeholder="请输入"
      />
    </gj-form-item>
    <gj-form-item row-class="form-footer">
      <div class="form-footer-content">
        <gj-button type="plain" @click="cancel">取消</gj-button>
        <gj-button
          :loading="loading === 'handleSubmit'"
          type="primary"
          html-type="submit"
          >确认</gj-button
        >
      </div>
    </gj-form-item>
  </gj-form>
  <VideoModal
    v-model:visible="videoPlayVisible"
    :src="previewImage"
  ></VideoModal>
</template>

<script>
import { reactive, toRefs, ref } from "vue";
import { getUploadDir, getSkuListBySpu } from "@/api/published/materialCenter";
import { GjMessage } from "@gj/atom";
import { createUuid } from "@/utils/common";
import { saveVideoInfoBind } from "@/api/fileUpload";
import VideoModal from "@/components/VideoModal";

export default {
  components: {
    VideoModal,
  },
  props: {
    showTreeSelect: {
      type: Boolean,
      default: true,
    },
    shopId: {
      type: String,
      default: "",
    },
    sku: {
      type: String,
      default: "",
    },
    skutype: {
      type: String,
      default: "",
    },
    treeSelectDisabled: {
      type: Boolean,
      default: false,
    },
    platform: {
      type: String,
      default: "",
    },
  },
  emits: ["cancel", "confirm"],
  setup(props, { emit }) {
    const formRef = ref(null);
    const data = reactive({
      loading: false,
      treeSelectList: [],
      treeSelectValue: "",
      treeSelectValue_u: "",
      videoData: {},
      // imgUpUrl:
      //   process.env.VUE_APP_PRODUCTION_API +
      //   (props.platform
      //     ? '/listing-common/video/cover-pic'
      //     : '/video/uploadCoverImage'),
      fileListData: [],
      form: {
        resourceId: "",
        title: "",
        coverUrl: "",
        description: "",
      },
      previewImage: "",
      videoPlayVisible: false,
    });

    let videoApi = {};
    if (props.platform) {
      let {
        initiateMultipartUpload,
        videoUpload,
        completeMultipartUpload,
        uploadCoverImage,
        uploadCoverImage_c,
        saveVideoInfo,
      } = require("@/api/modalFileUpload");
      videoApi = {
        initiateMultipartUpload,
        videoUpload,
        completeMultipartUpload,
        uploadCoverImage,
        uploadCoverImage_c,
        saveVideoInfo,
      };
    } else {
      let {
        initiateMultipartUpload,
        videoUpload,
        completeMultipartUpload,
        uploadCoverImage,
        uploadCoverImage_c,
        saveVideoInfo,
      } = require("@/api/fileUpload");
      videoApi = {
        initiateMultipartUpload,
        videoUpload,
        completeMultipartUpload,
        uploadCoverImage,
        uploadCoverImage_c,
        saveVideoInfo,
      };
    }
    const {
      initiateMultipartUpload,
      videoUpload,
      completeMultipartUpload,
      uploadCoverImage,
      uploadCoverImage_c,
      saveVideoInfo,
    } = videoApi;

    // 获取选择目录
    if (props.showTreeSelect) {
      getUploadDir().then((res) => {
        // 如果是spu
        if (props.skutype === "spu") {
          console.log("lo11111111111111");
          console.log(props.skutype);
          getSkuListBySpu({
            spu: props.sku,
          }).then((spuRes) => {
            let skuList = null;
            if (spuRes.data && spuRes.data.length > 0) {
              skuList = spuRes.data.map((item) => {
                return {
                  id: item.sku + "$sku$",
                  name: item.sku,
                };
              });
            }

            res.data[0].children = [
              {
                id: props.sku + "$sku$",
                name: props.sku,
                children: skuList,
              },
            ];
            data.treeSelectValue = props.sku + "$sku$";
            data.treeSelectList = res.data;
            console.log(1111111111, data.treeSelectList);
          });
        } else {
          // 如果是sku
          if (props.sku) {
            res.data[0].children = [
              {
                id: props.sku + "$sku$",
                name: props.sku,
              },
            ];
            data.treeSelectValue = props.sku + "$sku$";
          }
          data.treeSelectList = res.data;
        }
        data.treeSelectValue_u = res.data[0].id;
      });
    }

    const treeSelectValueChange = (val) => {
      if (val.indexOf("$sku$") > 0) {
        data.treeSelectValue_u = data.treeSelectList[0].id;
      } else {
        data.treeSelectValue_u = val;
      }
    };

    // 视频上传成功
    const uploadSuccess = (res) => {
      data.videoData = res;
      data.form.title = res.name;
      if (res.resourceId) {
        data.form.resourceId = res.resourceId;
      } else {
        data.form.resourceId = res.location;
      }
      const name = createUuid() + ".jpeg";
      const file = new File([res.videoImg], name, {
        type: "image/jpeg",
      });
      uploadCoverImage({
        file,
      }).then((imgRes) => {
        data.form.coverUrl = imgRes.data;
        data.fileListData = [
          {
            id: createUuid(),
            name,
            url: imgRes.data,
          },
        ];
        formRef.value.validateField("resourceId");
        formRef.value.validateField("title");
        formRef.value.validateField("coverUrl");
      });
    };
    // 视频播放
    const videoPlay = (file) => {
      data.previewImage = file.originalUrl;
      data.videoPlayVisible = true;
    };
    // 视频删除事件
    const beforeRemove = () => {
      data.form.resourceId = "";
      formRef.value.validateField("resourceId");
    };

    const onFailedCallback = (e) => {
      console.log("接收到错误信息", e);
    };
    // 封面图上传成功
    const onSuccessCallback = (e) => {
      console.log("接收到成功信息", e);
      data.form.coverUrl = e;
      formRef.value.validateField("coverUrl");
    };

    // 封面图删除
    const onRemoveImage = () => {
      data.form.coverUrl = "";
      formRef.value.validateField("coverUrl");
    };

    // 取消按钮
    const cancel = () => {
      emit("cancel", false);
    };

    // 确认按钮
    const handleSubmit = async ({ errors }) => {
      if (!errors && data.loading !== "handleSubmit") {
        data.loading = "handleSubmit";
        let uploadData = props.platform
          ? {
              coverUrl: data.form.coverUrl,
              description: data.form.description,
              fileName: data.videoData.name,
              platformCode: props.platform,
              shopId: props.shopId,
              title: data.form.title,
              videoUrl: data.videoData.location,
            }
          : data.form;
        saveVideoInfo(uploadData)
          .then((res) => {
            if (props.showTreeSelect) {
              if (data.treeSelectValue_u === data.treeSelectList[0].id) {
                GjMessage.success("添加成功!");
                emit("confirm", res.data);
              } else {
                saveVideoInfoBind({
                  type: props.skutype,
                  sku: props.sku,
                  resourceIds: [data.form.resourceId],
                }).then(() => {
                  GjMessage.success("添加成功!");
                  emit("confirm", res.data);
                });
              }
            } else {
              GjMessage.success("添加成功!");
              emit("confirm", res.data);
            }
            data.loading = false;
          })
          .catch(() => {
            data.loading = false;
          });
      }
    };

    return {
      ...toRefs(data),
      formRef,
      createUuid,
      initiateMultipartUpload,
      treeSelectValueChange,
      videoUpload,
      completeMultipartUpload,
      uploadSuccess,
      videoPlay,
      beforeRemove,
      uploadCoverImage_c,
      onSuccessCallback,
      onFailedCallback,
      onRemoveImage,
      cancel,
      handleSubmit,
    };
  },
};
</script>
<style lang="scss" scoped>
.form-footer {
  border-top: 1px solid #e6e6ed;
}
.form-footer-content {
  width: 100%;
  text-align: right;
  .arco-btn {
    margin-left: 10px;
  }
}
</style>
