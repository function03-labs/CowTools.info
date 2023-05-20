import { gql } from "graphql-tag"

export const DAILY_QUERY = gql`
  query Summary {
    hourlyTotals(first: 48, orderDirection: desc, orderBy: id) {
      id
      numberOfTrades
      timestamp
      volumeUsd
      orders
    }
  }
`

export const HISTORICAL_VOL = gql`
  query Summary {
    dailyTotals(first: 7, orderDirection: desc, orderBy: timestamp) {
      timestamp
      orders
      numberOfTrades
      volumeUsd
      totalTokens
    }
  }
`
export const GET_SETTLEMENT = gql`
  query GetSettlement($id: ID!) {
    settlement(id: $id) {
      id
      solver {
        address
        id
      }
      txHash
      trades {
        buyAmount
        buyAmountUsd
        sellAmount
        sellAmountUsd
        buyToken {
          address
          name
          symbol
        }
        sellToken {
          address
          name
          priceUsd
          symbol
        }
      }
    }
  }
`

export const NUM_TRANSACTIONS_QUERY = gql`
  query NumTransactions {
    uniswapFactories(first: 1) {
      totalVolumeUSD
      totalTransactions
    }
  }
`
