<template>

</template>

<script>
import {defineComponent} from "vue";
import WarnTemplate from './message-notice';
import {useI18n} from "vue-i18n";
import {useMessageWarn} from "./useMessageWarn";

export default defineComponent({
  name: "MessageWarn",
  setup() {
    const { t } = useI18n();
    const { getMessageNotice, polling } = useMessageWarn();

    getMessageNotice().then();

    polling();
  }
})
</script>

<style scoped>

</style>
