// 销售信息
<template>
  <div class="basic-info" id="variantInfo-ebay">
    <!-- v-show="$store.getters.getgoodsData.specsType == 2" -->
    <h2 class="title">销售信息</h2>
    <gj-form
      ref="variantForm"
      :model="variantInfo"
      class="basic-info-form"
      :label-col-props="{ span: 24 }"
      :wrapper-col-props="{ span: 24 }"
      :rules="rules"
      @submit="submitForm"
    >
      <!-- 变体信息-->
      <div
        v-show="
          $store.getters.getgoodsData.specsType == 2 &&
          $store.getters.getdraftData.listingType == 'FixedPriceItem'
        "
      >
        <gj-row :gutter="24">
          <gj-col :span="24">
            <gj-table
              :data-source="variantInfo.templateData"
              :columns="fastColumns"
              bordered
              row-key="id"
              ref="noteTable"
              :pagination="false"
            >
              <template #bodyCell="{ record, index, column }">
                <template v-if="column.dataIndex === 'attrName'">
                  <div>
                    <span class="attr-header-name" v-show="record.attrName">
                      {{ record.attrName }}
                    </span>
                    <gj-button
                      class="mr"
                      type="text"
                      v-if="!record.attrName && !record.isAttrName"
                      @click="addAttrName(record, index)"
                      >添加属性名
                    </gj-button>

                    <gj-space class="mr" v-show="record.isAttrName">
                      <gj-select
                        v-model="record.attrName"
                        placeholder="按回车完成输入"
                        allow-clear
                        allow-create
                        :style="{ width: '130px' }"
                        @change="
                          selectNameChangs(record, index, record.attrName)
                        "
                      >
                        <gj-option
                          v-for="item in personListOptAttr"
                          :key="item.userId"
                          :value="item.userId"
                          >{{ item.userName }}</gj-option
                        >
                      </gj-select>
                    </gj-space>
                  </div>
                </template>
                <template v-if="column.dataIndex === 'attrValue'">
                  <div>
                    <gj-space
                      v-for="(item, i) in record.list"
                      :key="item"
                      class="mr"
                    >
                      <div class="attr-val-box">
                        <span> {{ item }}</span>
                        <SvgIcon
                          svgClass="closeIcon"
                          :width="24"
                          @click="closeAttrVal(i, index)"
                        ></SvgIcon>
                      </div>
                    </gj-space>
                    <gj-button
                      class="mr"
                      type="text"
                      v-if="!record.isAttrValue"
                      @click="addAttrVal(record, index)"
                      >添加属性值
                    </gj-button>

                    <gj-space v-else class="mr">
                      <gj-select
                        v-model="record.selectValue"
                        placeholder="按回车完成输入"
                        allow-create
                        allow-clear
                        :style="{ width: '127px' }"
                        @change="
                          selectValChangs(record, index, record.selectValue)
                        "
                      >
                        <gj-option
                          v-for="item in personListOptAttr"
                          :key="item.userId"
                          :value="item.userId"
                          >{{ item.userName }}</gj-option
                        >
                      </gj-select>
                    </gj-space>
                  </div>
                </template>
                <template v-if="column.dataIndex === 'operation'">
                  <div>
                    <gj-space>
                      <SvgIcon
                        svgClass="addTitle"
                        :width="24"
                        v-show="(index) => 0"
                        @click="addTitile"
                      ></SvgIcon>
                      <SvgIcon
                        svgClass="subtract"
                        v-show="index !== 0"
                        :width="24"
                        @click="removeTitile(index)"
                      ></SvgIcon>
                    </gj-space>
                  </div>
                </template>
              </template>
            </gj-table>
          </gj-col>
        </gj-row>
        <gj-row :gutter="24">
          <gj-col :span="8">
            <gj-form-item
              field=""
              :label-col-style="{ 'justify-content': 'flex-start' }"
              label="建议售价"
            >
              <gj-input-number
                v-model="variantInfo.recommendPrice"
                :max-length="255"
                placeholder="请输入"
                allow-clear
                show-word-limit
              />
            </gj-form-item>
          </gj-col>
          <gj-col :span="8">
            <gj-form-item
              field="upc"
              :label-col-style="{ 'justify-content': 'flex-start' }"
              label="UPC"
            >
              <gj-select
                v-model="variantInfo.upc"
                placeholder="请选择"
                allow-clear
              >
                <gj-option
                  v-for="item in ListOpt"
                  :key="item.userId"
                  :value="item.userId"
                  >{{ item.userName }}</gj-option
                >
              </gj-select>
              <gj-button type="text" @click="setEntry">批量录入</gj-button>
            </gj-form-item>
          </gj-col>
        </gj-row>
        <gj-row :gutter="24">
          <gj-col :span="24">
            <gj-table
              :data-source="variantInfo.tableData"
              row-key="id"
              :columns="columns"
              bordered
              ref="noteTable"
              :pagination="false"
              :row-selection="rowSelection"
            >
              <template #headerCell="{ title, column }">
                <template v-if="column.dataIndex == 'msku'">
                  <span>{{ title }}</span>
                  <gj-button
                    class="position-abslot"
                    @click="getGeneralSku"
                    size="small"
                    type="text"
                  >
                    自动生成
                  </gj-button>
                </template>
                <template v-else>
                  <span>{{ title }}</span>
                </template>
              </template>
              <template #bodyCell="{ index, record, column, recordIndexs }">
                <template v-if="column.type === 'add'">
                  <span v-if="!record?.isAttr">{{
                    record[column.dataIndex]
                  }}</span>

                  <div v-else>
                    <gj-space class="mr">
                      <gj-select
                        placeholder="按回车完成输入"
                        allow-create
                        allow-clear
                        :v-model="record[column.dataIndex]"
                        :style="{ maxWidth: '127px' }"
                        @popup-visible-change="
                          tableSelectPopupFun(column.dataIndex)
                        "
                        @change="saveTableSelectPopupFun"
                      >
                        <gj-option
                          v-for="(item, index) in selectOpt"
                          :key="index"
                          :value="item.attrValue"
                          >{{ item.attrValue }}</gj-option
                        >
                      </gj-select>
                    </gj-space>
                  </div>
                </template>
                <!-- 店铺SKU -->
                <template v-if="column.type === 'input-sku'">
                  <div v-if="!record?.isAttr">
                    <gj-input
                      :style="{ maxWidth: '214px' }"
                      v-model="variantInfo.tableData[recordIndexs[0]].msku"
                      placeholder="请输入"
                      allow-clear
                    />
                  </div>
                </template>
                <template v-if="column.type === 'input-Price'">
                  <div v-if="!record?.isAttr">
                    <gj-input-number
                      :style="{ maxWidth: '214px' }"
                      v-model="variantInfo.tableData[recordIndexs[0]].Price"
                      placeholder="请输入"
                      allow-clear
                    >
                      <template #prepend>
                        {{ variantInfo.priceUnit }}
                      </template>
                    </gj-input-number>
                  </div>
                </template>
                <template v-if="column.type === 'input-crossedPrice'">
                  <div v-if="!record?.isAttr">
                    <gj-input-number
                      :style="{ maxWidth: '214px' }"
                      v-model="
                        variantInfo.tableData[recordIndexs[0]].crossedPrice
                      "
                      placeholder="请输入"
                      allow-clear
                    >
                      <template #prepend>
                        {{ variantInfo.priceUnit }}
                      </template>
                    </gj-input-number>
                  </div>
                </template>
                <template v-if="column.type === 'input-quantity'">
                  <div v-if="!record?.isAttr">
                    <gj-input-number
                      :style="{ maxWidth: '214px' }"
                      v-model="variantInfo.tableData[recordIndexs[0]].quantity"
                      placeholder="请输入"
                      allow-clear
                    >
                    </gj-input-number>
                  </div>
                </template>
                <template v-if="column.dataIndex === 'msku'">
                  <span v-if="record?.isAttr">
                    <gj-space>
                      <gj-button shape="round" @click="closeTableBtn"
                        >取消</gj-button
                      >
                      <gj-button
                        shape="round"
                        type="outline"
                        @click="saveTableBtn(record, recordIndexs)"
                        >保存</gj-button
                      >
                    </gj-space>
                  </span>
                </template>
                <template v-if="column.dataIndex === 'upc'">
                  <div v-if="!record?.isAttr">
                    <gj-select
                      placeholder="选择"
                      v-model="variantInfo.tableData[recordIndexs[0]].upc"
                      allow-clear
                      :style="{ maxWidth: '214px' }"
                    >
                      <gj-option
                        v-for="item in tableOptUpc"
                        :key="item.userId"
                        :value="item.userId"
                        >{{ item.userName }}</gj-option
                      >
                    </gj-select>
                  </div>
                  <span v-else></span>
                </template>
                <template v-if="column.dataIndex === 'sku'">
                  <div v-if="!record?.isAttr" class="validate-lable">
                    <gj-form-item
                      :hide-label="true"
                      field="sku"
                      :rules="sku"
                      :validate-trigger="['change', 'input', 'blur']"
                      class="validate-lable-select"
                    >
                      <gj-select
                        placeholder=""
                        :style="{ maxWidth: '214px' }"
                        :trigger-props="{ autoFitPopupMinWidth: true }"
                        @popup-visible-change="selectPopupFun"
                        allow-clear
                        v-model="variantInfo.tableData[recordIndexs[0]].sku"
                      >
                        <gj-option
                          v-for="item in productOpt"
                          :key="item.sku"
                          :value="item.sku"
                          :label="item.skuName"
                          :disabled="item.disabled"
                          >{{ item.skuName }}</gj-option
                        >
                      </gj-select>
                    </gj-form-item>
                  </div>
                  <span v-else></span>
                </template>

                <template v-if="column.dataIndex === 'optional'">
                  <div v-if="!record?.isAttr">
                    <gj-space>
                      <SvgIcon
                        v-if="isTableOk"
                        svgClass="addTitle"
                        :width="24"
                        @click="addTitileTable(index)"
                      ></SvgIcon>
                      <SvgIcon
                        svgClass="subtract"
                        :width="24"
                        @click="removeTitileTable(index)"
                      ></SvgIcon>
                    </gj-space>
                  </div>
                  <span v-else></span>
                </template>
              </template>
            </gj-table>
          </gj-col>
        </gj-row>
      </div>
      <!-- 销售信息 -->
      <gj-row :gutter="24">
        <gj-col :span="8">
          <gj-form-item
            :label-col-style="{ 'justify-content': 'flex-start' }"
            label="私人购买"
          >
            <gj-switch
              size="small"
              v-model="variantInfo.privateListingEnable"
              :checked-value="true"
              :unchecked-value="false"
            /><span class="mr">允许买家匿名购买</span>
          </gj-form-item>
        </gj-col>
        <!-- 销售类型为拍卖时 -->
        <gj-col
          :span="8"
          v-show="$store.getters.getdraftData.listingType == 'Chinese'"
        >
          <gj-form-item
            :label-col-style="{ 'justify-content': 'flex-start' }"
            label="刊登天数"
            :field="
              $store.getters.getdraftData.listingType == 'Chinese'
                ? 'listingDuration'
                : 'ss'
            "
          >
            <gj-input
              placeholder="请选择"
              v-model="variantInfo.listingDuration"
            >
              <template #prepend> 天 </template>
            </gj-input>
          </gj-form-item>
        </gj-col>
        <gj-col
          :span="8"
          v-show="$store.getters.getdraftData.listingType == 'Chinese'"
        >
          <gj-form-item
            :label-col-style="{ 'justify-content': 'flex-start' }"
            label="起拍价"
            :field="
              $store.getters.getdraftData.listingType == 'Chinese'
                ? 'startPrice'
                : 'ss'
            "
          >
            <gj-input-number
              placeholder="请选择"
              v-model="variantInfo.startPrice"
            >
              <template #prepend> {{ variantInfo.priceUnit }} </template>
            </gj-input-number>
          </gj-form-item>
        </gj-col>
        <gj-col
          :span="8"
          v-show="$store.getters.getdraftData.listingType == 'Chinese'"
        >
          <gj-form-item
            :label-col-style="{ 'justify-content': 'flex-start' }"
            label="保底价"
          >
            <gj-input placeholder="请选择" v-model="variantInfo.reservePrice">
              <template #prepend> {{ variantInfo.priceUnit }} </template>
            </gj-input>
          </gj-form-item>
        </gj-col>
        <gj-col
          :span="8"
          v-show="$store.getters.getdraftData.listingType == 'Chinese'"
        >
          <gj-form-item
            :label-col-style="{ 'justify-content': 'flex-start' }"
            label="一口价"
          >
            <gj-input placeholder="请选择" v-model="variantInfo.buyItNowPrice">
              <template #prepend> {{ variantInfo.priceUnit }} </template>
            </gj-input>
          </gj-form-item>
        </gj-col>
        <gj-col
          :span="8"
          v-show="$store.getters.getdraftData.listingType == 'Chinese'"
        >
          <gj-form-item
            :label-col-style="{ 'justify-content': 'flex-start' }"
            label="批量销售"
          >
            <gj-switch
              v-model="variantInfo.shippingIncludedInTax"
              :checked-value="true"
              :unchecked-value="false"
            /><span class="mr">已关闭</span>
          </gj-form-item>
        </gj-col>
        <gj-col
          :span="8"
          v-show="$store.getters.getdraftData.listingType == 'Chinese'"
        >
          <gj-form-item
            :label-col-style="{ 'justify-content': 'flex-start' }"
            label="批发数量"
          >
            <gj-input-number placeholder="请选择" v-model="variantInfo.lotSize">
            </gj-input-number>
          </gj-form-item>
        </gj-col>
        <!-- end -->
        <!-- 销售类型为固定时，规格为单品时 -->
        <gj-col
          :span="8"
          v-show="
            $store.getters.getdraftData.listingType == 'FixedPriceItem' &&
            $store.getters.getgoodsData.specsType == 1
          "
        >
          <gj-form-item
            :label-col-style="{ 'justify-content': 'flex-start' }"
            label="价格"
          >
            <gj-input-number
              placeholder="请选择"
              v-model="variantInfo.recommendPrice"
            >
              <template #prepend> {{ variantInfo.priceUnit }} </template>
            </gj-input-number>
          </gj-form-item>
        </gj-col>
        <gj-col
          :span="8"
          v-show="
            $store.getters.getdraftData.listingType == 'FixedPriceItem' &&
            $store.getters.getgoodsData.specsType == 1
          "
        >
          <gj-form-item
            :label-col-style="{ 'justify-content': 'flex-start' }"
            label="库存"
          >
            <gj-input-number
              placeholder="second"
              v-model="variantInfo.quantity"
            >
            </gj-input-number>
          </gj-form-item>
        </gj-col>
        <!-- end -->
        <gj-col :span="8">
          <gj-form-item
            :label-col-style="{ 'justify-content': 'flex-start' }"
            label="销售税率"
          >
            <gj-input-group>
              <gj-select
                :trigger-props="{ autoFitPopupMinWidth: true }"
                :options="juridictionOpt"
                :style="{ width: '90px' }"
                placeholder="请选择"
                v-model="variantInfo.taxJurisdiction"
                @popup-visible-change="getEbayTaxJuridictions"
              >
                <gj-option
                  v-for="item in juridictionOpt"
                  :key="item.juridictionCode"
                  :value="item.juridictionCode"
                  :label="item.juridictionEnName"
                  >{{ item.juridictionEnName }}</gj-option
                >
              </gj-select>
              <gj-input-number
                placeholder="second"
                v-model="variantInfo.salesTaxPercent"
              >
                <template #append> {{ variantInfo.priceUnitCode }} </template>
              </gj-input-number>
            </gj-input-group>
          </gj-form-item>
        </gj-col>
        <gj-col :span="8">
          <gj-form-item
            :label-col-style="{ 'justify-content': 'flex-start' }"
            label="运费包含销售税"
          >
            <gj-switch
              v-model="variantInfo.shippingIncludedInTax"
              :checked-value="true"
              :unchecked-value="false"
            /><span class="mr">已关闭</span>
          </gj-form-item>
        </gj-col>
        <gj-col :span="8">
          <gj-form-item
            :label-col-style="{ 'justify-content': 'flex-start' }"
            label="VAT税率"
          >
            <gj-input-number
              placeholder="second"
              v-model="variantInfo.vatTaxPercent"
            >
              <template #append> {{ variantInfo.priceUnitCode }} </template>
            </gj-input-number>
          </gj-form-item>
        </gj-col>

        <gj-col
          :span="24"
          v-show="
            $store.getters.getdraftData.listingType == 'FixedPriceItem' &&
            $store.getters.getgoodsData.specsType == 1
          "
        >
          <div>
            <gj-row :gutter="24" class="box-price">
              <gj-col :span="8">
                <gj-form-item
                  :label-col-style="{ 'justify-content': 'flex-start' }"
                  label="接受议价"
                >
                  <gj-switch
                    size="small"
                    v-model="variantInfo.bestOfferEnabled"
                    :checked-value="true"
                    :unchecked-value="false"
                  /><span class="mr">{{
                    variantInfo.bestOfferEnabled ? "已开启" : "已关闭"
                  }}</span>
                </gj-form-item>
              </gj-col>
              <gj-col :span="8">
                <div class="box-price-bast">
                  <gj-switch
                    size="small"
                    v-model="variantInfo.autoAcceptPriceEnabled"
                    :checked-value="true"
                    :unchecked-value="false"
                  ></gj-switch>
                  <span class="mr">{{
                    variantInfo.bestOfferEnabled
                      ? "自动接受价格"
                      : "自动接受价格"
                  }}</span>
                </div>
                <div>
                  <gj-input-number
                    placeholder="second"
                    :disabled="!variantInfo.autoAcceptPriceEnabled"
                    v-model="variantInfo.bestOfferAutoAcceptPrice"
                  >
                    <template #prepend>
                      {{ variantInfo.priceUnit }}
                    </template>
                  </gj-input-number>
                </div>
              </gj-col>
              <gj-col :span="8">
                <div class="box-price-bast">
                  <gj-switch
                    size="small"
                    v-model="variantInfo.offerPriceEnabled"
                    :checked-value="true"
                    :unchecked-value="false"
                  /><span class="mr">{{
                    variantInfo.bestOfferEnabled
                      ? "自动拒绝价格"
                      : "自动拒绝价格"
                  }}</span>
                </div>
                <div>
                  <gj-input-number
                    placeholder="second"
                    :disabled="!variantInfo.offerPriceEnabled"
                    v-model="variantInfo.minimumBestOfferPrice"
                  >
                    <template #prepend>
                      {{ variantInfo.priceUnit }}
                    </template>
                  </gj-input-number>
                </div>
                <!-- </gj-form-item> -->
              </gj-col>
            </gj-row>
          </div>
        </gj-col>
      </gj-row>
    </gj-form>
  </div>
