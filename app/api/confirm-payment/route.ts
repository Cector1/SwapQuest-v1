import { NextRequest, NextResponse } from 'next/server'
import { MiniAppPaymentSuccessPayload } from '@worldcoin/minikit-js'

interface ConfirmPaymentRequest {
  payload: MiniAppPaymentSuccessPayload
  missionId?: string
}

// En una aplicación real, esto se almacenaría en una base de datos
const completedMissions = new Map<string, {
  missionId: string
  userId: string
  transactionId: string
  amount: string
  token: string
  timestamp: number
}>()

export async function POST(req: NextRequest) {
  try {
    const { payload, missionId }: ConfirmPaymentRequest = await req.json()

    console.log('🔍 Confirming payment:', {
      transactionId: payload.transaction_id,
      reference: payload.reference,
      missionId
    })

    // Verificar que el payload es válido
    if (!payload.transaction_id || !payload.reference) {
      return NextResponse.json(
        { error: 'Payload de pago inválido' },
        { status: 400 }
      )
    }

    // En una aplicación real, aquí verificarías el pago con la API de WorldCoin
      // const response = await fetch(
      //   `https://developer.worldcoin.org/api/v2/minikit/transaction/${payload.transaction_id}?app_id=${process.env.APP_ID}`,
      //   {
      //     method: 'GET',
      //     headers: {
      //       Authorization: `Bearer ${process.env.DEV_PORTAL_API_KEY}`,
      //     },
      //   }
      // )
      // const transaction = await response.json()

    // Para el demo, simulamos una verificación exitosa
    const isValidPayment = true // En producción: transaction.status !== 'failed'

    if (isValidPayment) {
      // Si es una misión, registrar la completación
      if (missionId) {
        completedMissions.set(`${missionId}-${payload.reference}`, {
          missionId,
          userId: 'worldcoin-user', // En producción, obtener del contexto de usuario
        transactionId: payload.transaction_id,
          amount: '0', // En producción, obtener del transaction
          token: 'WLD',
          timestamp: Date.now()
      })

        console.log('✅ Mission completed:', {
          missionId,
          transactionId: payload.transaction_id
        })
      }

      return NextResponse.json({ 
        success: true,
        transactionId: payload.transaction_id,
        reference: payload.reference,
        missionCompleted: !!missionId
      })
    } else {
      return NextResponse.json(
        { 
        success: false,
          error: 'Pago no válido o fallido' 
        },
        { status: 400 }
      )
    }

  } catch (error) {
    console.error('❌ Error confirming payment:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error interno del servidor' 
      },
      { status: 500 }
    )
  }
}

// Endpoint para obtener misiones completadas
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const missionId = searchParams.get('missionId')
  const userId = searchParams.get('userId')

  if (missionId) {
    // Buscar una misión específica
    const missions = Array.from(completedMissions.values()).filter(
      m => m.missionId === missionId && (!userId || m.userId === userId)
    )
    return NextResponse.json(missions)
  }

  if (userId) {
    // Buscar todas las misiones de un usuario
    const userMissions = Array.from(completedMissions.values()).filter(
      m => m.userId === userId
    )
    return NextResponse.json(userMissions)
  }

  // Devolver todas las misiones completadas (para admin)
  return NextResponse.json(Array.from(completedMissions.values()))
} 