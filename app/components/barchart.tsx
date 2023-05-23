"use client"

import { useMemo } from "react"
import { sortBy } from "lodash"
import {
  Bar,
  BarChart,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { computeBatchVolume } from "@/lib/utils_dashboard"
import { useHistoricalVol } from "@/hooks/hooks"

import { Batch } from "../datatable/columns"
import Skeleton from "react-loading-skeleton"
function mergeData(formattedData, formattedCowData) {
  const mergedData = formattedData.map((item) => {
    const cowItem = formattedCowData.find((cow) => cow.name === item.name)
    return {
      ...item,
      cowVolume: cowItem ? cowItem.total : 0,
    }
  })
  return mergedData
}
function formatCows(cowData: Batch[]) {
  const cowVolumeByDay = cowData?.reduce((acc, batch) => {
    const date = new Date(Number(batch.firstTradeTimestamp) * 1000)
    const utcDate = new Date(
      Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
    ).toLocaleDateString("en-US")

    acc[utcDate] =
      (acc[utcDate] || 0) +
      computeBatchVolume(batch.trades) * Number(batch.cowiness)
    return acc
  }, {})

  const cowDataList = Object.entries(cowVolumeByDay).map(
    ([date, cowVolume]) => {
      const name = new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })

      return {
        name,
        // parse cowVolume that is a number to int
        total: parseInt(cowVolume as string),
      }
    }
  )

  return cowDataList
}

const tooltipFormatter = (value, name, props) => {
  if (name === "Trades") {
    return value
  } else {
    return Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      notation: "compact",
      compactDisplay: "long",
    }).format(value)
  }
}
function formatData(historicalVolData) {
  // console.log("historicalVolData: ", historicalVolData)
  const formattedData = historicalVolData?.map((item) => ({
    // get day from timestamp
    name:
      new Date(item.timestamp * 1000).toLocaleDateString("en-US", {
        month: "short",
      }) +
      " " +
      new Date(item.timestamp * 1000).toLocaleDateString("en-US", {
        day: "numeric",
      }),
    trades: item.orders,
    //volume show Millions
    //remove $ sign
    total: parseInt(item.volumeUsd),
  }))

  return formattedData
}

export function Overview({ data: cowData }: { data: Batch[] }) {
  const { data: historicalVol, isLoading, isError } = useHistoricalVol()

  const formattedData = useMemo(() => {
    return sortBy(formatData(historicalVol), "name")
  }, [historicalVol])
  // console.log("formatted ddata is", formattedData)

  const formattedCowData = useMemo(
    () => sortBy(formatCows(cowData), "name"),
    [cowData]
  )

  const mergedData = useMemo(() => {
    return mergeData(formattedData, formattedCowData)
  }, [formattedData, formattedCowData])

  // console.log("formatted cow data is", formattedCowData)

  return (
    <>
      {formattedData && isLoading == false ? (
        <ResponsiveContainer width="100%" height={350}>
          <ComposedChart data={mergedData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />

            <XAxis
              dataKey="name"
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={true}
              axisLine={false}
              tickFormatter={(value) =>
                Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                  notation: "compact",
                  compactDisplay: "long",
                }).format(value)
              }
            />
            <Bar
              dataKey="total"
              name="Daily Volume"
              fill="#1d4ea8"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="cowVolume"
              name="CoW Volume"
              fill="#f44336"
              radius={[4, 4, 0, 0]}
            />
            <YAxis
              yAxisId="orders"
              orientation="right"
              stroke="#888888"
              fontSize={12}
              tickLine={true}
              axisLine={false}
              // double max to dataMax
              type="number"
              domain={[0, (dataMax) => dataMax * 1.4]}
            />
            <Line
              type="monotone"
              dataKey="trades"
              name="Trades"
              stroke="#ff7300"
              yAxisId={"orders"}
              isAnimationActive={true}
            />

            <Tooltip cursor={{ fill: "transparent" }} formatter={tooltipFormatter} />
            {/* Add legend top right and can click on it to hide bars */}
            <Legend
              verticalAlign="top"
              align="right"
              wrapperStyle={{ top: -10 }}
            />

            {/* <Legend /> */}
          </ComposedChart>
        </ResponsiveContainer>
      ) : (
        <Skeleton count={10} />
      )
      }
    </>
  )

}
// import { BarChart, Card, Text, Title } from "@tremor/react"

// const data = [
//   {
//     Month: "Jan 21",
//     Sales: 2890,
//     Profit: 2400,
//   },
//   {
//     Month: "Feb 21",
//     Sales: 1890,
//     Profit: 1398,
//   },
//   // ...
//   {
//     Month: "Jan 22",
//     Sales: 3890,
//     Profit: 2980,
//   },
// ]

// const valueFormatter = (number: number) =>
//   `$ ${Intl.NumberFormat("us").format(number).toString()}`

// export function Overview() {
//   return (
//     <Card>
//       <Title>Performance</Title>
//       <Text>Comparison between Sales and Profit</Text>
//       <BarChart
//         className="mt-4 h-80"
//         data={data}
//         index="Month"
//         categories={["Sales", "Profit"]}
//         colors={["indigo", "fuchsia"]}
//         stack={false}
//         valueFormatter={valueFormatter}
//       />
//     </Card>
//   )
// }
