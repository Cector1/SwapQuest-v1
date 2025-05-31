import { NextRequest, NextResponse } from 'next/server'
import { randomBytes } from 'crypto'

interface PaymentRequest {
  amount: string
  token: 'WLD' | 'USDC'
  missionId?: string
}

// En una aplicación real, esto se almacenaría en una base de datos
const pendingPayments = new Map<string, {
  id: string
  amount: string
  token: string
  missionId?: string
  timestamp: number
  status: 'pending' | 'completed' | 'failed'
}>()

export async function POST(req: NextRequest) {
  try {
    const { amount, token, missionId }: PaymentRequest = await req.json()

    // Validar entrada
    if (!amount || parseFloat(amount) <= 0) {
      return NextResponse.json(
        { error: 'Cantidad inválida' },
        { status: 400 }
      )
    }

    if (!['WLD', 'USDC'].includes(token)) {
      return NextResponse.json(
        { error: 'Token no soportado' },
        { status: 400 }
      )
    }

    // Generar ID único para el pago
    const paymentId = randomBytes(16).toString('hex')

    // Almacenar información del pago
    pendingPayments.set(paymentId, {
      id: paymentId,
      amount,
      token,
      missionId,
      timestamp: Date.now(),
      status: 'pending'
    })

    console.log('💰 Payment initiated:', {
      id: paymentId,
      amount,
      token,
      missionId
    })

    return NextResponse.json({ 
      id: paymentId,
      success: true 
    })

  } catch (error) {
    console.error('❌ Error initiating payment:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const paymentId = searchParams.get('id')

  if (!paymentId) {
    return NextResponse.json(
      { error: 'ID de pago requerido' },
      { status: 400 }
    )
  }

  const payment = pendingPayments.get(paymentId)
  
  if (!payment) {
    return NextResponse.json(
      { error: 'Pago no encontrado' },
      { status: 404 }
    )
  }

  return NextResponse.json(payment)
} 