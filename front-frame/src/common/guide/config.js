import { computed, createVNode } from 'vue';
import { MenuType } from '@/enum/layout';
import Collect from './contentForCollect.vue';
import FixNav from './contentForFixNav.vue';
import FullScreen from './contentForFullscreen.vue';
import { disableDom, enableDom, highLight, removeHightLight  } from './utils'
import { DIRECTION } from './enum'

// 要运行在 setup 中
export default ($store) => {

  const menuType = computed(() => $store.getters.menuType);
  const collapsed = computed(() => $store.getters.collapsed);
  const config = [
    {
      el: '.sidebar-container.sidebar-collapsed',
      direction: DIRECTION.right,
      title: '收藏菜单',
      content: createVNode(Collect),
      buttons: [
        {
          text: '跳过教程',
          action: 'skip',
        },
        {
          text: '下一条',
          action: 'next',
        }
      ],
      offset: {
        x: 0,
        y: -300,
      }
    },
    {
      el: '.tag-box .add-btn',
      direction: DIRECTION.br,
      title: '查看收藏菜单',
      content: `
      直接打开常用菜单~<br/>
      查找不费力！
      `,
      buttons: [
        {
          text: '跳过教程',
          action: 'skip',
        },
        {
          text: '下一条',
          action: 'next',
        }
      ],
      offset: {
        x: 130,
        y: 200,
      },
      before() {
        const elDom = document.querySelector('.tag-box .add-btn')
        if (elDom) elDom.click();
        const tabDom = document.querySelectorAll('.tag-box .tag-wrap li')
        if (tabDom && tabDom.length > 6) {
          const d = document.querySelector('.guide-template');
          d.style.transform = `translateX(-650px)`
          setTimeout(() => {
            d.classList.add('guide-template--bl')

          })
        }
        setTimeout(() => {
          disableDom('.favorites-menu')
        }, 100)
      },
      after() {
        const elDom = document.querySelector('.tag-box .add-btn')
        if (elDom) elDom.click();
        const tabDom = document.querySelectorAll('.tag-box .tag-wrap li')
        if (tabDom && tabDom.length > 6) {
          const d = document.querySelector('.guide-template');
          d.style.transform = ``
          d.classList.remove('guide-template--bl')
        }
        enableDom('.favorites-menu')
      }
    },
    {
      el: '.tag-box .thumbtack',
      elStyle: {
        'background-color': 'rgba(255, 255, 255, 0.2)'
      },
      direction: DIRECTION.br,
      offset: {
        x: 0,
        y: 0,
      },
      title: '固定页签',
      content: createVNode(FixNav),
      buttons: [
        {
          text: '跳过教程',
          action: 'skip',
        },
        {
          text: '下一条',
          action: 'next',
        }
      ],
    },
    {
      el: '.right-content .screen-full-icon',
      elStyle: {
        'background-color': 'rgba(255, 255, 255, 0.2)'
      },
      offset: {
        x: 30,
        y: 0,
      },
      direction: DIRECTION.bl,
      title: '一键全屏',
      content: createVNode(FullScreen),
      buttons: [
        {
          text: '跳过教程',
          action: 'skip',
        },
        {
          text: '下一条',
          action: 'next',
        }
      ],
    },
    {
      el: '.sidebar-user',
      direction: DIRECTION.tr,
      title: '设置布局',
      offset: {
        x: 120,
        y: 0,
      },
      content: `
      导航布局灵活设置~<br/>
      侧边还是顶部，选你所爱！
      `,
      buttons: [
        {
          text: '跳过教程',
          action: 'skip',
        },
        {
          text: '下一条',
          action: 'next',
        }
      ],
      before() {
        const dom = document.querySelector('.sidebar-user .sidebar-user-head');
        if (dom) dom.click();
        setTimeout(() => {
          disableDom('.arco-dropdown')
          highLight('.header-bar-container .switch-nav');
        }, 100)
      },
      after() {
        enableDom('.arco-dropdown')
        removeHightLight('.header-bar-container .switch-nav');
      }
    },
    {
      el: '.header-bar-container',
      direction: DIRECTION.right,
      title: '菜单搬家',
      content: `
      Review、Feedback和买家列表<br/>
      搬家到这里了哟~
      `,
      offset: {
        x: 0,
        y: -300,
      },
      buttons: [
        {
          text: '再看一遍',
          action: 'reset',
        },
        {
          text: '立即体验',
          action: 'skip',
 
        }
      ],
    },
  ]

  setConfig()

  function setConfig () {
    if (menuType.value === MenuType.sideBar) {
      config.unshift({
        el: '.collapse-btn',
        direction: DIRECTION.br,
        title: '收放导航',
        content: `
        侧边栏支持收放～<br/>
        内容展示最大化！
        `,
        buttons: [
          {
            text: '跳过教程',
            action: 'skip',
          },
          {
            text: '下一条',
            action: 'next',
          }
        ],
        offset: {
          x: 0,
          y: 0,
        },
        elStyle: {
          color: '#fff',
          'background-color': 'rgba(255, 255, 255, 0.2)'
        },
      })
      // 收藏菜单
      const el = collapsed.value ? '.sidebar-container.sidebar-collapsed' : '.arco-menu.sidebar-menu'
      config[1].el = el;
      if (collapsed.value) config[1].offset = {
        x: 330,
        y: -300
      };

      // 菜单搬家
      config[6].el = el;
      if (collapsed.value) config[6].offset = {
        x: 330,
        y: -300
      };
    } else {
      if (config[0].title === '收放导航') {
        config.splice(0, 1)
      }
      // 收藏菜单
      config[0].el = '.header-bar__menu-item__wrap';
      config[0].direction = DIRECTION.bottom;
      config[0].offset = {
        x: 0,
        y: 0
      }

      // 设置布局
      config[4].direction = DIRECTION.bl;
      config[4].offset = {
        x: 110,
        y: 70
      };
      config[4].templateClass = 'switch-new-layout'

      // 菜单搬家
      config[5].el = '.header-bar__menu-item__wrap';
      config[5].direction = DIRECTION.bottom;
      config[5].offset = {
        x: 0,
        y: 0
      }
    }
  }

  console.log('getConfig return ->', config)
  return config
}
