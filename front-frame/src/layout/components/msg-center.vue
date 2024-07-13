<template>
  <gj-popover
    title="Title"
    style="width: 320px"
    position="br"
    trigger="click"
    @popup-visible-change="handleClickNotification"
  >
    <span class="notification-icon">
      <gj-badge :count="messageTotalCount" :max-count="99" :offset="[10, 0]">
        <svg-icon svg-class="notification" :width="18" />
      </gj-badge>
    </span>
    <template #title>
      <span class="message_title">{{$t('messages')}}({{messageTotalCount}})</span>
      <div style="height: 10px;"></div>
    </template>
    <template #content>
      <!-- 预警消息 -->
      <div class="message_item" v-permissions="'/tool/earlyWarningMessage/view'">
        <div class="text_wrapper">
          <gj-badge :count="messagePopoverData.warnCount" :max-count="99" :offset="[24, 5]">
            <span class="text">{{$t('warnings')}}</span>
          </gj-badge>
          <gj-space>
            <router-link to="/amz-web/messageCenter/messageHome?activeTab=0" style="font-size: 12px;" class="router-link">
              <span>{{$t('all')}}</span>
              <svg-icon svg-class="arrow-right" :width="10" />
            </router-link>
<!--            <gj-link href="/amz-web/messageCenter/messageHome?activeTab=0" :hoverable="false" style="font-size: 12px;">
              <span>{{$t('all')}}</span>
              <svg-icon svg-class="arrow-right" :width="10" />
            </gj-link>-->
          </gj-space>
        </div>
        <div v-if="messagePopoverData?.warnCount > 0">
          <div class="content_wrapper">
            <span class="content ellipsis">{{messagePopoverData?.warnItem?.warnBusinessName}}</span>
            <span class="time">{{messagePopoverData?.warnItem?.startTime}}</span>
          </div>
          <div class="body ellipsis">
            {{messagePopoverData?.warnItem?.marketName}} {{messagePopoverData?.warnItem?.warnContent}}
          </div>
        </div>
        <gj-divider class="divider" />
      </div>
      <!-- 业绩通知 -->
      <div class="message_item" v-permissions="'/message/performanceNotifications/view'">
        <div class="text_wrapper">
          <gj-badge :count="messagePopoverData?.performanceCount" :max-count="99" :offset="[24, 5]">
            <span class="text">{{$t('performanceNotification')}}</span>
          </gj-badge>
           <gj-space>
             <router-link to="/amz-web/messageCenter/messageHome?activeTab=1" style="font-size: 12px;" class="router-link">
               <span>{{$t('all')}}</span>
               <svg-icon svg-class="arrow-right" :width="10" />
             </router-link>
<!--            <gj-link href="/amz-web/messageCenter/messageHome?activeTab=1" :hoverable="false" style="font-size: 12px;">
              <span>{{$t('all')}}</span>
              <svg-icon svg-class="arrow-right" :width="10" />
            </gj-link>-->
          </gj-space>
        </div>
        <div v-if="messagePopoverData?.performanceCount > 0">
          <div class="content_wrapper">
              <span class="content ellipsis">{{$t('store')}} {{messagePopoverData?.noticeItem?.market}}</span>
              <span>{{messagePopoverData?.noticeItem?.createTime}}</span>
          </div>
          <div class="body ellipsis">
            {{messagePopoverData?.noticeItem?.subject}}
          </div>
        </div>
        <gj-divider class="divider" />
      </div>
      <!-- 系统消息 -->
      <div class="message_item" v-permissions="'/system/systemNotice/view'">
        <div class="text_wrapper">
          <gj-badge :count="messagePopoverData.systemCount" :max-count="99" :offset="[24, 5]">
            <span class="text">{{$t('systemMessages')}}</span>
          </gj-badge>
          <gj-space>
            <router-link to="/amz-web/messageCenter/messageHome?activeTab=2" style="font-size: 12px;" class="router-link">
              <span>{{$t('all')}}</span>
              <svg-icon svg-class="arrow-right" :width="10" />
            </router-link>
<!--            <gj-link href="/amz-web/messageCenter/messageHome?activeTab=2" :hoverable="false" style="font-size: 12px;">
              <span>{{$t('all')}}</span>
              <svg-icon svg-class="arrow-right" :width="10" />
            </gj-link>-->
          </gj-space>
        </div>
        <div v-if="messagePopoverData?.systemCount > 0">
          <div class="content_wrapper">
            <span>{{$t('updateNotification')}}</span>
            <span>{{messagePopoverData?.systemMessage?.recordDate}}</span>
          </div>
          <div class="body ellipsis">
            {{messagePopoverData?.systemMessage?.msgTitle}}
          </div>
        </div>
        <gj-divider class="divider" />
      </div>
      <!-- 系统公告 -->
      <div class="message_item">
        <div class="text_wrapper">
          <gj-badge :count="messagePopoverData.versionCount" :max-count="99" :offset="[24, 5]">
            <span class="text">{{$t('systemAnnouncement')}}</span>
          </gj-badge>
          <gj-space>
            <router-link to="/amz-web/messageCenter/messageHome?activeTab=3" style="font-size: 12px;" class="router-link">
              <span>{{$t('all')}}</span>
              <svg-icon svg-class="arrow-right" :width="10" />
            </router-link>
