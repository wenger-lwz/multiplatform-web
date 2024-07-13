<!--文字设置-->
<template>
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
        allow-clear
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
            <gj-option value="10px" label="10px"></gj-option>
            <gj-option value="12px" label="12px"></gj-option>
            <gj-option value="13px" label="13px"></gj-option>
            <gj-option value="14px" label="14px"></gj-option>
            <gj-option value="16px" label="16px"></gj-option>
            <gj-option value="18px" label="18px"></gj-option>
            <gj-option value="20px" label="20px"></gj-option>
            <gj-option value="24px" label="24px"></gj-option>
            <gj-option value="32px" label="32px"></gj-option>
            <gj-option value="48px" label="48px"></gj-option>
          </gj-select>
        </div>
        <div class="fontColor">
          <div class="text">颜色</div>
          <input type="color" style="width: 32px" v-model="data.titleColor" />
        </div>
        <div class="fontAlign">
          <div class="text">对齐</div>
          <div class="alignGroup">
            <div
              class="item sp1"
              @click="setTitleAlign('left')"
              :class="{ active: data.titleAlign == 'left' }"
            >
              <span class="span1"></span>
              <span class="span2"></span>
              <span class="span3"></span>
            </div>
            <div
              class="item sp2"
              @click="setTitleAlign('center')"
              :class="{ active: data.titleAlign == 'center' }"
            >
              <span class="span1"></span>
              <span class="span2"></span>
              <span class="span3"></span>
            </div>
            <div
              class="item sp3"
              @click="setTitleAlign('right')"
              :class="{ active: data.titleAlign == 'right' }"
            >
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
        v-model="data.content"
        :style="{ width: '272px' }"
        allow-clear
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
            <gj-option value="10px" label="10px"></gj-option>
            <gj-option value="12px" label="12px"></gj-option>
            <gj-option value="13px" label="13px"></gj-option>
            <gj-option value="14px" label="14px"></gj-option>
            <gj-option value="16px" label="16px"></gj-option>
            <gj-option value="18px" label="18px"></gj-option>
            <gj-option value="20px" label="20px"></gj-option>
            <gj-option value="24px" label="24px"></gj-option>
            <gj-option value="32px" label="32px"></gj-option>
            <gj-option value="48px" label="48px"></gj-option>
          </gj-select>
        </div>
        <div class="fontColor">
          <div class="text">颜色</div>
          <input type="color" style="width: 32px" v-model="data.wordColor" />
        </div>
        <div class="fontAlign">
          <div class="text">对齐</div>
          <div class="alignGroup">
            <div
              class="item sp1"
              @click="setWordAlign('left')"
              :class="{ active: data.wordAlign == 'left' }"
            >
              <span class="span1"></span>
              <span class="span2"></span>
              <span class="span3"></span>
            </div>
            <div
              class="item sp2"
              @click="setWordAlign('center')"
              :class="{ active: data.wordAlign == 'center' }"
            >
              <span class="span1"></span>
              <span class="span2"></span>
              <span class="span3"></span>
            </div>
            <div
              class="item sp3"
              @click="setWordAlign('right')"
              :class="{ active: data.wordAlign == 'right' }"
            >
              <span class="span1"></span>
              <span class="span2"></span>
              <span class="span3"></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { defineComponent, reactive, toRefs, watch } from "vue";
import SvgIcon from "@/components/SvgIcon";

export default defineComponent({
  components: {
    SvgIcon,
  },
  name: "",
  props: {
    textData: {
      type: Object,
      default: () => {},
    },
  },
  setup(props) {
    const data = reactive({
      data: props.textData,
    });

    const setTitleAlign = (val) => {
      data.data.titleAlign = val;
    };

    const setWordAlign = (val) => {
      data.data.wordAlign = val;
    };
    watch(
      () => props.textData,
      (newvalue) => {
        data.data = newvalue;
      }
    );
    return {
      setTitleAlign,
      setWordAlign,
      ...toRefs(data),
    };
  },
});
</script>
<style scoped lang="scss">
@import "../template.scss";
.text {
  font-size: 12px;
  color: #000430;
}
.alignGroup {
  display: flex;
  width: 72px;
  height: 20px;
  border: 1px solid #eeeff0;
  border-radius: 2px;
  padding: 2px 0px;

  .active {
    background-color: #f2f2f5;
  }
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
</style>
