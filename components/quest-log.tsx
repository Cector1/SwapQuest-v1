"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ScrollText, CheckCircle2, Circle } from "lucide-react"

interface Quest {
  id: string
  title: string
  description: string
  reward: {
    gold: number
    xp: number
    items?: string[]
  }
  progress: number
  completed: boolean
  tasks: {
    description: string
    completed: boolean
  }[]
}

const initialQuests: Quest[] = [
  {
    id: "q1",
    title: "The Lost Artifact",
    description: "Find the ancient artifact hidden in the Whispering Woods.",
    reward: {
      gold: 50,
      xp: 100,
      items: ["Magic Amulet"],
    },
    progress: 33,
    completed: false,
    tasks: [
      { description: "Enter the Whispering Woods", completed: true },
      { description: "Find the hidden cave", completed: false },
      { description: "Retrieve the artifact", completed: false },
    ],
  },
  {
    id: "q2",
    title: "Goblin Trouble",
    description: "Clear out the goblin camp that's been causing trouble for local merchants.",
    reward: {
      gold: 30,
      xp: 75,
    },
    progress: 0,
    completed: false,
    tasks: [
      { description: "Locate the goblin camp", completed: false },
      { description: "Defeat the goblin leader", completed: false },
      { description: "Report back to the merchant guild", completed: false },
    ],
  },
  {
    id: "q3",
    title: "Rare Ingredients",
    description: "Collect rare herbs for the town alchemist.",
    reward: {
      gold: 25,
      xp: 50,
      items: ["Health Potion"],
    },
    progress: 66,
    completed: false,
    tasks: [
      { description: "Collect Moonflower", completed: true },
      { description: "Collect Dragonleaf", completed: true },
      { description: "Collect Shadow Root", completed: false },
    ],
  },
]

export function QuestLog() {
  const [quests, setQuests] = useState<Quest[]>(initialQuests)
  const [activeQuest, setActiveQuest] = useState<Quest | null>(null)

  const completeTask = (questId: string, taskIndex: number) => {
    setQuests((prevQuests) =>
      prevQuests.map((quest) => {
        if (quest.id === questId) {
          const updatedTasks = [...quest.tasks]
          updatedTasks[taskIndex] = {
            ...updatedTasks[taskIndex],
            completed: !updatedTasks[taskIndex].completed,
          }

          const completedTasks = updatedTasks.filter((task) => task.completed).length
          const progress = Math.round((completedTasks / updatedTasks.length) * 100)
          const allCompleted = updatedTasks.every((task) => task.completed)

          return {
            ...quest,
            tasks: updatedTasks,
            progress,
            completed: allCompleted,
          }
        }
        return quest
      }),
    )
  }

  return (
    <div className="bg-purple-800/50 border border-purple-700 rounded-lg p-6">
      <h2 className="text-xl font-bold mb-6 flex items-center">
        <ScrollText className="mr-2 h-5 w-5 text-amber-500" />
        Quest Log
      </h2>

      {activeQuest ? (
        <div>
          <Button
            variant="ghost"
            className="mb-4 text-purple-300 hover:text-white p-0"
            onClick={() => setActiveQuest(null)}
          >
            ← Back to all quests
          </Button>

          <div className="mb-4">
            <h3 className="text-lg font-bold text-amber-400">{activeQuest.title}</h3>
            <p className="text-sm text-purple-200 mt-1">{activeQuest.description}</p>
          </div>

          <div className="mb-6">
            <div className="flex justify-between text-sm mb-1">
              <span>Progress</span>
              <span>{activeQuest.progress}%</span>
            </div>
            <Progress value={activeQuest.progress} className="h-2" />
          </div>

          <div className="mb-6">
            <h4 className="font-medium mb-2">Tasks:</h4>
            <ul className="space-y-2">
              {activeQuest.tasks.map((task, index) => (
                <li
                  key={index}
                  className="flex items-start cursor-pointer"
                  onClick={() => completeTask(activeQuest.id, index)}
                >
                  {task.completed ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  ) : (
                    <Circle className="h-5 w-5 text-purple-400 mr-2 flex-shrink-0" />
                  )}
                  <span className={task.completed ? "line-through text-purple-400" : ""}>{task.description}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-purple-900/50 p-4 rounded-md">
            <h4 className="font-medium mb-2">Rewards:</h4>
            <div className="flex items-center mb-2">
              <div className="w-5 h-5 rounded-full bg-yellow-400 flex items-center justify-center text-purple-900 font-bold text-xs">
                G
              </div>
              <span className="ml-2">{activeQuest.reward.gold} Gold</span>
            </div>
            <div className="flex items-center">
              <div className="w-5 h-5 rounded-full bg-blue-400 flex items-center justify-center text-purple-900 font-bold text-xs">
                XP
              </div>
              <span className="ml-2">{activeQuest.reward.xp} Experience</span>
            </div>
            {activeQuest.reward.items && (
              <div className="mt-2">
                <span className="text-sm text-amber-300">+ {activeQuest.reward.items.join(", ")}</span>
              </div>
            )}
          </div>

          <div className="mt-6 text-center">
            <Button
              disabled={!activeQuest.completed}
              className={`
                ${activeQuest.completed ? "bg-amber-500 hover:bg-amber-600" : "bg-purple-700 cursor-not-allowed"}
              `}
            >
              {activeQuest.completed ? "Claim Rewards" : "Complete All Tasks"}
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {quests.map((quest) => (
            <motion.div
              key={quest.id}
              whileHover={{ scale: 1.02 }}
              className={`
                p-4 rounded-md cursor-pointer border
                ${
                  quest.completed
                    ? "border-green-500 bg-green-900/20"
                    : "border-purple-700 bg-purple-900/30 hover:bg-purple-800/30"
                }
              `}
              onClick={() => setActiveQuest(quest)}
            >
              <div className="flex justify-between items-start">
                <h3 className="font-bold">
                  {quest.title}
                  {quest.completed && (
                    <span className="ml-2 text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">Completed</span>
                  )}
                </h3>
                <div className="flex items-center">
                  <div className="w-5 h-5 rounded-full bg-yellow-400 flex items-center justify-center text-purple-900 font-bold text-xs">
                    G
                  </div>
                  <span className="ml-1 text-sm">{quest.reward.gold}</span>
                </div>
              </div>

              <p className="text-sm text-purple-300 mt-1 line-clamp-2">{quest.description}</p>

              <div className="mt-3">
                <div className="flex justify-between text-xs mb-1">
                  <span>{quest.progress}% complete</span>
                  <span>
                    {quest.tasks.filter((t) => t.completed).length}/{quest.tasks.length} tasks
                  </span>
                </div>
                <Progress value={quest.progress} className="h-1.5" />
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
