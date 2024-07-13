<template>
  <!-- 切换弹框 -->
  <gj-popconfirm :popup-visible="confirmVisible"
    position="bottom"
    content-class="switch-nav-confirm"
    okText="确认"
    @ok="handleConfirmSubmit"
    @cancel="handleConfimeCancel"
  >
    <div class="switch-nav" >
      <!-- 提示弹框 -->
      <gj-popover :popup-visible="popupVisible"
        class="blue-popover"
      >
        <!-- 挂载点（按钮 -->
        <div class="container" @click="handleClickBtn">
          <span class="title">切换新布局</span>
          <svg-icon svg-class="switch-nav-bg" style="color: #0045F0; width: 96px; height: 32px;" />
        </div>

        <template #content>
          <span class="close-btn" v-if="!isFrist">
            <svg-icon @click="handleTipClose" svg-class="close" style="color: white; width: 10px; height: 10px;" />
          </span>

          <section :style="`${isFrist ? '' : 'padding-right: 18px;'}`">
            全新的左侧导航布局，将为您提供更友好的使用体验！
            <br/>快点击切换，开启不一样的感受之旅吧😊
          </section>
          <gj-checkbox v-if="!isFrist"
            :model-value="neverTip" 
            :value="false"
            class="blue-popover__checkbox"
            @click="handleCheckBoxClick"
          >
            <span>不再提示</span>
          </gj-checkbox>
        </template>
      </gj-popover>
    </div>

    <template #content>
      <h5 class="confirm-title">左侧导航布局，使用体验更友好，推荐使用</h5>
      <ul class="confirm-list">
        <li @click="handleSelectMenu(MenuType.sideBar)" :class="`confirm-item ${selectMenuType === MenuType.sideBar ? 'active' : ''}`">
          <span class="book" style="left: 16px;">
            <span>全新</span>
            <svg-icon svg-class="book-mark" style="color: #0045F0; width: 32px; height: 24px;" />
          </span>
          <span class="book" style="left: 52px;">
            <span>推荐</span>
            <svg-icon svg-class="book-mark" style="color: #F87A01; width: 32px; height: 24px;" />
          </span>

          <gj-radio :model-value="selectMenuType" :value="MenuType.sideBar">左侧导航布局</gj-radio>
          <img src="@/assets/images/sideBar-mini.png" alt="左侧导航布局">
        </li>
        <li @click="handleSelectMenu(MenuType.headerBar)" :class="`confirm-item ${selectMenuType === MenuType.headerBar ? 'active' : ''}`">
          <gj-radio :model-value="selectMenuType" :value="MenuType.headerBar">顶部导航布局</gj-radio>
          <img src="@/assets/images/headerBar-mini.png" alt="顶部导航布局">
        </li>
      </ul>
    </template>
  </gj-popconfirm>
</template>

