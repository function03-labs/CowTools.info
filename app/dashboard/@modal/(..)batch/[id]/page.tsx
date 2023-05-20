"use client"

import { useState } from "react"
import { ChartPieIcon, ViewListIcon } from "@heroicons/react/outline"
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

import { useSettlement } from "@/hooks/hooks"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"

interface StockData {
  name: string
  value: number
  performance: string
  deltaType: DeltaType
}

const stocks: StockData[] = [
  {
    name: "Off Running AG",
    value: 10456,
    performance: "6.1%",
    deltaType: "increase",
  },
  {
    name: "Not Normal Inc.",
    value: 5789,
    performance: "1.2%",
    deltaType: "moderateDecrease",
  },
  {
    name: "Logibling Inc.",
    value: 4367,
    performance: "2.3%",
    deltaType: "moderateIncrease",
  },
  {
    name: "Raindrop Inc.",
    value: 3421,
    performance: "0.5%",
    deltaType: "moderateDecrease",
  },
  {
    name: "Mwatch Group",
    value: 1432,
    performance: "3.4%",
    deltaType: "decrease",
  },
]

const valueFormatter = (number: number) =>
  `$ ${Intl.NumberFormat("us").format(number).toString()}`

const categories = [
  {
    title: "Sales",
    metric: "$ 456,000",
  },
  {
    title: "Transactions",
    metric: "89,123",
  },
  {
    title: "Merchants",
    metric: "22",
  },
  {
    title: "Orders",
    metric: "678",
  },
]
type BuyAsset = {
  name: string
  value: number
  performance: string
  deltaType: DeltaType
}

export default function BatchModal({
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
  const [selectedView, setSelectedView] = useState("chart")
  const settlement: any = settlementData
  console.log(
    "data ready: ",
    settlement,
    batchId,
    "ios loading ",
    settlementIsLoading
  )

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
  console.log("buy stock are ", buyStocks)

  return (
    <Dialog defaultOpen={true}>
      <DialogContent className="m-0 p-0">
        <Card
          className=" mx-auto"
          style={{
            maxWidth: "100%",
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
              <Title>Batch ID:</Title>
              <Text className="overflow-hidden text-ellipsis">{batchId}</Text>
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
              <Metric>
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
              <Divider />

              {selectedView === "chart" ? (
                <>
                  <Text className="mt-8">
                    <Bold>Asset Inputs</Bold>
                  </Text>
                  <Text>{buyStocks.map((order) => order.name).join(", ")}</Text>
                  <DonutChart
                    data={buyStocks}
                    showAnimation={false}
                    showTooltip={true}
                    category="value"
                    index="name"
                    valueFormatter={valueFormatter}
                    className="mt-6"
                  />
                  <Text className="mt-8"></Text>
                  <Card className=" !border-transparent">
                    <Flex>
                      <Text className="truncate">
                        <Bold>CoWiness Score</Bold>
                      </Text>
                      <Text>
                        <Bold>62%</Bold>
                      </Text>
                    </Flex>

                    <CategoryBar
                      categoryPercentageValues={[10, 25, 45, 20]}
                      colors={["emerald", "yellow", "orange", "red"]}
                      percentageValue={65}
                      tooltip="65%"
                      className="mt-2"
                    />
                  </Card>
                </>
              ) : (
                <>
                  <Flex className="mt-8" justifyContent="between">
                    <Text className="truncate">
                      <Bold>Stocks</Bold>
                    </Text>
                    <Text>Since transaction</Text>
                  </Flex>
                  <List className="mt-4">
                    {stocks.map((stock) => (
                      <ListItem key={stock.name}>
                        <Text>{stock.name}</Text>
                        <Flex justifyContent="end" className="space-x-2">
                          <Text>
                            ${" "}
                            {Intl.NumberFormat("us")
                              .format(stock.value)
                              .toString()}
                          </Text>
                          <BadgeDelta deltaType={stock.deltaType} size="xs">
                            {stock.performance}
                          </BadgeDelta>
                        </Flex>
                      </ListItem>
                    ))}
                  </List>
                  ∏
                </>
              )}
              <Flex className="mt-6 border-t pt-4">
                <Button
                  size="xs"
                  variant="light"
                  icon={ArrowNarrowRightIcon}
                  iconPosition="right"
                >
                  View more
                </Button>
              </Flex>
            </>
          ) : (
            <div
              role="status"
              className="mt-6 max-w-lg animate-pulse space-y-4 divide-y divide-gray-200 rounded border border-gray-200 p-4 shadow dark:divide-gray-700 dark:border-gray-700 md:p-6"
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
      </DialogContent>
    </Dialog>
  )
}
