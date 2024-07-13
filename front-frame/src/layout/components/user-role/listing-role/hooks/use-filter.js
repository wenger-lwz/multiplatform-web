import { getProductCategory, getProductBrand, getProductType } from '@/api/public'
import { ref } from 'vue'

export const userFilterOption = () => {
  // 品类
  const productCategorys = ref([])
  getProductCategory()
    .then(data => {
      productCategorys.value = data
    })
  // 状态
  const statusList = [
    { id: 0, text: '在售' },
    { id: 2, text: '停售' },
    { id: 3, text: '删除' },
  ]

  return {
    productCategorys,
    statusList
  }
}
