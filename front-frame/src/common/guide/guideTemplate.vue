
<script>
import { defineComponent, computed, watch, ref } from 'vue';
import { useInject } from './useGuide'
import { getOffset } from './utils'
import { DIRECTION } from './enum'

const directions = Object.values(DIRECTION);

export default defineComponent({
  name: 'GuideTemplate',
  props: {
    el: {
      type: String,
      default: ''
    },
    /**
     * 引导出现在目标（el）的方向
     */
    direction: {
      type: String,
      default: ''
    },

  },
  setup(props, { expose }) {
    const { step, total, current, visible, skip, reset, next, back } = useInject();
    const left = ref(0);
    const top = ref(0);

    const computedLeft = computed(() => (current.value?.offset?.x ?? 0) + left.value);
    const computedTop = computed(() => (current.value?.offset?.y ?? 0) + top.value);
    const direction = computed(() => {
      return directions.includes(props.direction) ? props.direction : directions[0]
    });
    const visibleGuide = ref(false);

    const handleClickBtn = async (action) => {
      switch (action) {
        case 'skip': {
          await skip()
          break;
        }
        case 'reset': {
         await reset()
          break;
        }
        case 'next': {
         await next()
          break;
        }
        case 'back': {
          await back()
          break;
        }
      }
    }

    watch(() => [visible.value, step.value], (v) => {
      visibleGuide.value = false;
      if (!v) return;
      const { el, direction } = current.value;
      setTimeout(() => {
        const elDom = document.querySelector(el);
        if (elDom) {
          const [x, y] = getOffset(elDom, direction);
          left.value = x;
          top.value = y;
        }
        visibleGuide.value = true;
      }, 30)
    });

    /**
     * 使用 jsx 是为了判断和渲染 vNode（content
     */
    return () => (
      visible.value && current.value  &&
        <div v-show={visibleGuide.value} className={`${current.value.templateClass || ''} guide-template guide-template--${direction.value}`}
          style={{left: computedLeft.value + 'px', top: computedTop.value + 'px'}}
        >
          <div class="guide-content">
            <h5>{current.value.title}</h5>
            <section>
              { current.value.content ? 
                (typeof current.value.content  === 'object' && current.value.content) ||
                (typeof current.value.content  === 'string' && <div v-html={current.value.content}></div>)
              : ''}
            </section>

            <div class="guide-footer">
              <div class="step-count"><span>{step.value}</span>/{total.value}</div>
              <div class="step-button">
                { 
                  current.value.buttons &&
                  current.value.buttons.map((btn) => <span onClick={() => handleClickBtn(btn.action)}>{btn.text}</span>)
                }
              </div>
              <div class="guide-icon"></div>
            </div>

          </div>
          <div class="guide-line"></div>
      </div>
    );
  },

})

</script>

<style lang="scss">
.guide-template {
  position: fixed;
  z-index: 1009;
  .guide-content {
    position: relative;
    box-sizing: border-box;
    width: 320px;
    height: 124px;
    padding: 8px 12px;
    background: $g_color_white;
    border-radius: 8px;
    h5 {
      font-size: 16px;
      line-height: 26px;
      color: $g_color_black;
    }
    section {
      margin-top: 4px;
      font-size: 14px;
      line-height: 22px;
      color: #4E5969;
    }
  }
  .step-count {
    line-height: 18px;
    font-size: 12px;
    color: $g_color_faded;
    span {
      color: $g_color_black;

    }
  }
  .step-button {
    font-size: 14px;
    font-weight: bold;
    color: $g_primary_color;
    span {
      cursor: pointer;
    }
    span + span {
      margin-left: 24px;
    }
  }

  .guide-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 12px;
  }

  &__arrow {
    width: 30px;
    height: 74px;

    background: red;
  }

  &--right {
    padding-left: 130px;
    // transform: translateY(50%);
    .guide-line {
      width: 130px;
      height: 100px;
      top: 50px;
      &::after {
        transform: rotate(308deg) translate(0%, -50%);
      }
    }
  }

  &--br {
    transform: translateX(-30px);
    padding: 40px 0 0 100px;
    .guide-line {
      width: 100px;
      height: 100px;
      
    }
  }
  &--bl {
    padding: 54px 110px 0 0;
    transform: translateX(-100%);
    .guide-line {
      width: 110px;
      height: 100px;
      right: 0;
      top: 0;
      left: auto;
      &::after {
        transform: rotate(98deg) translate(-100%, 50%);
      }
    }
  }
  &--tr {
    padding: 0 0 40px 100px;
    transform: translate(0, -100%);
    .guide-line {
      &::after {
        transform: rotate(300deg) translate(-100%, 50%);
      }
    }
  }
  &--bottom {
    transform: translateX(-30px);
    padding: 40px 0 0 100px;
    .guide-line {
      width: 100px;
      height: 100px;
      
    }
  }

}

.guide-line {
  position: absolute;
  left: 0;
  top: 0;
  &::after {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 54px;
    height: 80px;
    transform: translate(-50%, -50%);
    content: '';
    @include useBackgroundImage('../../assets/images/guide-line.png', contain);
  }

}

.guide-icon {
  position: absolute;
  top: -59px;
  right: -26px;
  width: 100px;
  height: 142px;
  @include useBackgroundImage('../../assets/images/gj-idol.png');
}

.guide-box-shadow {
  position: relative;
  &::after {
    position: absolute;
    z-index: 1000;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    content: '';
    
    box-shadow: inset 10000px 10000px rgba(0, 0, 0, .7);
  }
}
.guide-high-light {
  overflow: hidden;
  position: relative;
  z-index: 1001;
}
.guide-disabled-events {
  pointer-events: none;
  .link,
  .arco-menu-item-inner,
  .gj-menu-item-link {
    pointer-events: none;
  }
  .favorites-menu-item,
  .arco-menu-item,
  .gj-menu-item,
  .menu-item-dd,
  .favorite-icon {
    pointer-events: visible;
  }
}
.guide-high-light-menu--light {
  box-sizing: border-box;
  border: 1px dashed #0045F0;
  background-color: #F2F3F5;
}
.guide-high-light-menu--dark {
  box-sizing: border-box;
  border: 1px dashed #FFF;
  background-color: rgba(255, 255, 255, .2);
  border-radius: 4px;
}
</style>