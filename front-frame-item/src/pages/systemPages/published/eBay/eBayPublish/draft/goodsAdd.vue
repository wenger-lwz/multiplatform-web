<template>
  <fullScreenDialog :dialogVisible="dialogVisible" class="full_Dialog_ebay">
    <template #title>
      <div class="dialog-title">
        <span>{{ actionName }}</span>
        <gj-button @click="cancel('off')">关闭</gj-button>
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
              @setShowItemFun="setShowItemFun"
              @attrFun="attrFun"
              :stroeCategoryId="stroeCategoryId"
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
      <span class="dialog-footer">
        <gj-button type="plain" @click="cancel('toast')">取消</gj-button>
        <gj-button type="plain" @click="save('verify')">检查费用</gj-button>
        <!-- <gj-button shape="round" @click="cancel">一键翻译</gj-button>
        <gj-button shape="round" @click="cancel">侵权检测</gj-button> -->
        <gj-button type="outline" @click="save(1)">立即发布</gj-button>
        <gj-button type="outline" @click="save(2)">定时发布</gj-button>
        <gj-button type="primary" @click="save" :loading="addLoading"
          >保存</gj-button
        >
      </span>
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

  <draft-modal
    :cancelVisible="cancelVisible"
    :modelObj="modelObj"
    @cancelHandleOk="cancelHandleOk"
    @cancelHandleOff="cancelHandleOff"
  ></draft-modal>
