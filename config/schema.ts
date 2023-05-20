import mongoose from "mongoose"

// Define the Mongoose schema for the Trade type
export const tradeSchema = new mongoose.Schema({
  buyAmount: String,
  buyAmountEth: String,
  buyAmountUsd: String,
  buyToken: {
    address: String,
    id: String,
    name: String,
    priceUsd: String,
    priceEth: String,
    symbol: String,
  },
  feeAmount: String,
  id: String,
  sellAmount: String,
  sellAmountEth: String,
  sellAmountUsd: String,
  sellToken: {
    address: String,
    id: String,
    name: String,
    priceUsd: String,
    priceEth: String,
    symbol: String,
  },
  timestamp: {
    $numberInt: String,
  },
})

// Define the Mongoose schema and model for the Batch type, including the Trade schema
export const batchSchema = new mongoose.Schema({
  _id: String,
  firstTradeTimestamp: {
    $numberInt: String,
  },
  txHash: String,
  solver: {
    address: String,
    id: String,
  },
  trades: [tradeSchema], // Reference the tradeSchema here
  cowiness: {
    $numberDouble: String,
  },
})

export const BatchModel = mongoose.model(
  "Batch",
  batchSchema,
  process.env.MONGODB_COLLECTION_NAME!
)
