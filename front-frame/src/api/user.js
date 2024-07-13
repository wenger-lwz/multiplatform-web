import request from '@/request'

// 获取当前用户
export function getCurrentUser() {
  return request({
    url: '/v2/system/account/current-username',
    method: 'get',
  }).then(res => res.data)
}

// 获取当前用户的数据权限
export function getUserRelateDataRole(userId) {
  return request({
    url: `/v2/sm/commonDataPermissionGroupUserMapping/groupList?userId=${userId}`,
    method: 'get',
  }).then(res => res.data)
}

// 用户数据权限分页列表
export function getUserDataRole(params) {
  if (params.name) {
    params.name = encodeURIComponent(params.name);
  }
  if (params.dataCode) {
      params.dataCode = encodeURIComponent(params.dataCode);
  }
  if (params.msku) {
      params.msku = encodeURIComponent(params.msku);
  }
  return request.get('/v2/sm/commonDataPermissionGroupMapping/user/pageList', {params}).then(res => res.data)
}

// 用户供应商数据权限
export function getUserSupplierRole(params) {
  return request.get('/v2/sm/commonDataPermissionGroupMapping/user/supplier/pageList', {params}).then(res => res.data)
}

// 用户商品数据权限
export function getUserListingRole(params) {
  return request.get('/v2/sm/commonDataPermissionGroupMapping/user/listing/pageList', {params}).then(res => res.data)
}
