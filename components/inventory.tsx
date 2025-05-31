"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Sword, Shield, BellRingIcon as Ring, PillBottleIcon as Potion, Scroll } from "lucide-react"

type ItemType = "weapon" | "armor" | "accessory" | "consumable" | "quest"
type ItemRarity = "common" | "uncommon" | "rare" | "epic" | "legendary"

interface Item {
  id: string
  name: string
  type: ItemType
  rarity: ItemRarity
  description: string
  value: number
  icon: React.ElementType
}

const initialItems: Item[] = [
  {
    id: "item1",
    name: "Rusty Sword",
    type: "weapon",
    rarity: "common",
    description: "An old sword with a dull blade. Still better than nothing.",
    value: 5,
    icon: Sword,
  },
  {
    id: "item2",
    name: "Wooden Shield",
    type: "armor",
    rarity: "common",
    description: "A simple wooden shield that can block weak attacks.",
    value: 3,
    icon: Shield,
  },
  {
    id: "item3",
    name: "Silver Ring",
    type: "accessory",
    rarity: "uncommon",
    description: "A shiny silver ring that brings good luck.",
    value: 15,
    icon: Ring,
  },
  {
    id: "item4",
    name: "Health Potion",
    type: "consumable",
    rarity: "common",
    description: "Restores a small amount of health when consumed.",
    value: 10,
    icon: Potion,
  },
  {
    id: "item5",
    name: "Ancient Scroll",
    type: "quest",
    rarity: "rare",
    description: "A mysterious scroll with strange symbols. Someone might be looking for this.",
    value: 50,
    icon: Scroll,
  },
]

const rarityColors = {
  common: "bg-gray-500",
  uncommon: "bg-green-500",
  rare: "bg-blue-500",
  epic: "bg-purple-500",
  legendary: "bg-amber-500",
}

export function Inventory() {
  const [items, setItems] = useState<Item[]>(initialItems)
  const [selectedItem, setSelectedItem] = useState<Item | null>(null)

  return (
    <div className="bg-purple-800/50 border border-purple-700 rounded-lg p-4">
      <h2 className="text-xl font-bold mb-4 text-center">Inventory</h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-2">
        {items.map((item) => (
          <Dialog key={item.id}>
            <DialogTrigger asChild>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className={`
                  relative p-2 rounded-md cursor-pointer
                  border border-${item.rarity === "legendary" ? "amber-500" : "purple-700"}
                  bg-purple-900/50 hover:bg-purple-800/50
                `}
                onClick={() => setSelectedItem(item)}
              >
                <div className="flex flex-col items-center">
                  <div
                    className={`
                    w-10 h-10 rounded-full flex items-center justify-center
                    ${rarityColors[item.rarity]}
                  `}
                  >
                    <item.icon className="h-5 w-5 text-white" />
                  </div>
                  <p className="text-xs mt-1 text-center">{item.name}</p>
                </div>
              </motion.div>
            </DialogTrigger>
            <DialogContent className="bg-purple-950 border-purple-800 text-white">
              <DialogHeader>
                <DialogTitle className="flex items-center">
                  <div
                    className={`
                    w-8 h-8 rounded-full flex items-center justify-center mr-2
                    ${rarityColors[item.rarity]}
                  `}
                  >
                    <item.icon className="h-4 w-4 text-white" />
                  </div>
                  {item.name}
                </DialogTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="capitalize">
                    {item.type}
                  </Badge>
                  <Badge className={`${rarityColors[item.rarity]} capitalize`}>{item.rarity}</Badge>
                </div>
              </DialogHeader>
              <DialogDescription className="text-purple-200">{item.description}</DialogDescription>
              <div className="flex justify-between items-center mt-4">
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full bg-yellow-400 flex items-center justify-center text-purple-900 font-bold text-xs">
                    G
                  </div>
                  <p className="ml-1 text-sm">{item.value}</p>
                </div>
                <div className="flex gap-2">
                  <Badge variant="outline" className="cursor-pointer hover:bg-purple-800">
                    Use
                  </Badge>
                  <Badge variant="outline" className="cursor-pointer hover:bg-purple-800">
                    Drop
                  </Badge>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        ))}

        {/* Empty slots */}
        {Array.from({ length: 10 - items.length }).map((_, index) => (
          <div
            key={`empty-${index}`}
            className="p-2 rounded-md border border-dashed border-purple-700/50 bg-purple-900/20"
          >
            <div className="flex flex-col items-center justify-center h-full min-h-[60px]">
              <p className="text-xs text-purple-600">Empty</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 text-center">
        <p className="text-sm text-purple-300">{items.length}/10 slots used</p>
      </div>
    </div>
  )
}
