<template>
  <gb-modal :title="title" class="email-auth-host">
    <div class="email-title">
      {{ type === 'oneKey' || type === 'other' ? $t('MESSAGE_WARN.doYouAllowMuch') : $t('MESSAGE_WARN.doYouAllowOne')}}
    </div>

    <div class="email-warp" v-if="type === 'oneKey' || type === 'other'">
      <div v-if="emailList.length > 0  && emailList.length < 10">
        <div v-for="(val, index) in emailList"
             class="email-line"
             :class="index === emailList.length - 1 ? 'last-email' : ''">
          {{val?.addr}}
        </div>
      </div>

      <div v-if="emailList.length >= 10" class="grid-div">
        <div
            v-for="(val, index) in emailList"
            :key="val"
            class="email-line"
            :class="index % 2 ? 'right-email' : 'left-email'">
          {{val?.addr}}
        </div>
      </div>
    </div>
    <div class="public-title">{{$t('MESSAGE_WARN.note')}}</div>
    <template #footer>
      <gj-button size="small"
                 :loading="isHandLoading"
                 @click="operatorAuth('hand')"
                 type="text">
        {{ $t('MESSAGE_WARN.manuallyVerify') }}
      </gj-button>
      <gj-button size="small"
                 :loading="isHandLoading"
                 @click="destroyModel()">
        {{ $t('MESSAGE_WARN.reject') }}
      </gj-button>
      <gj-button size="small"
                 type="primary"
                 :loading="isAuthLoading"
                 @click="operatorAuth('auto')">
        {{ $t('MESSAGE_WARN.allow') }}
      </gj-button>
    </template>
  </gb-modal>

</template>

<script>
import {defineComponent, ref} from "vue";
import {GbModal} from "@gj/biz";
import {GjButton, GjMessage} from "@gj/atom";
import { useModal } from '@gj/biz';
import request from "@/request";
import {useI18n} from "vue-i18n";
import ManuallyVerify from './manuallyVerify';

export default defineComponent({
  name: "emailAuth",
  components: {
    GbModal,
    GjButton
  },
  props: {
    type: {
      type: String
    },
    emailList: {
      type: Array
    },
    title: {
      type: String
    }
  },
  setup(props, { emit }) {
    const {t} = useI18n();
    const isHandLoading = ref(false);
    const isAuthLoading = ref(false);
    const { destroy } = useModal();

    const destroyModel = () => {
      destroy()
    }

    const manuallyVerify = (emailList) => {
      GbModal.create(ManuallyVerify, {
        props: {emailList, title: t('MESSAGE_WARN.manualVerification')}
      })
    }

    const authEmailOperator = async (type) => {
      const params = props.emailList.map(item => item.marketId);
      try {
        isHandLoading.value = true;
        isAuthLoading.value = true;

        const dada = await request.post('v2/market/maintain/ticketEmail/awsSesAuth', {marketId: params, auto: type === 'auto'});

        if (dada.code === 0) {
          GjMessage.success(t('MESSAGE_WARN.operatedSucceeded'));

          if (type === 'auto') {
            manuallyVerify(props.emailList);
          }

          destroyModel();
        } else {
          GjMessage.warning(dada.messages[0]);
        }
      } finally {
        isHandLoading.value = false;
        isAuthLoading.value = false;
      }
    }

    const operatorAuth = (type) => {
      const params = props.emailList?.map(item => item.marketId) || [];

      if (!params.length) {
        GjMessage.warning('数据异常');
        return;
      }

      authEmailOperator(type);
    }

    return {
      isHandLoading,
      isAuthLoading,
      destroyModel,
      operatorAuth
    }
  }
})
</script>

<style scoped lang="scss">
.email-auth-host {
  width: 600px;
}
.email-warp {
  padding: 8px 20px;
  max-height: 140px;
  overflow-y: auto;
}

.email-title{
  line-height: 20px;
  padding: 0 20px;
  color: #333;
}

.public-title {
  line-height: 18px;
  padding: 0 20px;
  color: #333;
}

.grid-div {
  display: grid;
  grid-template-columns: 50% 50%;
}

.email-line {
  line-height: 18px;
  padding-bottom: 8px;
  color: #333;
}

.right-email {
  padding-left: 28px;
}

.left-email{
  border-right: 1px solid #E4E5E6;
}

.last-email{
  padding-bottom: 0;
}

</style>
