"use client"

import Image from "next/image"
import { useState } from "react"

interface TokenLogoProps {
  token: string
  size?: number
  className?: string
}

// URLs de logos reales de tokens desde fuentes públicas confiables
const tokenImages = {
  AVAX: "https://cryptologos.cc/logos/avalanche-avax-logo.png",
  USDC: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png",
  ETH: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
  BTC: "https://cryptologos.cc/logos/bitcoin-btc-logo.png",
  USDT: "https://cryptologos.cc/logos/tether-usdt-logo.png",
  SOL: "https://cryptologos.cc/logos/solana-sol-logo.png",
  MATIC: "https://cryptologos.cc/logos/polygon-matic-logo.png",
  LINK: "https://cryptologos.cc/logos/chainlink-link-logo.png",
  UNI: "https://cryptologos.cc/logos/uniswap-uni-logo.png",
  DOT: "https://cryptologos.cc/logos/polkadot-new-dot-logo.png",
  ADA: "https://cryptologos.cc/logos/cardano-ada-logo.png",
  JOE: "https://raw.githubusercontent.com/traderjoe-xyz/joe-tokenlists/main/logos/0x6e84a6216eA6dACC71eE8E6b0a5B7322EEbC0fDd/logo.png",
}

// URLs alternativas como backup
const tokenImagesBackup = {
  AVAX: "https://assets.coingecko.com/coins/images/12559/small/Avalanche_Circle_RedWhite_Trans.png",
  USDC: "https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png",
  ETH: "https://assets.coingecko.com/coins/images/279/small/ethereum.png",
  BTC: "https://assets.coingecko.com/coins/images/1/small/bitcoin.png",
  USDT: "https://assets.coingecko.com/coins/images/325/small/Tether.png",
  SOL: "https://assets.coingecko.com/coins/images/4128/small/solana.png",
  MATIC: "https://assets.coingecko.com/coins/images/4713/small/matic-token-icon.png",
  LINK: "https://assets.coingecko.com/coins/images/877/small/chainlink-new-logo.png",
  UNI: "https://assets.coingecko.com/coins/images/12504/small/uniswap-uni.png",
  DOT: "https://assets.coingecko.com/coins/images/12171/small/polkadot.png",
  ADA: "https://assets.coingecko.com/coins/images/975/small/cardano.png",
  JOE: "https://assets.coingecko.com/coins/images/17569/small/traderjoe.png",
}

// Fallback emojis como último recurso
const tokenEmojis: Record<string, string> = {
  AVAX: "🔺",
  USDC: "💵",
  USDT: "💰",
  ETH: "💎",
  WETH: "💎",
  BTC: "₿",
  WBTC: "₿",
  SOL: "☀️",
  MATIC: "🟣",
  LINK: "",
  UNI: "🦄",
  DOT: "⚫",
  ADA: "💙",
  JOE: "🔥",
  WAVAX: "🔺",
}

export function TokenLogo({ token, size = 40, className = "" }: TokenLogoProps) {
  const [imageError, setImageError] = useState(false)
  const [backupError, setBackupError] = useState(false)

  const primarySrc = tokenImages[token as keyof typeof tokenImages]
  const backupSrc = tokenImagesBackup[token as keyof typeof tokenImagesBackup]
  const fallbackEmoji = tokenEmojis[token as keyof typeof tokenEmojis]

  // Si ambas imágenes fallan, usar emoji
  if ((imageError && backupError) || (!primarySrc && !backupSrc)) {
    return (
      <div
        className={`bg-zinc-800 rounded-full flex items-center justify-center border border-zinc-700 ${className}`}
        style={{ width: size, height: size, fontSize: size * 0.5 }}
      >
        {fallbackEmoji || token.charAt(0)}
      </div>
    )
  }

  // Determinar qué imagen usar
  const imageSrc = imageError ? backupSrc : primarySrc

  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <Image
        src={imageSrc || "/placeholder.svg"}
        alt={`${token} logo`}
        width={size}
        height={size}
        className="rounded-full object-cover"
        onError={() => {
          if (!imageError) {
            setImageError(true)
          } else {
            setBackupError(true)
          }
        }}
        priority={size > 32}
        unoptimized // Para permitir imágenes externas
      />
    </div>
  )
}
