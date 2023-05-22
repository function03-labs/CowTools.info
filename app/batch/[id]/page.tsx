"use client"

import { useState } from "react"
import { ArrowNarrowRightIcon } from "@heroicons/react/solid"
import {
  BadgeDelta,
  Bold,
  Button,
  Card,
  CategoryBar,
  DeltaType,
  Divider,
  DonutChart,
  Flex,
  List,
  ListItem,
  Metric,
  Text,
  Title,
  Toggle,
  ToggleItem,
} from "@tremor/react"

import { useSettlement, useCowiness } from "@/hooks/hooks"
import Navbar from "@/app/components/navbar"
import Skeleton from "react-loading-skeleton"
import Link from "next/link"
import { Metadata } from "next"
const valueFormatter = (number: number) =>
  `$ ${Intl.NumberFormat("us").format(number).toString()}`






type BuyAsset = {
  name: string
  value: number
  performance: string
  deltaType: DeltaType
}

export default function BatchPage({
  params: { id: batchId },
}: {
  params: {
    id: string
  }
}) {
  const {
    data: settlementData,
    isLoading: settlementIsLoading,
    isError: settlementIsError,
  } = useSettlement(batchId)

  const {
    data: cowinessData,
    isLoading: cowinessIsLoading,
    isError: cowinessIsError,
  } = useCowiness(batchId)

  const settlement: any = settlementData

  const buyAssets: { [symbol: string]: BuyAsset } | undefined =
    settlement?.trades.reduce((acc, trade) => {
      const symbol = trade.sellToken.symbol
      const value =
        Number(trade.sellAmountUsd) || Number(trade.buyAmountUsd) || 0
      if (!acc[symbol]) {
        acc[symbol] = {
          name: symbol,
          value: Number(value),
          performance: "",
          deltaType: "increase",
        }
      } else {
        acc[symbol].value += Number(value)
      }
      return acc
    }, {})
  console

  const buyStocks: BuyAsset[] = Object.values(buyAssets || {}).map((asset) => ({
    ...asset,
    value: asset.value,
  }))

  return (
    <>
      <Navbar />
      <Card
        // eslint-disable-next-line tailwindcss/migration-from-tailwind-2
        className="mx-auto !ring-opacity-0 dark:bg-black dark:ring-slate-500 md:my-10 md:max-w-lg md:ring-opacity-100 lg:max-w-2xl xl:max-w-4xl"
        style={{
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        <Flex
          className="space-x-8 overflow-auto"
          justifyContent="between"
          alignItems="center"
        >
          <div className=" overflow-hidden">
            <Title className=" dark:!text-inherit">Batch ID:</Title>
            <Text className="overflow-hidden text-ellipsis ">{batchId}</Text>
          </div>
          {/* <Toggle
              defaultValue="chart"
              color="gray"
              onValueChange={(value) => setSelectedView(value)}
            >
              <ToggleItem value="chart" icon={ChartPieIcon} />
              <ToggleItem value="list" icon={ViewListIcon} />
            </Toggle> */}
        </Flex>
        {settlementData && settlementData !== null ? (
          <>
            <Text className="mt-8 overflow-hidden text-ellipsis">
              Batch value
            </Text>
            <Metric className=" dark:!text-inherit ">
              {settlementData.trades
                .reduce(
                  (acc: number, trade: any) =>
                    acc +
                    (Number(trade.sellAmountUsd)
                      ? Number(trade.sellAmountUsd)
                      : Number(trade.buyAmountUsd)),
                  0
                )
                //convert to $ format
                .toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                })}
            </Metric>
            <Divider className=" dark:bg-slate-600" />



            <Text className="mt-8">
              <Bold className=" dark:!text-inherit">Asset Inputs</Bold>
            </Text>
            <Text className=" dark:!text-inherit">{buyStocks.map((order) => order.name).join(", ")}</Text>
            <DonutChart
              data={buyStocks}
              showAnimation={false}
              showTooltip={true}
              category="value"
              index="name"
              valueFormatter={valueFormatter}
              className="mt-6 dark:!text-inherit"
            />
            <Text className="mt-8"></Text>
            <Card className=" !border-transparent dark:bg-transparent dark:ring-slate-600">
              <Flex>
                <Text className="truncate  dark:!text-inherit">
                  <Bold>CoWiness Score</Bold>
                </Text>
                {(cowinessIsLoading || cowinessData === undefined) ? (
                  <Skeleton />
                ) : (
                  <Text className=" dark:!text-inherit">
                    <Bold>{`${(Number(cowinessData) * 100).toFixed(2)}
                    `}%</Bold>
                  </Text>
                )}
              </Flex>

              {cowinessIsLoading && cowinessData === undefined ? (
                <Skeleton />
              ) : (
                <CategoryBar
                  categoryPercentageValues={[10, 25, 45, 20]}
                  colors={["red", "orange", "yellow", "emerald"]}
                  percentageValue={Number(cowinessData) * 100}
                  tooltip={`${(Number(cowinessData) * 100).toFixed(2)}%`}
                  className="mt-2"
                />
              )}
            </Card>

            <Flex className="mt-6 border-t pt-4">
              <Link href={`https://explorer.cow.fi/tx/${batchId}`}
                target="_blank">

                <Button
                  size="xs"
                  variant="light"
                  icon={ArrowNarrowRightIcon}
                  iconPosition="right"

                >
                  View more
                </Button>
              </Link>
            </Flex>
          </>
        ) : (
          <div
            role="status"
            className="mt-6 w-full animate-pulse space-y-4 divide-y divide-gray-200 rounded border border-gray-200 p-4 shadow dark:divide-gray-700 dark:border-gray-700 md:p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="mb-2.5 h-2.5 w-24 rounded-full bg-gray-300 dark:bg-gray-600"></div>
                <div className="h-2 w-32 rounded-full bg-gray-200 dark:bg-gray-700"></div>
              </div>
              <div className="h-2.5 w-12 rounded-full bg-gray-300 dark:bg-gray-700"></div>
            </div>
            <div className="flex items-center justify-between pt-4">
              <div>
                <div className="mb-2.5 h-2.5 w-24 rounded-full bg-gray-300 dark:bg-gray-600"></div>
                <div className="h-2 w-32 rounded-full bg-gray-200 dark:bg-gray-700"></div>
              </div>
              <div className="h-2.5 w-12 rounded-full bg-gray-300 dark:bg-gray-700"></div>
            </div>
            <div className="flex items-center justify-between pt-4">
              <div>
                <div className="mb-2.5 h-2.5 w-24 rounded-full bg-gray-300 dark:bg-gray-600"></div>
                <div className="h-2 w-32 rounded-full bg-gray-200 dark:bg-gray-700"></div>
              </div>
              <div className="h-2.5 w-12 rounded-full bg-gray-300 dark:bg-gray-700"></div>
            </div>
            <div className="flex items-center justify-between pt-4">
              <div>
                <div className="mb-2.5 h-2.5 w-24 rounded-full bg-gray-300 dark:bg-gray-600"></div>
                <div className="h-2 w-32 rounded-full bg-gray-200 dark:bg-gray-700"></div>
              </div>
              <div className="h-2.5 w-12 rounded-full bg-gray-300 dark:bg-gray-700"></div>
            </div>
            <div className="flex items-center justify-between pt-4">
              <div>
                <div className="mb-2.5 h-2.5 w-24 rounded-full bg-gray-300 dark:bg-gray-600"></div>
                <div className="h-2 w-32 rounded-full bg-gray-200 dark:bg-gray-700"></div>
              </div>
              <div className="h-2.5 w-12 rounded-full bg-gray-300 dark:bg-gray-700"></div>
            </div>
            <span className="sr-only">Loading...</span>
          </div>
        )}
      </Card>
    </>
  )
}
