import { NextRequest, NextResponse } from 'next/server'

interface Mission {
  id: string
  title: string
  description: string
  type: 'pay' | 'send_transaction' | 'verify' | 'wallet_auth' | 'sign_message'
  difficulty: 'Fácil' | 'Medio' | 'Difícil'
  reward: number
  xpReward: number
  status: 'locked' | 'available' | 'in_progress' | 'completed'
  requirements?: string[]
  contractAddress?: string
  tokenAddress?: string
  minAmount?: string
  targetAddress?: string
  message?: string
  category: 'defi' | 'payments' | 'security' | 'social'
}

// En una aplicación real, esto se almacenaría en una base de datos
const userMissions = new Map<string, Mission[]>()
const completedMissions = new Map<string, string[]>() // userId -> missionIds[]

// Misiones por defecto
const defaultMissions: Mission[] = [
  {
    id: 'first_payment',
    title: 'Tu Primer Pago WorldCoin',
    description: 'Realiza tu primer pago usando WLD o USDC en World App',
    type: 'pay',
    difficulty: 'Fácil',
    reward: 50,
    xpReward: 100,
    status: 'available',
    minAmount: '0.1',
    category: 'payments'
  },
  {
    id: 'verify_human',
    title: 'Verificación Humana',
    description: 'Verifica tu identidad humana usando WorldID',
    type: 'verify',
    difficulty: 'Medio',
    reward: 100,
    xpReward: 200,
    status: 'available',
    category: 'security'
  },
  {
    id: 'send_wld',
    title: 'Enviar WLD',
    description: 'Envía WLD a otro usuario usando transacciones reales',
    type: 'send_transaction',
    difficulty: 'Medio',
    reward: 75,
    xpReward: 150,
    status: 'available',
    tokenAddress: '0x163f8C2467924be0ae7B5347228CABF260318753',
    minAmount: '1',
    category: 'payments'
  },
  {
    id: 'defi_interaction',
    title: 'Interacción DeFi',
    description: 'Interactúa con un protocolo DeFi real en World Chain',
    type: 'send_transaction',
    difficulty: 'Difícil',
    reward: 200,
    xpReward: 400,
    status: 'available',
    contractAddress: '0x742d35Cc6634C0532925a3b8D20Eb0d8f4C2f35f',
    category: 'defi'
  },
  {
    id: 'sign_message',
    title: 'Firma Digital',
    description: 'Firma un mensaje usando tu wallet WorldCoin',
    type: 'sign_message',
    difficulty: 'Fácil',
    reward: 25,
    xpReward: 50,
    status: 'available',
    message: 'Soy un usuario verificado de SwapQuest Gaming Platform',
    category: 'security'
  },
  {
    id: 'large_payment',
    title: 'Pago Grande',
    description: 'Realiza un pago de más de $10 usando WorldCoin',
    type: 'pay',
    difficulty: 'Difícil',
    reward: 150,
    xpReward: 300,
    status: 'available',
    minAmount: '10',
    category: 'payments'
  }
]

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get('userId') || 'default-user'

  try {
    // Obtener misiones del usuario o crear las por defecto
    let missions = userMissions.get(userId)
    if (!missions) {
      missions = [...defaultMissions]
      userMissions.set(userId, missions)
    }

    // Obtener misiones completadas
    const completed = completedMissions.get(userId) || []

    // Actualizar estado de las misiones
    const updatedMissions = missions.map(mission => ({
      ...mission,
      status: completed.includes(mission.id) ? 'completed' as const : mission.status
    }))

    return NextResponse.json({
      missions: updatedMissions,
      stats: {
        totalMissions: missions.length,
        completedMissions: completed.length,
        totalXP: completed.reduce((sum, missionId) => {
          const mission = missions.find(m => m.id === missionId)
          return sum + (mission?.xpReward || 0)
        }, 0),
        totalRewards: completed.reduce((sum, missionId) => {
          const mission = missions.find(m => m.id === missionId)
          return sum + (mission?.reward || 0)
        }, 0)
      }
    })

  } catch (error) {
    console.error('❌ Error fetching missions:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId, missionId, action } = await req.json()

    if (!userId || !missionId || !action) {
      return NextResponse.json(
        { error: 'Parámetros requeridos: userId, missionId, action' },
        { status: 400 }
      )
    }

    const missions = userMissions.get(userId) || [...defaultMissions]
    const completed = completedMissions.get(userId) || []

    switch (action) {
      case 'complete':
        if (!completed.includes(missionId)) {
          completed.push(missionId)
          completedMissions.set(userId, completed)
          
          const mission = missions.find(m => m.id === missionId)
          console.log('✅ Mission completed:', {
            userId,
            missionId,
            reward: mission?.reward,
            xp: mission?.xpReward
          })
        }
        break

      case 'start':
        // Marcar misión como en progreso
        const missionIndex = missions.findIndex(m => m.id === missionId)
        if (missionIndex !== -1) {
          missions[missionIndex].status = 'in_progress'
          userMissions.set(userId, missions)
        }
        break

      default:
        return NextResponse.json(
          { error: 'Acción no válida' },
          { status: 400 }
        )
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('❌ Error updating mission:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
} 