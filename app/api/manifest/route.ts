import { NextResponse } from 'next/server'

export async function GET() {
  const manifest = {
    name: 'SwapQuest - WorldCoin x AVAX Gaming',
    short_name: 'SwapQuest',
    description: 'WorldCoin MiniApp for Gaming DApp on Avalanche Fuji with Real Swaps',
    start_url: '/',
    display: 'standalone',
    background_color: '#1616b4', // Ethereum Blue
    theme_color: '#f7931a', // Bitcoin Orange
    orientation: 'portrait',
    scope: '/',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any maskable'
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any maskable'
      }
    ],
    categories: ['games', 'finance', 'productivity'],
    lang: 'en',
    screenshots: [],
    // WorldCoin specific metadata
    worldcoin: {
      app_id: 'swapquest-miniapp',
      version: '1.0.0',
      requires_verification: false,
      permissions: [
        'worldid_verification',
        'wallet_access'
      ]
    }
  }

  return NextResponse.json(manifest, {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600'
    }
  })
} 