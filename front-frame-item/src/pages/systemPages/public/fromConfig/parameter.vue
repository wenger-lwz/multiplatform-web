<template>
  <div style="background: #f2f3f5">
    <div class="processAction">
      <div class="actionTop">
        <SvgIcon :svgClass="data.parameterData.svgClass" :width="14" />
        <span class="title">{{ data.parameterData.name }}</span>
        <el-button class="mediumBtn" @click="reset">重置</el-button>
      </div>
      <div class="wrapTip" v-show="hasPermission('tips')">
        <div class="tipCell">
          <span class="circle"></span>
          <span
            >最多支持15位数字。如需要用作“
            身份证号码”填写，请选用“单行文字”。</span
          >
        </div>
        <div class="tipCell">
          <span class="circle"></span>
          <span>无法填写“0”开头的数字。</span>
        </div>
      </div>
      <el-form :model="data.parameterData" class="actionForm">
        <el-form-item label="标题">
          <el-input
            v-model="data.parameterData.name"
            size="small"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item label="提示">
          <el-input
            v-model="data.parameterData.placeholder"
            size="small"
            placeholder="请输入提示"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="显示格式"
          class="dataCell"
          v-show="hasPermission('showType')"
        >
          <el-select
            v-model="data.parameterData.showType"
            size="small"
            placeholder="请选择"
          >
            <el-option
              v-for="item in data.parameterData.option"
              :key="item.value"
              :value="item.value"
              >{{ item.label }}</el-option
            >
          </el-select>
        </el-form-item>
        <el-form-item
          label="上传文件最大体积"
          v-show="hasPermission('limitSize')"
        >
          <el-input
            class="wrapCell mt0"
            v-model="data.parameterData.limitSize"
            size="small"
            placeholder="请输入"
          >
            <template #append>MB</template>
          </el-input>
        </el-form-item>
        <el-form-item
          label="地址精度"
          class="casCell"
          v-show="hasPermission('adressType')"
        >
          <el-select
            v-model="data.parameterData.adressType"
            size="small"
            placeholder="请选择"
          >
            <el-option value="1">省/地区、市、区/县、详细地址</el-option>
            <el-option value="2">国家、省/地区、市、区/县、详细地址</el-option>
          </el-select>
        </el-form-item>
        <!-- 选项内容 -->
        <el-form-item label="选项内容" v-show="hasPermission('selectContent')">
          <div class="wrapCell">
            <div v-for="item in data.parameterData.option" :key="item.value">
              <el-input class="wrapCell" v-model="item.value" size="small">
                <template #append>
                  <SvgIcon svgClass="deletebtn" class="delIcon" :width="14" />
                  <SvgIcon svgClass="removebtn" :width="14" />
                </template>
              </el-input>
            </div>
            <el-button
              size="small"
              class="defaultBtn mediumBtn addActionBtn mt0"
              @click="addNewContent"
            >
              <SvgIcon svgClass="add" :width="14" />
              添加新选项
            </el-button>
          </div>
        </el-form-item>
        <el-form-item label="选项内容" v-show="hasPermission('uploadContent')">
          <div class="wrapCell">
            <div
              class="imgCell"
              v-for="item in data.parameterData.option"
              :key="item.value"
            >
              <div class="imgCheck">
                <el-checkbox v-model="item.checked" size="small" />
                <el-upload
                  action="https://jsonplaceholder.typicode.com/posts/"
                  list-type="picture-card"
                  :on-remove="handleRemove"
                  style="picCard"
                >
                  <el-icon><plus /></el-icon>
                </el-upload>
              </div>
              <el-input
                class="wrapInput"
                v-model="item.value"
                size="small"
                placeholder=""
              >
                <template #append>
                  <SvgIcon
                    svgClass="deletebtn"
                    class="delIcon"
                    @click="svgClick"
                    :width="14"
                  />
                  <SvgIcon svgClass="removebtn" :width="14" />
                </template>
              </el-input>
            </div>
          </div>
          <el-button
            size="small"
            class="defaultBtn mediumBtn addActionBtn"
            @click="addNewContent"
          >
            <SvgIcon svgClass="add" :width="14" />
            添加新选项
          </el-button>
        </el-form-item>
        <el-form-item
          label=""
          class="mt0"
          v-show="hasPermission('multiSelect')"
        >
          <el-checkbox
            v-model="data.parameterData.multiSelect"
            label="多选"
            size="small"
          ></el-checkbox>
        </el-form-item>
        <!-- 默认内容 -->
        <el-form-item
          label="默认内容"
          class="dataCell"
          v-show="hasPermission('dateRangeValue')"
        >
          <el-date-picker
            v-model="data.parameterData.value"
            :type="data.parameterData.showType"
            size="small"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item
          label="默认内容"
          class="dataCell"
          v-show="hasPermission('dateTimeValue')"
        >
          <el-date-picker
            v-model="data.parameterData.value"
            :type="data.parameterData.showType"
            size="small"
            placeholder="年-月-日"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="默认内容" v-show="hasPermission('value')">
          <el-input
            v-model="data.parameterData.value"
            size="small"
            placeholder="请输入默认内容"
          ></el-input>
        </el-form-item>
        <el-form-item label="默认内容" v-show="hasPermission('mulValue')">
          <el-input
            class="wrapCell"
            :rows="4"
            type="textarea"
            v-model="data.parameterData.value"
            size="small"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="默认内容"
          class="selCell"
          v-show="hasPermission('selectValue')"
        >
          <el-select
            v-model="data.parameterData.value"
            :multiple="data.parameterData.multiple"
            collapse-tags
            size="small"
            placeholder="请选择"
          >
            <el-option
              v-for="item in data.parameterData.option"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="默认内容"
          class="casCell"
          v-show="hasPermission('adressValue')"
        >
          <div>
            <el-cascader
              size="small"
              v-model="data.parameterData.value"
              placeholder="省/地区、市、区/县、详细地址"
              :options="data.parameterData.option"
              clearable
            />
          </div>
          <el-input
            class="wrapCell"
            :rows="4"
            type="textarea"
            v-model="data.parameterData.detailAdress"
            size="small"
            placeholder="请输入详细地址"
          ></el-input>
        </el-form-item>
        <el-form-item label="默认内容" v-show="hasPermission('uploadValue')">
          <div class="wrapCell mt0">
            <el-upload
              class="upload-demo"
              action="https://jsonplaceholder.typicode.com/posts/"
              :on-remove="handleRemove"
              :before-remove="beforeRemove"
              multiple
              :limit="3"
              :on-exceed="handleExceed"
              :file-list="fileList"
            >
              <el-button size="small" class="defaultBtn mediumBtn addActionBtn">
                <SvgIcon svgClass="uploadbtn" style="color: #666" :width="14" />
                上传附件
              </el-button>
            </el-upload>
            <div
              class="uploadText"
              v-for="item in data.parameterData.option"
              :key="item"
            >
              <span>{{ item.name }}</span>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="排布方式" v-show="hasPermission('layout')">
          <el-radio-group v-model="data.parameterData.layout">
            <el-radio label="1" size="small">横向排布</el-radio>
            <el-radio label="2" size="small">竖向排布</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- 必填选择 -->
        <el-form-item label="" v-show="hasPermission('required')">
          <el-checkbox
            v-model="data.parameterData.required"
            label="必填项"
            size="small"
          ></el-checkbox>
        </el-form-item>
        <el-form-item label="" v-show="hasPermission('autoZip')">
          <el-checkbox
            v-model="data.parameterData.autoZip"
            label="自动压缩图片"
            size="small"
          ></el-checkbox>
        </el-form-item>
        <el-form-item label="" v-show="hasPermission('limitNumber')">
          <el-checkbox
            v-model="data.parameterData.limitNumber"
            label="限制字数"
            size="small"
          ></el-checkbox>
          <div class="limitContent" v-show="data.parameterData.limitNumber">
            <el-input-number
              class="limitCell"
              v-model="data.parameterData.min"
              :step="1"
              :step-strictly="true"
              :min="0"
              controls-position="right"
              size="small"
              placeholder="最小值"
            />
            <span style="margin: 0 5px">~</span>
            <el-input-number
              class="limitCell"
              v-model="data.parameterData.max"
              :step="1"
              :step-strictly="true"
              :min="0"
              controls-position="right"
              size="small"
              placeholder="最小值"
            />
          </div>
        </el-form-item>

        <el-form-item label="" v-show="hasPermission('limitDot')">
          <el-checkbox
            v-model="data.parameterData.limitDot"
            label="限制允许小数"
            size="small"
          ></el-checkbox>
          <div class="wrapCell" v-show="data.parameterData.limitDot">
            <span>限制</span>
            <el-input
              class="limitCell"
              v-model="data.parameterData.limitDotquality"
              size="small"
              placeholder=""
            ></el-input>
            <span>位</span>
          </div>
        </el-form-item>

        <el-form-item label="" v-show="hasPermission('limitRange')">
          <el-checkbox
            v-model="data.parameterData.limitRange"
            label="限制数字范围"
            size="mini"
          ></el-checkbox>
          <div class="wrapCell" v-show="data.parameterData.limitRange">
            <el-input
              class="limitCell rengCell"
              v-model="data.parameterData.min"
              size="small"
              placeholder="最小值"
            ></el-input>
            <span>~</span>
            <el-input
              class="limitCell"
              v-model="data.parameterData.max"
              size="small"
              placeholder="最大值"
            ></el-input>
          </div>
        </el-form-item>

        <el-form-item label="" v-show="hasPermission('limitSelect')">
          <el-checkbox
            v-model="data.parameterData.limitSelect"
            label="限制选项"
            size="mini"
          ></el-checkbox>
          <div class="wrapCell" v-show="data.parameterData.limitSelect">
            <el-input
              class="limitCell rengCell"
              v-model="data.parameterData.min"
              size="small"
            ></el-input>
            <span>~</span>
            <el-input
              class="limitCell"
              v-model="data.parameterData.max"
              size="small"
              placeholder="不限"
            ></el-input>
          </div>
        </el-form-item>

        <el-form-item label="" v-show="hasPermission('limitFileNum')">
          <el-checkbox
            v-model="data.parameterData.limitFileNum"
            label="限制文件个数"
            size="mini"
          ></el-checkbox>
          <el-input
            v-show="data.parameterData.limitFileNum"
            class="wrapCell"
            v-model="data.parameterData.limitNum"
            size="small"
          ></el-input>
        </el-form-item>

        <el-form-item label="" v-show="hasPermission('limitUnit')">
          <el-checkbox
            v-model="data.parameterData.limitUnit"
            label="显示金额"
            size="mini"
          ></el-checkbox>
          <el-select
            class="selCell"
            v-show="data.parameterData.limitUnit"
            v-model="data.parameterData.limitUnits"
            size="small"
            placeholder="Y人名币"
          >
            <el-option
              v-for="item in data.parameterData.option"
              :key="item.value"
              :value="item.value"
              :label="item.label"
            >
              {{ item.label }}
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="" v-show="hasPermission('limitType')">
          <el-checkbox
            v-model="data.parameterData.limitType"
            label="限制文件类型"
            size="mini"
          ></el-checkbox>
          <div class="checkCell" v-show="data.parameterData.limitType">
            <div
              v-for="(item, index) in data.parameterData.option"
              :key="index"
            >
              <el-checkbox
                class="checkItem"
                size="mini"
                v-model="item.checked"
                :label="item.label"
              />
              <el-input
                v-show="item.value === '3' && item.checked"
                class="wrapCell"
                :rows="4"
                type="textarea"
                v-model="data.parameterData.limitTypeStr"
                size="small"
                placeholder="请输入自定义扩展名，多个请用逗号隔 开，如：txt，pdf，mp3等"
              ></el-input>
            </div>
          </div>
        </el-form-item>
      </el-form>
    </div>
    <div></div>
  </div>
