
import { allOrder } from "./order/index"
import { allSystem } from "./system/index"
import { allSale } from "./sales/index"
import { allStatistical } from "./statistical/index"
import { allFinance } from "./finance/index"
import { allTool } from "./tool/index"
import { allAds } from "./ads/index"

export const publicMenu = [
  ...allOrder,
  ...allSystem,
  ...allSale,
  ...allStatistical,
  ...allFinance,
  ...allTool,
  ...allAds
]