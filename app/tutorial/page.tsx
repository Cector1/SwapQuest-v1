"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ChevronLeft, ChevronRight, CheckCircle, Play } from "lucide-react"

const tutorialSteps = [
  {
    title: "Welcome to SwapQuest!",
    content: "SwapQuest is a gamified DeFi experience where you complete missions by performing real token swaps on Avalanche.",
    image: "/tutorial/welcome.png",
  },
  {
    title: "Connect Your Wallet",
    content: "First, connect your wallet to start your adventure. We support MetaMask and other popular wallets.",
    image: "/tutorial/wallet.png",
  },
  {
    title: "Choose Your Mission",
    content: "Browse available missions and select one that matches your trading goals. Each mission has specific requirements and rewards.",
    image: "/tutorial/missions.png",
  },
  {
    title: "Execute Swaps",
    content: "Perform the required token swaps using real DeFi protocols. Your transactions are verified on-chain.",
    image: "/tutorial/swap.png",
  },
  {
    title: "Earn Rewards",
    content: "Complete missions to earn ARENA tokens and unlock achievements. Build your reputation as a DeFi hero!",
    image: "/tutorial/rewards.png",
  },
]

export default function TutorialPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])

  const nextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCompletedSteps([...completedSteps, currentStep])
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const progress = ((currentStep + 1) / tutorialSteps.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950">
      <div className="container mx-auto p-4 pt-20">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-purple-900/50 border-purple-700">
            <CardHeader>
              <CardTitle className="text-2xl text-white text-center">
                SwapQuest Tutorial
              </CardTitle>
              <div className="mt-4">
                <div className="flex justify-between text-sm text-purple-300 mb-2">
                  <span>Step {currentStep + 1} of {tutorialSteps.length}</span>
                  <span>{Math.round(progress)}% Complete</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <h2 className="text-xl font-bold text-white mb-4">
                  {tutorialSteps[currentStep].title}
                </h2>
                <div className="bg-purple-800/50 rounded-lg p-6 mb-6">
                  <div className="w-full h-48 bg-purple-700/50 rounded-lg flex items-center justify-center mb-4">
                    <Play className="w-16 h-16 text-purple-400" />
                  </div>
                  <p className="text-purple-200 leading-relaxed">
                    {tutorialSteps[currentStep].content}
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <Button
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  variant="outline"
                  className="border-purple-600 text-purple-300 hover:bg-purple-600"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>

                <div className="flex space-x-2">
                  {tutorialSteps.map((_, index) => (
                    <div
                      key={index}
                      className={`w-3 h-3 rounded-full ${
                        index === currentStep
                          ? "bg-amber-500"
                          : completedSteps.includes(index)
                          ? "bg-green-500"
                          : "bg-purple-600"
                      }`}
                    />
                  ))}
                </div>

                {currentStep === tutorialSteps.length - 1 ? (
                  <Button className="bg-amber-500 hover:bg-amber-600 text-white">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Start Playing
                  </Button>
                ) : (
                  <Button
                    onClick={nextStep}
                    className="bg-amber-500 hover:bg-amber-600 text-white"
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
