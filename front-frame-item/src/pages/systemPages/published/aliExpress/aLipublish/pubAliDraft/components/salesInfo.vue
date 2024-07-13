<!--变体信息-->
<template>
  <div class="blockBox">
    <div class="title">销售资料</div>
    <gj-form
      ref="salseFormInfo"
      label-align="left"
      :label-col-props="{ span: 24 }"
      :wrapper-col-props="{ span: 24 }"
    >
      <div class="content-wrap">
        <template v-if="attr === 2">
          <div class="dafault-attr-wrap">
            <div class="table-title">
              <div class="div1">属性名</div>
              <div class="div2">属性值</div>
            </div>
            <div
              class="table-column"
              v-for="(item, index) in variantAttrInfo"
              :key="index"
            >
              <div class="div1">
                <span class="star" v-if="item.required">*</span
                ><span class="attrName">{{ item.zhName }}</span>
              </div>
              <div class="div2">
                <div class="value-wrap">
                  <gj-form-item
                    :hide-label="true"
                    field="attrValue"
                    :rules="
                      item.required
                        ? [
                            {
                              required: true,
                              message: '请选择',
                              validator: (value, cb) =>
                                customValidatorAttrValue(
                                  value,
                                  cb,
                                  item.attrValues
                                ),
                            },
                          ]
                        : []
                    "
                    validate-trigger="change"
                    :label-col-style="{ 'justify-content': 'flex-start' }"
                    :style="{ marginBottom: 0 }"
                  >
                    <div
                      v-for="(item1, index1) in item.attrValues"
                      :key="index1"
                      class="valueItem pad5"
                    >
                      <gj-input
                        v-model="item1.attrValueDefinitionName"
                        placeholder="自定义名称"
                        size="small"
                        @change="attrValueDefinitionNamechange"
                      >
                        <template #prepend>{{ item1.zhName }}</template>
                      </gj-input>
                      <SvgIcon
                        svgClass="closeIcon"
                        :width="16"
                        @click="deleteAttr(index, index1)"
                        class="closeBtn"
                      />
                    </div>
                    <div class="button-wrap">
                      <gj-button
                        @click="addAttr(index)"
                        size="small"
                        type="text"
                        >添加属性</gj-button
                      >
                    </div>
                  </gj-form-item>
                </div>
              </div>
            </div>
          </div>
          <gj-row :gutter="24">
            <gj-col :span="6">
              <gj-form-item label="店铺SKU">
                <gj-input placeholder="请输入" size="small" v-model="batchSKU">
                </gj-input>
              </gj-form-item>
            </gj-col>

            <gj-col :span="6">
              <gj-form-item label="数量">
                <gj-input-number
                  placeholder="请输入"
                  size="small"
                  v-model="batchNumber"
                  :min="0"
                  :max="100000000000000"
                >
                </gj-input-number>
              </gj-form-item>
            </gj-col>
            <gj-col :span="6">
              <gj-form-item label="建议售价">
                <gj-input-number
                  placeholder="请输入"
                  size="small"
                  v-model="batchPrice"
                  :min="0"
                  :max="100000000000000"
                >
                  <template #prefix> $ </template>
                </gj-input-number>
              </gj-form-item>
            </gj-col>
            <gj-col :span="6">
              <gj-button @click="batchEntry" size="small" type="text"
                >批量录入</gj-button
              >
            </gj-col>
          </gj-row>
          <gj-table
            :rowKey="'index'"
            :columns="table1Colums"
            :data-source="tableData"
            :row-selection="rowSelection"
            :pagination="false"
            :scroll="scroll"
            :bordered="true"
          >
            <template #headerCell="{ column }">
              <template v-if="column.dataIndex === 'msku'">
                店铺sku *
                <span @click="batchCreate">自动生成</span>
              </template>

              <template v-if="column.dataIndex === 'quantity'">
                数量 *
              </template>
              <template v-if="column.dataIndex === 'recommendPrice'">
                售价 *
              </template>
            </template>

            <template #bodyCell="{ column, record, index }">
              <template v-if="column.dataIndex === 'sku'">
                <gj-select
                  placeholder="请选择"
                  v-model="tableData[index].sku"
                  :trigger-props="{
                    updateAtScroll: true,
                    autoFitPopupMinWidth: true,
                  }"
                >
                  <gj-option
                    v-for="item in skuList"
                    :valeu="item.id"
                    :key="item.id"
                    >{{ item.sku }}</gj-option
                  >
                </gj-select>
              </template>

              <template v-if="column.dataIndex === 'msku'">
                <gj-form-item
                  :hide-label="true"
                  field="msku"
                  :rules="[
                    {
                      required: true,
                      message: 'SKU必填',
                      validator: (value, cb) =>
                        customValidatorSKU(value, cb, record),
                    },
                  ]"
                  validate-trigger="change"
                  :label-col-style="{ 'justify-content': 'flex-start' }"
                  :style="{ marginBottom: 0 }"
                >
                  <gj-input
                    placeholder="请输入"
                    v-model="tableData[index].msku"
                    @change="mskuChange(record, $event)"
                  >
                  </gj-input>
                </gj-form-item>
              </template>

              <template v-if="column.dataIndex === 'quantity'">
                <gj-form-item
                  :hide-label="true"
                  field="quantity"
                  :rules="[
                    {
                      required: true,
                      message: '请输入数量',
                      validator: (value, cb) =>
                        customValidatorQuantity(value, cb, record.quantity),
                    },
                  ]"
                  validate-trigger="change"
                  :label-col-style="{ 'justify-content': 'flex-start' }"
                  :style="{ marginBottom: 0 }"
                >
                  <gj-input-number
                    placeholder="请输入"
                    v-model="tableData[index].quantity"
                    :min="0"
                    :max="100000000000000"
                    @change="quantityChange(record, $event)"
                  >
                  </gj-input-number>
                </gj-form-item>
              </template>

              <template v-if="column.dataIndex === 'recommendPrice'">
                <gj-form-item
                  :hide-label="true"
                  field="recommendPrice"
                  :rules="[
                    {
                      required: true,
                      message: '请输入价格',
                      validator: (value, cb) =>
                        customValidatorPrice(value, cb, record.recommendPrice),
                    },
                  ]"
                  validate-trigger="change"
                  :label-col-style="{ 'justify-content': 'flex-start' }"
                  :style="{ marginBottom: 0 }"
                >
                  <gj-input-number
                    style="width: 125px"
                    placeholder="请输入"
                    v-model="tableData[index].recommendPrice"
                    @change="priceChange(record, $event)"
                    :min="0"
                    :max="100000000000000"
                  >
                  </gj-input-number>
                </gj-form-item>
              </template>

              <template v-if="column.dataIndex === 'open'">
                <gj-switch
                  :default-checked="record.open"
                  active-color="#1f6eef"
                  @change="switchChange(record, $event)"
                />
              </template>
            </template>
          </gj-table>
        </template>

        <gj-row :gutter="24">
          <gj-col :span="6" v-if="attr === 1">
            <gj-form-item
              label="售价"
              validate-trigger="change"
              field="recommendPrice"
              :rules="[
                {
                  required: true,
                  message: '请输入价格',
                  validator: (value, cb) =>
                    customValidatorPrice1(value, cb, salseForm.recommendPrice),
                },
              ]"
            >
              <gj-input-number
                v-model="salseForm.recommendPrice"
                @change="monomerPriceChange"
                placeholder="请输入"
                :min="0"
                :max="100000000000000"
              >
              </gj-input-number>
            </gj-form-item>
          </gj-col>

          <gj-col :span="6">
            <gj-form-item
              label="最小计量单位"
              validate-trigger="change"
              field="productUnit"
              label-align="left"
              :rules="[
                {
                  required: true,
                  message: '请选择最小计量单位',
                  validator: (value, cb) =>
                    customValidatorUnit(value, cb, salseForm.productUnit),
                },
              ]"
            >
              <gj-select
                v-model="salseForm.productUnit"
                placeholder="请选择"
                allow-clear
                :trigger-props="{
                  updateAtScroll: true,
                  autoFitPopupMinWidth: true,
                }"
              >
                <gj-option
                  v-for="item in unitList"
                  :value="item.value"
                  :key="item.key"
                  >{{ item.label }}</gj-option
                >
              </gj-select>
            </gj-form-item>
          </gj-col>

          <gj-col :span="6">
            <gj-form-item
              label="销售方式"
              validate-trigger="change"
              field="packageType"
              label-align="left"
              :rules="[
                {
                  required: true,
                  message: '请选择销售方式',
                  validator: (value, cb) =>
                    customValidatorType(value, cb, salseForm.packageType),
                },
              ]"
            >
              <gj-select
                v-model="salseForm.packageType"
                placeholder="请选择"
                allow-clear
                @change="packageTypeChange"
                :trigger-props="{
                  updateAtScroll: true,
                  autoFitPopupMinWidth: true,
                }"
              >
                <gj-option :value="1">打包销售</gj-option>
                <gj-option :value="0">非打包销售</gj-option>
              </gj-select>
            </gj-form-item>
          </gj-col>
          <gj-col :span="6">
            <gj-form-item
              label="每包"
              validate-trigger="change"
              field="lotNum"
              :rules="[
                {
                  required: true,
                  message: '请选择每包数量',
                  validator: (value, cb) =>
                    customValidatorNum(value, cb, salseForm.lotNum),
                },
              ]"
            >
              <gj-input-number
                placeholder="请输入"
                size="small"
                v-model="salseForm.lotNum"
                :min="0"
                :max="maxRange"
              >
              </gj-input-number>
            </gj-form-item>
          </gj-col>
        </gj-row>
        <!-- </gj-form> -->

        <div class="squre-line region">
          <div class="regionTitle">
            <span class="span1"> 区域定价</span>
            <gj-button @click="setAreaPrice" size="small" type="text"
              >设置/修改</gj-button
            >
          </div>
          <div class="modify">
            <div class="label">选择区域调价模板</div>
            <div class="selsetCon">
              <gj-select
                v-model="areatemplateId"
                @change="changeAreaTemplate"
                :trigger-props="{
                  updateAtScroll: true,
                  autoFitPopupMinWidth: true,
                }"
              >
                <gj-option
                  v-for="item in areaPlat"
                  :label="item.name"
                  :value="item.id"
                  :key="item.id"
                ></gj-option>
              </gj-select>
            </div>
          </div>
          <div class="gapContain">
            <gj-tag
              closable
              size="large"
              class="regionTag"
              v-for="(item, index) in tagList"
              :key="item.value"
              @close="closeTag(index)"
              >{{ item.label }}</gj-tag
            >
          </div>
        </div>

        <gj-row class="retail">
          <gj-col :span="24">
            <div class="label">调价方式</div>
            <div class="selsetCon">
              <gj-select
                v-model="configurationType"
                :trigger-props="{
                  updateAtScroll: true,
                  autoFitPopupMinWidth: true,
                }"
              >
                <gj-option value="absolute">直接报价</gj-option>
                <gj-option value="relative">调整比例</gj-option>
                <gj-option value="percentage">调整金额</gj-option>
              </gj-select>
            </div>
          </gj-col>
        </gj-row>
        <gj-row class="retail">
          <gj-col :span="24">
            <div class="label">零售价</div>
            <div class="selsetCon">
              <gj-input-group>
                <gj-select
                  v-model="batchAreaKey"
                  placeholder="请选择"
                  :trigger-props="{
                    updateAtScroll: true,
                    autoFitPopupMinWidth: true,
                  }"
                >
                  <gj-option
                    v-for="item in tagList"
                    :key="item.value"
                    :value="item.value"
                    >{{ item.label }}</gj-option
                  >
                </gj-select>
                <gj-input-number placeholder="请输入" v-model="batchAreaValue">
                </gj-input-number>
              </gj-input-group>
            </div>
            <gj-button @click="batchAreaPrice" size="small" type="text"
              >批量录入</gj-button
            >
          </gj-col>
        </gj-row>

        <gj-table
          class="table-content"
          :columns="table2Colums"
          row-key="index"
          :data-source="table2Data"
          :pagination="false"
          :scroll="scroll"
          :bordered="true"
        >
          <template #bodyCell="{ index, column }">
            <template v-if="column.type === 'self'">
              <!-- 直接报价 -->
              <div v-if="configurationType === 'absolute'">
                <gj-input-number
                  :min="0"
                  style="width: 125px"
                  placeholder="请输入"
                  v-model="table2Data[index][column['dataIndex']]"
                >
                </gj-input-number>
              </div>

              <!-- 调整比例 -->
              <div v-if="configurationType === 'relative'">
                <gj-input-number
                  :min="0"
                  style="width: 125px"
                  placeholder="请输入"
                  v-model="table2Data[index][column['dataIndex']]"
                >
                  <template #suffix> % </template>
                </gj-input-number>
              </div>

              <!-- 调整金额 -->
              <div v-if="configurationType === 'percentage'">
                <gj-input-number
                  :min="0"
                  style="width: 125px"
                  placeholder="请输入"
                  v-model="table2Data[index][column['dataIndex']]"
                >
                </gj-input-number>
              </div>
            </template>
          </template>
        </gj-table>
        <gj-row :gutter="24" class="mb16">
          <gj-col :span="6">
            <div class="label">
              <span class="span1">尺码表</span
              ><gj-button @click="syncSizePlat" type="text" size="small"
                >同步</gj-button
              >
            </div>
            <div class="selsetCon span2">
              <gj-select
                v-model="sizeTemplateId"
                :trigger-props="{
                  updateAtScroll: true,
                  autoFitPopupMinWidth: true,
                }"
              >
                <gj-option
                  v-for="item in sizePlat"
                  :label="item.name"
                  :value="item.id"
                  :key="item.id"
                ></gj-option>
              </gj-select>
            </div>
          </gj-col>
          <gj-col :span="6">
            <div class="label"><span class="span1">批发价</span></div>
            <div class="selsetCon span2">
              <gj-switch active-color="#1f6eef" v-model="bulkPrice" />
            </div>
          </gj-col>
        </gj-row>

        <div v-if="bulkPrice">
          <div class="squre-line wholesale">
            <span class="sp1">起批量 </span>
            <gj-input-number
              class="input"
              v-model="bulkOrder"
              :min="2"
              :max="100000"
              @change="bulkOrderChange"
            ></gj-input-number>
            <span class="sp2">零售价基础上减免 </span>
            <gj-input-number
              class="input"
              :max="100"
              :min="0"
              v-model="bulkDiscount"
              @change="discountChange"
            >
              <template #suffix> % </template>
            </gj-input-number>
            <span class="sp3">（{{ discount }} ）折</span>
          </div>
          <gj-table
            :rowKey="'index'"
            :columns="table3Colums"
            :data-source="table3Data"
            :pagination="false"
            :scroll="scroll"
            :bordered="true"
          >
          </gj-table>
        </div>
      </div>
    </gj-form>
    <attrModal
      :visible="visible"
      @handleOk="handleOk"
      @handleCancel="handleCancel"
      :option="checkOption"
    ></attrModal>
    <areaModal
      :visible="areaVisible"
      :areaList="areaList"
      @handleOk="confirmAreaModal"
      @cancel="cancelAreaModal"
      ref="areaModalRef"
    ></areaModal>
  </div>
