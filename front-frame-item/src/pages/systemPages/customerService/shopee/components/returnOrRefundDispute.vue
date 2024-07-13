<template>
  <gj-form
    ref="from"
    :model="createFrom"
    :rules="rules"
    :label-align="'right'"
    :auto-label-width="true"
  >
    <gj-form-item
      label="选择原因"
      :validate-trigger="['change', 'input', 'blur']"
      field="disputeReason"
    >
      <gj-select v-model="createFrom.disputeReason" placeholder="请选择">
        <gj-option
          v-for="item in returnReason"
          :value="item.reason"
          :key="item.reason"
        >
          {{ item.reasonName }}
        </gj-option>
      </gj-select>
    </gj-form-item>
    <gj-form-item
      label="邮箱"
      field="email"
      :validate-trigger="['change', 'input', 'blur']"
    >
      <gj-input
        v-model="createFrom.email"
        placeholder="请输入"
        show-word-limit
        :max-length="200"
      ></gj-input>
    </gj-form-item>

    <gj-form-item label="描述">
      <gj-textarea
        v-model="createFrom.disputeTextReason"
        placeholder="请输入"
        show-word-limit
        :max-length="256"
      />
    </gj-form-item>
    <gj-form-item
      class="imagesContent"
      field="files"
      :validate-trigger="['change', 'input']"
      :label-col-style="{ flex: '0px' }"
    >
      <template #label>
        <span style="text-align: left">上传证据</span>
      </template>
      <div class="imagesContent—wrapper">
        <div>提供证据来帮助解决争议,例如您可以上传产品包装到包裹中的图像</div>
        <gj-upload
          draggable
          action="/"
          tip="最多3个文件，最大文件上传大小: 每张图片10MB /JPG/JPEG/PNG"
          accept="image/jpg,image/jpeg,image/png"
          :fileList="createFrom.files"
          :limit="3"
          :custom-request="customRequest"
          @before-remove="beforeRemove"
        >
        </gj-upload>
      </div>
    </gj-form-item>
  </gj-form>
</template>

<script>
import {
  defineComponent,
  reactive,
  toRefs,
  getCurrentInstance,
  watchEffect,
  onMounted,
} from "vue";
import { setForm } from "@/utils/fnBusiness";
import {
  getShopeeReturnReason,
  getShopeeReturnDisputeUpload,
} from "@/api/customerService/shopee.js";
import { reg } from "@/utils/reg.js";
import { GjMessage } from "@gj/atom";
export default defineComponent({
  components: {},
  props: {
    fromType: {
      type: Number,
      default: () => {
        return 2;
      },
    },
    // 编辑数据
    row: {
      type: Object,
      default: () => {
        return {};
      },
    },
    rulesData: {
      type: String,
      default: () => {
        return "1";
      },
    },
  },
  setup(props) {
    const { proxy } = getCurrentInstance();
    const key = "createFrom";
    // 表单验证部分
    const checkEmail = (value, callback) => {
      if (!value) {
        callback();
      } else if (!reg.email.test(value.trim())) {
        callback("请输入正确的邮箱");
      } else {
        callback();
      }
    };

    const data = reactive({
      returnReason: [], // 标签列表
      // 创建/ 编辑标签
      createFrom: {
        email: null, //邮箱
        disputeTextReason: null, //描述
        disputeReason: null, // 原因
        images: [], //图片
        files: [], //图片
        allocationRule: props.rulesData, // 分配规则 1:按店铺;2:按商品目录3:按消息（23后续迭代）
        erpShopId: props.row.erpShopId,
        returnPlatformOrderId: props.row.returnPlatformOrderId,
      },
      rules: {
        disputeReason: [
          {
            required: true,
            message: "请完成必填项输入",
          },
        ],
        email: [
          { required: true, message: "请完成必填项输入" },
          { validator: checkEmail },
        ],
        files: [
          { required: true, message: "请上传图片证明" },
          {
            validator: (value, callback) => {
              if (!value.length && !data.createFrom.images.length) {
                callback("请上传图片证明");
              } else {
                callback();
              }
            },
          },
        ],
      },
    });

    const submitForm = () => {
      return setForm(proxy, key, data[key], "from");
    };

    const resetForm = () => {
      proxy.$refs["from"].resetFields();
    };
    // 获取退款原因
    const allShopeeReturnReason = () => {
      data.returnReason = [];
      getShopeeReturnReason().then((item) => {
        data.returnReason = item.data;
      });
    };
    // 获取上传图片
    const getImags = () => {};
    const customRequest = (option) => {
      const { fileItem, onError } = option;
      if (fileItem.file.size / 1024 / 1024 > 10) {
        return GjMessage.warning("上传图片大小不能超过 10MB!");
      }
      const formData = new FormData();
      formData.append("files", fileItem.file);
      formData.append("erpShopId", props.row?.erpShopId);
      getShopeeReturnDisputeUpload(formData)
        .then((res) => {
          data.createFrom.files.push({
            url: res.data[0],
            name: fileItem.name,
            uid: fileItem.uid,
          });
          proxy.$refs["from"].validateField("files");
          data.createFrom.images = data.createFrom.files.map(
            (item) => item.url
          );
        })
        .catch(() => {
          onError();
        });
    };
    const beforeRemove = (val) => {
      const uid = data.createFrom.files.findIndex(
        (item) => item.uid === val.uid
      );
      if (uid >= 0) {
        data.createFrom.files.splice(uid, 1);
        data.createFrom.images = data.createFrom.files.map((item) => item.url);
        proxy.$refs["from"].validateField("files");
      }
    };

    onMounted(() => {
      allShopeeReturnReason();
    });

    watchEffect(() => {
      // 新建
      if (props.fromType === 2) {
        data.createFrom.email = null;
        data.createFrom.disputeReason = null;
        data.createFrom.disputeTextReason = null;
        data.createFrom.images = [];
        data.createFrom.files = [];
        data.createFrom.erpShopId = props.row.erpShopId || "";
        data.createFrom.returnPlatformOrderId =
          props.row.returnPlatformOrderId || "";
        data.createFrom.allocationRule = props.rulesData;
      } else {
        // 编辑
        const {
          email,
          disputeReason,
          disputeTextReason,
          allocationRule,
          erpShopId,
          returnPlatformOrderId,
        } = props.row;
        data.createFrom = {
          ...data.createFrom,
          email,
          disputeReason,
          disputeTextReason,
          images: [],
          files: [],
          allocationRule,
          erpShopId,
          returnPlatformOrderId,
        };
      }
    });

    return {
      ...toRefs(data),
      submitForm,
      resetForm,
      getImags,
      customRequest,
      beforeRemove,
    };
  },
});
</script>

<style lang="scss" scoped>
.imagesContent {
  display: flex;
  flex-direction: column;
  .imagesContent—wrapper {
    width: 100%;
  }
}
</style>
