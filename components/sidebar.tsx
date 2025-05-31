"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Home, Gift, Bookmark, Store, Coins, Settings, BookOpen, LogOut, MoreHorizontal, User } from "lucide-react"

const menuItems = [
  { icon: Home, label: "SwapQuest Launch", active: false },
  { icon: Gift, label: "Refer & Earn", active: false },
  { icon: Bookmark, label: "Bookmarks", active: false },
  { icon: Store, label: "Arena App Store", active: true },
  { icon: Coins, label: "$ARENA Tokenomics", active: false },
  { icon: Settings, label: "Settings & Support", active: false },
  { icon: BookOpen, label: "ArenaBook", active: false },
  { icon: LogOut, label: "Log out", active: false },
]

export function Sidebar() {
  const [activeItem, setActiveItem] = useState("Arena App Store")

  return (
    <div className="w-80 bg-zinc-900 border-r border-zinc-800 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-zinc-800">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
            <span className="text-black font-bold text-lg">S</span>
          </div>
          <div>
            <h2 className="font-semibold text-white">SwapQuest</h2>
            <p className="text-xs text-zinc-400">Daily Trading Missions</p>
          </div>
        </div>
      </div>

      {/* Featured Banner */}
      <div className="p-4">
        <div className="bg-gradient-to-r from-orange-600 to-orange-500 rounded-lg p-4 relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-black text-sm font-medium">Still not a champion?</p>
            <p className="text-orange-900 text-xs">Join ARENA</p>
          </div>
          <div className="absolute top-2 right-2">
            <div className="w-8 h-8 bg-orange-400 rounded-full flex items-center justify-center">
              <Coins className="w-4 h-4 text-orange-900" />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.label}>
              <button
                onClick={() => setActiveItem(item.label)}
                className={`
                  w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left transition-colors
                  ${
                    activeItem === item.label
                      ? "bg-zinc-800 text-white"
                      : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
                  }
                `}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-sm">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* More Section */}
      <div className="px-4 py-2 border-t border-zinc-800">
        <button className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/50 transition-colors">
          <MoreHorizontal className="w-5 h-5" />
          <span className="text-sm">More</span>
        </button>
      </div>

      {/* Profile Section */}
      <div className="p-4 border-t border-zinc-800">
        <div className="flex items-center space-x-3">
          <Avatar className="w-8 h-8">
            <AvatarFallback className="bg-zinc-700">
              <User className="w-4 h-4" />
            </AvatarFallback>
          </Avatar>
          <span className="text-sm text-zinc-400">Profile</span>
        </div>
      </div>

      {/* Post Button */}
      <div className="p-4">
        <Button className="w-full bg-orange-600 hover:bg-orange-700 text-black font-semibold rounded-full py-3">
          Post
        </Button>
      </div>
    </div>
  )
}