</template>

<script>
import {
  defineComponent,
  reactive,
  toRefs,
  getCurrentInstance,
  watch,
  computed,
  ref,
  inject,
} from "vue";
import { getSkuRule } from "@/api/public";
import SvgIcon from "@/components/SvgIcon";
import { calcDescartes } from "@/utils/common";
import { setForm2 } from "@/utils/fnBusiness";
import areaModal from "./areaModal.vue";
import attrModal from "../../../components/attrModal.vue";
import {
  getPlatform,
  getTemplateDetail,
  syncPlatform,
} from "@/api/published/aliexpress";
import { GjMessage } from "@gj/atom";
export default defineComponent({
  props: {
    variantAttrInfo: {
      type: Array,
      default: () => {
        return [];
      },
    },
    attr: {
      type: Number,
      default: () => {
        return 2;
      },
    },
    skuList: {
      type: Array,
      default: () => {
        return [];
      },
    },
    areaPlat: {
      type: Array,
      default: () => {
        return [];
      },
    },

    editInfo: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  components: {
    SvgIcon,
    areaModal,
    attrModal,
  },
  setup(props, { emit }) {
    const { proxy } = getCurrentInstance();

    const areaModalRef = ref();
    const key = "moreAttr"; //

    const shopId = inject("shopId");
    const platformCategoryId = inject("platformCategoryId");
    const isSaveMoreAttrFalg = inject("isSaveMoreAttrFalg");

    const areaList = [
      {
        label: "Russian Federation",
        value: "RU",
      },
      {
        label: "United States",
        value: "US",
      },
      {
        label: "Canada",
        value: "CA",
      },
      {
        label: "Spain",
        value: "ES",
      },
      {
        label: "France",
        value: "FR",
      },
      {
        label: "United Kingdom",
        value: "UK",
      },
      {
        label: "Netherlands",
        value: "NL",
      },
      {
        label: "Israel",
        value: "IL",
      },
      {
        label: "Brazil",
        value: "BR",
      },
      {
        label: "Chile",
        value: "CL",
      },
      {
        label: "Australia",
        value: "AU",
      },
      {
        label: "Ukraine",
        value: "UA",
      },
      {
        label: "Belarus",
        value: "BY",
      },
      {
        label: "Japan",
        value: "JP",
      },
      {
        label: "Thailand",
        value: "TH",
      },
      {
        label: "Singapore",
        value: "SG",
      },
      {
        label: "South Korea",
        value: "KR",
      },
      {
        label: "Indonesia",
        value: "ID",
      },
      {
        label: "Malaysia",
        value: "MY",
      },
      {
        label: "Philippines",
        value: "PH",
      },
      {
        label: "Vietnam",
        value: "VN",
      },
      {
        label: "Italy",
        value: "IT",
      },
      {
        label: "Germany",
        value: "DE",
      },
      {
        label: "Saudi Arabia",
        value: "SA",
      },
      {
        label: "United Arab Emirates",
        value: "AE",
      },
      {
        label: "Poland",
        value: "PL",
      },
      {
        label: "Turkey",
        value: "TR",
      },
    ];
    const data = reactive({
      scroll: {
        x: 0,
        y: 400,
      },
      editData: props.editInfo,
      skuList: props.skuList,
      sizeTemplateId: "",
      areatemplateId: "",
      bulkPrice: true,
      bulkOrder: "", //起批量
      bulkDiscount: 0, //批发折扣

      attr: props.attr,
      batchAreaValue: "",
      batchAreaKey: "",
      configurationType: "absolute",
      visable: false,
      areaVisible: false,
      moreAttr: {},
      salseForm: {
        packageType: "",
        lotNum: "",
        productUnit: "",
        recommendPrice: "",
      },
      selectionData: [],
      batchPrice: "",
      batchNumber: "",
      batchSKU: "",
      variantAttrInfo: props.variantAttrInfo,
      columns: [],
      skuColumns: [
        {
          title: "关联sku",
          dataIndex: "sku",
          width: 160,
          fixed: "left",
        },
        {
          title: "店铺sku",
          dataIndex: "msku",
          width: 150,
          fixed: "left",
        },
        {
          title: "数量",
          dataIndex: "quantity",
          width: 150,
          fixed: "right",
        },
        {
          title: "售价",
          dataIndex: "recommendPrice",
          width: 150,
          fixed: "right",
        },
        {
          title: "启用",
          dataIndex: "open",
          width: 130,
          fixed: "right",
        },
      ],
      retailColumns: [],
      saleColumns: [
        {
          title: "零售价",
          dataIndex: "recommendPrice",
          width: 160,
        },
        {
          title: "起批量",
          dataIndex: "bulkOrder",
          width: 160,
        },
        {
          title: "批发价",
          dataIndex: "wholesalePrice",
          width: 160,
        },
      ],
      tableData: [],
      table2Data: [],
      table3Data: [],
      incrementalDKR: [],
      incrementalIdDKR: [],
      visible: false,
      checkOption: [],
      checkList: [],
      actionIndex: 0,
      rowSelection: {
        fixed: "left",
        onChange: (rowKey) => {
          data.rowSelection.selectedRowKeys = rowKey;
          console.log(rowKey);
        },
        selectedRowKeys: [],
      },
      tagList: [],
      sizePlat: [],
      areaPlat: props.areaPlat,
      unitList: [
        {
          label: "袋",
          value: 100000000,
        },
        {
          label: "桶",
          value: 100000001,
        },
        {
          label: "蒲式耳",
          value: 100000002,
        },
        {
          label: "箱",
          value: 100078580,
        },
        {
          label: "厘米",
          value: 100078581,
        },
        {
          label: "立方米",
          value: 100000003,
        },
        {
          label: "打",
          value: 100000004,
        },
        {
          label: "英尺",
          value: 100078584,
        },
        {
          label: "加仑",
          value: 100000005,
        },
        {
          label: "克",
          value: 100000006,
        },
        {
          label: "英寸",
          value: 100078587,
        },
        {
          label: "英寸",
          value: 100078587,
        },
        {
          label: "千克",
          value: 100000007,
        },
        {
          label: "千升",
          value: 100078589,
        },
        {
          label: "千米",
          value: 100000008,
        },
        {
          label: "升",
          value: 100078559,
        },
        {
          label: "英吨",
          value: 100000009,
        },
        {
          label: "米",
          value: 100000010,
        },
        {
          label: "公吨",
          value: 100000011,
        },
        {
          label: "毫克",
          value: 100078560,
        },
        {
          label: "毫升",
          value: 100078596,
        },
        {
          label: "毫米",
          value: 100078597,
        },
        {
          label: "盎司",
          value: 100000012,
        },
        {
          label: "包",
          value: 100000014,
        },
        {
          label: "双",
          value: 100000013,
        },
        {
          label: "件/个",
          value: 100000015,
        },
        {
          label: "磅",
          value: 100000016,
        },
        {
          label: "夸脱",
          value: 100078603,
        },
        {
          label: "套",
          value: 100000017,
        },
        {
          label: "美吨",
          value: 100000018,
        },
        {
          label: "平方英尺",
          value: 100078606,
        },
        {
          label: "平方英寸",
          value: 100078607,
        },
        {
          label: "平方米",
          value: 100000019,
        },
        {
          label: "平方码",
          value: 100078609,
        },
        {
          label: "吨",
          value: 100000020,
        },
        {
          label: "码",
          value: 100078558,
        },
      ],
      tableOldData: [],
      editAreaInfo: {},
      saveSalesInfo: {},
    });

    // const showAddAttrBut = (obj) => {
    //   if (obj.attrValues.length >= obj.values.length) {
    //     return false
    //   } else {
    //     return true
    //   }
    // }
    const customValidatorSKU = (value, cb, record) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          if (!record.msku) {
            cb("SKU必填");
          }
          resolve();
        }, 0);
      });
    };

    const customValidatorQuantity = (value, cb, quantity) => {
      return new Promise((resolve) => {
        if (quantity === 0) {
          quantity = toString(quantity);
        }
        setTimeout(() => {
          if (!quantity) {
            cb("数量必填");
          }
          resolve();
        }, 0);
      });
    };

    const customValidatorPrice = (value, cb, recommendPrice) => {
      if (recommendPrice === 0) {
        recommendPrice = toString(recommendPrice);
      }
      return new Promise((resolve) => {
        setTimeout(() => {
          if (!recommendPrice) {
            cb("价格必填");
          }
          resolve();
        }, 0);
      });
    };
    const customValidatorPrice1 = (value, cb, recommendPrice) => {
      if (recommendPrice === 0) {
        recommendPrice = toString(recommendPrice);
      }
      return new Promise((resolve) => {
        setTimeout(() => {
          if (!recommendPrice) {
            cb("请输入价格");
          }
          resolve();
        }, 0);
      });
    };

    const customValidatorUnit = (value, cb, Unit) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          if (!Unit) {
            cb("请选择最小计量单位");
          }
          resolve();
        }, 0);
      });
    };

    const customValidatorType = (value, cb, Type) => {
      return new Promise((resolve) => {
        if (Type === 0) {
          Type = toString(Type);
        }
        setTimeout(() => {
          if (!Type) {
            cb("请选择销售方式");
          }
          resolve();
        }, 0);
      });
    };

    const customValidatorNum = (value, cb, Num) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          if (Num === 0) {
            Num = toString(Num);
          }
          if (!Num) {
            cb("请输入每包数量");
          }
          resolve();
        }, 0);
      });
    };

    const customValidatorAttrValue = (value, cb, Num) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          if (Num.length === 0) {
            cb("请选择");
          }
          resolve();
        }, 0);
      });
    };

    const maxRange = computed(() => {
      if (data.salseForm.packageType == 0) {
        return 1;
      } else {
        return 10000000000;
      }
    });

    const packageTypeChange = () => {
      if (data.salseForm.packageType == 0) {
        if (data.salseForm.lotNum !== "") {
          data.salseForm.lotNum = 1;
        }
      }
    };

    const table1Colums = computed(() => {
      return data.columns.concat(data.skuColumns);
    });

    const table2Colums = computed(() => {
      return data.columns.concat(data.retailColumns);
    });

    //discount
    const discount = computed(() => {
      if (data.bulkDiscount > 0) {
        return parseFloat((10 - data.bulkDiscount / 10).toFixed(2));
      } else {
        return "";
      }
    });

    const table3Colums = computed(() => {
      return data.columns.concat(data.saleColumns);
    });

    //修改属性别名是重新构建dkr数据
    const attrValueDefinitionNamechange = () => {
      data.tableOldData = [...data.tableData];
      data.tableData = [];
      setIncrementalDKR();
      createTbaleData();

      data.tableData.forEach((item, index) => {
        item.sku = data.tableOldData[index].sku;
        item.msku = data.tableOldData[index].msku;
        item.quantity = data.tableOldData[index].quantity;
        item.recommendPrice = data.tableOldData[index].recommendPrice;
      });

      setTable2Data();
      setTable3Data();
    };

    // 构建增量的dkr数据
    const setIncrementalDKR = () => {
      const tempDkr = [];
      const idDkr = [];
      data.variantAttrInfo.forEach((item) => {
        if (item.attrValues.length > 0) {
          tempDkr.push(
            item.attrValues.map((o) => {
              return o.attrValueDefinitionName
                ? o.attrValueDefinitionName
                : o.zhName;
            })
          );

          idDkr.push(
            item.attrValues.map((o) => {
              return o.id;
            })
          );
        }
      });

      data.incrementalDKR = calcDescartes(tempDkr);
      data.incrementalIdDKR = calcDescartes(idDkr);
    };

    // 构建增量的table的数据结构
    const createTbaleData = () => {
      createTableLine(data.incrementalDKR);
    };

    // 创建table行
    const createTableLine = (dkrList) => {
      dkrList.forEach((item, index) => {
        let wheelSpaceCount = 0; //轮空的个数，用来处理从中间开始添加属性，导致columnIndex不对应产生bug
        let line = {};
        let variationSkuAttr = [];
        // console.log(dkrList)
        // console.log(data.columns)
        variationSkuAttr = data.columns.map((item) => {
          return {
            attrId: item.id,
            attrName: item.zhName,
            attrValueId: "",
            attrValueName: "",
            attrValueDefinitionName: "",
          };
        });

        data.variantAttrInfo.forEach((columnKey, columnIndex) => {
          let currentDkrId = "";
          // console.log(data.variantAttrInfo)
          // console.log(columnKey)
          if (columnKey.zhName && columnKey.attrValues.length > 0) {
            let columnsNames = data.columns.map((item) => item.zhName);
            if (columnsNames.indexOf(columnKey.zhName) <= -1) {
              data.columns.push({
                zhName: columnKey.zhName,
                id: columnKey.id,
              });
            }

            if (data.variantAttrInfo.length <= 1) {
              line[columnKey.zhName] = item;
              //找到对应的id
              currentDkrId = data.incrementalIdDKR[index];
            } else {
              line[columnKey.zhName] =
                typeof item === "string"
                  ? item
                  : item[columnIndex - wheelSpaceCount];
              currentDkrId =
                typeof data.incrementalIdDKR[index] === "number"
                  ? data.incrementalIdDKR[index]
                  : data.incrementalIdDKR[index][columnIndex - wheelSpaceCount];
            }
            console.log(currentDkrId);

            variationSkuAttr.forEach((arrtItem) => {
              if (arrtItem.attrName === columnKey.zhName) {
                //根据对应的Id来找到对应项
                const currentItem = columnKey.attrValues.filter(
                  (item1) => item1.id === currentDkrId
                )[0];
                arrtItem.attrValueName = currentItem.zhName;
                arrtItem.attrValueId = currentItem.id;
                arrtItem.attrValueDefinitionName =
                  currentItem.attrValueDefinitionName;
              }
            });
          } else {
            wheelSpaceCount++;
          }
        });

        //建议售价
        line.recommendPrice = 0;
        line.open = true;
        line.sku = "";
        line.msku = "";
        line.quantity = "";
        line.variationSkuAttr = variationSkuAttr;

        line = complexValue(line, data.tableOldData);

        // line.recommendPrice = newLine.recommendPrice
        //   ? newLine.recommendPrice
        //   : 0
        // line.open = newLine.open ? newLine.open : true
        // line.sku = newLine.sku ? newLine.sku : ''
        // line.msku = newLine.msku ? newLine.msku : ''
        // line.quantity = newLine.quantity ? newLine.quantity : ''
        line.index = data.tableData.length;
        console.log(data.tableOldData);
        data.tableData.push(line);
        console.log(data.tableData, "数据源", data.variantAttrInfo);
      });

      setTable2Data();
      setTable3Data();
    };

    const complexValue = (line, oldData) => {
      let newLine = {};
      let equalIndex = -1;
      if (oldData.length > 0) {
        const computeArr = oldData.map((item) => {
          let newItem = { ...item };
          delete newItem.recommendPrice;
          delete newItem.open;
          delete newItem.sku;
          delete newItem.msku;
          delete newItem.quantity;
          delete newItem.variationSkuAttr;
          delete newItem.index;
          delete newItem.bulkDiscount;
          delete newItem.bulkOrder;
          delete newItem.skuId;
          delete newItem.wholesale;
          delete newItem.wholesalePrice;

          return newItem;
        });

        computeArr.forEach((item, index) => {
          const arr1 = Object.values(item);
          const arr2 = Object.values(line);
          const arr3 = arr2.filter((item) => arr1.indexOf(item) > -1);
          if (arr3.length === arr1.length) {
            equalIndex = index;
          }
        });
      }
      if (equalIndex > -1) {
        newLine = {
          ...line,
          recommendPrice: oldData[equalIndex].recommendPrice,
          open: oldData[equalIndex].open,
          sku: oldData[equalIndex].sku,
          msku: oldData[equalIndex].msku,
          quantity: oldData[equalIndex].quantity,
        };
      } else {
        newLine = { ...line };
      }
      return newLine;
    };

    const submitForm = () => {
      let formatTable = [];
      console.log(data.tagList);
      console.log(data.table2Data);
      data.table2Data.forEach((item, index) => {
        // formatTable[index] = []

        formatTable[index] = {
          dataList: [],
        };

        data.tagList.forEach((tItem) => {
          formatTable[index].dataList.push({
            country: tItem.value,
            price: item[tItem.value],
          });
        });
      });
      console.log(formatTable);
      const aeopNationalQuoteConfiguration = {
        configurationType: data.configurationType,
        configurationDatas: formatTable,
      };
      const formatAttrInfo = data.variantAttrInfo.map((item) => {
        return {
          attrId: item.id,
          attrName: item.zhName,
          attrValues: item.attrValues.map((item1) => {
            return {
              attrValueDefinitionName: item1.attrValueDefinitionName,
              attrValueId: item1.id,
              attrValueName: item1.zhName,
            };
          }),
        };
      });
      const formatVariants = data.tableData.map((item) => {
        return {
          variationSkuAttr: item.variationSkuAttr,
          open: item.open,
          recommendPrice: item.recommendPrice,
          sku: item.sku,
          msku: item.msku,
          quantity: item.quantity,
        };
      });
      // data.salseForm.packageType =
      //   data.salseForm.packageType == 1 ? true : false
      return setForm2(
        proxy,
        key,
        {
          variantAttrInfoList: formatAttrInfo,
          variants: formatVariants,
          aeopNationalQuoteConfiguration: aeopNationalQuoteConfiguration,
          ...data.salseForm,
          bulkOrder: data.bulkOrder, //起批量
          bulkDiscount: data.bulkDiscount, //批发折扣
          bulkPrice: data.bulkPrice, //是否开启批发价
        },
        "salseFormInfo"
      );
      // return true
    };

    const resetForm = () => {
      proxy.$refs["moreAttrForm"].resetFields();
    };

    //批量录入价格
    const batchEntry = () => {
      if (data.rowSelection.selectedRowKeys.length == 0)
        return GjMessage.warning("至少选择一条要操作的数据");

      if (
        !data.batchPrice.toString() ||
        !data.batchNumber.toString() ||
        !data.batchSKU.toString()
      ) {
        return GjMessage.warning("请输入店铺sku/数量/建议售价");
      }
      // if (!data.batchPrice) return GjMessage.warning('请输入价格')
      data.rowSelection.selectedRowKeys.forEach((item) => {
        data.tableData[item].recommendPrice = data.batchPrice;
        data.tableData[item].quantity = data.batchNumber;
        data.tableData[item].msku = data.batchSKU;
      });
    };

    const addAttr = (index) => {
      data.visible = true;
      data.checkOption = data.variantAttrInfo[index].values;
      data.actionIndex = index;
    };

    const deleteAttr = (index, index1) => {
      const attrId = data.variantAttrInfo[index].attrValues[index1].id;

      //恢复未选中状态
      data.variantAttrInfo[index].values.forEach((item) => {
        if (item.id === attrId) {
          item.check = false;
          item.visible = true;
        }
      });

      //删除variantAttrInfo对应的属性

      // //找到对应columns的index
      // const delColumnsIndex = data.columns
      //   .map((item) => item.attrName)
      //   .indexOf(attrName)
      // if (data.variantAttrInfo[index].attrValues.length > 1) {
      //   // 删除行
      //   data.tableData = data.tableData.filter((item) => {
      //     return item[attrName] !== attrValueName
      //   })
      // } else {
      //   // 删除列
      //   data.tableData.forEach((item) => {
      //     delete item[attrName]
      //   })

      //   data.columns.splice(delColumnsIndex, 1)

      //   if (data.columns.length === 0) {
      //     data.tableData = []
      //   }
      // }
      data.variantAttrInfo[index].attrValues.splice(index1, 1);

      data.tableOldData = [...data.tableData];
      data.tableData = [];
      setIncrementalDKR();
      createTbaleData();

      saveCustomizedPic();
    };

    const handleOk = (arr) => {
      data.visible = false;
      data.tableOldData = [...data.tableData];

      const coyeData = [...data.variantAttrInfo[data.actionIndex].attrValues];
      let ids = coyeData.map((item) => item.id);

      data.variantAttrInfo[data.actionIndex].attrValues = [];
      data.variantAttrInfo[data.actionIndex].values = arr;
      data.checkOption = arr;
      data.checkOption.forEach((item) => {
        if (item.check) {
          item.visible = false;

          // if (!ids.includes(item.id)) {
          data.variantAttrInfo[data.actionIndex].attrValues.push({
            ...item,
            attrValueDefinitionName: "",
          });

          data.variantAttrInfo[data.actionIndex].attrValues.forEach((item) => {
            const copyIndex = ids.indexOf(item.id);
            if (copyIndex > -1) {
              item.attrValueDefinitionName =
                coyeData[copyIndex].attrValueDefinitionName;
            }
          });
          // }
          data.tableData = [];
          setIncrementalDKR();
          createTbaleData();
          saveCustomizedPic();
        }
      });
    };
    const handleCancel = () => {
      data.visible = false;
      data.checkOption = [];
    };
    //保存可上传图片属性
    const saveCustomizedPic = () => {
      const arr = data.variantAttrInfo.filter(
        (item) => item.customizedPic === true
      );
      emit("setCustomizedPic", arr);
    };

    const priceChange = (record, event) => {
      const index = record.index;
      data.tableData.map((item) => {
        if (item.index === index) {
          item.recommendPrice = event;
        }
      });

      data.table3Data.map((item) => {
        if (item.index === index) {
          item.recommendPrice = event;
        }
      });
      // data.table3Data = [...data.table3Data]
    };

    const switchChange = (record, event) => {
      const index = record.index;
      data.tableData.map((item) => {
        if (item.index === index) {
          item.open = event;
        }
      });
      // data.tableData
      console.log(data.tableData);
    };

    const quantityChange = (record, event) => {
      const index = record.index;
      data.tableData.map((item) => {
        if (item.index === index) {
          item.quantity = event;
        }
      });
    };
    const mskuChange = (record, event) => {
      const index = record.index;
      data.tableData.map((item) => {
        if (item.index === index) {
          item.msku = event;
        }
      });
    };
    const batchCreate = () => {
      if (data.rowSelection.selectedRowKeys.length === 0) {
        return GjMessage.warning("至少选择一条要操作的数据");
      }

      getSkuRule({
        platformCode: "ALIEXPRESS",
        shopCode: shopId.value,
        variantCount: data.rowSelection.selectedRowKeys.length,
      }).then((res) => {
        const mskuList = res.data.sonRuleStr;
        data.rowSelection.selectedRowKeys.forEach((item, index) => {
          data.tableData[item].msku = mskuList[index];
        });
      });

      console.log("自动生成");
    };

    const setAreaPrice = () => {
      data.areaVisible = true;
    };

    const confirmAreaModal = (arr) => {
      data.areaVisible = false;
      data.tagList = [];
      areaList.forEach((item) => {
        arr.forEach((item1) => {
          if (item1 === item.value) {
            data.tagList.push(item);
          }
        });
      });

      setRetailColumns();
      setTable2Data();
      setTable3Data();
    };

    const setTable2Data = () => {
      data.table2Data = [];
      if (data.attr == 2) {
        data.tableData.forEach((item) => {
          let line = { ...item };
          data.tagList.forEach((item1) => {
            line[item1.value] = "";
          });
          data.table2Data.push(line);
        });
      } else if (data.attr == 1 && data.tagList.length > 0) {
        let line = {};
        data.tagList.forEach((item1) => {
          line[item1.value] = "";
        });
        data.table2Data.push(line);
      }
    };

    const setTable3Data = () => {
      console.log(data.table3Data);

      data.table3Data = [];

      if (data.attr == 2) {
        data.tableData.forEach((item) => {
          let line = { ...item };

          line["bulkOrder"] = "";
          line["wholesalePrice"] = "";

          data.table3Data.push(line);
        });
      } else if (data.attr == 1 && data.tagList.length > 0) {
        let line = {};

        line["recommendPrice"] = data.salseForm.recommendPrice;
        line["bulkOrder"] = "";
        line["wholesalePrice"] = "";

        data.table3Data.push(line);
      }

      bulkOrderChange();
      discountChange();
    };

    //单品是输入价格
    const monomerPriceChange = () => {
      console.log(data.salseForm.recommendPrice);
      if (data.table3Data.length > 0) {
        data.table3Data[0].recommendPrice = data.salseForm.recommendPrice;
      }
    };
    const bulkOrderChange = () => {
      data.table3Data.forEach((item) => {
        item.bulkOrder = data.bulkOrder;
      });
    };

    const discountChange = () => {
      data.table3Data.forEach((item) => {
        if (item.recommendPrice && data.bulkDiscount > 0) {
          item.wholesalePrice =
            item.recommendPrice * (1 - data.bulkDiscount / 100);
        } else {
          item.wholesalePrice = "-";
        }
      });
    };
    //选择区域模板
    const changeAreaTemplate = (val) => {
      getTemplateDetail(val).then((res) => {
        const arr =
          res.data?.configuration?.configurationDatas[0]?.dataList || [];
        const newArr = [];
        data.configurationType = res.data.configuration.configurationType;
        arr.forEach((item) => {
          areaList.forEach((item1) => {
            if (item.country === item1.value) {
              newArr.push(item1);
            }
          });
        });
        // 更新表格头数据
        data.tagList = newArr;

        setRetailColumns();
        setTable2Data();
        // 更新表格头内容
        data.table2Data.forEach((item) => {
          arr.forEach((item1) => {
            item[item1.country] = item1.price;
          });
        });

        setTable3Data();
      });
    };

    const cancelAreaModal = () => {
      data.areaVisible = false;
    };

    const setRetailColumns = () => {
      data.retailColumns = data.tagList.map((item) => {
        return {
          type: "self",
          title: `${item.label}零售价`,
          dataIndex: item.value,
          width: 180,
        };
      });
    };

    const closeTag = (index) => {
      data.tagList.splice(index, 1);

      setRetailColumns();
      areaModalRef.value.updataCheck(data.tagList.map((item) => item.value));
      setTable2Data();
      setTable3Data();
    };

    const syncSizePlat = () => {
      if (!shopId.value) {
        return GjMessage.warning("请先选择店铺");
      }
      syncPlatform({
        componentTypes: ["1"],
        shopId: [shopId.value],
        categoryId: platformCategoryId.value,
      }).then(() => {
        GjMessage.success("同步成功");
      });
    };

    const getSizePlat = () => {
      if (!shopId.value || !platformCategoryId.value) return;
      getPlatform({
        shopId: shopId.value,
        componentType: "5",
        categoryId: platformCategoryId.value,
      }).then((res) => {
        data.sizePlat = res.data;
      });
    };

    //批量录入区域价格
    const batchAreaPrice = () => {
      if (!data.batchAreaValue) {
        return GjMessage.warning("请输入区域价格");
      }
      if (!data.batchAreaKey) {
        return GjMessage.warning("请选择区域");
      }

      data.table2Data.forEach((item) => {
        item[data.batchAreaKey] = data.batchAreaValue;
      });
    };

    watch(
      () => props.attr,
      (newValue) => {
        data.attr = newValue;

        if (newValue === 1) {
          data.saveSalesInfo.tableData = [...data.tableData];
          data.saveSalesInfo.variantAttrInfo = [...data.variantAttrInfo];
          data.saveSalesInfo.table2Data = [...data.table2Data];
          data.saveSalesInfo.table3Data = [...data.table3Data];
          data.saveSalesInfo.batchSKU = data.batchSKU;
          data.saveSalesInfo.batchPrice = data.batchPrice;
          data.saveSalesInfo.batchNumber = data.batchNumber;
          data.saveSalesInfo.recommendPrice = data.salseForm.recommendPrice;
          data.saveSalesInfo.productUnit = data.salseForm.productUnit;
          data.saveSalesInfo.packageType = data.salseForm.packageType;
          data.saveSalesInfo.lotNum = data.salseForm.lotNum;
          data.saveSalesInfo.batchAreaKey = data.batchAreaKey;
          data.saveSalesInfo.batchAreaValue = data.batchAreaValue;
          data.saveSalesInfo.bulkOrder = data.bulkOrder;
          data.saveSalesInfo.bulkDiscount = data.bulkDiscount;
          data.saveSalesInfo.configurationType = data.configurationType;
          data.saveSalesInfo.tagList = data.tagList;
          data.saveSalesInfo.retailColumns = data.retailColumns;

          data.columns = [];
          setTable2Data();
          setTable3Data();
        } else {
          if (isSaveMoreAttrFalg.value) {
            if (JSON.stringify(data.saveSalesInfo) == "{}") return;
            data.tableData = [...data.saveSalesInfo?.tableData];
            data.variantAttrInfo = [...data.saveSalesInfo?.variantAttrInfo];
            data.table2Data = [...data.saveSalesInfo?.table2Data];
            data.table3Data = [...data.saveSalesInfo?.table3Data];
            data.batchSKU = data.saveSalesInfo?.batchSKU;
            data.batchPrice = data.saveSalesInfo?.batchPrice;
            data.batchNumber = data.saveSalesInfo?.batchNumber;
            data.salseForm.recommendPrice = data.saveSalesInfo?.recommendPrice;
            data.salseForm.productUnit = data.saveSalesInfo?.productUnit;
            data.salseForm.packageType = data.saveSalesInfo?.packageType;
            data.salseForm.lotNum = data.saveSalesInfo?.lotNum;
            data.batchAreaKey = data.saveSalesInfo?.batchAreaKey;
            data.batchAreaValue = data.saveSalesInfo?.batchAreaValue;
            data.bulkOrder = data.saveSalesInfo?.bulkOrder;
            data.bulkDiscount = data.saveSalesInfo?.bulkDiscount;
            data.configurationType = data.saveSalesInfo?.configurationType;
            data.tagList = [...data.saveSalesInfo?.tagList];
            data.retailColumns = [...data.saveSalesInfo?.retailColumns];
          }
        }
      }
    );

    watch(
      () => props.variantAttrInfo,
      (value, old) => {
        console.log(value, old);
        data.incrementalDKR = [];
        data.incrementalIdDKR = [];
        let newvalue = value.map((item) => {
          let newValueName = item.values
            ? item.values.map((item1) => {
                return {
                  ...item1,
                  visible: true,
                  check: false,
                };
              })
            : [];

          console.log(newValueName);
          return {
            ...item,
            values: newValueName,
            attrValues: [],
          };
        });

        data.variantAttrInfo = newvalue;
        data.columns = newvalue.map((item) => {
          return {
            id: item.id,
            zhName: item.zhName,
            title: item.zhName,
            dataIndex: item.zhName,
          };
        });
        console.log(data.columns);
        data.tableOldData = [];
        data.tableData = [];
        data.table2Data = [];
        data.table3Data = [];
        //编辑复显逻辑
        if (JSON.stringify(data.editData) != "{}") {
          const variantAttrInfoList = data.editData.variantAttrInfoList || [];

          //变体回显
          data.tableData = data.editData.variants.map((item, index) => {
            const newItem = {
              ...item,
              index,
            };
            item.variationSkuAttr.forEach((item1) => {
              newItem[item1.attrName] = item1.attrValueDefinitionName
                ? item1.attrValueDefinitionName
                : item1.attrValueName;
            });

            return newItem;
          });
          data.variantAttrInfo.forEach((item1) => {
            variantAttrInfoList.forEach((item2) => {
              if (item1.id == item2.attrId) {
                //找到属性已勾选的属性值
                item1.values.forEach((select1) => {
                  item2.attrValues.forEach((select2) => {
                    if (select1.id == select2.attrValueId) {
                      select1.visible = false;
                      select1.check = true;
                      item1.attrValues.push({
                        ...select1,
                        attrValueDefinitionName:
                          select2.attrValueDefinitionName,
                      });
                    }
                  });
                });
              }
            });
          });

          //保存变体图片信息
          saveCustomizedPic();

          echoAreaPriceAndTradePrice();
        }
      },
      { deep: true }
    );

    watch(
      () => props.areaPlat,
      (newValue) => {
        data.areaPlat = newValue;
        data.areatemplateId = "";
      }
    );

    watch(
      () => props.editInfo,
      (newValue) => {
        if (JSON.stringify(newValue) != "{}") {
          data.editData = JSON.parse(JSON.stringify(newValue));
          data.salseForm.recommendPrice = newValue.recommendPrice;
          data.salseForm.lotNum = newValue.lotNum;
          data.salseForm.productUnit = newValue.productUnit;
          data.salseForm.packageType = newValue.packageType ? 1 : 0;
          data.attr = newValue.specsType;
          data.bulkOrder = newValue.bulkOrder;
          data.bulkDiscount = newValue.bulkDiscount;
          data.bulkPrice = newValue.bulkPrice;

          data.editAreaInfo = newValue.aeopNationalQuoteConfiguration;

          if (newValue.specsType == 1) {
            echoAreaPriceAndTradePrice();
          }
        }
      },
      { deep: true }
    );

    watch(
      () => platformCategoryId.value,
      () => {
        getSizePlat();

        //切换分类 清空数据
        data.batchSKU = "";
        data.batchPrice = "";
        data.batchNumber = "";
        data.salseForm.recommendPrice = "";
        data.salseForm.productUnit = "";
        data.salseForm.packageType = "";
        data.salseForm.lotNum = "";
        data.batchAreaKey = "";
        data.batchAreaValue = "";
        data.bulkOrder = "";
        data.bulkDiscount = 0;
        data.configurationType = "absolute";
        data.tagList = [];
        data.table2Data = [];
        data.table3Data = [];
        data.retailColumns = [];
      }
    );

    watch(
      () => shopId.value,
      () => {
        // getAreaPlat()
        getSizePlat();
      }
    );
    watch(
      () => props.skuList,
      (newValue) => {
        data.skuList = newValue;
      }
    );
    watch(
      () => data.table3Data,
      (newValue) => {
        data.table3Data = [...newValue];
      }
    );

    const echoAreaPriceAndTradePrice = () => {
      const aeopNationalQuoteConfiguration = data.editAreaInfo;
      data.tagList = [];
      if (aeopNationalQuoteConfiguration) {
        data.configurationType =
          aeopNationalQuoteConfiguration?.configurationType;

        const countryVal =
          aeopNationalQuoteConfiguration?.configurationDatas[0]?.dataList?.map(
            (item) => item.country
          ) || [];

        areaList.forEach((item) => {
          countryVal.forEach((item1) => {
            if (item.value == item1) {
              data.tagList.push(item);
            }
          });
        });
      }
      areaModalRef.value.updataCheck(data.tagList.map((item) => item.value));
      setRetailColumns();
      setTable2Data();
      data.table2Data.forEach((item, index) => {
        aeopNationalQuoteConfiguration?.configurationDatas[
          index
        ].dataList.forEach((item1) => {
          item[item1.country] = item1.price;
        });
      });
      setTable3Data();
      bulkOrderChange();
      console.log(data.table3Data);
    };
    return {
      ...toRefs(data),
      attrValueDefinitionNamechange,
      addAttr,
      batchEntry,
      deleteAttr,
      handleOk,
      handleCancel,
      priceChange,
      switchChange,
      submitForm,
      resetForm,
      table1Colums,
      table2Colums,
      table3Colums,
      areaModalRef,
      quantityChange,
      batchCreate,
      setAreaPrice,
      areaList,
      confirmAreaModal,
      cancelAreaModal,
      closeTag,
      syncSizePlat,
      getSizePlat,
      // getAreaPlat,
      batchAreaPrice,
      changeAreaTemplate,
      setTable2Data,
      setTable3Data,
      monomerPriceChange,
      discount,
      discountChange,
      bulkOrderChange,
      maxRange,
      packageTypeChange,
      customValidatorSKU,
      customValidatorQuantity,
      customValidatorPrice,
      customValidatorPrice1,
      customValidatorUnit,
      customValidatorType,
      customValidatorNum,
      mskuChange,
      customValidatorAttrValue,
      // showAddAttrBut,
    };
  },
});
</script>
<style lang="scss" scoped>
.blockBox {
  .content {
    display: flex;
    flex-wrap: wrap;
    .item {
      min-width: 160px;
      margin-right: 16px;
      margin-bottom: 8px;
    }
  }
  .title {
    padding-top: 12px;
    font-size: 14px;
    margin-bottom: 16px;
    font-weight: 600;
  }
  .content-wrap {
    box-sizing: border-box;
    padding: 0 16px 0 8px;
    .dafault-attr-wrap {
      border-radius: 5px 5px 0 0;
      border: 1px solid #e9e9ef;
      margin-bottom: 16px;

      .table-title {
        height: 32px;
        display: flex;
        align-items: center;
        background: #f2f2f5;
        border-radius: 5px 5px 0 0;
        display: flex;
        .div1 {
          padding-left: 22px;
          font-size: 12px;
          width: 150px;
        }
        .div2 {
          padding-left: 22px;
          font-size: 12px;
          flex: 1;
        }
      }

      .table-column {
        min-height: 50px;
        display: flex;
        align-items: center;
        border-top: 1px solid #f2f2f5;
        .div1 {
          padding-left: 22px;
          font-size: 12px;
          width: 150px;
        }
        .div2 {
          padding-left: 22px;
          font-size: 12px;
          flex: 1;
        }
      }
      .attrName {
        font-size: 12px;
        background: #ffffff;
        border-radius: 16px;
        border: 1px solid #d9d9e0;
        padding: 8px 12px;
        color: rgba(0, 4, 48, 0.8);
      }
      .star {
        color: #ff5c5c;
      }
      .value-wrap {
        display: flex;
        flex-wrap: wrap;
        flex: 1;
        /deep/.arco-form-item-content {
          flex-wrap: wrap;
        }
      }

      .button-wrap {
        display: flex;
        align-items: center;
        margin-right: 7px;
      }
      .valueItem {
        height: 32px;
        border: 1px solid #d9d9e0;
        border-radius: 16px;
        position: relative;
        padding-right: 12px;
        margin-right: 5px;
        margin: 5px 5px 5px 0px;
        :deep(.arco-input-prepend) {
          background-color: #fff;
          border-radius: 16px 0 0 16px;
          min-width: 20px;
          border: none;
        }
        :deep(.arco-input-wrapper) {
          border-radius: 0 16px 16px 0;
          background-color: #fff;
          width: 100px;
          border: none;
          border-left: 1px solid #d9d9e0;
        }

        :deep(.arco-input-focus) {
          border: none;
        }

        .closeBtn {
          position: absolute;
          cursor: pointer;
          top: 8px;
          right: 10px;
        }
      }
    }
    .region {
      .regionTitle {
        height: 28px;
        .span1 {
          font-weight: 600px;
        }
      }
      .modify {
        .label {
          height: 16px;
          font-size: 12px;
          line-height: 16px;
          margin-bottom: 4px;
        }
        .selsetCon {
          width: 316px;
          margin-bottom: 16px;
        }
      }
      .regionTag {
        background: #ffffff;
        border-radius: 16px;
        border: 1px solid #d9d9e0;
        color: rgba(0, 4, 48, 0.8);
        margin-right: 4px;
      }

      .gapContain {
        display: flex;
        flex-wrap: wrap;
        gap: 8px 4px;
      }
    }

    .retail {
      .retailItem {
        width: 100%;
      }
      .label {
        height: 16px;
        font-size: 12px;
        line-height: 16px;
        margin-bottom: 4px;
      }
      .selsetCon {
        width: 316px;
        margin-bottom: 16px;
        display: inline-block;
        /deep/.arco-input-group {
          width: 100%;
        }
      }
    }

    .wholesale {
      .sp1 {
        margin-right: 8px;
      }
      .sp2 {
        margin: 0 8px;
      }
      .sp3 {
        margin-left: 8px;
      }

      .input {
        width: 261px;
      }
    }
  }
}
.squre-line {
  padding: 12px;
  box-sizing: border-box;
  width: 100%;
  border: 1px solid #e6e6ed;
  border-radius: 8px;
  margin-bottom: 10px;
}
.mb16 {
  margin-bottom: 16px;
}
.span1 {
  display: inline-block;
  height: 28px;
  line-height: 28px;
}
.span2 {
  height: 32px;
  line-height: 32px;
}
</style>
