import { NextRequest, NextResponse } from 'next/server'
import { randomBytes } from 'crypto'

export async function GET(req: NextRequest) {
  try {
    // Generate a cryptographically secure random nonce
    const nonce = randomBytes(32).toString('hex')

    console.log('🎲 Generated nonce for WorldCoin authentication:', nonce)
    
    // In production, you might want to:
    // 1. Store the nonce in a database with an expiration time
    // 2. Associate it with the user's session
    // 3. Implement rate limiting

    return NextResponse.json({
      nonce,
      timestamp: Date.now(),
      expiresAt: Date.now() + (5 * 60 * 1000) // 5 minutes
    })
    
  } catch (error) {
    console.error('❌ Error generating nonce:', error)
    return NextResponse.json(
      { error: 'Failed to generate nonce' },
      { status: 500 }
    )
  }
} 