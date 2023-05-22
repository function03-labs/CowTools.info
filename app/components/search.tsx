"use client"

import React, { FormEvent, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { Input } from "@/components/ui/ui/input"

export function Search() {
  const router = useRouter()
  const [tx, setTx] = useState("")

  const handleClick = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log("submitting,", `/batch/${tx}`)
    router.push(`/batch/${tx}`)
  }

  const handleChange = (e: any) => {
    setTx(e.currentTarget.value)
  }
  return (
    <div>
      <form onSubmit={handleClick}>
        <Input
          type="search"
          placeholder="Search by batch tx hash..."
          className="lg:[40vw] h-9 w-[100%] md:w-[40vw] md:max-w-[60vw] lg:max-w-[60vw]"
          onChange={handleChange}
          value={tx}
        />
      </form>
    </div>
  )
}
