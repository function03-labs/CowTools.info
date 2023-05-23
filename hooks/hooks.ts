import { GraphQLClient, request } from "graphql-request"
import { useQuery } from "react-query"

import {
  DAILY_QUERY,
  GET_SETTLEMENT,
  HISTORICAL_VOL,
  NUM_TRANSACTIONS_QUERY,
} from "./queries"

const endpoint = "https://api.thegraph.com/subgraphs/name/cowprotocol/cow"
const graphQLClient = new GraphQLClient(endpoint)

export function useDailyVolume() {
  return useQuery<{ [key: string]: any }[]>(
    "dailyVolume",
    async () => {
      const data: any = await graphQLClient.request(DAILY_QUERY)
      return data.hourlyTotals
    },
    { refetchInterval: 5000 }
  )
}

export function useHistoricalVol() {
  return useQuery<{ [key: string]: any }[]>(
    "historicalVol",
    async () => {
      const data: any = await graphQLClient.request(HISTORICAL_VOL)
      return data.dailyTotals
    },
    { refetchOnWindowFocus: false }
  )
}

export function useSettlement(settlementID: string) {
  const variables = {
    id: settlementID,
  }

  return useQuery<{ [key: string]: any }>(
    "settlement" + settlementID,
    async () => {
      const data: any = await graphQLClient.request(GET_SETTLEMENT, variables)
      return data.settlement
    }
  )
}

export function useNumTransactions() {
  return useQuery<number>("numTransactions", async () => {
    const data: any = await graphQLClient.request(NUM_TRANSACTIONS_QUERY)
    return data.uniswapFactories[0].totalTransactions
  })
}

export function useCowiness(batchTxID: string) {
  return useQuery<number>("cowiness" + batchTxID, async () => {
    try {
      const response = await fetch(`https://api.cowtools.info/cowiness/v1/?batch_tx=${batchTxID}`)
      const data = await response.json()
      return data.cowiness
    } catch (error) {
      console.error(error)
      return 0
    }
  })
}
