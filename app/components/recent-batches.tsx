import Link from "next/link"
import { formatDistanceToNow, parseISO } from "date-fns"

import { computeBatchVolume } from "@/lib/utils_dashboard"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/ui/avatar"

import { Batch } from "../datatable/columns"

function rankTopBatches(data: Batch[], top: number): Batch[] {
  return data
    ?.slice()
    .sort((a, b) => {
      const aValue = Number(a.cowiness) * computeBatchVolume(a.trades)
      const bValue = Number(b.cowiness) * computeBatchVolume(b.trades)
      return bValue - aValue
    })
    .slice(0, top)
}

export function RecentBatches({ data }: { data: Batch[] }) {
  const topBatches = rankTopBatches(data, 5)

  return (
    <>
      <div className="mb-4 grid grid-cols-10 items-center  text-sm font-medium text-muted-foreground">
        <div className="grow col-span-6">Batch ID</div>
        <div className="ml-4 shrink-0 col-span-2 text-right">Value</div>
        <div className="ml-4 shrink-0 col-span-2 text-right">CoW %</div>
      </div>
      <div className="space-y-8">
        {topBatches.map((batch) => (
          <div className="grid grid-cols-10 items-center" key={batch._id}>
            <div className="col-span-6 grow overflow-auto ">
              <p className="w-[80%] overflow-hidden text-ellipsis text-sm font-medium leading-none">
                <Link href={`/batch/${batch.txHash}`}>{batch.txHash}</Link>
              </p>
              <p className="text-sm text-muted-foreground">
                {formatDistanceToNow(Number(batch.firstTradeTimestamp) * 1000, {
                  addSuffix: true,
                })}
              </p>
            </div>
            <div className="col-span-2 ml-4 shrink-0 text-right">
              {Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
                notation: "compact",
                // minimumFractionDigits: 3,
                maximumFractionDigits: 2,
                compactDisplay: "long",
              }).format(computeBatchVolume(batch.trades))}
            </div>
            <div className="col-span-2 ml-4 shrink-0 text-right">
              {(Number(batch.cowiness) * 100).toFixed(2)}%
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
