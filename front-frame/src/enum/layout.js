
export const MenuType = {
  sideBar: 'sideBar',
  headerBar: 'headerBar'
}

export const brands = {
  'alibaba': 'ALI',
  'aliexpress': '',
  'amazon': 'AMZ',
  'eBay': 'EBAY',
  'lazada': 'LZD',
  'shopbase': '',
  'shopee': 'SHPE',
  'shopify': 'SHPY',
  'shopyy': '',
  'walmart': 'WLMT',
  'wish': '',
  'generalTools': 'PLAT', // 通用工具，不属于多平台，但也在同一级
}

export const brandsEnum = (() => {
  let brand = brands;
  Object.entries(brand).forEach(([key, value]) => {
    brand[value] = key
  })
  return brand;
})()