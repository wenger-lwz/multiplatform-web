<template>
  <gj-popover trigger="click" style="width: 240px"  position="br">
    <gj-badge :count="totalCount" :offset="[10, 0]">
      <svg-icon svg-class="task" :width="16" />
    </gj-badge>
    <template #content>
      <div class="task-header">
        <div class="task-title">
          <div class="task-mask"></div>
          <div>{{$t('task')}}<span>({{taskCount}})</span></div>
        </div>
        <div class="task-icon">
          <gj-button shape="circle" type="text" size="small" class="icon-button">
            <router-link to="/amz-web/messageCenter/taskSetting">
              <svg-icon svg-class="setting" :width="16" />
            </router-link>
          </gj-button>
        </div>
      </div>
      <div class="task-list">
        <template v-for="(item) in list">
          <div class="task-item" @click="router.push({path: item.routerLink, query: item.queryParams})">
            <div class="task-item-title">{{ $t(item.text) }}</div>
            <div class="item-badge" :class="{'zero-badge': item.count === 0, 'un-zero-badge': item.count !== 0}">
              {{ item.count }}
            </div>
          </div>
        </template>

        <!--          <div class="task-item">-->
        <!--            <div class="task-item-title">title</div>-->
        <!--            <div class="item-badge" :class="{'un-zero-badge': true}">-->
        <!--              {{1}}-->
        <!--            </div>-->
        <!--          </div>-->
        <!--          <div class="task-item">-->
        <!--            <div class="task-item-title">title</div>-->
        <!--            <div class="item-badge" :class="{'un-zero-badge': true}">-->
        <!--              {{99}}+-->
        <!--            </div>-->
        <!--          </div>-->
      </div>
      <!--        <gj-empty />-->
    </template>
  </gj-popover>

</template>

<script>
import {defineComponent, reactive, ref, toRefs} from "vue";
import SvgIcon from "../../components/SvgIcon";
import {useMainAppNotice} from "@gj/micro-frontend";
import {MicroToMainEventType} from "@gj/micro-frontend";
import {useRouter} from "vue-router";

export default defineComponent({
  name: 'gj-task-center',
  components: {
    SvgIcon
  },
  setup() {
    const router = useRouter();
    const BusinessType = {
          MY_TASK: 'my_task', // 我的任务
          PURCHASE_PLAN: 'purchase_plan', // 采购计划
          PURCHASE_ORDER: 'purchase_order', // 采购订单
          TRANSFER: 'transfer', // 调拨单
          FINANCE: 'finance', // 请款单
          DELIVERY: 'delivery', // 交货单
          INVOICE: 'invoice', // 发货单
          QC: 'qc', // 质检单
    }
    const BusinessTypeOptions = {
      [BusinessType.MY_TASK]: {text: 'MESSAGE.myTask', routerLink: '/amz-web/approval/myTask', permission: '/approval/myTask/view'},
      [BusinessType.PURCHASE_PLAN]: {text: 'MESSAGE.purchasePlan', routerLink: '/amz-web/purchase/purchasePlan', permission: '/purchase/purchasePlan/view'},
      [BusinessType.PURCHASE_ORDER]: {text: 'MESSAGE.purchaseOrder', routerLink: '/amz-web/purchase/purchaseOrder', permission: '/purchase/purchaseOrder/view'},
      [BusinessType.TRANSFER]: {text: 'MESSAGE.transferOrder', routerLink: '/amz-web/warehouse/transferringOrder', permission: '/warehouse/transferringOrder/view'},
      [BusinessType.FINANCE]: {text: 'MESSAGE.paymentRequestOrder', routerLink: '/amz-web/finance/paymentOrder', permission: '/finance/paymentOrder/view'},
      [BusinessType.DELIVERY]: {text: 'MESSAGE.deliveryOrder', routerLink: '/amz-web/purchase/deliveryOrder', permission: '/purchase/deliveryOrder/view'},
      [BusinessType.INVOICE]: {text: 'MESSAGE.shippingOrder', routerLink: '/amz-web/logistics/logisticsBill', permission: '/logistics/logisticsBill/view'},
      [BusinessType.QC]: {text: 'MESSAGE.qualityInspectionOrder', routerLink: '/amz-web/warehouse/qualityOrder', permission: '/warehouse/qualityOrder/view'},
    };
    const { registerListener } = useMainAppNotice();
    const data = reactive({
      totalCount: 0,
      list: []
    });

    registerListener(MicroToMainEventType.TASK, event => {
      const {data: {list, totalCount}} = event;

      data.totalCount = totalCount;
      data.list = (list ||[]).map(value => {
        // [queryParams]="{businessType: item.businessType, taskNotice: item.criteria}"
        value.routerLink = BusinessTypeOptions[value.businessType].routerLink;
        value.queryParams = {businessType: value.businessType, taskNotice: value.criteria};
        value.text = BusinessTypeOptions[value.businessType].text;
        return value;
      });
    });

    const taskCount = ref(0);

    return {
      taskCount,
      ...toRefs(data),
      router
    }
  },
})
</script>

<style scoped lang="scss">
.task-header {
  display: flex;
  justify-content: space-between;
  background: #ffffff;
  //width: 180px;
  height: 22px;

  .task-title {
    .task-mask {
      width: 4px;
      background: #1f6eef;
      margin-right: 8px;
    }

    display: flex;
    justify-content: flex-start;
  }

  .task-icon {
    &:deep .arco-btn-size-medium {
      line-height: 24px;
    }
  }
}
.task-list {
  margin-top: 8px;
  padding-right: 4px;

  .task-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 30px;
    padding-left: 12px;
    cursor: pointer;

    &:hover {
      background: #f5f7fa;
    }

    .item-badge {
      border-radius: 30px;
      text-align: center;
      color: #ffffff;
      padding: 0 6px;
      font-size: 12px;
      // #d8dadd
    }

    .zero-badge {
      background: #d8dadd;
    }

    .un-zero-badge {
      background: #f5222d;
    }
  }
}

:deep(.arco-badge-number) {
  box-shadow: none;
  min-width: 18px;
  padding: 0 3px;
  right: 5px;
  top: 1px;
  height: 17px;
  line-height: 17px;
}
</style>
