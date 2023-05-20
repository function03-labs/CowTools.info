"use client"

import { useEffect } from "react"
import { Activity, CreditCard, DollarSign, Download, Users } from "lucide-react"

import { computeBatchVolume } from "@/lib/utils_dashboard"
import { useDailyVolume, useNumTransactions } from "@/hooks/hooks"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/ui/card"

import { Batch } from "./datatable/columns"

export default function Cards({ data: CowData }: { data: Batch[] }) {
  const { data: dailyVolume, isLoading: isDailyVolumeLoading } =
    useDailyVolume()

  const last24hVolume = dailyVolume
    ?.slice(0, 24) // get the first 24 entries
    .reduce((acc, entry) => acc + Number(entry.volumeUsd), 0) as number // sum up the volumeUsd values

  const early24Volume = dailyVolume
    ?.slice(-24) // get the first 24 entries
    .reduce((acc, entry) => acc + Number(entry.volumeUsd), 0) as number // sum up the volumeUsd values
  useEffect(() => {
    if (last24hVolume) {
      const element: HTMLElement = document.querySelector(".animate-blink")!
      // add this to element's style
      element.style.animation = "blink 1s cubic-bezier(0.13,-0.84,0.53,0.54)"
      // add this to element's class
      setTimeout(() => (element.style.animation = "none"), 1000)
    }
  }, [last24hVolume])
  const last24hBatches = dailyVolume
    ?.slice(0, 24)
    .reduce((acc, entry) => acc + Number(entry.numberOfTrades), 0) as number
  const early24hBatches = dailyVolume
    ?.slice(-24)
    .reduce((acc, entry) => acc + Number(entry.numberOfTrades), 0) as number
  const percentageChangeVol =
    ((last24hVolume - early24Volume) / early24Volume) * 100
  const percentageChangeBat =
    ((last24hBatches - early24hBatches) / early24hBatches) * 100
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Daily Volume</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div
            // className="animate-[blink_1s_cubic-bezier(0.13,-0.84,0.53,0.54)] text-2xl font-bold"
            className={`text-2xl font-bold ${last24hVolume && "animate-blink"}`}
          >
            {last24hVolume ? (
              <>
                {last24hVolume.toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                  notation: "compact",
                  minimumFractionDigits: 3,
                  maximumFractionDigits: 3,
                })}
                <span className=" text-xs font-medium ">
                  {" "}
                  <span
                    className={
                      percentageChangeVol >= 0
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  >
                    {percentageChangeVol >= 0 ? "+" : "-"}
                    {Math.abs(percentageChangeVol).toFixed(2)}%
                  </span>
                  {/* calculate percentage change and display based on color green or red */}
                </span>
              </>
            ) : (
              <div className="animate-pulse">Loading...</div>
            )}
          </div>
          <p className="hidden text-xs text-muted-foreground sm:block">
            Total volume of CoW transactions in the last 24 hours
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Daily Batches</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div
            className={`${
              last24hVolume && "animate-blink"
            } text-2xl font-bold transition-colors`}
          >
            {last24hBatches ? (
              <>
                {last24hBatches}
                <span className=" text-xs font-medium ">
                  {" "}
                  <span
                    className={
                      percentageChangeBat >= 0
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  >
                    {percentageChangeBat >= 0 ? "+" : "-"}
                    {Math.abs(percentageChangeBat).toFixed(2)}%
                  </span>
                </span>
              </>
            ) : (
              <div className="animate-pulse">Loading...</div>
            )}{" "}
          </div>

          <p className="hidden text-xs text-muted-foreground sm:block">
            Total number of batch auctions in the last 24 hours
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">CoWiness Volume</CardTitle>
          <CreditCard className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {CowData?.filter(
              (batch) =>
                batch.firstTradeTimestamp * 1000 >
                new Date(new Date().getTime() - 24 * 60 * 60 * 1000).getTime()
            )
              .reduce(
                (acc, batch) =>
                  acc +
                  Number(batch.cowiness) * computeBatchVolume(batch.trades),
                0
              )
              .toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
                notation: "compact",
                minimumFractionDigits: 3,
                maximumFractionDigits: 3,
              })}{" "}
          </div>

          <p className="hidden text-xs text-muted-foreground sm:block">
            Daily volume from Coincidence of Wants in batch auctions
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Fully Matched CoWs
          </CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {
              CowData?.filter(
                (batch) =>
                  batch.firstTradeTimestamp * 1000 >
                    new Date(
                      new Date().getTime() - 24 * 60 * 60 * 1000
                    ).getTime() && Number(batch.cowiness) >= 0.9
              ).length
            }
          </div>
          <p className="hidden text-xs text-muted-foreground sm:block">
            Number of fully matched CoWs in the last 24 hours
          </p>
          {/* <p className="text-xs text-muted-foreground">
                    +201 since last hour
                  </p> */}
        </CardContent>
      </Card>
    </div>
  )
}
