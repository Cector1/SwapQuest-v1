"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { 
  BookOpen, 
  Play, 
  Clock, 
  Star, 
  Trophy, 
  CheckCircle,
  Lock,
  Unlock,
  Coins,
  Zap,
  Target,
  Award,
  Crown,
  Gem
} from 'lucide-react'
import { toast } from 'sonner'

interface Lesson {
  id: string
  title: string
  description: string
  author: string
  duration: string
  difficulty: 'Principiante' | 'Intermedio' | 'Avanzado'
  category: 'basics' | 'intermediate' | 'advanced' | 'premium'
  completed: boolean
  cost: number // Costo en puntos de conocimiento (0 = gratis)
  content: string
  videoUrl?: string
  isPremium: boolean
}

export function LearningHub() {
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null)
  const [showLessonDialog, setShowLessonDialog] = useState(false)
  const [knowledgePoints, setKnowledgePoints] = useState(0)
  const [unlockedLessons, setUnlockedLessons] = useState<string[]>([])

  const lessons: Lesson[] = [
    // Lecciones Gratuitas
    {
      id: 'intro-defi',
      title: 'Introducción a DeFi',
      description: 'Aprende los conceptos básicos de las finanzas descentralizadas',
      author: 'María González',
      duration: '15 min',
      difficulty: 'Principiante',
      category: 'basics',
      completed: false,
      cost: 0,
      isPremium: false,
      content: `
# Introducción a DeFi

## ¿Qué es DeFi?

DeFi (Finanzas Descentralizadas) es un ecosistema de aplicaciones financieras construidas sobre blockchain que elimina intermediarios tradicionales.

## Características principales:

- **Descentralización**: Sin autoridades centrales
- **Transparencia**: Código abierto y auditable
- **Accesibilidad**: Disponible 24/7 globalmente
- **Interoperabilidad**: Protocolos que se conectan entre sí

## Casos de uso:

1. **Préstamos y créditos**
2. **Intercambio de tokens (DEX)**
3. **Staking y yield farming**
4. **Seguros descentralizados**

¡Completa esta lección para comenzar tu viaje en DeFi!
      `
      },
      {
      id: 'wallets-security',
      title: 'Wallets y Seguridad',
      description: 'Protege tus activos digitales con las mejores prácticas',
      author: 'Carlos Ruiz',
      duration: '20 min',
      difficulty: 'Principiante',
      category: 'basics',
        completed: false,
      cost: 0,
      isPremium: false,
      content: `
# Wallets y Seguridad en DeFi

## Tipos de Wallets:

### Hot Wallets (Conectadas)
- MetaMask, Trust Wallet
- Convenientes para uso diario
- Mayor riesgo de hackeo

### Cold Wallets (Desconectadas)
- Hardware wallets (Ledger, Trezor)
- Máxima seguridad
- Ideales para almacenamiento a largo plazo

## Mejores Prácticas:

1. **Nunca compartas tu frase semilla**
2. **Usa autenticación de dos factores**
3. **Verifica siempre las direcciones**
4. **Mantén software actualizado**
5. **Usa redes seguras**

## Consejos de WorldCoin:
- WorldID proporciona verificación humana
- Reduce riesgo de bots y ataques Sybil
- Integración nativa con protocolos DeFi
      `
      },
      {
      id: 'smart-contracts',
      title: 'Smart Contracts Básicos',
      description: 'Entiende cómo funcionan los contratos inteligentes',
      author: 'Ana López',
      duration: '25 min',
      difficulty: 'Intermedio',
      category: 'intermediate',
      completed: false,
      cost: 0,
      isPremium: false,
      content: `
# Smart Contracts en DeFi

## ¿Qué son los Smart Contracts?

Programas autoejecutables que corren en blockchain con términos del acuerdo directamente escritos en código.

## Características:

- **Inmutables**: No se pueden cambiar una vez desplegados
- **Deterministas**: Mismo input = mismo output
- **Transparentes**: Código visible públicamente
- **Sin intermediarios**: Ejecución automática

## Casos de uso en DeFi:

1. **AMM (Automated Market Makers)**
2. **Lending Protocols**
3. **Yield Farming**
4. **Insurance Protocols**

## Riesgos:

- Bugs en el código
- Ataques de reentrancia
- Manipulación de oráculos
- Riesgo de liquidación

¡Siempre investiga antes de interactuar con contratos!
      `
    },
    // Lecciones Premium (requieren puntos)
    {
      id: 'advanced-yield-farming',
      title: 'Yield Farming Avanzado',
      description: 'Estrategias avanzadas para maximizar rendimientos',
      author: 'Roberto Silva',
      duration: '35 min',
      difficulty: 'Avanzado',
      category: 'premium',
        completed: false,
      cost: 50,
      isPremium: true,
      content: `
# Yield Farming Avanzado

## Estrategias Complejas:

### 1. Liquidity Mining Compuesto
- Reinversión automática de recompensas
- Compounding de yields
- Optimización de gas fees

### 2. Cross-Chain Farming
- Aprovechar diferentes ecosistemas
- Arbitraje entre chains
- Gestión de riesgos multi-chain

### 3. Leveraged Farming
- Usar préstamos para amplificar posiciones
- Gestión de riesgo de liquidación
- Cálculo de APY real vs riesgo

## Herramientas Profesionales:

- **Zapper.fi**: Portfolio tracking
- **DeBank**: Multi-chain analytics
- **APY.vision**: Impermanent loss tracking
- **DeFiPulse**: Protocol rankings

## Riesgos Avanzados:

1. **Impermanent Loss**
2. **Smart Contract Risk**
3. **Liquidation Risk**
4. **Regulatory Risk**

¡Solo para usuarios experimentados!
      `
    },
    {
      id: 'defi-security-audit',
      title: 'Auditoría de Seguridad DeFi',
      description: 'Aprende a evaluar la seguridad de protocolos DeFi',
      author: 'Elena Martín',
      duration: '40 min',
      difficulty: 'Avanzado',
      category: 'premium',
        completed: false,
      cost: 75,
      isPremium: true,
      content: `
# Auditoría de Seguridad en DeFi

## Checklist de Seguridad:

### 1. Análisis del Código
- ¿Está el código verificado?
- ¿Hay auditorías públicas?
- ¿Quién desarrolló el protocolo?

### 2. Tokenomics
- Distribución de tokens
- Mecanismos de inflación
- Governance tokens

### 3. Liquidez y TVL
- Total Value Locked
- Distribución de liquidez
- Concentración de holders

## Red Flags:

⚠️ **Código no verificado**
⚠️ **Sin auditorías**
⚠️ **Equipo anónimo**
⚠️ **Tokenomics poco claras**
⚠️ **Baja liquidez**

## Herramientas de Análisis:

- **DeFiSafety**: Ratings de seguridad
- **Rugdoc**: Análisis de riesgos
- **CertiK**: Auditorías profesionales
- **Immunefi**: Bug bounties

## Metodología de Evaluación:

1. Research del equipo
2. Análisis técnico
3. Evaluación económica
4. Test en testnet
5. Inversión gradual

¡La seguridad es lo primero en DeFi!
      `
    },
    {
      id: 'worldcoin-minikit',
      title: 'Tu Primera MiniApp con WorldCoin',
      description: 'Desarrolla aplicaciones usando WorldCoin MiniKit',
      author: 'Lautaro Oliver',
      duration: '30 min',
      difficulty: 'Avanzado',
      category: 'premium',
        completed: false,
      cost: 100,
      isPremium: true,
      content: `
# Desarrollo con WorldCoin MiniKit

## Configuración Inicial:

### 1. Instalación
\`\`\`bash
npm install @worldcoin/minikit-js @worldcoin/minikit-react
\`\`\`

### 2. Setup Básico
\`\`\`typescript
import { MiniKit } from '@worldcoin/minikit-js'

// Verificar instalación
if (MiniKit.isInstalled()) {
  console.log('World App detectado!')
}
\`\`\`

## Funcionalidades Principales:

### 1. Autenticación
- Sign-In with Ethereum (SIWE)
- WorldID verification
- Wallet connection

### 2. Pagos
- Pagos en WLD/USDC
- Transacciones on-chain
- Confirmación automática

### 3. Transacciones
- Smart contract interactions
- Multi-step transactions
- Error handling

## Ejemplo Práctico:

\`\`\`typescript
// Realizar pago
const { finalPayload } = await MiniKit.commandsAsync.pay({
  reference: 'unique-ref',
  to: '0x...',
  tokens: [{
    symbol: Tokens.WLD,
    token_amount: '1000000000000000000' // 1 WLD
  }],
  description: 'Pago de ejemplo'
})
\`\`\`

## Best Practices:

1. **Siempre verificar MiniKit.isInstalled()**
2. **Manejar errores gracefully**
3. **Validar transacciones en backend**
4. **Usar referencias únicas**
5. **Implementar timeouts**

¡Construye el futuro de DeFi con WorldCoin!
      `
    },
    {
      id: 'mev-protection',
      title: 'Protección contra MEV',
      description: 'Estrategias para protegerte del Maximal Extractable Value',
      author: 'Diego Fernández',
      duration: '45 min',
      difficulty: 'Avanzado',
      category: 'premium',
        completed: false,
      cost: 125,
      isPremium: true,
      content: `
# Protección contra MEV

## ¿Qué es MEV?

Maximal Extractable Value: valor que puede ser extraído de la reordenación, inclusión o exclusión de transacciones en un bloque.

## Tipos de MEV:

### 1. Front-running
- Bots copian tu transacción
- La ejecutan antes con mayor gas
- Se aprovechan de tu información

### 2. Sandwich Attacks
- Transacción antes y después de la tuya
- Manipulan el precio
- Extraen valor de tu trade

### 3. Liquidation MEV
- Bots compiten por liquidaciones
- Extraen valor de posiciones en riesgo

## Estrategias de Protección:

### 1. Private Mempools
- **Flashbots Protect**
- **Eden Network**
- **KeeperDAO**

### 2. Commit-Reveal Schemes
- Ocultar intención inicial
- Revelar en segundo paso
- Reduce front-running

### 3. Batch Auctions
- **CoW Protocol**
- **Gnosis Auction**
- Mejor ejecución de precios

## Herramientas:

- **MEV-Boost**: Proposer-builder separation
- **Flashbots**: MEV research y tools
- **Bloxroute**: Private transactions
- **1inch**: MEV protection integrado

## Costos vs Beneficios:

✅ **Mejor ejecución de precios**
✅ **Protección contra ataques**
❌ **Fees adicionales**
❌ **Menor velocidad**

¡Protege tus trades de los extractores de valor!
      `
    }
  ]

  // Cargar puntos de conocimiento y lecciones desbloqueadas
  useEffect(() => {
    const points = localStorage.getItem('knowledgePoints')
    const unlocked = localStorage.getItem('unlockedLessons')
    
    setKnowledgePoints(points ? parseInt(points) : 0)
    setUnlockedLessons(unlocked ? JSON.parse(unlocked) : [])
  }, [])

  const unlockLesson = (lesson: Lesson) => {
    if (knowledgePoints >= lesson.cost) {
      const newPoints = knowledgePoints - lesson.cost
      const newUnlocked = [...unlockedLessons, lesson.id]
      
      setKnowledgePoints(newPoints)
      setUnlockedLessons(newUnlocked)
      
      localStorage.setItem('knowledgePoints', newPoints.toString())
      localStorage.setItem('unlockedLessons', JSON.stringify(newUnlocked))
      
      toast.success(`¡Lección "${lesson.title}" desbloqueada!`)
      
      // Abrir la lección inmediatamente
      setSelectedLesson(lesson)
      setShowLessonDialog(true)
    } else {
      toast.error(`Necesitas ${lesson.cost - knowledgePoints} puntos más para desbloquear esta lección`)
    }
  }

  const completeLesson = (lessonId: string) => {
    // Marcar lección como completada
    const completedLessons = localStorage.getItem('completedLessons')
    const completed = completedLessons ? JSON.parse(completedLessons) : []
    
    if (!completed.includes(lessonId)) {
      completed.push(lessonId)
      localStorage.setItem('completedLessons', JSON.stringify(completed))
      toast.success('¡Lección completada! +10 puntos de conocimiento')
      
      // Dar puntos bonus por completar lección
      const bonusPoints = knowledgePoints + 10
      setKnowledgePoints(bonusPoints)
      localStorage.setItem('knowledgePoints', bonusPoints.toString())
    }
    
    setShowLessonDialog(false)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Principiante': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'Intermedio': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'Avanzado': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'basics': return BookOpen
      case 'intermediate': return Target
      case 'advanced': return Trophy
      case 'premium': return Crown
      default: return BookOpen
    }
  }

  const isLessonAccessible = (lesson: Lesson) => {
    return !lesson.isPremium || unlockedLessons.includes(lesson.id)
  }

  const completedLessons = JSON.parse(localStorage.getItem('completedLessons') || '[]')

  return (
    <div className="space-y-6">
      {/* Header con puntos disponibles */}
      <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border-purple-200 dark:border-purple-800">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                <Gem className="w-6 h-6 text-purple-600" />
            </div>
            <div>
                <h3 className="font-semibold text-purple-900 dark:text-purple-100">Centro de Conocimiento</h3>
                <p className="text-sm text-purple-700 dark:text-purple-300">
                  Desbloquea contenido premium con tus puntos
                </p>
              </div>
            </div>
          <div className="text-right">
              <div className="text-2xl font-bold text-purple-600 flex items-center space-x-1">
                <Coins className="w-6 h-6" />
                <span>{knowledgePoints}</span>
              </div>
              <div className="text-xs text-purple-500">puntos disponibles</div>
        </div>
      </div>
        </CardContent>
      </Card>

      {/* Estadísticas de progreso */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{completedLessons.length}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Completadas</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{lessons.length}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{unlockedLessons.length}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Desbloqueadas</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">
              {Math.round((completedLessons.length / lessons.length) * 100)}%
        </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Progreso</div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de lecciones */}
      <div className="grid gap-4">
        {lessons.map((lesson) => {
          const IconComponent = getCategoryIcon(lesson.category)
          const isAccessible = isLessonAccessible(lesson)
          const isCompleted = completedLessons.includes(lesson.id)
          
          return (
            <motion.div
              key={lesson.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className={`cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] ${
                isCompleted 
                  ? 'border-green-200 bg-green-50 dark:bg-green-900/20' 
                  : !isAccessible 
                    ? 'border-gray-200 bg-gray-50 dark:bg-gray-900/20' 
                    : ''
              }`}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        isCompleted 
                          ? 'bg-green-100 dark:bg-green-900' 
                          : lesson.isPremium && !isAccessible
                            ? 'bg-gray-100 dark:bg-gray-900'
                            : 'bg-blue-100 dark:bg-blue-900'
                }`}>
                        {isCompleted ? (
                          <CheckCircle className="w-6 h-6 text-green-600" />
                        ) : lesson.isPremium && !isAccessible ? (
                          <Lock className="w-6 h-6 text-gray-600" />
                  ) : (
                          <IconComponent className="w-6 h-6 text-blue-600" />
                  )}
                </div>
                
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold">{lesson.title}</h3>
                          {lesson.isPremium && (
                            <Crown className="w-4 h-4 text-yellow-500" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          {lesson.description}
                        </p>
                        <p className="text-xs text-gray-500 mb-2">
                          Hecho por {lesson.author}
                        </p>
                      
                        <div className="flex items-center space-x-2 flex-wrap gap-1">
                          <Badge className={getDifficultyColor(lesson.difficulty)}>
                          {lesson.difficulty}
                        </Badge>
                          <Badge variant="outline" className="text-xs">
                            <Clock className="w-3 h-3 mr-1" />
                            {lesson.duration}
                          </Badge>
                          {lesson.isPremium && (
                            <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-700 border-yellow-200">
                              <Coins className="w-3 h-3 mr-1" />
                              {lesson.cost} pts
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end space-y-2">
                      {isCompleted ? (
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Completada
                        </Badge>
                      ) : !isAccessible ? (
                  <Button
                          size="sm"
                          variant="outline"
                          onClick={() => unlockLesson(lesson)}
                          disabled={knowledgePoints < lesson.cost}
                        >
                          <Unlock className="w-4 h-4 mr-1" />
                          Desbloquear
                        </Button>
                      ) : (
                        <Button 
                          size="sm"
                          onClick={() => {
                            setSelectedLesson(lesson)
                            setShowLessonDialog(true)
                          }}
                        >
                          <Play className="w-4 h-4 mr-1" />
                          Estudiar
                        </Button>
                      )}
                    </div>
                </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Dialog de lección */}
      <Dialog open={showLessonDialog} onOpenChange={setShowLessonDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              {selectedLesson && <BookOpen className="w-5 h-5" />}
              <span>{selectedLesson?.title}</span>
              {selectedLesson?.isPremium && (
                <Crown className="w-5 h-5 text-yellow-500" />
              )}
            </DialogTitle>
          </DialogHeader>
          
          {selectedLesson && (
            <div className="space-y-4">
              <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                <span>Por {selectedLesson.author}</span>
                <span>•</span>
                <span>{selectedLesson.duration}</span>
                <span>•</span>
                <Badge className={getDifficultyColor(selectedLesson.difficulty)}>
                  {selectedLesson.difficulty}
                </Badge>
              </div>
              
              <div className="prose dark:prose-invert max-w-none">
                <div dangerouslySetInnerHTML={{ 
                  __html: selectedLesson.content.replace(/\n/g, '<br>').replace(/#{1,6} /g, '<h3>').replace(/<h3>/g, '<h3 class="text-lg font-semibold mt-4 mb-2">') 
                }} />
        </div>
        
              <div className="flex space-x-3 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setShowLessonDialog(false)}
                  className="flex-1"
                >
                  Cerrar
                </Button>
                <Button
                  onClick={() => completeLesson(selectedLesson.id)}
                  className="flex-1"
                  disabled={completedLessons.includes(selectedLesson.id)}
                >
                  {completedLessons.includes(selectedLesson.id) ? (
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4" />
                      <span>Completada</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Award className="w-4 h-4" />
                      <span>Completar (+10 pts)</span>
                </div>
                  )}
                </Button>
                </div>
                  </div>
                )}
        </DialogContent>
      </Dialog>
        </div>
  )
} 