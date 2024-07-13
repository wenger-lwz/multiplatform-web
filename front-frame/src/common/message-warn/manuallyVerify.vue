<template>
  <gb-modal :title="title">
    <div class="manually-verify">
      <gj-alert type="warning" class="auth-alert">
        {{$t('MESSAGE_WARN.24HoursHead')}}
        <span style="color: #f5222d"> {{ $t('MESSAGE_WARN.24Hours') }}</span>
        {{ $t('MESSAGE_WARN.24HoursAfter') }}
      </gj-alert>

      <gj-steps :current="current" direction="vertical">
        <gj-step :title="$t('MESSAGE_WARN.logInTheEmail')">
          <template #description>
            <div class="desc-title">{{ $t('MESSAGE_WARN.step1') }}
              <span class="email-number">( {{ $t('MESSAGE_WARN.total') }}{{emailList.length}} )</span>
            </div>
            <div class="email-content">
                <span v-for="(item, index) in emailList">
                    {{item.addr}}  {{index < emailList.length - 1 ? '、' : ''}}
                </span>
            </div>
          </template>
        </gj-step>
        <gj-step :title="$t('MESSAGE_WARN.searchEmail')">
          <template #description>
            <div class="desc-title">
              {{ $t('MESSAGE_WARN.step2Head') }}
              <span style="font-weight: bold">
                    {{ $t('MESSAGE_WARN.step2Title') }}
                </span>
              {{ $t('MESSAGE_WARN.step2After') }}
            </div>
          </template>
        </gj-step>
        <gj-step :title="$t('MESSAGE_WARN.clickLink')">
          <template #description>
            <div class="desc-title" v-html="$t('MESSAGE_WARN.step3')"></div>
            <div class="desc-tooltip">
              <div class="example-warp">
                    <span class="example-title">
                        {{ $t('MESSAGE_WARN.example') }}
                    </span>
                <span class="example-link">
                        https://email-verification.us-east-1.amazonaws.com/?Context -Date=20211223T094917Z&Identity......
                    </span>
              </div>

              <div class="hand-warp">
                     <span class="example-title hand-tooltip">
                        {{ $t('MESSAGE_WARN.example') }}
                    </span>
                <i nz-icon iconfont="icon-handoup"></i>
                <span class="hand-inner">{{ $t('MESSAGE_WARN.findTheVerificationLink') }}</span>
              </div>

            </div>
          </template>
        </gj-step>
      </gj-steps>
    </div>
    <template #footer>
      <gj-button size="small"
                 type="primary"
                 @click="destroyModel()">
        {{$t('MESSAGE_WARN.iknow')}}
      </gj-button>
    </template>
  </gb-modal>
</template>

<script>
import {defineComponent, ref} from "vue";
import {GbModal, useModal} from "@gj/biz";
import {GjButton} from "@gj/atom";

export default defineComponent({
  name: "manuallyVerify",
  components: {
    GbModal,
    GjButton
  },
  props: {
    emailList: {
      type: Array
    },
    title: {
      type: String
    }
  },
  setup(props, {emit}) {
    const { destroy } = useModal();
    const current = ref(1);

    const setCurrent = (val) => {
      current.value = val;
    };

    const destroyModel = () => {
      destroy();
    }

    return {
      current,
      setCurrent,
      destroyModel
    }
  }
})
</script>

<style scoped lang="scss">
.manually-verify {
  padding: 4px 12px 0;
  width: 600px;
}

.desc-title {
  margin-bottom: 12px;
}

.manually-verify .email-title {
  color: #000 !important;
  font-weight: 500;
}

.desc-title .email-number {
  color: #999;
}

.email-content {
  /*min-height: 44px;*/
  max-height: 200px;
  overflow-y: auto;
}

.desc-tooltip {
  padding: 16px;
  border-radius: 4px;
  background: #EEF5FF;
  line-height: 18px;
}

.example-warp {
  margin-bottom: 8px;
}

.example-title {
  color: #000;
  font-weight: 400;
  display: inline-block;
  margin-right: 10px;
}

.example-link {
  color: #1F6EEF;
  text-decoration: underline;
}

.hand-warp {
  height: 20px;
  display: flex;
  align-items: center;
}

.hand-tooltip {
  visibility: hidden;
}

.hand-warp i {
  display: inline-block;
  width: 20px;
  height: 20px;
  font-size: 20px;
  transform: rotate(-90deg);
}

.hand-inner {
  color: #FB9115;
  margin-left: 4px;
}

.auth-alert {
  margin-bottom: 16px;
}
::v-deep {
  .arco-steps-item {
    display: flex;
  }
  .arco-steps-item-content {
    display: flex;

    .arco-steps-item-description {
      flex: 1;
    }
    .arco-steps-item-title {
      width: 100px;
    }
  }
}
</style>
