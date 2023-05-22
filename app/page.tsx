import { Suspense } from "react"
import { Metadata } from "next"
//import Link
import Skeleton from 'react-loading-skeleton';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/ui/card"

import Cards from "./cards"
import { Overview } from "./components/barchart"
import { CalendarDateRangePicker } from "./components/date-range-picker"
import { MainNav } from "./components/main-nav"
import Navbar from "./components/navbar"
import { RecentBatches } from "./components/recent-batches"
import { Search } from "./components/search"
import TeamSwitcher from "./components/team-switcher"
import { UserNav } from "./components/user-nav"
import { columns } from "./datatable/columns"
import { DataTable } from "./datatable/data-table"
import { getDataAsyncQuick } from "./getDataAsyncQuick";
import { getApiDataLastWeek } from "./getApiDataLastWeek";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "CowSwap Dashboard to visualize Coincidence of Wants in Batch Auctions",
}

export default async function DashboardPage() {
  let dataQuick: any = getDataAsyncQuick()

  let data: any = getApiDataLastWeek()


  return (
    <>    <div className="flex-col md:flex">

      <Navbar />

      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        {/* <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          </div> */}
        <div className="space-y-4">

          <Cards data={dataQuick} />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-4 lg:grid-cols-7">
            <Card className="col-span-1 md:col-span-2 lg:col-span-4">
              <CardHeader>
                <CardTitle>Historical Volume</CardTitle>
                <CardDescription>{" "}</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <Suspense fallback={<Skeleton count={10} />}>
                  {data.then((data) => {
                    return <Overview data={data} />
                  })}
                </Suspense>
              </CardContent>
            </Card>
            <Card className="col-span-1 md:col-span-2 lg:col-span-3">
              <CardHeader>
                <CardTitle>CoWiness Leaderboard</CardTitle>
                <CardDescription>
                  Highest CoWs in batch auctions in the last 24 hours
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<Skeleton count={10} />} >
                  {dataQuick.then((dataQuick) => (
                    <RecentBatches data={dataQuick} />
                  ))}
                </Suspense>
              </CardContent>
            </Card>
          </div>

          {/* adding tanstack table below */}
        </div>
        <div className="!overflow-hidden">
          <Suspense fallback={<Skeleton count={10} />} >
            {dataQuick.then((dataQuick) => (
              <DataTable columns={columns} data={dataQuick} />
            ))}
          </Suspense>
        </div>
      </div>
    </div>
    </>
  )
}