</template>
<script>
import {
  reactive,
  toRefs,
  defineComponent,
  onMounted,
  getCurrentInstance,
  watch,
  ref,
} from "vue";
import { useStore } from "vuex";
import dayjs from "dayjs";
import { compatibilityCommonFun } from "../components/compatibilityInfo";
import rightNav from "@/components/rightNav";
import basicInfo from "./form/basicInfo.vue";
import productInfo from "./form/productInfo.vue";
import productAttributesInfo from "./form/productAttributes.vue";
import compatibilityInfo from "./form/compatibilityInfo.vue";
import variantInfo from "./form/variantInfo.vue";
import pictureInfo from "./form/pictureInfo.vue";
import productDescriptionInfo from "./form/productDescriptionInfo.vue";
import logisticsPolicyInfo from "./form/logisticsPolicy.vue";
import packingInfo from "./form/packingInfo.vue";
import returnPolicyInfo from "./form/returnPolicy.vue";
import locationofGoodsInfo from "./form/locationofGoods.vue";
import buyerRequirementsInfo from "./form/buyerRequirements.vue";
import fullScreenDialog from "@/pages/systemPages/published/components/fullScreenDialog.vue";
import draftModal from "@/pages/systemPages/published/eBay/eBayPublish/components/goodsModal.vue";
import {
  createDraftList,
  getdraftList,
  getDraftCopyList,
  modifyDraft,
  setVerify,
  getDraftRelease,
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
    draftModal,
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
    stroeCategoryId: {
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
      listData: [],
      defaultSect: [
        {
          name: "基础信息",
          sectionId: "basicInfo",
          ref: "basicInfo",
          isShow: true,
        },
        {
          name: "产品信息",
          sectionId: "productInfo",
          ref: "productInfo",
          isShow: true,
        },
        {
          name: "产品属性",
          sectionId: "productAttributesInfo",
          ref: "productAttributesInfo",
          isShow: true,
        },
        {
          name: "配件兼容性",
          sectionId: "compatibilityInfo",
          ref: "compatibilityInfo",
          isShow: false,
        },
        {
          name: "销售信息",
          sectionId: "variantInfo",
          ref: "variantInfo",
          isShow: true,
        },
        {
          name: "图片视频",
          sectionId: "pictureInfo",
          ref: "pictureInfo",
          isShow: true,
        },
        {
          name: "产品描述",
          sectionId: "productDescriptionInfo",
          ref: "productDescriptionInfo",
          isShow: true,
        },
        {
          name: "物流政策",
          sectionId: "logisticsPolicyInfo",
          ref: "logisticsPolicyInfo",
          isShow: true,
        },
        {
          name: "包装信息",
          sectionId: "packingInfo",
          ref: "packingInfo",
          isShow: true,
        },
        {
          name: "退货政策",
          sectionId: "returnPolicyInfo",
          ref: "returnPolicyInfo",
          isShow: true,
        },
        {
          name: "物品所在地",
          sectionId: "locationofGoodsInfo",
          ref: "locationofGoodsInfo",
          isShow: true,
        },
        {
          name: "买家要求",
          sectionId: "buyerRequirementsInfo",
          ref: "buyerRequirementsInfo",
          isShow: true,
        },
      ],
      stroeCategoryId: "",
      cancelVisible: false,
      modelObj: {
        modelTitle: "",
        modelText: "",
      },
    });
    const componentRef = ref([]);
    const setRefFunction = (item, el) => {
      if (!componentRef.value.find((it) => it.sectionId === item.sectionId)) {
        componentRef.value.push({ sectionId: item.sectionId, el: el });
      }
    };

    const store = useStore();
    const attrFun = (val) => {
      data.stroeCategoryId = val;
    };
    const setShowItemFun = (key, val) => {
      data.defaultSect.forEach((item) => {
        if (item.sectionId == key) {
          item.isShow = val;
        }
      });
      data.listData = data.defaultSect.filter((item) => item.isShow);
    };
    const cancelHandleOk = () => {
      data.cancelVisible = false;
      emit("cancel");
    };
    const cancelHandleOff = () => {
      data.cancelVisible = false;
    };
    const cancel = (val) => {
      // emit('cancel')
      // store.dispatch(proxy.$mt.DRAFT_INFO_PRICEUNIT, '')
      // store.dispatch(proxy.$mt.GOODS_INFO_EBAY_SPECSTYPE, 1)
      // store.dispatch(proxy.$mt.GOODS_INFO_EBAY, '')
      // store.dispatch(proxy.$mt.GOODS_INFO_EBAY_CATEGORYID, '')
      if (val == "toast") {
        data.modelObj = {
          modelTitle: "提示",
          modelText: "当前编辑未保存，关闭将不做保存，是否关闭？",
        };
        data.cancelVisible = true;
      } else {
        emit("cancel");
        store.dispatch(proxy.$mt.GOODS_INFO_EBAY_SPECSTYPE, 1);
        store.dispatch(proxy.$mt.GOODS_INFO_EBAY, "");
        store.dispatch(proxy.$mt.GOODS_INFO_EBAY_CATEGORYID, "");
        let skuObj = {
          type: "",
          value: "",
        };
        store.dispatch(proxy.$mt.GOODS_INFO_EBAY_PICTURE, skuObj);
      }
    };

    const formAll = (fnName) => {
      const list = [];
      componentRef.value.forEach((targetRef) => {
        let arr = data.listData.filter(
          (item) => item.sectionId == targetRef.sectionId
        );
        if (arr.length !== 0) {
          const fn = targetRef.el[fnName] || targetRef.el.submitForm;
          list.push(fn());
        }
      });
      return list;
    };

    const save = (val) => {
      let formList = formAll("submitForm");
      Promise.all(formList).then(function (res) {
        let isSubmit = false;
        if (res.includes("404")) {
          isSubmit = true;
          console.log("验证失败", "获取到的表单的值", store.getters.getParams);
          // GjMessage.warning("草稿需要补充完整信息才能定时发布！");
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
            data.onlineType = null;
          }
          console.log(obj);
          let params = {
            isbnCode: obj.productInfo.isbnCode || "", //isbn编码
            eanCode: obj.productInfo.eanCode || "", //ean编码
            priceUnit: store.getters.getdraftData.priceUnit, //价格单位
            buyItNowPrice: obj.variantInfo?.buyItNowPrice || "", // 一口价 ,
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
            compatibilityNames: obj.compatibilityInfo?.columns || [], //配件兼容性名称,
            compatibilityRecords:
              compatibilityCommonFun.getCompatibilityInfoData(
                obj.compatibilityInfo?.tableData,
                props.actionType,
                data.goodsRowData
              ), //兼容性列表
            compatibilityTemplateId:
              obj.compatibilityInfo?.compatibilityTemplateId || "", //配件兼容性模板id
            categoryAttributes: obj.productAttributesInfo?.productList || [], //产品属性
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

          console.log(params, obj.pictureInfo.vidoeObj, "入参");

          if (val == "verify") {
            return setVerifyFun(params);
          }
          if (props.actionType == "add" || props.actionType == "copy") {
            data.CommonParams = params;
            // 定时发布
            if (data.onlineType == 1 || data.onlineType == 2) {
              data.visible = true;
            } else {
              //保存
              createFun(params);
            }
          }
          if (props.actionType == "edit") {
            editFun(params);
          }
        }
      });
    };
    const setVerifyFun = (params) => {
      setVerify(params)
        .then(() => {
          emit("cancel");
          emit("tableUplod");
        })
        .finally(() => {
          data.addLoading = false;
        });
    };
    const createFun = (params) => {
      // 保存接口
      createDraftList(params)
        .then((res) => {
          const { code } = res;
          if (code === 0 || code === 200) {
            data.addLoading = false;
            GjMessage.success("草稿保存成功！");
          } else {
            GjMessage.warning("草稿保存失败！");
          }
          emit("cancel");
          emit("tableUplod");
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
        .then((res) => {
          const { code } = res;
          if (code === 0 || code === 200) {
            GjMessage.success("发布任务已提交，请稍后查看！");
          } else {
            GjMessage.warning("发布任务提交失败，请重试！");
          }
          emit("cancel");
          emit("tableUplod");
        })
        .finally(() => {
          data.addLoading = false;
        });
    };
    const editFun = (params) => {
      modifyDraft(props.rowData.id, params)
        .then((res) => {
          const { code } = res;
          if (code === 0 || code === 200) {
            GjMessage.success("草稿保存成功！");
          } else {
            GjMessage.warning("草稿保存失败！");
          }
          emit("cancel");
          emit("tableUplod");
        })
        .finally(() => {
          data.addLoading = false;
        });
    };

    const getEditdraft = (row) => {
      getdraftList(row.id).then((res) => {
        const { code } = res;
        if (code == 0 || code == 200) {
          data.goodsRowData = res.data;
          data.stroeCategoryId = res.data.stroeCategoryId;
        }
      });
    };
    const getCopyDraft = async (row) => {
      await getDraftCopyList(row.id).then((res) => {
        const { code } = res;
        if (code == 0 || code == 200) {
          data.goodsRowData = res.data;
          data.stroeCategoryId = res.data.stroeCategoryId;
        }
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
    watch(
      () => props.actionType,
      (newVal) => {
        if (newVal == "add") {
          data.actionName = "创建草稿";
        } else if (newVal == "edit") {
          data.actionName = "编辑草稿";
          getEditdraft(props.rowData);
        } else {
          data.actionName = "复制草稿";
          getCopyDraft(props.rowData);
        }
      },
      {
        immediate: true,
      }
    );
    onMounted(() => {
      data.listData = data.defaultSect.filter((item) => item.isShow);
    });
    return {
      ...toRefs(data),
      dayjs,
      onOk,
      getDisabledTime,
      getRange,
      onChange,
      onSelect,
      setRefFunction,
      cancel,
      save,
      attrFun,
      setShowItemFun,
      cancelHandleOk,
      cancelHandleOff,
      setVerifyFun,
      formAll,
      createFun,
      getEditdraft,
      getCopyDraft,
      handleOk,
      handleCancel,
      getTimezone,
    };
  },
});
</script>
<style lang="scss" scoped>
.full_Dialog_ebay {
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
}
</style>
