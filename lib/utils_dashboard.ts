import { Trade } from "@/app/dashboard/datatable/columns"

export function computeBatchVolume(trades: Trade[]): number {
  let batchVolume = 0

  trades.forEach((trade) => {
    const sellVolumeUSD = parseFloat(trade.sellAmountUsd)
    const buyVolumeUSD = parseFloat(trade.buyAmountUsd)
    batchVolume += sellVolumeUSD > 0 ? sellVolumeUSD : buyVolumeUSD
  })

  return batchVolume
}
