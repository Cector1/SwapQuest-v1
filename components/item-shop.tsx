"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Sword, Shield, BellRingIcon as Ring, PillBottleIcon as Potion, Scroll, Search } from "lucide-react"

type ItemType = "weapon" | "armor" | "accessory" | "consumable" | "quest"
type ItemRarity = "common" | "uncommon" | "rare" | "epic" | "legendary"

interface ShopItem {
  id: string
  name: string
  type: ItemType
  rarity: ItemRarity
  description: string
  price: number
  icon: React.ElementType
}

const shopItems: ShopItem[] = [
  {
    id: "shop1",
    name: "Steel Sword",
    type: "weapon",
    rarity: "uncommon",
    description: "A well-crafted steel sword that deals moderate damage.",
    price: 75,
    icon: Sword,
  },
  {
    id: "shop2",
    name: "Iron Shield",
    type: "armor",
    rarity: "uncommon",
    description: "A sturdy iron shield that provides good protection.",
    price: 60,
    icon: Shield,
  },
  {
    id: "shop3",
    name: "Ruby Ring",
    type: "accessory",
    rarity: "rare",
    description: "A beautiful ring with a ruby gem that enhances magical abilities.",
    price: 120,
    icon: Ring,
  },
  {
    id: "shop4",
    name: "Greater Health Potion",
    type: "consumable",
    rarity: "uncommon",
    description: "Restores a moderate amount of health when consumed.",
    price: 30,
    icon: Potion,
  },
  {
    id: "shop5",
    name: "Mana Potion",
    type: "consumable",
    rarity: "uncommon",
    description: "Restores a moderate amount of mana when consumed.",
    price: 35,
    icon: Potion,
  },
  {
    id: "shop6",
    name: "Map Fragment",
    type: "quest",
    rarity: "rare",
    description: "A torn piece of an ancient map. Might be valuable to a collector.",
    price: 90,
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

export function ItemShop() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedItem, setSelectedItem] = useState<ShopItem | null>(null)

  const filteredItems = shopItems.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.rarity.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="bg-purple-800/50 border border-purple-700 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Mystic Emporium</h2>
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-purple-400" />
          <Input
            placeholder="Search items..."
            className="pl-8 bg-purple-900/50 border-purple-700"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid grid-cols-5 mb-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="weapon">Weapons</TabsTrigger>
          <TabsTrigger value="armor">Armor</TabsTrigger>
          <TabsTrigger value="accessory">Accessories</TabsTrigger>
          <TabsTrigger value="consumable">Potions</TabsTrigger>
        </TabsList>

        {["all", "weapon", "armor", "accessory", "consumable"].map((category) => (
          <TabsContent key={category} value={category} className="mt-0">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {filteredItems
                .filter((item) => category === "all" || item.type === category)
                .map((item) => (
                  <Dialog key={item.id}>
                    <DialogTrigger asChild>
                      <motion.div
                        whileHover={{ scale: 1.03 }}
                        className="bg-purple-900/50 border border-purple-700 rounded-md p-3 cursor-pointer"
                        onClick={() => setSelectedItem(item)}
                      >
                        <div className="flex items-center">
                          <div
                            className={`
                            w-10 h-10 rounded-full flex items-center justify-center
                            ${rarityColors[item.rarity]}
                          `}
                          >
                            <item.icon className="h-5 w-5 text-white" />
                          </div>
                          <div className="ml-3">
                            <p className="font-medium text-sm">{item.name}</p>
                            <div className="flex items-center mt-1">
                              <div className="w-4 h-4 rounded-full bg-yellow-400 flex items-center justify-center text-purple-900 font-bold text-xs">
                                G
                              </div>
                              <p className="ml-1 text-xs">{item.price}</p>
                            </div>
                          </div>
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
                          <p className="ml-1">{item.price}</p>
                        </div>
                        <Button className="bg-amber-500 hover:bg-amber-600">Purchase</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
