<template>
  <gj-modal
    v-model:visible="skuRulesVisible"
    title="规则编辑"
    @ok="handleOk"
    @cancel="handleCancel"
    title-align="start"
    :unmount-on-close="true"
    :width="800"
  >
    <div class="content">
      <div class="parentSku">
        <p>父SKU</p>
        <div class="addContent">
          <gj-select
            v-model="parentElementCode"
            placeholder="添加元素"
            style="width: 85px"
            @change="addElement('parent')"
          >
            <gj-option
              v-for="item in elementList"
              :value="item.value"
              :key="item.value"
              >{{ item.label }}</gj-option
            >
          </gj-select>
          <gj-select
            v-model="parentDelimiterCode"
            size="small"
            placeholder="添加分隔符"
            style="width: 96px"
            @change="addDelimiter('parent')"
          >
            <gj-option
              v-for="item in delimiterList"
              :value="item.value"
              :key="item.value"
              >{{ item.label }}</gj-option
            >
          </gj-select>
        </div>
        <div class="dragContent">
          <draggable
            :list="skuData.parentRule"
            group="viewer"
            animation="300"
            item-key="index"
            chosenClass="choose"
            handle=".dr-mover"
          >
            <template #item="{ element, index }">
              <div class="itemContainPlus">
                <div class="dragItem">
                  <SvgIcon svgClass="dragSvg" :width="20" class="dr-mover" />
                  <span class="">{{
                    element.ruleKey !== "6"
                      ? transferData(element.ruleKey)
                      : element.ruleValue
                  }}</span>
                  <gj-input
                    size="small"
                    v-model="element.ruleValue"
                    style="width: 60px; line-height: 0"
                    v-show="['2', '3', '4'].includes(element.ruleKey)"
                    :key="element.ruleKey"
                    placeholder="请输入"
                  >
                    <template #append> 位 </template>
                  </gj-input>
                  <SvgIcon
                    svgClass="deleteCha"
                    :width="12"
                    @click="delRules(index, 'parent')"
                  />
                </div>
                <div v-if="skuData.parentRule.length > index + 1">+</div>
              </div>
            </template>
          </draggable>
        </div>
      </div>
      <div class="childSku">
        <p>子SKU</p>
        <div class="addContent">
          <gj-select
            v-model="childElementCode"
            size="small"
            placeholder="添加元素"
            style="width: 85px"
            @change="addElement('child')"
          >
            <gj-option
              v-for="item in elementList"
              :value="item.value"
              :label="item.label"
              :key="item.value"
              >{{ item.label }}</gj-option
            >
            <gj-option value="5" key="5">父SKU</gj-option>
          </gj-select>
          <gj-select
            v-model="childDelimiterCode"
            size="small"
            placeholder="添加分隔符"
            style="width: 96px"
            @change="addDelimiter('child')"
          >
            <gj-option
              v-for="item in delimiterList"
              :value="item.value"
              :key="item.value"
              >{{ item.label }}</gj-option
            >
          </gj-select>
        </div>
        <div class="dragContent">
          <draggable
            :list="skuData.sonRule"
            group="viewer"
            animation="300"
            chosenClass="choose"
            item-key="value"
            handle=".dr-mover"
          >
            <template #item="{ element, index }">
              <div class="itemContainPlus">
                <div class="dragItem">
                  <SvgIcon svgClass="dragSvg" :width="20" class="dr-mover" />
                  <span class="">{{
                    element.ruleKey !== "6"
                      ? transferData(element.ruleKey)
                      : element.ruleValue
                  }}</span>
                  <gj-input
                    size="small"
                    v-model="element.ruleValue"
                    style="width: 60px; line-height: 0"
                    v-show="['2', '3', '4'].includes(element.ruleKey)"
                    :key="element.ruleKey"
                    placeholder="请输入"
                  >
                    <template #append> 位 </template>
                  </gj-input>
                  <SvgIcon
                    svgClass="deleteCha"
                    :width="12"
                    @click="delRules(index, 'child')"
                  />
                </div>
                <div v-if="skuData.sonRule.length > index + 1">+</div>
              </div>
            </template>
          </draggable>
        </div>
      </div>
      <div class="example">
        <p>示例</p>
        <div class="exampleContent">
          <p>父SKU：{{ skuData.parentRuleStr }}</p>
          <p>子SKU：{{ skuData.sonRuleStr }}</p>
        </div>
      </div>
    </div>
  </gj-modal>
