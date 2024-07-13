const baseRoute = '/multiplatform-web';

/*
 * 素材中心
 */
export default {
  "key": "PLAT_materialCenter",
  "route": null,
  "apiPath": null,
  "description": "素材中心",
  "typeStyle": "menu",
  "platform": 'PLAT',
  "parentKey": "PLAT_Publish",
  "id": null,
  "icon": 'generalTools',
  "children": [
    {
      "id": null,
      "typeStyle": "page",
      "key": "PLAT_materialCenter_productMaterial",
      "route": `${baseRoute}/productMaterial`,
      "apiPath": null,
      "platform": 'PLAT',
      "description": "产品素材",
      "parentKey": "PLAT_materialCenter",
      "children": [
        {
          "id": null,
          "typeStyle": "btn",
          "key": "PLAT_materialCenter_productMaterial-view",
          "apiPath": null,
          "platform": 'PLAT',
          "description": "查看",
          "parentKey": "PLAT_materialCenter_productMaterial",
          "buttonType": "view"
        }
      ],
    },
    {
      "id": null,
      "typeStyle": "page",
      "key": "PLAT_materialCenter_pictureManagement",
      "route": `${baseRoute}/pictureManagement`,
      "apiPath": null,
      "platform": 'PLAT',
      "description": "图片管理",
      "parentKey": "PLAT_materialCenter",
      // "children": [
      //   {
      //     "id": null,
      //     "typeStyle": "btn",
      //     "key": "PLAT_materialCenter_pictureManagement-view",
      //     "apiPath": null,
      //     "platform": 'PLAT',
      //     "description": "查看",
      //     "parentKey": "pictureManagement",
      //     "buttonType": "view"
      //   }
      // ],
    },
    {
      "id": null,
      "typeStyle": "page",
      "key": "PLAT_materialCenter_videoManagement",
      "route": `${baseRoute}/videoManagement`,
      "apiPath": null,
      "platform": 'PLAT',
      "description": "视频中心",
      "parentKey": "PLAT_materialCenter"
    }
  ],

}
