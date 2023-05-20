import { Suspense } from "react"
import { Metadata } from "next"
//import Link
import { MongoClient } from "mongodb"

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
  description: "Example dashboard app using the components.",
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
          next: { revalidate: 1000 },
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

// export async function getDataAsync(): Promise<Batch[]> {
//   // const client = await MongoClient.connect(process.env.MONGODB_URI as string)
//   // const db = client.db(process.env.MONGODB_DB_NAME)
//   // const collection = db.collection(
//   //   process.env.MONGODB_COLLECTION_NAME as string
//   // )
//   const data_info = JSON.stringify({
//     collection: "last_batches_augmented_final_serve",
//     database: "cow_batches",
//     dataSource: "Cluster0",
//     projection: {
//       _id: 1,
//     },
//   })

//   const headers = {
//     "Content-Type": "application/json",
//     "Access-Control-Request-Headers": "*",
//     "api-key":
//       "5KHg7ImnBlNQlXkGGbyyB4LFoN0g9hk4fxUdWJbyKdd1bxo3DDrr48YjCHQquWMG",
//   }
//   const config = {
//     method: "POST",
//     headers: headers,
//     body: data_info,
//   }

//   fetch(
//     "https://us-east-2.aws.data.mongodb-api.com/app/data-fnjyq/endpoint/data/v1/action/findOne",
//     config
//   )
//     .then((response) => response.json())
//     .then((data) => console.log(JSON.stringify(data)))
//     .catch((error) => console.log(error))

//   // const now = new Date()
//   // const twoDaysAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000)
//   // const query = {
//   //   firstTradeTimestamp: { $gte: Math.floor(twoDaysAgo.getTime() / 1000) },
//   // }
//   // const cursor = collection.find(query).sort({ $natural: -1 })
//   // const data = await cursor.toArray()

//   // await client.close()
//   // console.log(data.length, "data dn")

//   // return data as unknown as Batch[]
// }
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
    <>
      <div className="flex-col md:flex">
        {/* <div className="border-b">
          <div className="flex h-16 items-center px-4">
            <TeamSwitcher />
            <MainNav className="mx-6" />
            <div className="ml-auto flex items-center space-x-4">
              <Search />
              <UserNav />
            </div>
          </div>
        </div> */}
        <Navbar />
        <div className="flex-1 space-y-4 p-8 pt-6">
          {/* <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          </div> */}

          <div className="space-y-4">
            <Suspense fallback={<div>Loading...</div>}>
              {dataQuick.then((dataQuick) => (
                <Cards data={dataQuick} />
              ))}
            </Suspense>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-4 lg:grid-cols-7">
              <Card className="col-span-1 md:col-span-2 lg:col-span-4">
                <CardHeader>
                  <CardTitle>Historical Volume</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  <Suspense fallback={<div>Loading...</div>}>
                    {data.then((data) => {
                      return <Overview data={data} />
                    })}
                  </Suspense>
                </CardContent>
              </Card>
              <Card className="col-span-1 md:col-span-2 lg:col-span-3">
                <CardHeader>
                  <CardTitle>Largest Batches by CoWiness %</CardTitle>
                  {/* <CardDescription>
                    $xx,xxx volume traded in the last 24 hours
                  </CardDescription> */}
                </CardHeader>
                <CardContent>
                  <Suspense fallback={<div>Loading...</div>}>
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
            <Suspense fallback={<div>Loading...</div>}>
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
