<!--图文设置-->
<template>
  <div>
    <div class="text">
      <div class="type mb16">
        <SvgIcon svgClass="document" :width="18" style="margin-right: 8px" />
        <span>文字</span>
      </div>
      <div class="titleAttr">
        <div class="subTitle">标题</div>
        <gj-input
          placeholder="请输入标题"
          class="mb8"
          size="small"
          v-model="data.title"
          :style="{ width: '272px' }"
        ></gj-input>
        <gj-button
          size="small"
          type="text"
          class="mb16"
          :style="{ 'margin-top': '12px' }"
          >高级设置
        </gj-button>
        <div class="fontStyle">
          <div class="fontWeight">
            <div class="text">字重</div>
            <gj-select size="small" v-model="data.titleWeight">
              <gj-option :value="400" label="400"></gj-option>
              <gj-option :value="500" label="500"></gj-option>
              <gj-option :value="600" label="600"></gj-option>
              <gj-option :value="700" label="700"></gj-option>
              <gj-option :value="800" label="800"></gj-option>
            </gj-select>
          </div>
          <div class="fontSize">
            <div class="text">字号</div>
            <gj-select size="small" v-model="data.titleSize">
              <gj-option value="12px" label="12px"></gj-option>
              <gj-option value="13px" label="13px"></gj-option>
              <gj-option value="14px" label="14px"></gj-option>
              <gj-option value="16px" label="16px"></gj-option>
              <gj-option value="18px" label="18px"></gj-option>
              <gj-option value="20px" label="20px"></gj-option>
            </gj-select>
          </div>
          <div class="fontColor">
            <div class="text">颜色</div>
            <input type="color" style="width: 32px" v-model="data.titleColor" />
          </div>
          <div class="fontAlign">
            <div class="text">对齐</div>
            <div class="alignGroup">
              <div class="item sp1" @click="setTitleAlign('left')">
                <span class="span1"></span>
                <span class="span2"></span>
                <span class="span3"></span>
              </div>
              <div class="item sp2" @click="setTitleAlign('center')">
                <span class="span1"></span>
                <span class="span2"></span>
                <span class="span3"></span>
              </div>
              <div class="item sp3" @click="setTitleAlign('right')">
                <span class="span1"></span>
                <span class="span2"></span>
                <span class="span3"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="contentAttr">
        <div class="subTitle">正文</div>
        <gj-input
          placeholder="请输入正文"
          class="mb8"
          size="small"
          type="textarea"
          :rows="5"
          :style="{ width: '272px' }"
          v-model="data.content"
        ></gj-input>
        <gj-button
          size="small"
          type="text"
          class="mb16"
          :style="{ 'margin-top': '12px' }"
          >高级设置
        </gj-button>
        <div class="fontStyle">
          <div class="fontWeight">
            <div class="text">字重</div>
            <gj-select size="small" v-model="data.wordWeight">
              <gj-option :value="400" label="400"></gj-option>
              <gj-option :value="500" label="500"></gj-option>
              <gj-option :value="600" label="600"></gj-option>
              <gj-option :value="700" label="700"></gj-option>
              <gj-option :value="800" label="800"></gj-option>
            </gj-select>
          </div>
          <div class="fontSize">
            <div class="text">字号</div>
            <gj-select size="small" v-model="data.wordSize">
              <gj-option value="12px" label="12px"></gj-option>
              <gj-option value="13px" label="13px"></gj-option>
              <gj-option value="14px" label="14px"></gj-option>
              <gj-option value="16px" label="16px"></gj-option>
              <gj-option value="18px" label="18px"></gj-option>
              <gj-option value="20px" label="20px"></gj-option>
            </gj-select>
          </div>
          <div class="fontColor">
            <div class="text">颜色</div>
            <input type="color" style="width: 32px" v-model="data.wordColor" />
          </div>
          <div class="fontAlign">
            <div class="text">对齐</div>
            <div class="alignGroup">
              <div class="item sp1" @click="setWordAlign('left')">
                <span class="span1"></span>
                <span class="span2"></span>
                <span class="span3"></span>
              </div>
              <div class="item sp2" @click="setWordAlign('center')">
                <span class="span1"></span>
                <span class="span2"></span>
                <span class="span3"></span>
              </div>
              <div class="item sp3" @click="setWordAlign('right')">
                <span class="span1"></span>
                <span class="span2"></span>
                <span class="span3"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="image">
      <div class="type mb16">
        <SvgIcon svgClass="imgIcon" :width="18" style="margin-right: 8px" />
        <span>图片</span>
      </div>
      <div class="subTitle">
        <span class="tips">上传图片</span>
      </div>
      <gj-upload
        draggable
        :on-before-upload="beforeAvatarUpload"
        :show-file-list="false"
        :custom-request="customRequest"
      >
        <template #upload-button>
          <div class="upload">
            <div class="top">
              <SvgIcon
                svgClass="uploadIcon2"
                :width="16"
                style="margin-right: 12px"
              />
              <span style="font-size: 12px; color: #666883"
                >将文件拖至此框内，或者点击上传</span
              >
            </div>
          </div>
        </template>
      </gj-upload>
      <div class="list" style="padding: 12px 0; margin-right: 12px">
        <draggable :list="data.imageList">
          <template #item="{ element, index }">
            <div class="item mb16">
              <SvgIcon
                svgClass="drag"
                :width="12"
                style="margin-top: 1px; margin-right: 8px"
              />
              <SvgIcon
                svgClass="imgIcon"
                :width="14"
                style="margin-top: 1px; margin-right: 8px"
              />
              <span class="imgName">{{ element.name }}</span>
              <span class="num">
                <SvgIcon
                  svgClass="linkIcon"
                  :width="14"
                  style="margin-left: 8px"
                />
                <SvgIcon
                  svgClass="closeIcon"
                  :width="16"
                  style="margin-left: 8px"
                  @click="delectImg(index)"
                />
              </span>
            </div>
          </template>
        </draggable>
      </div>
      <div class="check">
        <gj-checkbox v-model="data.clearGap">去除图片间隙 </gj-checkbox>
      </div>
    </div>
  </div>
