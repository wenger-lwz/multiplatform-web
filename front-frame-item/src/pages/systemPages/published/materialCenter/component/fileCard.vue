<template>
  <div class="upload-list-item">
    <gj-checkbox
      v-if="selection"
      :default-checked="defaultChecked"
      @change="checkboxChange"
    />
    <!-- popup-container="#otherPicturesList" -->
    <gj-popconfirm
      v-if="closableRight"
      type="warning"
      position="bottom"
      content="此操作不可逆，是否删除?"
      @ok="close"
    >
      <div
        tabindex="0"
        class="mask-icon-item mask-icon-item__close closable-right"
      >
        <SvgIcon svgClass="close" :width="16"></SvgIcon>
      </div>
    </gj-popconfirm>
    <div class="picture-mask">
      <div :class="['mask-icon', !fileName && 'file-name-no']">
        <div>
          <div v-if="preview" class="mask-icon-item" @click="imagePreview">
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8.25 6C8.25 5.7694 8.21531 5.5469 8.15086 5.33744C7.97448 5.72811 7.58149 6 7.125 6C6.50368 6 6 5.49632 6 4.875C6 4.41851 6.27189 4.02552 6.66256 3.84914C6.4531 3.78469 6.2306 3.75 6 3.75C4.75736 3.75 3.75 4.75736 3.75 6C3.75 7.24264 4.75736 8.25 6 8.25C7.24264 8.25 8.25 7.24264 8.25 6Z"
                fill="#000430"
                fill-opacity="0.6"
              />
              <path
                d="M6.00041 2.25C2.68884 2.25 0 4.75 0 6C0 7.25 2.68884 9.75 6.00041 9.75C9.31198 9.75 12 7.25 12 6C12 4.75 9.31198 2.25 6.00041 2.25ZM6.00041 3.25C7.40882 3.25 8.70874 3.78506 9.65805 4.46801C10.1312 4.80843 10.4921 5.1678 10.7246 5.48185C10.9644 5.80566 10.9968 5.98262 10.9997 5.99884L11 6L10.9997 6.00116C10.9968 6.01738 10.9644 6.19434 10.7246 6.51815C10.4921 6.8322 10.1312 7.19157 9.65805 7.53199C8.70874 8.21494 7.40882 8.75 6.00041 8.75C4.59199 8.75 3.29184 8.21493 2.34229 7.53194C1.86898 7.1915 1.50807 6.83211 1.27543 6.51805C1.03573 6.19446 1.00327 6.01756 1.00026 6.00118L1 6L1.00026 5.99882C1.00327 5.98244 1.03573 5.80554 1.27543 5.48195C1.50807 5.16789 1.86898 4.8085 2.34229 4.46806C3.29184 3.78507 4.59199 3.25 6.00041 3.25Z"
                fill="#000430"
                fill-opacity="0.6"
              />
            </svg>
          </div>
          <div
            v-if="closable"
            class="mask-icon-item mask-icon-item__close"
            @click="close"
          >
            <SvgIcon svgClass="close" :width="12"></SvgIcon>
          </div>
          <div v-if="editable" class="mask-icon-item">
            <SvgIcon svgClass="editRemark" :width="12"></SvgIcon>
          </div>
          <div
            v-if="showRelatedInformation"
            class="mask-icon-item"
            @click="relatedInfo"
          >
            <SvgIcon svgClass="Union" :width="10"></SvgIcon>
          </div>
        </div>
      </div>
      <div v-if="showSize" class="picture-size">
        {{ file.width || 0 }}*{{ file.height || 0 }}
      </div>
    </div>
    <gj-image
      v-if="type === 'image'"
      :class="!fileName && 'file-name-no'"
      width="118"
      height="118"
      :src="file.url || file.thumbnailUrl"
    />
    <div v-if="fileName" class="list-item-name">
      <gb-text>{{ file.title || file.content || file.name }}</gb-text>
      <gj-trigger
        v-if="labelGroup"
        class="list-item-tags"
        position="right"
        trigger="click"
        :popup-translate="[10, 0]"
        show-arrow
        update-at-scroll
        @popup-visible-change="popupVisibleChange"
      >
        <span class="icon">
          <SvgIcon svgClass="more" :width="12"></SvgIcon>
        </span>
        <template #content>
          <div v-if="tags.length > 0">
            <gj-tag
              v-for="(tag, index) of tags"
              :key="index"
              closable
              @close="tagClose(index)"
            >
              {{ tag.title }}
            </gj-tag>
          </div>
        </template>
      </gj-trigger>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import SvgIcon from "@/components/SvgIcon";
import {
  getLabelByResourceId,
  deleteResourceLabel,
} from "@/api/published/materialCenter";

