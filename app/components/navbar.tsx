"use client"

import { useState } from "react"
import { FaBars } from "react-icons/fa"

import { MainNav } from "./main-nav"
import { Search } from "./search"
import TeamSwitcher from "./team-switcher"
import { UserNav } from "./user-nav"

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <TeamSwitcher />
        <MainNav className="mx-6 hidden lg:flex" />
        <div className="ml-auto items-center space-x-4 flex">
          <Search />
          <UserNav className="" />
        </div>
      </div>
    </div>
  )
}

export default Navbar