<!--            <gj-link href="/amz-web/messageCenter/messageHome?activeTab=3" :hoverable="false" style="font-size: 12px;">
              <span>{{$t('all')}}</span>
              <svg-icon svg-class="arrow-right" :width="10" />
            </gj-link>-->
          </gj-space>
        </div>
        <div v-if="messagePopoverData?.versionCount > 0">
          <div class="content_wrapper">
            <span>{{$t('updateNotification')}}</span>
            <span>{{messagePopoverData?.versionItem?.recordDate}}</span>
          </div>
          <div class="body ellipsis">
            {{messagePopoverData?.versionItem?.title}}
          </div>
        </div>
      </div>
    </template>
  </gj-popover>
</template>
<script setup>
import { computed, ref, onMounted } from 'vue'
import { countAndInfo,countAndInfoUpdateAnnouncement } from '@/api/public'
import { useI18n } from 'vue-i18n'
import SvgIcon from '@/components/SvgIcon.vue'
import dayjs from 'dayjs';
import {useStore} from "vuex";
const $store = useStore()

onMounted(() => {
  getNotification();
  // getNotificationUpdateAnnouncement();
  setInterval(() => {
    getNotification();
  }, 5 * 60 * 1000);
})

const auth = computed(() => $store.getters.auth)

// 消息中心
const isShowMessagePopover = ref(false);
const messagePopoverData = ref({});
const messageTotalCount = computed(() => {
  const warnCount = messagePopoverData.value.warnCount || 0;
  const performanceCount = messagePopoverData.value.performanceCount || 0;
  const versionCount = messagePopoverData.value.versionCount || 0;
  const systemCount = messagePopoverData.value.systemCount || 0;
  return warnCount + performanceCount + versionCount + systemCount;
});
const handleClickNotification = (visible) => {
  isShowMessagePopover.value = visible;
  if (visible) {
    getNotification();
    // getNotificationUpdateAnnouncement();
  }
};

const versionCount = ref(0)
const versionItem = ref({})
function getNotification () {
  countAndInfo().then(async (res) => {
    const data = res.data || {};

    // 根据菜单展示有菜单权限的数据
    if(!auth.value || auth.value.length === 0) {
     await $store.dispatch('getAuth')
    }

    if(!auth.value.includes('/tool/earlyWarningMessage/view')) {
      data.warnCount = 0;
    }

    if(!auth.value.includes('/message/performanceNotifications/view')) {
      data.performanceCount = 0;
    }

    if(!auth.value.includes('/system/systemNotice/view')) {
      data.systemCount = 0;
    }

    messagePopoverData.value = {...data, versionCount: versionCount.value, versionItem: versionItem.value};
  })
}

function getNotificationUpdateAnnouncement () {
  countAndInfoUpdateAnnouncement().then(async (res) => {
    const data = res.data || {};
    if (data && data.versionItem) {
      data.versionItem.title = `${dayjs().format(data.versionItem.recordDate, 'YYYY年MM月DD日')} ERP ${data.versionItem.versionNumber} 上线！`;
    }

    if(!auth.value.includes('/system/systemNotice/view')) {
      data.systemCount = 0;
    }

    versionItem.value = data.versionItem
    versionCount.value = data.versionCount
    messagePopoverData.value = {...messagePopoverData.value, versionCount:data.versionCount,versionItem: data.versionItem };      
  })
}

</script>

<style lang="scss" scoped>

.notification-icon {
  margin-right: 14px;
}

.router-link {
  color: #0046f0;
  text-decoration: none;
  background-color: transparent;
  outline: none;
  cursor: pointer;
  transition: color 0.3s;
}

.message_title {
  display: inline-block;
  border-left: 4px solid #1f6eef;
  padding-left: 8px;
  line-height: 22px;
  font-size: 14px;
  font-weight: 600;
}

:deep(.arco-badge-number) {
  min-width: 18px;
  box-shadow: none;
  padding: 0 3px;
  right: 5px;
  height: 17px;
  line-height: 17px;
}

.message_item {
  font-size: 12px;

  &:last-of-type {
    .divider {
      display: none;
    }
  }

  .text_wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;

    .text {
      font-size: 13px;
    }
  }

  .content_wrapper {
    display: flex;
    justify-content: space-between;
    line-height: 22px;

    .content {
      max-width: 150px;
    }

    .time {
      color: #999;
    }
  }

  .body {
    line-height: 22px;
  }
}
</style>
