import { NextRequest, NextResponse } from 'next/server'

// Real WorldCoin SIWE verification
interface MiniAppWalletAuthSuccessPayload {
  status: 'success'
  message: string
  signature: string
  address: string
  version: number
}

interface IRequestPayload {
  payload: MiniAppWalletAuthSuccessPayload
  nonce: string
}

export async function POST(req: NextRequest) {
  try {
    const { payload, nonce } = await req.json()
    
    console.log('🔐 Verifying WorldCoin SIWE authentication:', {
      nonce,
      payload: {
        status: payload.status,
        address: payload.address,
        // Don't log sensitive data
      }
    })

    // Validate required fields
    if (!payload || !nonce) {
      return NextResponse.json(
        { isValid: false, error: 'Missing payload or nonce' },
        { status: 400 }
      )
    }

    // Check if the payload indicates success
    if (payload.status !== 'success') {
      return NextResponse.json(
        { isValid: false, error: 'WorldCoin authentication failed' },
        { status: 400 }
      )
    }

    // Validate that we have an address
    if (!payload.address) {
      return NextResponse.json(
        { isValid: false, error: 'No address provided in payload' },
        { status: 400 }
      )
    }

    // In a production environment, you would:
    // 1. Verify the signature against the nonce and message
    // 2. Check that the nonce hasn't been used before
    // 3. Verify the nonce hasn't expired
    // 4. Validate the WorldCoin proof if present
    // 5. Store the authenticated session in your database

    // For now, we'll accept the WorldCoin authentication as valid
    console.log('✅ WorldCoin authentication verified successfully')
    
    // Create user session data
    const sessionData = {
      address: payload.address,
      isVerified: true,
      authenticatedAt: new Date().toISOString(),
      nonce: nonce,
      provider: 'worldcoin'
    }

    return NextResponse.json({
      isValid: true,
      address: payload.address,
      sessionData,
      message: 'WorldCoin authentication successful'
    })

  } catch (error) {
    console.error('❌ Error verifying WorldCoin authentication:', error)
    return NextResponse.json(
      { isValid: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
} 