export default defineComponent({
  components: {
    SvgIcon,
  },
  props: {
    file: {
      type: Object,
      default: () => {},
    },
    type: {
      type: String,
      default: "image",
    },
    defaultChecked: {
      type: Boolean,
      default: false,
    },
    skuIndex: {
      type: Number,
    },
    fileIndex: {
      type: Number,
    },
    selection: {
      type: Boolean,
      default: false,
    },
    closableRight: {
      type: Boolean,
      default: false,
    },
    fileName: {
      type: Boolean,
      default: true,
    },
    labelGroup: {
      type: Boolean,
      default: false,
    },
    showSize: {
      type: Boolean,
      default: false,
    },
    preview: {
      type: Boolean,
      default: true,
    },
    closable: {
      type: Boolean,
      default: true,
    },
    editable: {
      type: Boolean,
      default: false,
    },
    showRelatedInformation: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["select", "preview", "close", "relatedInfo"],
  data() {
    return {
      tags: [],
    };
  },
  methods: {
    checkboxChange(val) {
      this.$emit("select", this.file, val, this.skuIndex, this.fileIndex);
    },
    imagePreview() {
      this.$emit("preview", this.file.url || this.file.originalUrl);
    },
    close() {
      this.$emit("close", this.file, this.fileIndex, this.skuIndex);
    },
    relatedInfo() {
      this.$emit("relatedInfo", this.file);
    },
    popupVisibleChange(val) {
      if (val) {
        getLabelByResourceId(this.file.resourceId).then((res) => {
          this.tags = res.data;
        });
      }
    },
    tagClose(index) {
      deleteResourceLabel({
        resourceId: this.file.resourceId,
        labelId: this.tags[index].id,
      }).then((res) => {
        console.log(res);
      });
    },
  },
});
</script>

<style lang="scss">
.list-item-tags {
  background: #ffffff;
  border-radius: 4px;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.15);
  .arco-trigger-content {
    background-color: var(--color-bg-popup);
    border-radius: 4px;
    > div {
      margin: 10px 5px 10px 10px;
      padding-right: 5px;
      overflow-y: auto;
      width: 108px;
      max-height: 168px;
    }
    .arco-tag {
      position: relative;
      max-width: 100%;
      padding-right: 22px;
      .arco-tag-close-btn {
        position: absolute;
        right: 5px;
        height: 100%;
        .arco-icon {
          vertical-align: -50%;
        }
      }
    }
    .arco-tag + .arco-tag {
      margin-top: 8px;
    }
  }
  .arco-trigger-arrow {
    box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.15);
  }
}
.upload-list-item .arco-image-error {
  border-radius: 8px 8px 0 0;
}
.file-name-no .arco-image-error {
  border-radius: 8px;
}
</style>

<style scoped lang="scss">
.upload-list-item {
  position: relative;
  display: inline-block;
  vertical-align: top;
  box-sizing: border-box;
  width: 120px;
  // height: 144px;
  margin: 6px;
  border: 1px solid #e6e6ed;
  border-radius: 8px;
  cursor: pointer;
  &:hover {
    border: 1px solid #99b5f9;
    .picture-size {
      background: rgba(0, 4, 48, 0.3) !important;
    }
    .mask-icon {
      background-color: rgba(0, 4, 48, 0.3);
      > div {
        display: block !important;
      }
    }
  }
  .closable-right {
    position: absolute;
    top: 4px;
    right: 4px;
    z-index: 5;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0;
  }
  .list-item-name {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 24px;
    padding: 0 4px 0 8px;
    font-size: 12px;
    color: #666883;
    word-break: break-all;
    overflow: hidden;
    .icon {
      width: 15px;
      height: 15px;
      margin-left: 5px;
      border-radius: 50%;
      &:hover {
        background: rgba(0, 69, 240, 0.1);
      }
      .svg-icon {
        width: 15px;
        height: 15px;
      }
    }
  }
  .picture-mask {
    position: absolute;
    z-index: 1;
    display: flex;
    flex-direction: column;
    // display: none;
    width: 118px;
    height: 118px;
    .mask-icon {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 8px 8px 0 0;
      > div {
        display: none;
        width: 60px;
      }
    }
  }
  .picture-size {
    width: 100%;
    height: 18px;
    box-sizing: border-box;
    padding: 0 8px;
    background: rgba(0, 4, 48, 0.2);
    backdrop-filter: blur(4px);
    font-size: 12px;
    line-height: 18px;
    color: #d9d9e0;
  }
}
.mask-icon-item {
  display: inline-block;
  width: 20px;
  height: 20px;
  text-align: center;
  line-height: 20px;
  background: #d9e3fd;
  border-radius: 50%;
  margin: 5px;
  color: #666883;
  &:hover {
    background: #99b5f9;
  }
}
.mask-icon-item__close {
  &:hover {
    background: #ff5c5c;
    color: #fff;
  }
  &:focus {
    background: #ff5c5c;
    color: #fff;
  }
}
::v-deep .arco-image {
  border-radius: 8px 8px 0 0;
}
.file-name-no {
  border-radius: 8px !important;
}
::v-deep .arco-checkbox {
  position: absolute;
  z-index: 5;
  padding: 8px;
}
::v-deep .arco-icon-hover.arco-checkbox-icon-hover::before {
  display: none;
}
</style>
