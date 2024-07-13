<template>
  <div class="jj-timeline">
    <div
      class="jj-timeline-item"
      v-for="(activity, index) in listData"
      :key="index"
      @click="clickContent(activity, index)"
    >
      <span
        class="jj-typography"
        style="font-size: 12px"
        :class="activeData === index ? 'addColor' : ''"
      >
        {{ $t(activity.name) }}
      </span>
    </div>
  </div>
</template>

<script>
import {
  defineComponent,
  toRefs,
  reactive,
  getCurrentInstance,
  computed,
  onDeactivated,
  onMounted,
  onActivated,
} from "vue";

export default defineComponent({
  name: "rightNavPage",
  components: {},
  props: {
    layoutData: {
      type: Array,
      default: () => {
        return [];
      },
    },
    proxyData: {
      type: Object,
      default: () => {
        return {};
      },
    },
    scrollVal: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },

  setup(prop) {
    const { proxy } = getCurrentInstance();
    const data = reactive({
      itemTab: [],
      activeData: 0,
    });
    const clickContent = (val, index) => {
      const element = prop.proxyData.$refs[val.sectionId][0];
      element.scrollIntoView(true);
      data.activeData = index;
    };
    const rightNavPagescroll = (val) => {
      if (val && val.target.className === "arco-modal-body") {
        let count = val.target;
        for (let i = data.itemTab.length - 1; i >= 0; i--) {
          const element = prop.proxyData.$refs[data.itemTab[i]][0].offsetTop;
          if (count.scrollTop >= element) {
            data.activeData = i;
            break;
          } else if (
            data.itemTab.length - 1 === i &&
            count.scrollTop + count.clientHeight === count.scrollHeight
          ) {
            data.activeData = data.itemTab.length - 1;
            break;
          }
        }
      }
    };
    const listData = computed(() => {
      return proxy.layoutData;
    });

    data.itemTab = computed(() => {
      let itemTab = [];
      proxy.layoutData.forEach((item) => {
        itemTab.push(item.sectionId);
      });
      return itemTab;
    });

    const myAddListener = () => {
      window.addEventListener("scroll", rightNavPagescroll, true);
    };

    onMounted(() => {
      myAddListener();
    });
    onActivated(() => {
      myAddListener();
    });
    onDeactivated(() => {
      data.activeData = 0;
      window.removeEventListener("scroll", rightNavPagescroll, true);
    });
    return {
      ...toRefs(data),
      clickContent,
      rightNavPagescroll,
      listData,
    };
  },
});
</script>

<style scoped lang="scss">
.jj-timeline {
  border-left: 1px solid #d9d9e0;
  padding-left: 4px;
  display: flex;
  flex-direction: column;
}
.jj-timeline-item {
  color: #000430;
  font-size: 14px;
  height: 24px;
  padding: 4px 8px;
  display: flex;
  align-items: center;
  border-radius: 4px;
  box-sizing: border-box;
}
.addColor {
  font-weight: 700;
}
.jj-timeline-item:hover {
  background: #f2f6fe;
}
.jj-timeline-item:active,
.jj-timeline-item:visited {
  background: #e6ecfe;
  color: #000430;
  font-weight: 700;
}
</style>
