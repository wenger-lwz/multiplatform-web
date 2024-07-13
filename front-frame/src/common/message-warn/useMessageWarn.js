import request from "@/request";
import {createVNode, getCurrentInstance, watch} from "vue";
import WarnTemplate from './message-notice';
import {GjMessage, GjNotification} from "@gj/atom";
import {useI18n} from "vue-i18n";
import { GbModal } from '@gj/biz';
import {useRoute, useRouter} from "vue-router";
import EmailAuth from './emailAuth';


export function useMessageWarn() {
  const { t } = useI18n();
  const $route = useRoute();
  const $router = useRouter();
  const instance = getCurrentInstance();
  const pollingCycle = 5 * 60 * 1000;
  let noticeData = [];
  let noticeModal;
  let vNode;
  let updateNotify = () => {};
  let pollingTimer;

  const messageWarnRequest = () => {
    return request.get('v2/warnItem/getWarnItemNoticeList').then(({ data }) => data);
  }

  const updateNoticeViewStatusRequest = (params, url) => {
    return request.post(url, params);
  }

  const deleteRowData = () => {
    if (!noticeData) {
      return;
    }

    noticeData.splice(0, 1);

    if (!noticeData.length && noticeModal) {
      noticeModal.close();
      noticeModal = null;
      return;
    }

    updateNotify('updateItem', noticeData[0]);
  }

  const destroyModel = () => {
    if (!noticeModal) {
      return;
    }

    noticeModal.close();
    noticeModal = null;

    if (pollingTimer) {
      clearInterval(pollingTimer);
      pollingTimer = null;
    }
  }

  const clearAllMessage = () => {
    destroyModel();
    noticeData = [];
  }

  watch(() => $route.path, n => {
    if (n.includes('/auth/login')) {
      console.log('clearAllMessage');
      clearAllMessage();
    }
  }, {immediate: true})

  const emailAuth = (data) => {
    GbModal.create(EmailAuth, {props: {type: 'other', emailList: data.map(item => item), title: t('MESSAGE_WARN.autoVerification')},})
  }

  const getEmailAuth = async (params) => {
    const data = await request.get('v2/market/maintain/ticketEmail/awsSesAuth/verify', {params}).then(({data}) => data);

    if (!data) {
      return;
    }

    // data.verifyResult = 'AWS_UNAUTH';

    const {verifyResult, marketName} = data;

    switch (verifyResult) {
      case 'EMAIL_DISPARITY':
        GjMessage.warning(params.email + t('MESSAGE_WARN.isNot') + marketName + t('MESSAGE_WARN.amazonSESVerification'));
        break;
      case 'AWS_UNAUTH':
        emailAuth([{ marketId: params.marketId, addr: params.email}])
        break;
      case 'AWS_AUTH_SUCCESS':
        GjMessage.success(t('MESSAGE_WARN.thisAfter-sale'));
        break;
    }
  }

  const notify = (type, data) => {
    switch (type) {
      case 'deleteRowData':
        deleteRowData(); break;
      case 'destroyModel':
        destroyModel(); break;
      case 'registerNotify':
        registerNotify(data); break;
      case 'goTo':
        $router.push(data).then();
        break;
      case 'getEmailAuth':
        getEmailAuth(data).then();
        break;
    }
  }

  const registerNotify = (fn) => {
    updateNotify = fn;
  }

  const getMessageNotice = async () => {
    const warnData = await messageWarnRequest();

    // console.log(noticeData, warnData);

    if (!warnData || !warnData.length) {
      return;
    }

    const noticeIds = noticeData.map(v => v.id);

    warnData.forEach(value => {
      if( value.msgType === "SYSTEM_MSG"){
        value.content = value.content.replace(/\n/g, '<br/>')
      }
      if (!noticeIds.includes(value.id)) {
        noticeData.push(value);
      }
      // value.content = `<a id="nav" href="http://dsds.com?markets=1&email=12344@qq.com&marketId=30">4324</a>`
      // value.remindLevel = 1;
    });

    // console.log(noticeData, warnData);

    if (noticeModal) {
      return;
    }
    vNode = createVNode(WarnTemplate, {
      t,
      dataItem: noticeData[0],
      updateNoticeViewStatusRequest,
      notify,
    });

    noticeModal = GjNotification.success({
      content: vNode,
      closable: false,
      duration: 0,
      showIcon: false,
      position: "bottomRight"
    }, instance.appContext)
  };

  const polling = () => {
    pollingTimer = setInterval(() => {
      getMessageNotice().then();
    }, pollingCycle);
  }

  return {
    getMessageNotice,
    polling
  }
}
