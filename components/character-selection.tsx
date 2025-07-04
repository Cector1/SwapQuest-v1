"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Sword, Wand2, Eye, Shield } from "lucide-react"

const characters = [
  { id: 1, name: "Warrior", description: "Strong and brave, excels in combat", startingItem: "Rusty Sword", icon: Sword },
  { id: 2, name: "Mage", description: "Powerful spellcaster with arcane knowledge", startingItem: "Apprentice Staff", icon: Wand2 },
  { id: 3, name: "Rogue", description: "Stealthy and quick, master of deception", startingItem: "Worn Dagger", icon: Eye },
  { id: 4, name: "Cleric", description: "Divine healer with protective abilities", startingItem: "Simple Mace", icon: Shield },
]

export function CharacterSelection() {
  const [selectedCharacter, setSelectedCharacter] = useState<number | null>(null)

  return (
    <div className="mt-12 w-full max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-6">Choose Your Hero</h2>

      <Carousel className="w-full">
        <CarouselContent>
          {characters.map((character) => (
            <CarouselItem key={character.id} className="md:basis-1/2">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className={`
                  p-4 rounded-lg border-2 h-full flex flex-col cursor-pointer
                  ${
                    selectedCharacter === character.id
                      ? "border-amber-400 bg-purple-800/50"
                      : "border-purple-700 bg-purple-900/30"
                  }
                `}
                onClick={() => setSelectedCharacter(character.id)}
              >
                <div className="flex justify-center mb-4">
                  <div className="w-32 h-32 rounded-full bg-purple-700 flex items-center justify-center">
                    <character.icon className="w-16 h-16 text-amber-400" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-center text-amber-400">{character.name}</h3>
                <p className="text-center text-sm mt-2 flex-grow">{character.description}</p>
                <p className="text-center text-xs mt-3 text-purple-300">
                  Starting item: <span className="text-amber-300">{character.startingItem}</span>
                </p>
              </motion.div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-0" />
        <CarouselNext className="right-0" />
      </Carousel>

      <div className="mt-8 text-center">
        <Button disabled={selectedCharacter === null} className="bg-amber-500 hover:bg-amber-600 text-lg px-8">
          Confirm Selection
        </Button>
      </div>
    </div>
  )
}