</template>
<script>
import draggable from "vuedraggable";
import SvgIcon from "@/components/SvgIcon.vue";
import { defineComponent, reactive, toRefs, watch } from "vue";
export default defineComponent({
  name: "skuRulesComponent",
  components: {
    SvgIcon,
    draggable,
  },
  props: {
    skuRules: {
      type: Object,
      default: () => {
        return {
          parentRule: [],
          sonRule: [],
          parentRuleStr: "",
          sonRuleStr: "",
          ruleType: "2",
          others: [
            {
              shopCode: "",
              platformCode: "ALIEXPRESS",
            },
          ],
        };
      },
    },
  },
  setup(props, { emit }) {
    const data = reactive({
      elementList: [
        { value: "1", label: "店铺代码" },
        { value: "2", label: "顺序数字" },
        { value: "3", label: "随机数字" },
        { value: "4", label: "随机字母" },
      ], // 添加元素的选择列表
      delimiterList: [
        { value: "11", label: "-" },
        { value: "12", label: "|" },
        { value: "13", label: "#" },
        { value: "14", label: "+" },
        { value: "15", label: "," },
        { value: "16", label: "@" },
        { value: "17", label: "_" },
        { value: "18", label: "." },
        { value: "19", label: "*" },
      ], // 添加分隔符的选择列表
      skuData: props.skuRules,
      parentElementCode: "", // 父SKU元素类型
      parentDelimiterCode: "", // 父分隔符类型
      childElementCode: "", // 子SKU元素类型
      childDelimiterCode: "", // 子分隔符类型
    });
    // 添加元素
    const addElement = (type) => {
      console.log(type);
      type === "parent"
        ? data.skuData.parentRule.push({
            ruleKey: data.parentElementCode,
            ruleValue:
              data.parentElementCode === "1" ? data.skuData.shopCode : "2",
          })
        : data.skuData.sonRule.push({
            ruleKey: data.childElementCode,
            ruleValue:
              data.childElementCode === "1" ? data.skuData.shopCode : "2",
          });
      emit("changeSkuRules", data.skuData);
      data.parentElementCode = "";
      data.childElementCode = "";
    };
    // 添加分隔符
    const addDelimiter = (type) => {
      type === "parent"
        ? data.skuData.parentRule.push({
            ruleKey: "6",
            ruleValue: transferData(data.parentDelimiterCode),
          })
        : data.skuData.sonRule.push({
            ruleKey: "6",
            ruleValue: transferData(data.childDelimiterCode),
          });
      emit("changeSkuRules", data.skuData);
      data.parentDelimiterCode = "";
      data.childDelimiterCode = "";
    };
    // 删除父SKU
    const delRules = (idx, type) => {
      type === "parent"
        ? data.skuData.parentRule.splice(idx, 1)
        : data.skuData.sonRule.splice(idx, 1);
      emit("changeSkuRules", data.skuData);
    };
    // 转化code为name
    const transferData = (code) => {
      if (code === "5") return "父SKU";
      let arr =
        data.elementList.filter((item) => item.value === code).length > 0
          ? data.elementList.filter((item) => item.value === code)
          : data.delimiterList.filter((item) => item.value === code);
      return arr[0].label;
    };
    // 生成顺序数字
    const sortNumber = (num) => {
      let n = parseInt(num);
      let str = "";
      for (var i = 1; i < n; i++) {
        str += "0";
      }
      return str + "1";
    };
    // 生成随机数字
    const randomNumber = (num) => {
      let n = parseInt(num);
      var str = "";
      for (var i = 0; i < n; i++) {
        str += Math.floor(Math.random() * 10);
      }
      return str;
    };
    // 生成随机字母
    const randomKey = (num) => {
      let $chars = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz";
      let n = parseInt(num);
      var maxPos = $chars.length;
      var str = "";
      for (var i = 0; i < n; i++) {
        str += $chars.charAt(Math.floor(Math.random() * maxPos));
      }
      return str;
    };
    const getParentRuleStr = (list) => {
      let str = "";
      list.forEach((item) => {
        switch (item.ruleKey) {
          case "1":
            str += "xxx";
            break;
          case "2":
            str += sortNumber(item.ruleValue);
            break;
          case "3":
            str += randomNumber(item.ruleValue);
            break;
          case "4":
            str += randomKey(item.ruleValue);
            break;
          case "5":
            str += data.skuData.parentRuleStr;
            break;
          case "6":
            str += item.ruleValue;
            break;
          default:
            break;
        }
      });
      return str;
    };

    const handleOk = () => {
      emit("handleOk");
    };
    const handleCancel = () => {
      emit("handleCancel");
    };

    // 生成父示例
    watch(
      () => data.skuData.parentRule,
      () => {
        data.skuData.parentRuleStr = getParentRuleStr(data.skuData.parentRule);
        if (
          data.skuData.sonRule.filter((item) => item.ruleKey === "5").length > 0
        ) {
          data.skuData.sonRuleStr = getParentRuleStr(data.skuData.sonRule);
        }
      },
      {
        deep: true,
        immediate: true,
      }
    );
    // 生成子示例
    watch(
      () => data.skuData.sonRule,
      () => {
        data.skuData.sonRuleStr = getParentRuleStr(data.skuData.sonRule);
      },
      {
        deep: true,
        immediate: true,
      }
    );
    return {
      ...toRefs(data),
      addElement,
      addDelimiter,
      delRules,
      transferData,
      handleOk,
      handleCancel,
    };
  },
});
</script>
<style scoped lang="scss">
.content {
  padding: 16px;
  .parentSku,
  .childSku,
  .example {
    margin-bottom: 20px;
    p {
      color: #333333;
      font-size: 14px;
      margin-bottom: 12px;
    }
    .addContent {
      display: flex;
      gap: 16px;
      margin-bottom: 12px;
      /deep/ .arco-select {
        width: 85px;
        background: rgb(255, 255, 255);
        border: 1px solid rgb(230, 230, 237);
        box-sizing: border-box;
        border-radius: 16px;
        /* font-size: 12px !important; */
        /* padding: 0px; */
        padding: 0 8px;
        height: 34px;
        .arco-select-view-input,
        .arco-select-view-value,
        svg {
          font-size: 12px;
        }
        .arco-select-view-suffix {
          padding-left: 4px;
        }
      }
    }
    .dragContent {
      padding: 12px;
      background: #ffffff;
      /* 品牌蓝40%等价 */

      border: 1px dashed #99b5f9;
      box-sizing: border-box;
      border-radius: 6px;
      > div {
        display: flex;
        flex-wrap: wrap;
        flex-direction: row;
        gap: 12px;
        .itemContainPlus {
          display: flex;
          align-items: center;
          flex-direction: row;
          gap: 12px;
          .dragItem {
            border: 1px solid #d9d9e0;
            box-sizing: border-box;
            border-radius: 16px;
            padding: 0 8px;
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            gap: 12px;
            height: 32px;
            span {
              font-size: 12px;
            }
            /deep/ .arco-input-wrapper {
              width: 92px;
              background: #fff;
              padding: 0;
              border: none;
              .arco-input-wrapper,
              .arco-input {
                text-align: center;
                &:focus {
                  outline: none;
                  border: none;
                }
              }
            }
            /deep/ .arco-input-append {
              background: #fff;
              border: none;
              padding: 0;
            }
            svg {
              cursor: pointer;
            }
            .dr-mover {
              cursor: move;
            }
          }
        }
      }
      .choose {
        background: #edf7ff !important;
      }
    }
    .exampleContent {
      padding: 12px;
      border: 1px solid #e6e6ed;
      box-sizing: border-box;
      border-radius: 8px;
      font-size: 12px;
    }
  }
  .example {
    margin: 0;
  }
}
</style>
