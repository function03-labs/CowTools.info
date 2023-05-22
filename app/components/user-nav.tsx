"use client"

import Link from "next/link"
import { MenuAlt1Icon, MenuAlt2Icon } from "@heroicons/react/outline"
import {
  Files,
  Github,
  Home,
  LayoutDashboard,
  LayoutGrid,
  List,
  ListChecksIcon,
  LucideMenu,
  Menu,
  MenuIcon,
  Twitter,
} from "lucide-react"
import { FaBars, FaIcons } from "react-icons/fa"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ModeToggle } from "@/components/ui/mode-toggle"
import { Avatar } from "@/components/ui/ui/avatar"
import { Button, buttonVariants } from "@/components/ui/ui/button"
import { Icons } from "@/components/icons"

export function UserNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <div className={cn("", className)}>
      <div className="lg:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"link"} className="relative flex h-6 w-6">
              {/* <LucideMenu className="h-8 w-8" /> */}
              <Avatar>
                <Menu className="relative h-full w-full" />
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <LayoutGrid className="mr-2 h-4 w-4" />
                <span>Overview</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Files className="mr-2 h-4 w-4" />
                <span>Docs</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Github className="mr-2 h-4 w-4" />
                <span>Github</span>
                <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Twitter className="mr-2 h-4 w-4" />
                <span>Twitter</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <nav className="hidden items-center space-x-1  lg:flex">
        <Link href={siteConfig.links.github} target="_blank" rel="noreferrer">
          <div
            className={cn(
              buttonVariants({
                size: "sm",
                variant: "ghost",
              }),
              "w-9 px-0"
            )}
          >
            <Icons.gitHub className="h-5 w-5" />
            <span className="sr-only">GitHub</span>
          </div>
        </Link>
        <Link href={siteConfig.links.twitter} target="_blank" rel="noreferrer">
          <div
            className={cn(
              buttonVariants({
                size: "sm",
                variant: "ghost",
              }),
              "w-9 px-0"
            )}
          >
            <Icons.twitter className="h-5 w-5 fill-current" />
            <span className="sr-only">Twitter</span>
          </div>
        </Link>
        <ModeToggle />
      </nav>
    </div>
  )
}
