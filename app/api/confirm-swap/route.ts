import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { transactionHash, missionId, swapDetails, userAddress } = await req.json()

    console.log('🔍 Confirming swap transaction:', {
      transactionHash,
      missionId,
      swapDetails,
      userAddress
    })

    // Validate required fields
    if (!transactionHash || !missionId || !swapDetails || !userAddress) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // In a production environment, you would:
    // 1. Verify the transaction on World Chain using the transaction hash
    // 2. Check that the transaction was successful
    // 3. Verify the swap amounts and tokens match the mission requirements
    // 4. Update the user's mission progress in your database
    // 5. Award the appropriate rewards

    // For now, we'll simulate the verification process
    console.log('✅ Simulating transaction verification...')
    
    // Simulate blockchain verification delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Mock verification logic
    const isValidTransaction = Math.random() > 0.1 // 90% success rate for demo
    
    if (!isValidTransaction) {
      return NextResponse.json(
        { success: false, error: 'Transaction verification failed' },
        { status: 400 }
      )
    }

    // Calculate mission rewards based on swap details
    const missionRewards = calculateMissionRewards(missionId, swapDetails)

    // In production, save to database:
    // - Mark mission as completed for user
    // - Add rewards to user's balance
    // - Log the transaction for audit purposes

    console.log('🎉 Swap mission completed successfully!', {
      missionId,
      userAddress,
      rewards: missionRewards,
      transactionHash
    })

    return NextResponse.json({
      success: true,
      message: 'Swap verified and mission completed',
      rewards: missionRewards,
      transactionHash,
      missionId,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('❌ Error confirming swap:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

function calculateMissionRewards(missionId: string, swapDetails: any) {
  // Mission-specific reward calculation
  const baseRewards = {
    tokens: 0,
    xp: 0,
    knowledgePoints: 0
  }

  switch (missionId) {
    case 'first_swap':
      return { tokens: 75, xp: 150, knowledgePoints: 40 }
    case 'usdc_wld_swap':
      return { tokens: 100, xp: 200, knowledgePoints: 50 }
    case 'wld_eth_swap':
      return { tokens: 90, xp: 180, knowledgePoints: 45 }
    case 'large_swap':
      return { tokens: 200, xp: 400, knowledgePoints: 80 }
    case 'arbitrage_swap':
      return { tokens: 300, xp: 600, knowledgePoints: 120 }
    default:
      // Calculate based on swap amount
      const amountIn = parseFloat(swapDetails.amountIn || '0')
      const baseTokens = Math.max(10, Math.floor(amountIn / 1e16)) // Minimum 10 tokens
      return {
        tokens: baseTokens,
        xp: baseTokens * 2,
        knowledgePoints: Math.floor(baseTokens / 2)
      }
  }
} 