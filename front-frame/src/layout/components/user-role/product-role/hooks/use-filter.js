import { getProductCategory, getProductBrand, getProductType } from '@/api/public'
import { ref } from 'vue'

export const userFilterOption = () => {
  // 品类
  const productCategorys = ref([])
  getProductCategory()
    .then(data => {
      productCategorys.value = data
    })
  // 品牌
  const productBrands = ref([])
  getProductBrand()
    .then(data => { 
      productBrands.value = data
    })
  // 类型
  const productTypes = ref([])
  getProductType()
    .then(data => {
      productTypes.value = data
    })
  // 关键词key
  const keywordTypes = [
    { id: 'dataCode', text: 'SKU' },
    { id: 'msku', text: 'MSKU' },
    { id: 'name', text: '产品名称' },
  ]

  return {
    productCategorys,
    productBrands,
    productTypes,
    keywordTypes
  }
}