</template>

<script>
import { getCurrentInstance, reactive, toRefs, watch } from "vue";
import { setForm } from "@/utils/fnBusiness";
import { getSkuRule } from "@/api/public";
import { useStore } from "vuex";
import { calcDescartes } from "@/utils/common";
import SvgIcon from "@/components/SvgIcon";
import { getSkuListBySpu } from "@/api/public";
import { GjMessage } from "@gj/atom";
import {
  getQueryEbayTaxJuridictions,
  // getOnlyQueryEbayBaseSiteInfo,
} from "@/api/published/ebay.js";
export default {
  emits: ["setShowItemFun", "attrFun"],
  components: {
    SvgIcon,
  },
  props: {
    actionType: {
      type: String,
      default: () => {
        return "";
      },
    },
    publicList: {
      type: Array,
      default: () => {
        return [];
      },
    },
    goodsRowData: {
      type: Object,
      default: () => {
        return {};
      },
    },
    stroeCategoryId: {
      type: String,
      default: () => {
        return "";
      },
    },
  },
  setup(props) {
    const { proxy } = getCurrentInstance();
    const store = useStore();
    const key = "variantInfo";
    const data = reactive({
      fastColumns: [
        {
          title: "属性名",
          dataIndex: "attrName",
          width: 220,
        },
        {
          title: "属性值",
          dataIndex: "attrValue",
        },
        {
          title: "操作",
          dataIndex: "operation",
          width: 120,
        },
      ],
      variantInfo: {
        recommendPrice: null,
        upc: "",
        templateData: [
          {
            attrName: "",
            attrValue: "",
            id: 0,
            isAttrValue: false,
            list: [],
            selectValue: "",
            isAttrName: false,
          },
        ], // table 变体属性数据
        tableData: [], // table 变体数据
        privateListingEnable: false,
        shippingIncludedInTax: false,
        taxJurisdiction: "", //销售税管辖地区
        salesTaxPercent: null, //销售税率
        bestOfferEnabled: false, //是否接受议价 ,
        priceUnit: "",
        priceUnitCode: "%",
        offerPriceEnabled: false, //是否启用自动拒绝价格
        minimumBestOfferPrice: null, //自动拒绝价格
        autoAcceptPriceEnabled: false, //是否启用自动接受价格 ,
        bestOfferAutoAcceptPrice: null, // 自动接受价格
        vatTaxPercent: null,
        lotSize: null,
        buyItNowPrice: null,
        reservePrice: null,
        startPrice: null,
        listingDuration: "",
      },
      juridictionOpt: [],
      rowSelection: {
        selectRows: [],
        onChange: (selectedRowKeys) => {
          data.rowSelection.selectRows = selectedRowKeys;
        },
      },
      personListOptAttr: [],
      personListOpt: [
        {
          userId: store.getters.getgoodsData.picture.value,
          userName: store.getters.getgoodsData.picture.value,
        },
      ],
      productOpt: [], //关联spu
      tableOptUpc: [{ userId: "Dose not apply", userName: " Dose not apply" }],
      ListOpt: [{ userId: "Dose not apply", userName: " Dose not apply" }],
      rules: {
        startPrice: [{ required: true, message: "起拍价必填" }],
        listingDuration: [{ required: true, message: "刊登天数必填" }],
      },
      sku: [
        {
          required: true,
          message: "请选择sku",
          validator: (value, cb) => {
            return new Promise((resolve) => {
              setTimeout(() => {
                if (
                  !data.variantInfo.tableData.find((item) => item.sku.trim())
                ) {
                  cb("请选择sku");
                }
                resolve();
              }, 100);
            });
          },
        },
      ],
      otherColumns: [
        {
          title: "店铺SKU",
          dataIndex: "msku",
          type: "input-sku",
          width: 200,
        },
        {
          title: "价格（币种）",
          dataIndex: "Price",
          type: "input-Price",
          numberType: "input",
          minWidth: 140,
        },
        {
          title: "划线价（币种）",
          dataIndex: "crossedPrice",
          type: "input-crossedPrice",
          numberType: "input",
          minWidth: 140,
        },
        {
          title: "数量",
          dataIndex: "quantity",
          type: "input-quantity",
          numberType: "input",
          minWidth: 140,
        },
        {
          title: "upc",
          dataIndex: "upc",
          type: "select",
        },
        {
          title: "关联SKU",
          dataIndex: "sku",
          type: "select",
          minWidth: 240,
        },
        {
          title: "操作",
          dataIndex: "optional",
          type: "optional",
          maxWidth: 150,
        },
      ],
      columns: [], // 自定义属性列
      // 选择SKU的弹框
      actionDialogVisible: false,
      // 记录删除行之后剩余的列的value，用于添加行的DKR计算
      filterColumnsKeyValueFied: [],
      initDataList: [], //表格中的新增
      isTableOk: false,
      selectOpt: [],
      nodeCols: [],
      selectFlagName: "",
    });
    const submitForm = () => {
      return setForm(proxy, key, data[key], "variantForm");
    };
    const resetForm = () => {
      proxy.$refs.variantForm.resetFields();
    };
    const addTitile = () => {
      data.variantInfo.templateData.push({
        attrName: "",
        attrValue: "",
        isAttrValue: false,
        selectValue: "",
        list: [],
        id: data.variantInfo.templateData.length,
      });
      data.variantInfo.templateData = [...data.variantInfo.templateData];
    };
    const removeTitile = (index) => {
      data.variantInfo.templateData.splice(index, 1);
      data.variantInfo.templateData = [...data.variantInfo.templateData];
    };

    const removeTitileTable = (index) => {
      // 释放删除的关联sku
      data.productOpt = data.productOpt.map((i) => {
        return {
          ...i,
          disabled:
            data.variantInfo.tableData[index]?.sku == i.spuName
              ? false
              : i.disabled,
        };
      });
      // 删除的数据
      data.isTableOk = true;
      data.initDataList.push(data.variantInfo.tableData[index]);
      data.variantInfo.tableData.splice(index, 1);
      data.variantInfo.tableData = data.variantInfo.tableData.map(
        (item, index) => {
          return {
            ...item,
            id: index,
          };
        }
      );
    };
    //表格取消
    const closeTableBtn = () => {
      data.variantInfo.tableData.splice(0, 1);
      data.variantInfo.tableData = data.variantInfo.tableData.map(
        (item, index) => {
          return {
            ...item,
            id: index,
          };
        }
      );
      if (data.initDataList.length == 0) {
        data.isTableOk = false;
      }
    };
    // 表格确定
    const saveTableBtn = (row) => {
      let isBur = false;
      let sum = 0;
      data.nodeCols.forEach((ele) => {
        data.initDataList.forEach((item, index) => {
          if (item[ele] == row[ele]) {
            isBur = true;
            sum = index;
          } else {
            isBur = false;
          }
        });
      });
      if (isBur) {
        console.log("对比", sum);
        data.variantInfo.tableData.push(data.initDataList[sum]);
        data.variantInfo.tableData = data.variantInfo.tableData.map(
          (item, index) => {
            return {
              ...item,
              id: index,
            };
          }
        );
        data.initDataList.splice(sum, 1);
      } else {
        return GjMessage.warning("只能添加删除的数据，请重新选择");
      }
    };

    const addTitileTable = () => {
      if (!data.variantInfo.tableData[0].isAttr) {
        let newObj = {
          // obj: data.variantInfo.tableData[0],
          isAttr: true,
        };
        let obj = data.variantInfo.tableData[0];
        Object.keys(obj).forEach((key) => {
          newObj[key] = "";
        });
        data.variantInfo.tableData.unshift(newObj);
        data.variantInfo.tableData = data.variantInfo.tableData.map(
          (item, index) => {
            return {
              ...item,
              id: index,
            };
          }
        );
      }
    };
    //添加属性值
    const addAttrVal = (row, index) => {
      if (row.attrName.length == 0) {
        return GjMessage.warning("请先在表格中操作属性名。");
      } else {
        data.variantInfo.templateData = data.variantInfo.templateData.map(
          (item, flag) => {
            return {
              ...item,
              isAttrValue: flag == index ? true : false,
              selectValue: "",
            };
          }
        );
      }
    };
    //添加属性名
    const addAttrName = (record, index) => {
      data.variantInfo.templateData = data.variantInfo.templateData.map(
        (item, flag) => {
          return {
            ...item,
            isAttrName: flag == index ? true : false,
          };
        }
      );
    };
    const selectNameChangs = (row, index, val) => {
      data.variantInfo.templateData = data.variantInfo.templateData.map(
        (item, flag) => {
          return {
            ...item,
            isAttrName: false,
            attrName: flag == index ? val : item.attrName,
          };
        }
      );
    };

    const selectValChangs = (row, index, val) => {
      let iSbulen = true;
      if (row.list.length !== 0) {
        row.list.forEach((item) => {
          if (item.includes(val)) {
            iSbulen = false;
          }
        });
      }
      if (iSbulen) {
        data.variantInfo.templateData[index].list.push(val);
        data.variantInfo.templateData[index].isAttrValue = false;
        if (
          data.variantInfo.templateData.length > 0 &&
          !data.variantInfo.templateData[0].attrValue
        ) {
          createTbaleData();
        }
      } else {
        console.log("重复");
        return GjMessage.warning("已存在，请重新输入");
      }
    };

    // 批量录入
    const setEntry = () => {
      if (data.rowSelection.selectRows.length == 0) {
        GjMessage.warning("请先在表格中勾选要操作的内容行");
      } else {
        let b = data.variantInfo.tableData.map((item, index) => {
          return {
            ...item,
            Price:
              item.id == data.rowSelection.selectRows[index]
                ? data.variantInfo.recommendPrice
                : item.Price,
            upc:
              item.id == data.rowSelection.selectRows[index]
                ? data.variantInfo.upc
                : item.upc,
          };
        });
        data.variantInfo.tableData = b.map((item) => {
          return {
            ...item,
            Price: Number(item.Price) == 0 ? null : Number(item.Price),
          };
        });
      }
    };
    // 构建table的数据结构
    const createTbaleData = () => {
      data.columns = [];
      // let oldTable = data.variantInfo.tableData
      data.variantInfo.tableData = [];
      let newTable = [];
      const dkr = [];
      // 生成列
      data.variantInfo.templateData.forEach((item) => {
        if (item.attrName && item.list.length > 0) {
          // 生成属性的table列
          data.columns.splice(0, 0, item.attrName);
          // 生成dkr数据源
          dkr.push(item.list);
        }
      });
      // 生成值
      if (data.columns.length > 0) {
        const tempData = calcDescartes(dkr.reverse());
        tempData.forEach((item, index) => {
          const line = {};
          data.columns.forEach((key, kIndex) => {
            if (data.columns.length <= 1) {
              // 如果只有一个属性返回一个一维数组
              line[key] = item;
            } else {
              line[key] = item[kIndex];
            }
          });
          // 生成其他值
          data.otherColumns.forEach((item) => {
            line[item.dataIndex] = "";
            if (item.numberType === "input") {
              line[item.dataIndex] = null;
            } else {
              line[item.dataIndex] = "";
            }
          });
          // 生成table数据行
          let obj = {
            ...line,
            id: index,
            skuAttrs: data.columns.map((flag) => {
              return {
                attrCustom: false,
                attrName: flag,
                attrValue: line[flag],
              };
            }),
          };
          data.variantInfo.tableData.push(obj);
          newTable.push(obj);
        });
        // // 待定
        // if (newTable.length == oldTable.length) {
        //   data.variantInfo.tableData = newTable;
        // } else {
        //   let sum = oldTable.length;
        //   newTable.splice(0, sum);
        //   let arr = [...newTable, ...oldTable];
        //   data.variantInfo.tableData = arr;
        // }
      }
      let cols = data.columns.map((item) => {
        return {
          title: item,
          dataIndex: item,
          type: "add", //处理表格第一行添加
          fixed: "left",
        };
      });
      data.columns = [...cols, ...data.otherColumns].flat();
      store.dispatch(
        proxy.$mt.GOODS_INFO_EBAY_ATTRIBUTELIST,
        data.variantInfo.templateData
      );
      // 动态标识
      data.nodeCols = cols.map((item) => {
        return item.title;
      });
    };
    const saveTableSelectPopupFun = (val) => {
      data.variantInfo.tableData = data.variantInfo.tableData.map(
        (item, index) => {
          if (index == 0) {
            return {
              ...item,
              [data.selectFlagName]: val,
            };
          } else {
            return item;
          }
        }
      );
    };
    // 生成select
    const tableSelectPopupFun = (val) => {
      data.selectFlagName = val;
      data.selectOpt = [];
      data.variantInfo.templateData.forEach((item) => {
        if (val == item.attrName) {
          data.selectOpt = item.list.map((i) => {
            return {
              attrName: i,
              attrValue: i,
            };
          });
        }
      });

      //全部数据
      // data.selectOpt = []
      // data.nodeCols.forEach((i) => {
      //   data.variantInfo.templateData.forEach((item) => {
      //     if (i == item.attrName) {
      //       let option = item.list.map((i) => {
      //         return {
      //           attrName: i,
      //           attrValue: i,
      //         }
      //       })
      //       data.selectOpt.push(option)
      //     }
      //   })
      // })
      // data.selectOpt = data.selectOpt.flat()
      // console.log(data.selectOpt, '全部数据')
    };
    // 关联spu
    const selectPopupFun = (val) => {
      data.productOpt = store.getters.getgoodsData.relationSpuList.map(
        (item) => {
          return {
            ...item,
            disabled: false,
          };
        }
      );
      if (val) {
        //禁用表格中已选中
        data.variantInfo.tableData.forEach((item) => {
          data.productOpt = data.productOpt.map((i) => {
            return {
              ...i,
              disabled: item.sku == i.sku ? true : i.disabled,
            };
          });
        });
      }
    };

    const spuListFn = (val) => {
      let params = {
        spu: val, // '81-BU6438J-BK',
      };
      getSkuListBySpu(params).then((res) => {
        const { code } = res;
        if (code == 200 || code == 0) {
          data.productOpt = res.data || [];
        }
      });
    };
    const closeAttrVal = (i, index) => {
      const list = data.variantInfo.templateData[index].list;
      list.splice(i, 1);
      createTbaleData();
    };

    //自动生成规则
    const getGeneralSku = () => {
      getSkuRule({
        platformCode: "EBAY",
        shopCode: store.getters.getdraftData.shopId,
        variantCount: data.variantInfo.tableData.length,
      }).then((res) => {
        data.variantInfo.tableData = data.variantInfo.tableData.map(
          (item, index) => {
            return {
              ...item,
              msku: res.data.sonRuleStr[index],
            };
          }
        );
      });
    };

    // 税率字段获取接口
    const getEbayTaxJuridictions = (val) => {
      if (val) {
        const params = {
          siteId: store.getters.getgoodsData.siteId,
        };
        getQueryEbayTaxJuridictions(params).then((res) => {
          data.juridictionOpt = res.data;
        });
        // const paramsUnit = {
        //   siteId: store.getters.getgoodsData.siteId,
        //   isAll: 0,
        // }
        // getOnlyQueryEbayBaseSiteInfo(paramsUnit).then((res) => {
        //   data.variantInfo.priceUnit = res.data[0].siteCurrency
        // })
      }
    };

    watch(
      () => store.getters.getdraftData.priceUnit,
      (newVal) => {
        console.log(newVal, "priceUnit");
        if (newVal) {
          data.variantInfo.priceUnit = newVal;
        }
      }
    );

    watch(
      () => props.goodsRowData,
      () => {
        const {
          variants,
          variantAttrs,
          recommendPrice,
          upc,
          quantity,
          templateData,
          tableData,
          privateListingEnable,
          shippingIncludedInTax,
          taxJurisdiction,
          salesTaxPercent,
          bestOfferEnabled,
          offerPriceEnabled,
          minimumBestOfferPrice,
          autoAcceptPriceEnabled,
          bestOfferAutoAcceptPrice,
          vatTaxPercent,
          lotSize,
          buyItNowPrice,
          reservePrice,
          startPrice,
          listingDuration,
        } = props.goodsRowData;
        data.variantInfo = {
          recommendPrice: recommendPrice,
          upc: upc,
          templateData: templateData, // table 变体属性数据
          tableData: tableData, // table 变体数据
          privateListingEnable: privateListingEnable,
          shippingIncludedInTax: shippingIncludedInTax,
          taxJurisdiction: taxJurisdiction, //销售税管辖地区
          salesTaxPercent: salesTaxPercent, //销售税率
          bestOfferEnabled: bestOfferEnabled, //是否接受议价 ,
          priceUnit: store.getters.getdraftData.priceUnit,
          priceUnitCode: "$",
          offerPriceEnabled: offerPriceEnabled, //是否启用自动拒绝价格
          minimumBestOfferPrice: minimumBestOfferPrice, //自动拒绝价格
          autoAcceptPriceEnabled: autoAcceptPriceEnabled, //是否启用自动接受价格 ,
          bestOfferAutoAcceptPrice: bestOfferAutoAcceptPrice, // 自动接受价格
          vatTaxPercent: vatTaxPercent,
          lotSize: lotSize,
          quantity: quantity,
          buyItNowPrice: buyItNowPrice,
          reservePrice: reservePrice,
          startPrice: startPrice,
          listingDuration: listingDuration,
        };
        data.variantInfo.recommendPrice = recommendPrice;
        if (store.getters.getgoodsData.specsType == 2) {
          let b = variants[0].skuAttrs;
          let col = b.map((item) => {
            return {
              title: item.attrName,
              dataIndex: item.attrName,
              type: "add", //处理表格第一行添加
              fixed: "left",
            };
          });
          data.columns = [...col, ...data.otherColumns];
          data.variantInfo.recommendPrice = "";
          data.variantInfo.upc = "";
          data.variantInfo.tableData = variants
            .map((item, index) => {
              let obj = item.skuAttrs;
              let cunt = [];
              Object.keys(obj).forEach((key) => {
                let str = {
                  [obj[key].attrName]: obj[key].attrValue,
                };
                cunt.push(str);
              });
              let tempObj = {};
              cunt.reduce((prev, cur) => {
                Object.assign(prev, cur);
                return prev;
              }, tempObj);
              return {
                ...item,
                ...tempObj,
                id: index,
              };
            })
            .flat();
          if (store.getters.getgoodsData.picture.type == "spu") {
            spuListFn(store.getters.getgoodsData.picture.value);
          }
          data.variantInfo.templateData = variantAttrs.map((item, index) => {
            return {
              attrName: item.attrName,
              attrValue: "",
              id: index,
              list: item.attrValues.map((item) => {
                return item.attrValue;
              }),
            };
          });
        }
        getEbayTaxJuridictions(true);
        console.log(data.variantInfo, "data.variantInfo");
      }
    );
    return {
      ...toRefs(data),
      spuListFn,
      submitForm,
      resetForm,
      addTitile,
      removeTitile,
      removeTitileTable,
      addTitileTable,
      addAttrVal,
      selectValChangs,
      createTbaleData,
      setEntry,
      closeAttrVal,
      addAttrName,
      selectNameChangs,
      selectPopupFun,
      tableSelectPopupFun,
      saveTableSelectPopupFun,
      closeTableBtn,
      saveTableBtn,
      getSkuListBySpu,
      getGeneralSku,
      getEbayTaxJuridictions,
    };
  },
};
</script>
<style lang="scss" scoped>
.basic-info {
  .title {
    padding: 16px 0 2px 0px;
    font-size: 14px;
  }
  .basic-info-form {
    box-sizing: border-box;
    padding: 0 16px 0 8px;
  }
  .mr {
    margin: 8px;
  }
  .closeIcon {
    color: #fff;
    vertical-align: bottom;
    font-size: 20px !important;
  }

  .attr-header-name {
    border: 1px solid #d9d9e0;
    display: inline-block;
    text-align: center;
    padding: 6px 15px;
    border-radius: 20px;
  }
}
.validate-lable {
  position: relative;
  .validate-lable-select {
    position: absolute;
    top: -15px;
  }
  :deep(.arco-form-item-message) {
    position: absolute;
    top: 6px;
    left: 12px;
  }
}
.attr-val-box {
  border: 1px solid #ccc;
  padding: 5px 8px;
  border-radius: 24px;
  text-align: center;
}
.box-price {
  width: 100%;
  border: 1px solid #e6e6ed;
  border-radius: 8px;
  margin-left: 0 !important;
  display: flex;
  .box-price-bast {
    height: 30px;
    line-height: 32px;
    margin-bottom: 10px;
  }
}
</style>
