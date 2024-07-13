import { getSupplier, getUserList } from '@/api/public'
import { ref } from 'vue'

export const userFilterOption = () => {
  // 供应商
  const suppliers = ref([])
  getSupplier({type: 'Supplier'})
    .then(data => {
      suppliers.value = data
    })
  // 用户列表
  const userList = ref([])
  getUserList()
    .then(data => {
      userList.value = data
    })
  // 状态
  const statusList = [
    { id: 0, text: '启用' },
    { id: 1, text: '禁用' },
  ]
  // 结算方式
  const settlementMethod = [
    {id: 1, text: '现结'},
    {id: 2, text: '月结'}
  ]

  return {
    suppliers,
    userList,
    statusList,
    settlementMethod
  }
}
