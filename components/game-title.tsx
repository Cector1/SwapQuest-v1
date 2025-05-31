"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

export function GameTitle() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return <h1 className="text-6xl font-bold text-amber-500">SwapQuest</h1>

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="text-center"
    >
      <h1 className="text-6xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-300 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
        SwapQuest
      </h1>
      <motion.p
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="mt-2 text-xl text-purple-200"
      >
        The Ultimate Fantasy Trading Adventure
      </motion.p>
    </motion.div>
  )
}
