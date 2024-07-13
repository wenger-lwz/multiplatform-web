<template>
  <div ref="containerEl"></div>
  <div v-if="messageItemRef && !noticeHiddenRef" class="message-notice-container">
    <div class="message-title">
      <div class="title-content">
        <span>
          {{
            messageItemRef?.msgType === 'SYSTEM_MSG' ? messageItemRef?.businessType : messageItemRef?.title
          }}
        </span>
      </div>
      <div class="title-icon">
        <icon-right @click="hiddenNotice()"></icon-right>
<!--        <svg-icon svg-class="add" :width="12" @click="hiddenNotice()"/>-->
      </div>

      <!--        <i nz-icon nzType="right" nzTheme="outline" class="notice-arrow" style="margin-right: -10px;" @click="hiddenNotice()"-->
      <!--           (click)="hiddenNotice()"></i>-->
    </div>
    <div class="message-content">
      <div v-html="messageItemRef?.content"></div>
    </div>
    <div class="message-notice--footer" v-if="messageItemRef?.msgType === 'SYSTEM_MSG'">
      <gj-button v-if="messageItemRef?.remindLevel === RemindLevelForSystem.MIDDLE"
                 @click="updateNoticeStatus()"
                 type="text">
        {{ t('MESSAGE.gotIt') }}
      </gj-button>
      <gj-dropdown trigger="hover" v-if="messageItemRef?.remindLevel === NoticeLevel.STRONG">
        <gj-button type="text">
          <span>{{ t('MESSAGE_WARN.remindLater') }}</span>
          <icon-down></icon-down>
        </gj-button>
        <template #content>
          <gj-doption v-for="item in NoticeDelayOptions" @click="updateNoticeStatus(item.id)" :key="item.id">
            {{ t(item.text) }}
          </gj-doption>
        </template>
      </gj-dropdown>
      <!-- 立即查看 -->
      <gj-button type="primary" @click="routerBusinessModel()">{{ t('MESSAGE_WARN.viewNow') }}</gj-button>
    </div>
    <div class="message-notice--footer" v-else>
      <gj-button size="small"
                 v-if="messageItemRef?.remindLevel === NoticeLevel.COMMONLY"
                 @click="updateNoticeStatus()"
                 type="text">
        {{ t('MESSAGE_WARN.gotIt') }}
      </gj-button>
      <gj-dropdown trigger="hover" v-if="messageItemRef?.remindLevel === NoticeLevel.STRONG">
        <gj-button type="text">
          <span>{{ t('MESSAGE_WARN.remindLater') }}</span>
          <icon-down></icon-down>
        </gj-button>
        <template #content>
          <gj-doption v-for="item in NoticeDelayOptions"
                      @click="updateNoticeStatus(item.id)"
                      :key="item.id">
            {{ t(item.text) }}
          </gj-doption>
        </template>
      </gj-dropdown>
      <gj-button size="small" type="primary" @click="routerBusinessModel()">{{ t('MESSAGE_WARN.viewNow') }}</gj-button>
    </div>
  </div>
  <div v-else class="mini-container" @click="showNotice()">
    <svg-icon svg-class="task" :width="20" @click="hiddenNotice()"/>
    <!--    <i nz-icon iconfont="icon-renwu" class="mini-icon"></i>-->
  </div>
</template>

<script>
import {defineComponent, onMounted, reactive, ref} from "vue";
import SvgIcon from '@/components/SvgIcon.vue';
import {GjButton, GjDropdown} from '@gj/atom';
import {useRoute, useRouter} from "vue-router";
import {
  BusinessType, BusinessTypeOptions,
  MsgType,
  NoticeLevel,
  NoticeStatusApiOptions,
  RemindLevelForSystem, transFormMap
} from "@/common/message-warn/enum";
import {MicroAppType, useMainAppNotice, useMicroAppNotice} from "@gj/micro-frontend";
import { IconRight, IconDown } from '@gj/icons-vue';


