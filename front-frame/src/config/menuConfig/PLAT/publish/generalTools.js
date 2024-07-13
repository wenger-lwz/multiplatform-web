const baseRoute = '/multiplatform-web';
export default {
  key: "PLAT_generalTools",
  id: null,
  platform: 'PLAT',
  typeStyle: "menu",
  icon: "generalTools",
  route: '',
  apiPath: null,
  description: "通用工具菜单",
  parentKey: "PLAT_Publish",
  children: [
    {
      key: "PLAT_generalTools_phonePool",
      id: null,
      platform: 'PLAT',
      typeStyle: "page",
      icon: '',
      route: baseRoute + "/phonePool",
      apiPath: null,
      description: "号码池",
      parentKey: "PLAT_generalTools",
      // isShow: false,
      children: [
        {
          key: "PLAT_generalTools_phonePool-view",
          id: null,
          platform: 'PLAT',
          typeStyle: "btn",
          route: "",
          icon: '',
          apiPath: null,
          description: "新增按钮",
          parentKey: "PLAT_generalTools_phonePool",
          buttonType: "add"
        }
      ]
    },
    {
      key: "PLAT_generalTools_SKUMap",
      id: null,
      platform: 'PLAT',
      typeStyle: "page",
      icon: '',
      route: baseRoute + "/SKUMap",
      apiPath: null,
      description: "SKU 映射",
      parentKey: "PLAT_generalTools",
      // isShow: false,
      children: [
        {
          key: "PLAT_generalTools_SKUMap-add",
          id: null,
          platform: 'PLAT',
          typeStyle: "btn",
          icon: '',
          route: "",
          apiPath: null,
          description: "新增按钮",
          parentKey: "PLAT_generalTools_SKUMap",
          buttonType: "add"
        },
        {
          key: "PLAT_generalTools_SKUMap-delete",
          id: null,
          platform: 'PLAT',
          typeStyle: "btn",
          icon: '',
          route: "",
          apiPath: null,
          description: "删除按钮",
          parentKey: "PLAT_generalTools_SKUMap",
          buttonType: "delete"
        }
      ]
    },
    {
      key: "PLAT_generalTools_SKUAtuoGenerated",
      id: null,
      platform: 'PLAT',
      typeStyle: "page",
      icon: '',
      route: baseRoute + "/SKUAtuoGenerated",
      apiPath: null,
      description: "店铺SKU生成规则",
      parentKey: "PLAT_generalTools",
      // isShow: false,
      children: [
        {
          key: "PLAT_generalTools_SKUAtuoGenerated-edit",
          id: null,
          platform: 'PLAT',
          typeStyle: "btn",
          icon: '',
          route: "",
          apiPath: null,
          description: "编辑按钮",
          parentKey: "PLAT_generalTools_SKUAtuoGenerated",
          buttonType: "edit"
        }
      ]
    }
  ]
}
