import { Suspense } from "react"
import { Metadata } from "next"
//import Link
import { MongoClient } from "mongodb"
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
import { Batch, columns } from "./datatable/columns"
import { DataTable } from "./datatable/data-table"

export const metadata: Metadata = {
  title: "Dashboard",
  description: "CowSwap Dashboard to visualize Coincidence of Wants in Batch Auctions",
}

async function getApiDataLastWeek(): Promise<Batch[]> {
  const batchSize = 1000 // set batch size for pagination
  const now = new Date()
  const twoDaysAgo = new Date(now.getTime() - 162 * 60 * 60 * 1000)
  const firstTradeTimestamp = Math.floor(twoDaysAgo.getTime() / 1000)

  let page = 0
  let allData: Batch[] = []

  while (true) {
    const data = JSON.stringify({
      collection: process.env.MONGODB_COLLECTION_NAME,
      database: process.env.MONGODB_DB_NAME,
      dataSource: "Cluster0",
      filter: {
        firstTradeTimestamp: { $gte: firstTradeTimestamp },
      },
      limit: batchSize,
      skip: page * batchSize,
    })

    try {
      const response = await fetch(
        "https://us-east-2.aws.data.mongodb-api.com/app/data-fnjyq/endpoint/data/v1/action/find",
        {
          next: { revalidate: 24 * 60 * 60 },
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Request-Headers": "*",
            "api-key":
              "5KHg7ImnBlNQlXkGGbyyB4LFoN0g9hk4fxUdWJbyKdd1bxo3DDrr48YjCHQquWMG",
          },
          body: data,
        }
      )

      const responseData = await response.json()
      console.log(responseData.documents.length, "data historical api")

      if (responseData.documents.length === 0) {
        break // break out of loop if no more data
      }

      allData.push(...(responseData.documents as unknown as Batch[]))
      page++
    } catch (error) {
      console.log(error)
      break
    }
  }

  return allData
}


async function getDataAsyncQuick(): Promise<Batch[]> {
  const client = await MongoClient.connect(process.env.MONGODB_URI as string)
  const db = client.db(process.env.MONGODB_DB_NAME)
  const collection = db.collection(
    process.env.MONGODB_COLLECTION_NAME as string
  )

  const now = new Date()
  const twoDaysAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000)
  const query = {
    firstTradeTimestamp: { $gte: Math.floor(twoDaysAgo.getTime() / 1000) },
  }
  const cursor = collection.find(query).sort({ $natural: -1 })
  // only 200 results
  const data = await cursor.toArray()

  await client.close()
  console.log(data.length, "data dn quick")

  return data as unknown as Batch[]
}
export default async function DashboardPage() {
  let data: any = getApiDataLastWeek()
  let dataQuick: any = getDataAsyncQuick()


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
