<template>
  <fullScreenDialog :dialogVisible="dialogVisible">
    <template #title>
      <div class="dialog-title">
        <span>{{ actionName }}</span>
        <gj-button @click="cancel" shape="round">关闭</gj-button>
      </div>
    </template>
    <template #content>
      <div class="detail-content">
        <div class="left-silder">
          <div
            v-for="item in listData"
            :key="item.sectionId"
            :ref="item.sectionId"
            :id="`${item.sectionId}`"
          >
            <component
              :is="item.sectionId"
              :ref="
                (el) => {
                  setRefFunction(item, el);
                }
              "
              :actionType="actionType"
              :goodsRowData="goodsRowData"
              :publicList="publicList"
            />
          </div>
        </div>
        <div class="right-silder">
          <rightNav
            :layoutData="listData"
            :proxyData="proxyThis"
            :topIsFixed="false"
          ></rightNav>
        </div>
      </div>
    </template>
    <template #footer>
      <!-- listing 在线 -->
      <div
        class="dialog-footer-listing"
        v-if="actionType == 'listingEdit' && listingType == '1'"
      >
        <div class="left">
          <gj-radio-group
            v-model="positionStatus"
            type="button"
            @change="setOnLineChange"
            v-if="rowData?.updateState !== 1"
          >
            <gj-radio value="onLine">在线</gj-radio>
            <gj-radio value="TemporaryStorage">暂存</gj-radio>
          </gj-radio-group>
        </div>
        <div class="rigth">
          <gj-button shape="round" @click="cancel">取消</gj-button>
          <gj-button
            shape="round"
            type="outline"
            @click="saveDelete"
            v-if="rowData?.updateState !== 1"
            >删除暂存</gj-button
          >
          <gj-button shape="round" type="outline" @click="save('upload')"
            >更新</gj-button
          >
          <gj-button shape="round" type="outline" @click="save('storag')"
            >保存</gj-button
          >
        </div>
      </div>
      <!-- listing 下架 -->
      <div
        class="dialog-footer"
        v-if="actionType == 'listingEdit' && listingType == '2'"
      >
        <gj-button shape="round" @click="save('verify')">检查费用</gj-button>
        <gj-button shape="round" type="outline" @click="save('reshelf')"
          >重新上架</gj-button
        >
      </div>
      <!-- 草稿 -->
      <div class="dialog-footer" v-if="actionType == 'listingCopy'">
        <gj-button shape="round" @click="cancel">取消</gj-button>
        <gj-button shape="round" @click="save('verify')">检查费用</gj-button>
        <gj-button shape="round" type="outline" @click="save(1)"
          >立即发布</gj-button
        >
        <gj-button shape="round" type="outline" @click="save(2)"
          >定时发布</gj-button
        >
        <gj-button shape="round" type="outline" @click="save">保存</gj-button>
      </div>
    </template>
  </fullScreenDialog>
  <gj-modal v-model:visible="visible" @ok="handleOk" @cancel="handleCancel">
    <template #title>
      {{ onlineType == 1 ? "立即发布" : "定时发布" }}
    </template>
    <div v-if="onlineType == 1">
      即将发布 1 条商品，是否确认{{ onlineType == 1 ? "立即" : "定时" }}发布
    </div>
    <div v-else-if="onlineType == 2">
      <gj-form :model="visibleFrom">
        <gj-row :gutter="24">
          <gj-col :span="20">
            <gj-form-item field="name" label="选择时区">
              <gj-radio-group
                v-model="visibleFrom.timeZone"
                @change="getTimezone"
              >
                <gj-radio value="Asia/Shanghai">默认时区（北京）</gj-radio>
                <gj-radio value="1">站点时区（美国）</gj-radio>
              </gj-radio-group>
            </gj-form-item>
          </gj-col>
          <gj-col :span="24">
            <gj-form-item field="onlineTime" label="选择时间">
              <!-- <gj-date-picker
                size="small"
                style="width: 200px"
                v-model="visibleFrom.onlineTime"
              /> -->
              <gj-date-picker
                style="width: 220px; margin: 0 24px 24px 0"
                show-time
                format="YYYY-MM-DD HH:mm:ss"
                v-model="visibleFrom.onlineTime"
                :disabledDate="(current) => dayjs(current).isBefore(dayjs())"
                :disabledTime="getDisabledTime"
                @change="onChange"
                @select="onSelect"
                @ok="onOk"
              />
            </gj-form-item>
          </gj-col>
          <gj-col :span="24">
            <gj-form-item field="state" label="是否启用">
              <gj-radio-group v-model="visibleFrom.state">
                <gj-radio :value="true">是</gj-radio>
                <gj-radio :value="false">否</gj-radio>
              </gj-radio-group>
            </gj-form-item>
          </gj-col>
        </gj-row>
      </gj-form>
    </div>
    <div v-else>即将删除该刊登草稿，是否删除？</div>
  </gj-modal>