export default defineComponent({
  components: {
    SvgIcon,
    GjButton,
    GjDropdown,
    IconRight,
    IconDown,
  },
  props: {
    dataItem: {
      type: Object
    },
    noticeHidden: {
      type: Boolean,
      default: false
    },
    t: {
      type: Function
    },
    updateNoticeViewStatusRequest: {
      type: Function
    },
    notify: {
      type: Function,
      default: () => {
      }
    },
  },
  setup(props) {
    const {sendCustomize} = useMainAppNotice();
    const $router = useRouter();
    const noticeHiddenRef = ref(props.noticeHidden);
    const messageItemRef = reactive(props.dataItem);
    const containerEl = ref(null);
    const businessTypeMap = transFormMap(BusinessTypeOptions);

    let parentContainerEl = null;
    const NoticeDelay = {
      TEN_MIN: 'TEN_MIN', // 十分钟
      FIFTEEN_MIN: 'FIFTEEN_MIN', // 十五分钟
      THIRTY_MIN: 'THIRTY_MIN', // 三十分钟
      SIXTY_MIN: 'SIXTY_MIN', // 一小时
    }
    const NoticeDelayOptions = [
      {id: NoticeDelay.TEN_MIN, text: 'MESSAGE_WARN.tenMinutesLater'},
      {id: NoticeDelay.FIFTEEN_MIN, text: 'MESSAGE_WARN.fifteenMinutesLater'},
      {id: NoticeDelay.THIRTY_MIN, text: 'MESSAGE_WARN.30MinutesLater'},
      {id: NoticeDelay.SIXTY_MIN, text: 'MESSAGE_WARN.anHourLater'},
    ];

    const hiddenNotice = () => {
      noticeHiddenRef.value = true;
      console.log('hiddenNotice');
      parentContainerEl?.classList.add('hidden-notice');
    };

    const showNotice = () => {
      noticeHiddenRef.value = false;
      parentContainerEl?.classList.remove('hidden-notice');
    };

    const updateItem = (data) => {
      data && Object.assign(messageItemRef, data);
    }

    const updateNotify = (type, data) => {
      switch (type) {
        case 'updateItem':
          updateItem(data);
          break;
      }
    };

    props.notify('registerNotify', updateNotify);

    const updateNoticeStatus = async (noticeDelay = null, item = messageItemRef) => {
      item = item || messageItemRef
      const {id, msgType, remindLevel} = item;
      const params = {id: id};

      if (noticeDelay) {
        params.delayTimeType = noticeDelay;
      }

      console.log(NoticeStatusApiOptions, NoticeStatusApiOptions[msgType + '_' + remindLevel])

      const noticeStatusApiOption = NoticeStatusApiOptions[msgType + '_' + remindLevel];

      const url = noticeStatusApiOption?.url;

      if (!url) {
        return;
      }

      await props.updateNoticeViewStatusRequest(params, url);

      props.notify('deleteRowData');
    };

    const routerBusinessModel = () => {
      const {msgType, id, businessType, orderNo} = messageItemRef;

      let url;
      let params = {};

      if (MsgType.WARN === msgType) {
        url = `/amz-web/messageCenter/messageHome`;
        params.warnId = id;
        params.activeTab = 0;
      } else if (MsgType.SYSTEM_MSG === msgType) {
        url = `/amz-web/messageCenter/messageHome`;
        params.messageId = id;
        params.activeTab = 2;
        // this.hiddenNotice()
      } else {
        url = businessTypeMap[businessType].routerLink;
        if (BusinessType.MY_TASK !== businessType) {
          params.businessCode = orderNo;
        }
      }

      props.notify('goTo', {path: url, query: params});

      updateNoticeStatus(null, {...messageItemRef, remindLevel: NoticeLevel.COMMONLY});
    }

    const tranHref = (href) => {
      const arr = href.split('&');
      const obj = {};
      arr.forEach(item => {
        const arrInner = item.split('=');
        if (arrInner[0] === 'marketId') {
          obj[arrInner[0]] = Number(arrInner[1]);
        } else {
          obj[arrInner[0]] = arrInner[1];
        }
      });

      return obj;
    }

    const watchHref = () => {
      if (!parentContainerEl) {
        return;
      }

      parentContainerEl.addEventListener('click', event => {
        event.preventDefault();
        const {target} = event;

        const elID = target?.id;

        if (!elID || !['nav', 'auth'].includes(elID)) {
          return;
        }

        const href = target.attributes['href'].nodeValue;
        const obj = tranHref(href.split('?')[1]);

        if (elID === 'nav') {
          // sendCustomize(MicroAppType.AMZ, {
          //   route: '/system/marketInit',
          //   state: { type: 'auth', ids: obj.markets},
          //   type: 'routeByState'
          // });
          // console.log({
          //   route: '/system/marketInit',
          //   state: { type: 'auth', ids: obj.markets},
          //   type: 'routeByState'
          // })
          $router.push({
            path: '/amz-web/system/marketInit',
            query: { type: 'auth', ids: obj.markets, routeType: 'state'}
          });
        } else if (elID === 'auth') {
          props.notify('getEmailAuth', {marketId: obj.marketId, email: obj.email})
        }
      });
    }

    onMounted(() => {
      let parentEl = containerEl.value;

      while (parentEl && parentEl.parentElement) {
        parentEl = parentEl.parentElement;

        if (!parentEl.classList.contains('arco-notification-success')) {
          continue;
        }

        parentContainerEl = parentEl;

        break;
      }

      parentContainerEl?.classList.add('message-notification');

      watchHref();
    });

    return {
      hiddenNotice,
      noticeHiddenRef,
      messageItemRef,
      updateNoticeStatus,
      routerBusinessModel,
      showNotice,
      RemindLevelForSystem,
      NoticeDelayOptions,
      NoticeLevel,
      containerEl
    }
  }
})
</script>

<style scoped lang="scss">
.message-notice-container {
  .message-title {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .title-content {
      font-size: 14px;
      font-weight: 600;
      color: #333;
      border-left: 4px solid #3582fb;
      padding-left: 10px;
      margin-bottom: 20px;
    }

    .title-icon {
      font-size: 24px;
      cursor: pointer;
      align-self: baseline;
    }
  }

  .message-content {
    margin-bottom: 10px;

    ::v-deep a {
      text-decoration: none;
    }
  }

  .message-notice--footer {
    display: flex;
    justify-content: center;
    align-items: center;

    > *:not(:first-child) {
      margin-left: 8px;
    }
  }
}

.mini-container {
  width: 36px;
  height: 36px;
  border-radius: 5px;
  background: rgb(31, 110, 239);
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  color: #FFFFFF;
  justify-content: center;
  align-items: center;
}
</style>