</template>
<script>
import {
  defineComponent,
  reactive,
  toRefs,
  watch,
  getCurrentInstance,
} from "vue";
import SvgIcon from "@/components/SvgIcon";
import { fileUpload } from "@api/published/aliexpress";
import draggable from "vuedraggable";

export default defineComponent({
  components: {
    SvgIcon,
    draggable,
  },
  name: "",
  props: {
    textImageData: {
      type: Object,
      default: () => {},
    },
  },
  setup(props, { emit }) {
    const { proxy } = getCurrentInstance();
    const data = reactive({
      data: props.textImageData,
      link: "",
      dragging: "",
    });

    const setTitleAlign = (val) => {
      data.data.titleAlign = val;
    };

    const setWordAlign = (val) => {
      data.data.wordAlign = val;
    };
    const beforeAvatarUpload = (file) => {
      const imgType = ["image/png", "image/jpeg", "image/jpg"];
      const isType = imgType.indexOf(file.type) !== -1;
      const isLt2M = file.size / 1024 / 1024 < 2;
      const isLt10 = data.data.imageList.length <= 10;
      if (!isType) {
        proxy.$gjMessage.warning("仅支持jpg、jpeg、png格式的图片！");
      }

      if (!isLt2M) {
        proxy.$gjMessage.warning("图片大小不能超过2MB！");
      }

      if (!isLt10) {
        proxy.$gjMessage.warning("图片最多上传10张！");
      }

      // data.data.imageList.push(file)
      console.log(file);
      return isType && isLt2M && isLt10;
    };

    const delectImg = (index) => {
      emit("delectImg", index);
    };
    const enter = () => {
      console.log(data.link);
    };

    const customRequest = (option) => {
      const { fileItem } = option;
      const formData = new FormData();
      formData.append("file", fileItem.file);
      formData.append("categoryId", 10);
      fileUpload(formData).then((res) => {
        if (res.code === 200) {
          data.data.imageList.push({
            url: res.data.originalUrl,
            name: fileItem.name,
          });
          proxy.$gjMessage.success("上传成功");
        }
      });
    };

    // //使用中模块互换位置
    // const handleDragStart = (item) => {
    //   data.dragging = item
    // }
    // const handleDragEnd = () => {
    //   data.dragging = null
    // }
    // //首先把div变成可以放置的元素，即重写dragenter/dragover
    // const handleDragOver = (e) => {
    //   e.dataTransfer.dropEffect = 'move' // e.dataTransfer.dropEffect="move";//在dragenter中针对放置目标来设置!
    // }
    // const handleDragEnter = (e, item) => {
    //   e.dataTransfer.effectAllowed = 'move' //为需要移动的元素设置dragstart事件
    //   if (item === data.dragging) {
    //     return
    //   }
    //   const newItems = [...data.data.imageList]
    //   console.log(newItems)
    //   const src = newItems.indexOf(data.dragging)
    //   const dst = newItems.indexOf(item)

    //   newItems.splice(dst, 0, ...newItems.splice(src, 1))

    //   data.data.imageList = newItems
    // }
    watch(
      () => props.textImageData,
      (newvalue) => {
        data.data = newvalue;
      }
    );
    return {
      setTitleAlign,
      setWordAlign,
      customRequest,
      beforeAvatarUpload,
      delectImg,
      enter,
      ...toRefs(data),
      // handleDragStart,
      // handleDragEnd,
      // handleDragOver,
      // handleDragEnter,
    };
  },
});
</script>
<style scoped lang="scss">
@import "../template.scss";
.alignGroup {
  display: flex;
  width: 72px;
  height: 20px;
  border: 1px solid #eeeff0;
  border-radius: 2px;
  padding: 2px 0px;
  .item {
    width: 24px;
    height: 20px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    padding: 0 2px;
    .span1 {
      display: block;
      width: 16px;
      height: 2px;
      background: #666;
    }
    .span2 {
      display: block;
      width: 10px;
      height: 2px;
      background: #666;
    }
    .span3 {
      display: block;
      width: 10px;
      height: 2px;
      background: #666;
    }
  }
  .sp1 {
    align-items: start;
  }

  .sp2 {
    align-items: center;
  }
  .sp3 {
    align-items: end;
  }
}
.upload {
  width: 272px;
  min-height: 72px;
  background: #fafafb;
  border: 1px solid #e6e6ed;
  padding-bottom: 14px;
  padding-right: 12px;
  box-sizing: border-box;
  .top {
    display: flex;
    min-height: 16px;
    align-items: center;
    // justify-content: center;
    margin-left: 24px;
    margin-top: 28px;
    margin-bottom: 13px;
    span {
      flex: 1;
    }
  }
}
</style>
