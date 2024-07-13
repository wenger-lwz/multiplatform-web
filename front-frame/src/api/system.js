import request from '@/request'

// 通过版本查询公告
export function getVersionAnnouncement(version='') {
  return request({
    url: version ? '/api/admin/version/version?version='+version : '/api/admin/version/version',
    method: 'get',   
  })
}

// 公告标记已读
export function markAnnouncement(params) {
  return request({
    url: '/admin/version/mark',
    method: 'post',   
    data: params,
  })
}

// 获取公司信息，如名称
export function getCompanyInformation(id) {
  return request({
    url: `/v2/setting/systemSetting/getCompanyInformation/${id}`,
    method: 'get',   
  })
}

// 将用户的一些数据，存储在服务器，适用于跨浏览器场景
export const setUserStorage = (type, content) => {
  if (content === undefined) return;
  if (typeof content !== 'string') {
    content = JSON.stringify(content);
  }
  return request({
    url: `/admin/system/sys-user-personalize/save`,
    method: 'put',
    data: {
      type,
      content
    }
  })
}

// 获取用户储存在服务器的信息
export const getUserStorage = (type) => {
  return new Promise((resolve, reject) => {
    try {
      request({
        url: `/admin/system/sys-user-personalize/${type}`,
        method: 'get'
      }).then(r => {
        if (r.data && r.data !== '') {
          return resolve(parseIfJson(r.data))
        }
        resolve(undefined);
      })
    } catch (err) {
      reject(err)
    }
  });
}

// 判断用户是否今日首次进入系统
export const isFirstEnterSystemToday = () => {
  return request({
    url: `/admin/system/sys-user/isFirstLoginToday`,
    method: 'get',
  })
}


function parseIfJson (string) {
  try {
    const data = JSON.parse(string);
    return data;
  } catch (err) {}
  return string
}