</template>

<script>
import { defineComponent, reactive, watch } from "vue";
import SvgIcon from "@/components/SvgIcon.vue";
export default defineComponent({
  name: "parameter",
  components: {
    SvgIcon,
  },
  props: {
    parameterData: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  setup(props, { emit }) {
    const data = reactive({
      parameterData: props.parameterData,
    });
    const svgClick = () => {
      console.log(123);
    };
    const hasPermission = (key) => {
      console.log(key);
      return data.parameterData.permission.indexOf(key) > -1 ? true : false;
    };
    const reset = () => {
      emit("resetData", data.parameterData.type);
    };
    const addNewContent = () => {
      console.log(data);
    };
    watch(
      () => props.parameterData,
      () => {
        data.parameterData = props.parameterData;
      }
    );
    return {
      data,
      svgClick,
      hasPermission,
      reset,
      addNewContent,
    };
  },
});
</script>

<style lang="scss" scoped>
.processAction {
  background: #fff;
  .actionTop {
    padding-bottom: 16px;
    display: flex;
    align-items: center;
    color: #333333;
    .title {
      width: 160px;
      font-size: 14px;
      font-weight: 700;
      padding-left: 10px;
    }
  }
  .wrapTip {
    background: #eef3fb;
    border-radius: 4px;
    padding: 16px 0 10px 16px;
    .tipCell {
      display: flex;
      color: #666;
      .circle {
        width: 8px;
        height: 8px;
        background: #d8dadd;
        border-radius: 8px;
        margin-right: 10px;
        margin-top: 5px;
      }
      span {
        width: 240px;
        font-size: 12px;
        line-height: 18px;
        margin-bottom: 8px;
      }
    }
  }
  .el-form-item {
    display: block;
    .limitContent {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: start;
    }
    .limitCell {
      width: 100px !important;
    }
  }

  .dataCell,
  .casCell,
  .selCell {
    /deep/.el-input__inner {
      // width: 266px;
    }
  }
  .actionForm {
    .addActionBtn {
      width: 268px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 16px;
      .svg-icon {
        position: relative;
        top: 2px;
        margin-right: 6px;
      }
    }
    .imgCell {
      display: flex;
      align-items: center;
      height: 30px;
      margin-bottom: 16px;
      .imgCheck {
        height: 30px;
        width: 80px;
        padding-left: 10px;
        border: 1px solid #e4e7ed;
        border-radius: 4px 0 0 4px;
        border-right: none;
        display: flex;
        div /deep/.el-upload--picture-card {
          width: 26px;
          height: 26px;
          line-height: 26px;
          margin-top: 1px;
        }
        label.el-checkbox.el-checkbox--small {
          height: 30px;
          margin-right: 6px;
        }
      }

      .wrapInput {
        /deep/.el-input__inner {
          border-left: none;
          border-radius: 0px;
        }
        /deep/.el-input__inner:hover {
          border-radius: 0px;
          border-left: 1px solid #c0c4cc;
        }
        /deep/.el-input__inner:focus {
          border-radius: 0px;
          border-left: 1px solid #1f6eef;
        }
      }
    }
    .mt0 {
      margin-top: 0;
    }
    .mb {
      margin-bottom: 0;
    }
  }
  .wrapCell {
    margin-top: 16px;
    .delIcon {
      cursor: pointer;
      margin-right: 10px;
    }
    .rengCell {
      margin-left: 0px;
    }
    .uploadText {
      height: 32px;
      line-height: 32px;
      border: 1px solid #e4e7ed;
      border-radius: 4px;
      padding-left: 8px;
      font-size: 12px;
      color: #666;
      margin: 16px 0;
    }
  }

  .checkCell {
    margin-top: 16px;
    border: 1px solid #e4e7ed;
    border-radius: 4px;
    padding: 10px;
    .checkItem {
      min-width: 200px;
    }
  }
}
</style>
