<template>
  <div>
    <!-- 文字设置 -->
    <div class="text" v-if="type === 'text'">
      <div class="type mb16">
        <SvgIcon svgClass="logo" :width="18" style="margin-right: 8px" />
        <span>文字</span>
      </div>
      <div class="titleAttr">
        <div class="subTitle">标题</div>
        <el-input placeholder="请输入标题" class="mb8" size="small"></el-input>
        <el-button size="small" type="text" class="mb16">高级设置 </el-button>
        <div class="fontStyle">
          <div class="fontWeight">
            <div class="text">字重</div>
            <el-select size="small">
              <el-option></el-option>
              <el-option></el-option>
              <el-option></el-option>
            </el-select>
          </div>
          <div class="fontSize">
            <div class="text">字号</div>
            <el-select size="small">
              <el-option></el-option>
              <el-option></el-option>
              <el-option></el-option>
            </el-select>
          </div>
          <div class="fontColor">
            <div class="text">颜色</div>
            <el-color-picker v-model="color" size="small" style="width: 32px" />
          </div>
          <div class="fontAlign">
            <div class="text">对齐</div>
            <div
              style="
                width: 28px;
                height: 28px;
                display: inline-block;
                background: #ccc;
              "
            ></div>
            <div
              style="
                width: 28px;
                height: 28px;
                display: inline-block;
                background: #ccc;
              "
            ></div>
            <div
              style="
                width: 28px;
                height: 28px;
                display: inline-block;
                background: #ccc;
              "
            ></div>
          </div>
        </div>
      </div>
      <div class="contentAttr">
        <div class="subTitle">正文</div>
        <el-input
          placeholder="请输入标题"
          class="mb8"
          size="small"
          type="textarea"
          :rows="5"
        ></el-input>
        <el-button size="small" type="text" class="mb16">高级设置 </el-button>
        <div class="fontStyle">
          <div class="fontWeight">
            <div class="text">字重</div>
            <el-select size="small">
              <el-option></el-option>
              <el-option></el-option>
              <el-option></el-option>
            </el-select>
          </div>
          <div class="fontSize">
            <div class="text">字号</div>
            <el-select size="small">
              <el-option></el-option>
              <el-option></el-option>
              <el-option></el-option>
            </el-select>
          </div>
          <div class="fontColor">
            <div class="text">颜色</div>
            <el-color-picker v-model="color" size="small" style="width: 32px" />
          </div>
          <div class="fontAlign">
            <div class="text">对齐</div>
            <div
              style="
                width: 28px;
                height: 28px;
                display: inline-block;
                background: #ccc;
              "
            ></div>
            <div
              style="
                width: 28px;
                height: 28px;
                display: inline-block;
                background: #ccc;
              "
            ></div>
            <div
              style="
                width: 28px;
                height: 28px;
                display: inline-block;
                background: #ccc;
              "
            ></div>
          </div>
        </div>
      </div>
    </div>

    <!-- 图片设置 -->
    <div class="image" v-if="type === 'image'">
      <div class="type mb16">
        <SvgIcon svgClass="logo" :width="18" style="margin-right: 8px" />
        <span>图片</span>
      </div>
      <div class="subTitle">
        <span class="tips">上传图片</span> <span class="add">添加</span>
      </div>
      <el-upload
        class="upload-demo"
        drag
        action="https://jsonplaceholder.typicode.com/posts/"
        multiple
        style="width: 268px"
      >
        <div class="uploadCon">
          <div class="title">
            <SvgIcon svgClass="logo" :width="24" style="margin-right: 8px" />
            将文件拖至此处，或者<el-button type="text"> 点击上传</el-button>
          </div>
          <div class="contont">
            图片宽度与高度不能小于260px，支持jpg、
            png格式，单张图片不超过2MB，最多上传10张图片
          </div>
          <div class="tips">只支持“http://”或“https://”开头的地址</div>
        </div>
      </el-upload>
      <div class="list" style="padding: 12px 0">
        <div class="item mb16">
          <SvgIcon svgClass="logo" :width="18" />
          <span class="word">文字</span>
          <span class="num">
            <SvgIcon svgClass="logo" :width="18" />
            <SvgIcon svgClass="logo" :width="18" style="margin-left: 8px" />
          </span>
        </div>
        <div class="item mb16">
          <SvgIcon svgClass="logo" :width="18" />
          <span class="word">文字</span>
          <span class="num">
            <SvgIcon svgClass="logo" :width="18" />
            <SvgIcon svgClass="logo" :width="18" style="margin-left: 8px" />
          </span>
        </div>
        <div class="item mb16">
          <SvgIcon svgClass="logo" :width="18" />
          <span class="word">文字</span>
          <span class="num">
            <SvgIcon svgClass="logo" :width="18" />
            <SvgIcon svgClass="logo" :width="18" style="margin-left: 8px" />
          </span>
        </div>
      </div>
      <div class="check">
        <el-checkbox>去除图片间隙 </el-checkbox>
      </div>
    </div>

    <!-- 视频 -->
    <div class="video" v-if="type === 'video'">
      <div class="type mb16">
        <SvgIcon svgClass="logo" :width="18" style="margin-right: 8px" />
        <span>视频</span>
      </div>
      <div class="subTitle"><span class="tips">上传视频</span></div>
      <el-upload
        class="upload-demo"
        drag
        action="https://jsonplaceholder.typicode.com/posts/"
        multiple
        style="width: 268px"
      >
        <div class="uploadCon">
          <div class="title">
            <SvgIcon svgClass="logo" :width="24" style="margin-right: 8px" />
            将文件拖至此处，或者<el-button type="text"> 点击上传</el-button>
          </div>
          <div class="contont">
            图片宽度与高度不能小于260px，支持jpg、
            png格式，单张图片不超过2MB，最多上传10张图片
          </div>
          <div class="tips">只支持“http://”或“https://”开头的地址</div>
        </div>
      </el-upload>
      <div class="list" style="padding: 12px 0">
        <div class="item mb16">
          <SvgIcon svgClass="logo" :width="18" />
          <span class="word">文字</span>
          <span class="num">
            <SvgIcon svgClass="logo" :width="18" />
            <SvgIcon svgClass="logo" :width="18" style="margin-left: 8px" />
          </span>
        </div>
        <div class="item mb16">
          <SvgIcon svgClass="logo" :width="18" />
          <span class="word">文字</span>
          <span class="num">
            <SvgIcon svgClass="logo" :width="18" />
            <SvgIcon svgClass="logo" :width="18" style="margin-left: 8px" />
          </span>
        </div>
        <div class="item mb16">
          <SvgIcon svgClass="logo" :width="18" />
          <span class="word">文字</span>
          <span class="num">
            <SvgIcon svgClass="logo" :width="18" />
            <SvgIcon svgClass="logo" :width="18" style="margin-left: 8px" />
          </span>
        </div>
      </div>
    </div>

    <!-- 图文 -->
    <div class="textAndImage" v-if="type === 'textAndImage'">
      <div class="type mb16">
        <SvgIcon svgClass="logo" :width="18" style="margin-right: 8px" />
        <span>图片</span>
      </div>
      <div class="titleAttr">
        <div class="subTitle">标题</div>
        <el-input placeholder="请输入标题" class="mb8" size="small"></el-input>
        <el-button size="small" type="text" class="mb16">高级设置 </el-button>
        <div class="fontStyle">
          <div class="fontWeight">
            <div class="text">字重</div>
            <el-select size="small">
              <el-option></el-option>
              <el-option></el-option>
              <el-option></el-option>
            </el-select>
          </div>
          <div class="fontSize">
            <div class="text">字号</div>
            <el-select size="small">
              <el-option></el-option>
              <el-option></el-option>
              <el-option></el-option>
            </el-select>
          </div>
          <div class="fontColor">
            <div class="text">颜色</div>
            <el-color-picker v-model="color" size="small" style="width: 32px" />
          </div>
          <div class="fontAlign">
            <div class="text">对齐</div>
            <div
              style="
                width: 28px;
                height: 28px;
                display: inline-block;
                background: #ccc;
              "
            ></div>
            <div
              style="
                width: 28px;
                height: 28px;
                display: inline-block;
                background: #ccc;
              "
            ></div>
            <div
              style="
                width: 28px;
                height: 28px;
                display: inline-block;
                background: #ccc;
              "
            ></div>
          </div>
        </div>
      </div>
      <div class="contentAttr">
        <div class="subTitle">正文</div>
        <el-input
          placeholder="请输入标题"
          class="mb8"
          size="small"
          type="textarea"
          :rows="5"
        ></el-input>
        <el-button size="small" type="text" class="mb16">高级设置 </el-button>
        <div class="fontStyle">
          <div class="fontWeight">
            <div class="text">字重</div>
            <el-select size="small">
              <el-option></el-option>
              <el-option></el-option>
              <el-option></el-option>
            </el-select>
          </div>
          <div class="fontSize">
            <div class="text">字号</div>
            <el-select size="small">
              <el-option></el-option>
              <el-option></el-option>
              <el-option></el-option>
            </el-select>
          </div>
          <div class="fontColor">
            <div class="text">颜色</div>
            <el-color-picker v-model="color" size="small" style="width: 32px" />
          </div>
          <div class="fontAlign">
            <div class="text">对齐</div>
            <div
              style="
                width: 28px;
                height: 28px;
                display: inline-block;
                background: #ccc;
              "
            ></div>
            <div
              style="
                width: 28px;
                height: 28px;
                display: inline-block;
                background: #ccc;
              "
            ></div>
            <div
              style="
                width: 28px;
                height: 28px;
                display: inline-block;
                background: #ccc;
              "
            ></div>
          </div>
        </div>
      </div>
      <div class="type mb16">
        <SvgIcon svgClass="logo" :width="18" style="margin-right: 8px" />
        <span>图片</span>
      </div>
      <div class="subTitle">
        <span class="tips">上传图片</span> <span class="add">添加</span>
      </div>
      <el-upload
        class="upload-demo"
        drag
        action="https://jsonplaceholder.typicode.com/posts/"
        multiple
        style="width: 268px"
      >
        <div class="uploadCon">
          <div class="title">
            <SvgIcon svgClass="logo" :width="24" style="margin-right: 8px" />
            将文件拖至此处，或者<el-button type="text"> 点击上传</el-button>
          </div>
          <div class="contont">
            图片宽度与高度不能小于260px，支持jpg、
            png格式，单张图片不超过2MB，最多上传10张图片
          </div>
          <div class="tips">只支持“http://”或“https://”开头的地址</div>
        </div>
      </el-upload>
      <div class="list" style="padding: 12px 0">
        <div class="item mb16">
          <SvgIcon svgClass="logo" :width="18" />
          <span class="word">文字</span>
          <span class="num">
            <SvgIcon svgClass="logo" :width="18" />
            <SvgIcon svgClass="logo" :width="18" style="margin-left: 8px" />
          </span>
        </div>
        <div class="item mb16">
          <SvgIcon svgClass="logo" :width="18" />
          <span class="word">文字</span>
          <span class="num">
            <SvgIcon svgClass="logo" :width="18" />
            <SvgIcon svgClass="logo" :width="18" style="margin-left: 8px" />
          </span>
        </div>
        <div class="item mb16">
          <SvgIcon svgClass="logo" :width="18" />
          <span class="word">文字</span>
          <span class="num">
            <SvgIcon svgClass="logo" :width="18" />
            <SvgIcon svgClass="logo" :width="18" style="margin-left: 8px" />
          </span>
        </div>
      </div>
      <div class="check">
        <el-checkbox>去除图片间隙 </el-checkbox>
      </div>
    </div>
  </div>
</template>
<script>
import { defineComponent, reactive, toRefs } from "vue";

export default defineComponent({
  name: "",
  props: {
    type: {
      type: String,
      default: () => {
        return "textAndImage";
      },
    },
  },
  setup(props) {
    const data = reactive({
      type: props.type,
    });
    return {
      ...toRefs(data),
    };
  },
});
</script>
<style scoped lang="scss"></style>