<script>
import { defineComponent, ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex'
import { setUserStorage, getUserStorage, isFirstEnterSystemToday } from '@/api/system'
import SvgIcon from '@/components/SvgIcon.vue';
import { MenuType } from '@/enum/layout';
import { 
  FIRST_ENTER_SYSTEM,
  NEVER_SHOW_SWITCH_MENU_TIP,
  CLOSE_SWITCH_MENU_TIP_DATE,
  MENU_TYPE 
} from '@/enum/storage';

export default defineComponent({
  name: 'SwitchNav',
  components: {
    SvgIcon
  },
  setup() {
    const $store = useStore();
    const storeMenuType = computed(() => $store.getters.menuType)

    const popupVisible = ref(false);
    const confirmVisible = ref(false);
    const isFrist = ref(true);
    const selectMenuType = ref(MenuType.headerBar);
    const neverTip = ref(false);

    const todayDate = new Date().toLocaleDateString('zh-CN');

    const handleClickBtn = () => {
      // 1. 关闭tip
      handleTipClose();

      // 2. 打开confirm
      confirmVisible.value = true;
    };

    const handleTipClose = () => {
      // 记录关闭的日期
      if (popupVisible.value) setUserStorage(CLOSE_SWITCH_MENU_TIP_DATE, todayDate);

      // 1.关闭tip
      popupVisible.value = false;
  

      // 2. 记录是否不再提示
      if (neverTip.value) {
        setUserStorage(NEVER_SHOW_SWITCH_MENU_TIP, true);
      }
    };
    const handleSelectMenu = (type) => {
      selectMenuType.value = type
    };
    const handleConfirmSubmit = () => {
      confirmVisible.value = false;
      if (storeMenuType.value === selectMenuType.value) return;
      $store.commit('SWITCH_MENU')
      
    };
    const handleConfimeCancel = () => {
      confirmVisible.value = false;
    };
    const handleCheckBoxClick = (val) => {
      neverTip.value = !neverTip.value
    }

    onMounted(async() => {
      // 判断是否显示tip
      // 如果能拿到本地储存的localStorage，那就就是切换过菜单，不再弹出 tip 提示
      if (localStorage.getItem(MENU_TYPE)) return;
      // 是否选择过不再提示
      const r = await getUserStorage(NEVER_SHOW_SWITCH_MENU_TIP);
      neverTip.value = Boolean(r);
      if (neverTip.value) return;

      // 判断当天是否关闭过提示弹框
      const r2 = await getUserStorage(CLOSE_SWITCH_MENU_TIP_DATE);
      if (r2 === todayDate) return;

      // 还需要请求一次后端 api，看是否当天是首次进入。
      const { data } = await isFirstEnterSystemToday();
      popupVisible.value = Boolean(data);
       
      // 如果弹框则需要再判断弹框样式。
      if (popupVisible.value) {
        isFrist.value = await isFirstEnterToday(todayDate);
      }
    });


    async function isFirstEnterToday (todayDate) {
      // 是否是首次进入系统
      const result = await getUserStorage(FIRST_ENTER_SYSTEM);
      const enterDate = result?.date || todayDate;

      if (result === undefined || result.isFirstEnter !== false) {
        // 设置不再是首次进入
        setUserStorage(FIRST_ENTER_SYSTEM, {
          isFirstEnter: false,
          date: todayDate,
        })
        return true;
      }
      
      // 非首次进入，还需要判断是不是首天
      if (enterDate === todayDate) {
        return true;
      }

      return false
    }

    return {
      MenuType,
      isFrist,
      neverTip,
      popupVisible,
      confirmVisible,
      selectMenuType,
      handleCheckBoxClick,
      handleClickBtn,
      handleTipClose,
      handleSelectMenu,
      handleConfirmSubmit,
      handleConfimeCancel
    }
  }
})
</script>

<style lang="scss">
.switch-nav {
  height: 40px;
  .container {
    position: relative;
    cursor: pointer;
    &:hover {
      .svg-icon {
        color: #4080FF!important;
      }
    }
    &:active {
      .svg-icon {
        color: #0E42D2!important;
      }
    }
  }
  .title {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 100%;
    text-align: center;
    font-size: 12px;
    color: #fff;
    transform: translate(-50%, -50%);
  }

  &-confirm {
    .confirm-title {
      font-size: 18px;
      color: #1D2129;
      font-weight: bold;
    }
    .confirm-list {
      display: flex;
      justify-content: space-between;
      width: 580px;
      padding-bottom: 8px;
      margin-top: 26px;
      li {
        position: relative;
        width: 282px;
        height: 193px;
        border-radius: 4px;
        border: 1px solid #DADDE2;
        cursor: pointer;
        &.active {
          border-color: #0045F0;
        }
      }
    }
    .confirm-item {
      box-sizing: border-box;
      padding: 24px 16px 20px;
      text-align: center;
      img {
        display: block;
        width: 252px;
        height: 118px;
        margin-top: 15px;
        border: 0;
      }
      &:hover {
        border-color: white;
        box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1)
      }
    }

    .book {
      position: absolute;
      left: 0;
      top: 0;
      span {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        text-align: center;
        color: white;
        font-size: 12px;
      }
    }

    /** 调整底部按钮样式  */
    .arco-popconfirm-footer {
      .arco-btn {
        padding: 0 12px;
        height: 32px;
        line-height: 31px;
        text-align: center;
        border-radius: 4px;
      }
    }
    .arco-radio-label {
      font-size: 14px;
      color: #1D2129;
      font-weight: bold;
    }
  }
}

.blue-popover {
  .arco-popover-popup-content {
    color: white;
    background-color: #0045F0;

  }
  .arco-popover-popup-arrow {
    background-color: #0045F0;
  }

  &__checkbox {
    margin-top: 15px;
    .arco-checkbox-label {
      color: white;
    }
    .arco-checkbox-icon {
      background-color: transparent;
    }
    .arco-checkbox-icon-check {
      color: #0045F0;
    }
    .arco-checkbox:hover,
    .arco-checkbox-icon-hover::before {
      background-color: #0045F0!important;
    }
    &.arco-checkbox-checked {
      .arco-checkbox-icon {
        background-color: white;
      }
    }
  }

  .close-btn {
    position: absolute;
    top: 17px;
    right: 15px;
    cursor: pointer;
  }
}

.switch-new-layout {
  top: 123%;
  &::before {
    position: absolute;
    width: 54px;
    height: 80px;
    content: '';
    left: 168px;
    top: -47px;
    transform: rotate(65deg);
    @include useBackgroundImage('../../../assets/images/guide-line.png', contain);

  }
  .guide-line {
    top: 70px;
    right: 3px;
    .guide-line::after {
      transform: 
        rotate(110deg) translate(-100%, 50%);
    }
  }
}
</style>