"use client"

import Link from "next/link"
import { ColumnDef } from "@tanstack/react-table"
import Avatar from "boring-avatars"
import { formatDistanceToNow } from "date-fns"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { DataTableColumnHeader } from "./utils/utils"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export interface Trade {
  buyAmount: string
  buyAmountEth: string
  buyAmountUsd: string
  buyToken: {
    address: string
    id: string
    name: string
    priceUsd: string
    priceEth: string
    symbol: string
  }
  feeAmount: string
  id: string
  sellAmount: string
  sellAmountEth: string
  sellAmountUsd: string
  sellToken: {
    address: string
    id: string
    name: string
    priceUsd: string
    priceEth: string
    symbol: string
  }
  timestamp: {
    $numberInt: string
  }
}

export interface Batch {
  _id: string
  firstTradeTimestamp: number
  txHash: string
  solver: {
    address: string
    id: string
  }
  trades: Trade[]
  cowiness: number
}

export const columns: ColumnDef<Batch>[] = [
  {
    accessorKey: "_id",
    header: "ID",
    cell: ({ row }) => {
      const id = row.original._id
      const prefix = id.substring(0, 8)
      const suffix = id.substring(id.length - 4)

      return (
        <div>
          <Link href={`/batch/${id}`}>{`${prefix}...${suffix}`}</Link>
        </div>
      )
    },
  },
  {
    accessorKey: "firstTradeTimestamp",
    header: "Timestamp",
    cell: ({ row }) => {
      const timestamp = new Date(
        Number(row.original.firstTradeTimestamp) * 1000
      )

      const formatted = formatDistanceToNow(timestamp, {
        addSuffix: true,
      })

      return <div>{formatted}</div>
    },
  },
  {
    accessorKey: "txHash",
    header: "Batch Tx",
    cell: ({ row }) => {
      const hash = row.original.txHash
      const prefix = hash.substring(0, 8)
      const suffix = hash.substring(hash.length - 4)

      return (
        <div>
          {" "}
          <Link href={`/batch/${hash}`}>{`${hash}`}</Link>
        </div>
      )
    },
  },
  {
    accessorKey: "solver",
    header: "Solver",
    cell: ({ row }) => {
      const solverName = row.original.solver.id
      const prefix = solverName.substring(0, 8)
      const suffix = solverName.substring(solverName.length - 4)

      return (
        <div className="flex items-center">
          <Avatar
            size={24}
            name={solverName}
            variant="pixel"
            colors={["#3182CE", "#2C7A7B", "#2C5282", "#2A4365"]}
          />
          <div className="ml-2">
            {prefix}...{suffix}
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "trades",
    header: "Tokens In",
    cell: ({ row }) => {
      const tokens = new Set<string>()
      row.original.trades.forEach((trade) => {
        if (
          trade.sellToken.address.toLowerCase() ==
          "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE".toLowerCase()
        ) {
          tokens.add("ETH")
        } else {
          tokens.add(trade.sellToken.symbol)
        }
      })

      return <div>{Array.from(tokens).join(", ")}</div>
    },
  },
  {
    accessorKey: "trades",
    header: "Tokens Out",
    cell: ({ row }) => {
      // if buyToken.address is 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE in low cap, then it is ETH
      const tokens = new Set<string>()
      row.original.trades.forEach((trade) => {
        if (
          trade.buyToken.address.toLowerCase() ==
          "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE".toLowerCase()
        ) {
          tokens.add("ETH")
        } else {
          tokens.add(trade.buyToken.symbol)
        }
      })

      return <div>{Array.from(tokens).join(", ")}</div>
    },
  },
  {
    accessorKey: "trades",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          <div className="text-right font-medium">Trades</div>
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>)
    },
    cell: ({ row }) => {
      const num_trades = row.original.trades.length
      return <div className="text-right font-medium" >{num_trades}</div >
    },

  },
  {
    accessorKey: "trades",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          <div className="text-right">Batch Value</div>
          <ArrowUpDown className="ml-2 h-4 w-4" />

        </Button>)
    },
    cell: ({ row }) => {
      const batchValue = row.original.trades.reduce(
        (total, trade) =>
          total +
          (parseFloat(trade.sellAmountUsd) == 0
            ? parseFloat(trade.buyAmountUsd)
            : parseFloat(trade.sellAmountUsd)),
        0
      )
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(batchValue)

      return <div className="text-right font-medium">{formatted}</div>
    },
  },
  {
    accessorKey: "cowiness",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          <div className="text-right">CoW %</div>
          <ArrowUpDown className="ml-2 h-4 w-4" />

        </Button>)
    },
    cell: ({ row }) => {
      const cowiness = Number(row.original.cowiness) * 100
      const formatted = cowiness.toFixed(2)

      return <div className="text-right font-medium">{`${formatted}%`}</div>
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const batch = row.original

      return (
        <div className=" self-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(batch.txHash)}
              >
                Copy Batch Tx
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link
                  href={`https://explorer.cow.fi/tx/${batch.txHash}?tab=graph`}
                  target="_blank"
                >
                  View graph
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link
                  href={`https://explorer.cow.fi/tx/${batch.txHash}`}
                  target="_blank"
                >
                  Open on Cow explorer
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link
                  href={`https://etherscan.io/tx/${batch.txHash}`}
                  target="_blank"
                >
                  Open on Etherscan
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    },
  },
]