</template>
<script>
import {
  reactive,
  toRefs,
  defineComponent,
  computed,
  getCurrentInstance,
  watch,
  ref,
} from "vue";
import { useStore } from "vuex";
import dayjs from "dayjs";
import { compatibilityCommonFun } from "../components/compatibilityInfo";
import rightNav from "@/components/rightNav";
import basicInfo from "../draft/form/basicInfo.vue";
import productInfo from "../draft/form/productInfo.vue";
import productAttributesInfo from "../draft/form/productAttributes.vue";
import compatibilityInfo from "../draft/form/compatibilityInfo.vue";
import variantInfo from "../draft/form/variantInfo.vue";
import pictureInfo from "../draft/form/pictureInfo.vue";
import productDescriptionInfo from "../draft/form/productDescriptionInfo.vue";
import logisticsPolicyInfo from "../draft/form/logisticsPolicy.vue";
import packingInfo from "../draft/form/packingInfo.vue";
import returnPolicyInfo from "../draft/form/returnPolicy.vue";
import locationofGoodsInfo from "../draft/form/locationofGoods.vue";
import buyerRequirementsInfo from "../draft/form/buyerRequirements.vue";
import fullScreenDialog from "@/pages/systemPages/published/components/fullScreenDialog.vue";
import {
  createDraftList,
  getdraftList,
  getDraftCopyList,
  setVerify,
  getDraftRelease,
  getListingCopy,
  getstoraggDetails,
  getListingDetails,
  getListingUpload,
  setStoraggSave,
  deleteStoragg,
  getListingRelistingSingle,
} from "@api/published/ebay.js";
import { GjMessage } from "@gj/atom";
export default defineComponent({
  emits: ["cancel", "tableUplod"],
  components: {
    basicInfo,
    productInfo,
    productAttributesInfo,
    compatibilityInfo,
    variantInfo,
    pictureInfo,
    productDescriptionInfo,
    logisticsPolicyInfo,
    packingInfo,
    returnPolicyInfo,
    locationofGoodsInfo,
    buyerRequirementsInfo,
    fullScreenDialog,
    rightNav,
  },
  props: {
    dialogVisible: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
    actionType: {
      //操作
      type: String,
      default: () => {
        return "";
      },
    },
    rowData: {
      //列数据
      type: Object,
      default: () => {
        return {};
      },
    },
    listingType: {
      //1在线/2下架
      type: String,
      default: () => {
        return "";
      },
    },
  },
  setup(props, { emit }) {
    const { proxy } = getCurrentInstance();
    const data = reactive({
      visible: false,
      visibleFrom: {
        id: "",
        onlineTime: "",
        state: true,
        onlineType: "",
        timeZone: "Asia/Shanghai",
      },
      CommonParams: {},
      onlineType: 1,
      actionName: "", //操作类型
      publicList: [], //数据字典
      goodsRowData: {}, //id查详情
      proxyThis: proxy,
      addLoading: false,
    });
    const componentRef = ref([]);
    const setRefFunction = (item, el) => {
      if (!componentRef.value.find((it) => it.sectionId === item.sectionId)) {
        componentRef.value.push({ sectionId: item.sectionId, el: el });
      }
    };
    const defaultSect = [
      {
        name: "基础信息",
        sectionId: "basicInfo",
        ref: "basicInfo",
      },
      {
        name: "产品信息",
        sectionId: "productInfo",
        ref: "productInfo",
      },
      {
        name: "产品属性",
        sectionId: "productAttributesInfo",
        ref: "productAttributesInfo",
      },
      {
        name: "配件兼容性",
        sectionId: "compatibilityInfo",
        ref: "compatibilityInfo",
      },
      {
        name: "销售信息",
        sectionId: "variantInfo",
        ref: "variantInfo",
      },
      {
        name: "图片视频",
        sectionId: "pictureInfo",
        ref: "pictureInfo",
      },
      {
        name: "产品描述",
        sectionId: "productDescriptionInfo",
        ref: "productDescriptionInfo",
      },
      {
        name: "物流政策",
        sectionId: "logisticsPolicyInfo",
        ref: "logisticsPolicyInfo",
      },
      {
        name: "包装信息",
        sectionId: "packingInfo",
        ref: "packingInfo",
      },
      {
        name: "退货政策",
        sectionId: "returnPolicyInfo",
        ref: "returnPolicyInfo",
      },
      {
        name: "物品所在地",
        sectionId: "locationofGoodsInfo",
        ref: "locationofGoodsInfo",
      },
      {
        name: "买家要求",
        sectionId: "buyerRequirementsInfo",
        ref: "buyerRequirementsInfo",
      },
    ];

    const store = useStore();
    const listData = computed(() => {
      return defaultSect;
    });
    const cancel = () => {
      emit("cancel");
      store.dispatch(proxy.$mt.DRAFT_INFO_PRICEUNIT, "");
      store.dispatch(proxy.$mt.GOODS_INFO_EBAY_SPECSTYPE, 1);
      store.dispatch(proxy.$mt.GOODS_INFO_EBAY, "");
      store.dispatch(proxy.$mt.GOODS_INFO_EBAY_CATEGORYID, "");
    };

    const restUpload = () => {
      emit("cancel");
      emit("tableUplod");
    };

    const formAll = (fnName) => {
      const list = [];
      componentRef.value.forEach((targetRef) => {
        const fn = targetRef.el[fnName] || targetRef.el.submitForm;
        list.push(fn());
      });
      return list;
    };

    const saveDelete = () => {
      deleteStoragg(props.rowData.id).then(() => {
        GjMessage.success("暂存已删除，请稍后查看结果");
      });
    };
    const save = (val) => {
      let formList = formAll("submitForm");
      Promise.all(formList).then(function (res) {
        let isSubmit = false;
        if (res.includes("404")) {
          isSubmit = true;
          console.log("验证失败", "获取到的表单的值", store.getters.getParams);
          GjMessage.warning("请检查是否填写完整。");
        } else {
          isSubmit = false;
          console.log("验证成功", "获取到的表单的值", store.getters.getParams);
        }
        if (!isSubmit) {
          data.addLoading = true;
          let obj = {
            ...store.getters.getParams,
          };
          //1: 立即发布， 2： 定时发布)
          if (val == 1 || val == 2) {
            data.onlineType = val;
          } else {
            data.onlineType = obj.logisticsPolicyInfo.publishMode;
          }
          let params = {
            isbnCode: obj.productInfo.isbnCode, //isbn编码
            eanCode: obj.productInfo.eanCode, //ean编码
            priceUnit: store.getters.getdraftData.priceUnit, //价格单位
            buyItNowPrice: obj.variantInfo.buyItNowPrice, // 一口价 ,
            listingDuration: obj.variantInfo.listingDuration, //刊登天数
            // listingTemplateId: 'string', //刊登模板id
            lotSize: obj.variantInfo.lotSize, //批量销售数量
            reservePrice: obj.variantInfo.reservePrice, //保底价
            salesTaxPercent: obj.variantInfo.salesTaxPercent, //销售税率
            startPrice: obj.variantInfo.startPrice, //起始价格
            recommendPrice: obj.variantInfo.recommendPrice, //建议售价 需要判断类型
            quantity: obj.variantInfo.quantity, //库存数量
            vatTaxPercent: obj.variantInfo.vatTaxPercent, //VAT税率
            taxJurisdiction: obj.variantInfo.taxJurisdiction, //销售税管辖地区
            bestOfferEnabled: obj.variantInfo.bestOfferEnabled, //是否接受议价 ,
            autoAcceptPriceEnabled: obj.variantInfo.autoAcceptPriceEnabled, //是否启用自动接受价格 ,
            bestOfferAutoAcceptPrice: obj.variantInfo.bestOfferAutoAcceptPrice, // 自动接受价格
            offerPriceEnabled: obj.variantInfo.offerPriceEnabled, //是否启用自动拒绝价格
            minimumBestOfferPrice: obj.variantInfo.minimumBestOfferPrice, //自动拒绝价格
            shippingIncludedInTax: obj.variantInfo.shippingIncludedInTax, //运费是否包含销售税
            privateListingEnable: obj.variantInfo.privateListingEnable, //是否允许买家匿名购买
            excludeLocations: obj.logisticsPolicyInfo.excludeLocations, //不配送地区集合
            buyerTemplateId: obj.buyerRequirementsInfo.buyerTemplateId, //买家要求模板id ,
            logisticsTemplateId: obj.logisticsPolicyInfo.logisticsTemplateId, //物流政策模板id
            returnDescription: obj.buyerRequirementsInfo.returnDescription, //退货说明
            returnTemplateId: obj.buyerRequirementsInfo.returnTemplateId, //退货政策模板id
            publishMode: data.onlineType || 1, //发布方式(1: 立即发布， 2： 定时发布)
            internationalDispatchCost:
              obj.logisticsPolicyInfo.internationalDispatchCost, //国际运输处理费用
            internationalRateTableEnable:
              obj.logisticsPolicyInfo.internationalRateTableEnable, //是否使用国际运费表
            domesticDispatchCost: obj.logisticsPolicyInfo.domesticDispatchCost, //国内运输处理费用
            domesticDispatchTime: obj.logisticsPolicyInfo.domesticDispatchTime, //国内运输处理时间
            domesticRateTable: obj.logisticsPolicyInfo.domesticRateTable, //国内运费表
            internationalRateTable:
              obj.logisticsPolicyInfo.internationalRateTable, //国际运费表
            domesticRateTableEnable:
              obj.logisticsPolicyInfo.domesticRateTableEnable, //是否使用国内运费表
            domesticShippingMethods:
              obj.logisticsPolicyInfo.domesticShippingMethods, //国内运输方式
            internationalShippingMethods:
              obj.logisticsPolicyInfo.internationalShippingMethods, //国际运输方式
            domesticShippingType: obj.logisticsPolicyInfo.domesticShippingType, //国内运输类型
            internationalShippingType:
              obj.logisticsPolicyInfo.internationalShippingType, //国际运输类型
            excludeLocationEnable:
              obj.logisticsPolicyInfo.excludeLocationEnable, //是否有不运送地区
            internationalReturnEnable:
              obj.returnPolicyInfo.internationalReturnEnable, //国际是否允许退货
            internationalReturnTime:
              obj.returnPolicyInfo.internationalReturnTime, //国际退货期限
            internationalReturnType:
              obj.returnPolicyInfo.internationalReturnType, //国际退货方式
            internationalReturnCostBy:
              obj.returnPolicyInfo.internationalReturnCostBy, //国际退货运费由谁承担
            domesticReturnCostBy: obj.returnPolicyInfo.domesticReturnCostBy, //国内退货运费由谁承担
            domesticReturnEnable: obj.returnPolicyInfo.domesticReturnEnable, //国内是否允许退货
            domesticReturnTime: obj.returnPolicyInfo.domesticReturnTime, //国内退货期限
            domesticReturnType: obj.returnPolicyInfo.domesticReturnType, //国内退货方式

            shippingIrregular: obj.packingInfo.shippingIrregular, //是否不规则包裹
            shippingPackage: obj.packingInfo.shippingPackage, //包装类型
            measurementUnit: obj.packingInfo.measurementUnit, //测量单位 English - 英制Metric - 公制,
            packageDepth: obj.packingInfo.packageDepth, //包装高
            packageLength: obj.packingInfo.packageLength, //包装长
            packageWidth: obj.packingInfo.packageWidth, //包装宽
            weightMajor: obj.packingInfo.weightMajor, //包装重量较大值
            weightMinor: obj.packingInfo.weightMinor, //包装重量较小值
            payDescription: obj.packingInfo.payDescription, //付款说明
            paymentTemplateId: obj.packingInfo.paymentTemplateId, //付款政策模板id
            autoPay: obj.packingInfo.autoPay, //是否需要立即付款 ,
            itemLocationTemplateId:
              obj.locationofGoodsInfo.itemLocationTemplateId, //物品所在地模板id
            postalCode: obj.locationofGoodsInfo.postalCode, //邮政编码
            location: obj.locationofGoodsInfo.location, //地区
            country: obj.locationofGoodsInfo.country, //国家
            maximumItemRequirements:
              obj.buyerRequirementsInfo.maximumItemRequirements, //是否限制一定时间内购买或出价次数
            maximumUnpaidItemStrikesInfo:
              obj.buyerRequirementsInfo.maximumUnpaidItemStrikesInfo, //是否限制买家弃标次数
            maximumUnpaidItemStrikesInfoCount:
              obj.buyerRequirementsInfo.maximumUnpaidItemStrikesInfoCount, //弃标次数
            maximumUnpaidItemStrikesInfoPeriod:
              obj.buyerRequirementsInfo.maximumUnpaidItemStrikesInfoPeriod, //弃标日期范围
            shipToRegistrationCountry:
              obj.buyerRequirementsInfo.shipToRegistrationCountry, //是否限制买家运送地址在运送范围之外
            minimumFeedbackScore:
              obj.buyerRequirementsInfo.minimumFeedbackScore, //是否限制信用指标
            minimumFeedbackScoreValue:
              obj.buyerRequirementsInfo.minimumFeedbackScoreValue, //信用指标数
            disableBuyerRequirements:
              obj.buyerRequirementsInfo.disableBuyerRequirements, //是否禁止买家要求
            maximumItemCount: obj.productDescriptionInfo.maximumItemCount, //最大购买数
            description: obj.productDescriptionInfo.descValue, //产品描述
            productImages: obj.pictureInfo.productImages, //产品图片
            compatibilityNames: obj.compatibilityInfo.columns, //配件兼容性名称,
            compatibilityRecords:
              compatibilityCommonFun.getCompatibilityInfoData(
                obj.compatibilityInfo.tableData,
                props.actionType
              ), //兼容性列表
            compatibilityTemplateId:
              obj.compatibilityInfo.compatibilityTemplateId, //配件兼容性模板id
            categoryAttributes: obj.productAttributesInfo.productList, //产品属性
            ebayCondition: obj.productInfo.ebayCondition, //物品状况
            conditionDescription: obj.productInfo.conditionDescription, //物品状况描述
            listingType: obj.productInfo.listingType, // 销售类型(FixedPriceItem: 固定价、 Chinese: 拍卖价),
            platformCategories: obj.productInfo.platformCategories, // ebay平台第一分类层级对象 - 前端分类回显用,
            platformCategoryId: obj.productInfo.platformCategoryId, //第一分类
            secondPlatformCategories: obj.productInfo.secondPlatformCategories, //ebay平台第二分类层级对象 - 前端分类回显用,
            secondPlatformCategoryId: obj.productInfo.secondCategoryId, //第二分类id
            secondShopCategory: obj.basicInfo.secondShopCategory, //店铺第二分类
            categoryId: obj.basicInfo.categoryId, //产品分类
            categoryName: obj.basicInfo.categoryName, //产品分类名称
            chargePersonId: obj.basicInfo.chargePersonId, //负责人id
            chargePersonName: obj.basicInfo.chargePersonName, //负责人名称
            shopCategory: obj.basicInfo.shopCategory, //店铺分类
            shopId: obj.basicInfo.shopId, //店铺id
            shopName: obj.basicInfo.shopName, //店铺名称
            siteId: obj.basicInfo.siteId, //站点id
            specsType: obj.productInfo.specsType, //规格(1: 单品, 2: 变体)
            msku: obj.productInfo.msku, //店铺sku
            spu: obj.productInfo.sku
              ? obj.productInfo.sku
              : obj.productInfo.spu, //关联spu
            subtitle: obj.productInfo.subtitle, //副标题
            title: obj.productInfo.titleDesc, //标题
            upcCode: obj.productInfo.upcCode, //upc编码
            variantAttrs:
              obj.productInfo.specsType == 1
                ? []
                : compatibilityCommonFun.getVariantInfoData(obj), //存储用户选择的变体属性,
            variants:
              obj.productInfo.specsType == 1
                ? []
                : compatibilityCommonFun.getVariantInfoTableData(obj), //变体集合
            videoInfos:
              JSON.stringify(obj.pictureInfo.vidoeObj) == "{}"
                ? []
                : [obj.pictureInfo.vidoeObj].flat(), //视频信息
          };
          console.log(params, "入参");
          if (val == "verify") {
            //草稿检查费用
            return setVerifyFun(params);
          }
          if (val == "reshelf") {
            // 重新上架
            return getListingRelistingSingle(props.rowData.id, params).then(
              () => {
                restUpload();
              }
            );
          }
          // listing更新
          if (val == "upload") {
            return getListingUpload(props.rowData.id, params).then(() => {
              restUpload();
            });
          }
          // listing保存
          if (val == "storag" && props.actionType !== "listingCopy") {
            params.id = props.rowData.id;
            return setStoraggSave(params).then(() => {
              restUpload();
            });
          }
          if (props.actionType == "listingCopy") {
            data.CommonParams = params;
            // 定时发布
            if (val == 1 || val == 2) {
              data.visible = true;
            } else {
              //草稿保存
              createFun(params);
            }
          }
        }
      });
    };

    const setVerifyFun = (params) => {
      setVerify(params)
        .then(() => {
          restUpload();
        })
        .finally(() => {
          data.addLoading = false;
        });
    };
    const createFun = (params) => {
      // 保存接口
      createDraftList(params)
        .then((res) => {
          console.log(res);
          restUpload();
        })
        .finally(() => {
          data.addLoading = false;
        });
    };
    const createDraDraftRelease = async () => {
      let id = "";
      // 保存接口同步发布
      await createDraftList(data.CommonParams).then((res) => {
        id = res.data;
      });
      let d = new Date(data.visibleFrom.onlineTime);
      let params = {
        id: id,
        onlineTime: d.getTime(d),
        onlineType: data.onlineType,
        state: data.visibleFrom.state,
        timeZone: data.visibleFrom.timeZone,
      };
      await getDraftRelease(params)
        .then(() => {
          GjMessage.success("刊登任务已提交，请稍后查看结果");
          data.visible = false;
          restUpload();
        })
        .finally(() => {
          data.addLoading = false;
        });
    };

    const getEditdraft = (row) => {
      getdraftList(row.id).then((res) => {
        const { code, message } = res;
        if (code !== 200 || code !== 0) {
          GjMessage.success(message);
        }
        data.goodsRowData = res.data;
      });
    };
    const getCopyDraft = async (row) => {
      await getDraftCopyList(row.id).then((res) => {
        const { code, message } = res;
        if (code !== 200 || code !== 0) {
          GjMessage.success(message);
        }
        data.goodsRowData = res.data;
      });
    };

    const getCopyList = async (row) => {
      await getListingCopy(row.id).then((res) => {
        const { code, message } = res;
        if (code !== 200 || code !== 0) {
          GjMessage.success(message);
        }
        data.goodsRowData = res.data;
      });
    };

    const getstoraggList = (row) => {
      getstoraggDetails(row.id).then((res) => {
        const { code, message } = res;
        if (code !== 200 || code !== 0) {
          GjMessage.success(message);
        }
        data.goodsRowData = res.data;
      });
    };
    // 详情
    const getDetailsList = (row) => {
      let params = {
        id: row.id,
        status: props.listingType,
      };
      getListingDetails(params).then((res) => {
        const { code, message } = res;
        if (code !== 200 || code !== 0) {
          GjMessage.success(message);
        }
        data.goodsRowData = res.data;
      });
    };
    const handleOk = () => {
      createDraDraftRelease();
    };
    const handleCancel = () => {
      data.visible = false;
    };
    const getTimezone = (val) => {
      if (val == 1) {
        data.visibleFrom = {
          ...data.visibleFrom,
          timeZone: "",
        };
      }
    };
    const getDisabledTime = () => {
      let time = new Date();
      // let d = time.getDate()
      let h = time.getHours();
      let mm = time.getMinutes();
      let s = time.getSeconds();
      return {
        disabledHours: () => getRange(h, 24),
        disabledMinutes: () => getRange(mm, 60),
        disabledSeconds: () => getRange(s, 60),
      };
    };
    const getRange = (start, end) => {
      const result = [];
      for (let i = 0; i < end; i++) {
        if (i < start) {
          result.push(i);
        }
      }
      return result;
    };

    const onOk = (dateString, date) => {
      console.log(dateString, date, "1");
      data.visibleFrom.onlineTime = dateString;
    };
    const onChange = (dateString, date) => {
      console.log(dateString, date, "2");
      data.visibleFrom.onlineTime = dateString;
    };
    const onSelect = (dateString, date) => {
      console.log(dateString, date, "3");
      data.visibleFrom.onlineTime = dateString;
    };

    const setOnLineChange = (val) => {
      data.positionStatus = val;
      if (val == "TemporaryStorage") {
        //暂存
        getstoraggList(props.rowData);
      } else {
        //在线
        getDetailsList(props.rowData);
      }
    };
    watch(
      () => props.actionType,
      (newVal) => {
        if (newVal == "listingEdit") {
          data.actionName = "编辑商品";
          if (props.rowData?.updateState == 1) {
            getDetailsList(props.rowData);
          } else {
            getstoraggList(props.rowData);
          }
        } else {
          data.actionName = "复制草稿";
          getCopyList(props.rowData);
        }
      },
      {
        immediate: true,
      }
    );

    return {
      ...toRefs(data),
      dayjs,
      onOk,
      getDisabledTime,
      getRange,
      onChange,
      onSelect,
      listData,
      setRefFunction,
      cancel,
      save,
      setVerifyFun,
      formAll,
      createFun,
      getEditdraft,
      getCopyDraft,
      handleOk,
      handleCancel,
      getTimezone,
      getDetailsList,
      setOnLineChange,
      getCopyList,
      saveDelete,
    };
  },
});
</script>
<style lang="scss" scoped>
.detail-content {
  padding: 0px 24px 16px 8px;
  background: #fff;
  box-sizing: border-box;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  justify-content: space-between;
  .left-silder {
    padding-right: 24px;
    width: calc(100% - 100px);
  }
  // :deep(.arco-form-item-content-flex) {
  //   max-width: 358px;
  // }
  .right-silder {
    padding-top: 16px;
    height: 500px;
    width: 100px;
    position: fixed;
    right: 24px;
    top: 80px;
    .arco-anchor {
      width: 100%;
    }
  }
}
.dialog-footer {
  background: #fff;
  button {
    margin-left: 12px;
  }
}
.dialog-footer-listing {
  background: #fff;
  display: flex;
  .left {
    flex: 1;
    text-align: left;
  }
  .right {
    flex: 1;
    text-align: right;
  }
  button {
    margin-left: 12px;
  }
}
</style>
