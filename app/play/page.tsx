"use client"

import { MissionsSystem } from "@/components/missions-system"

export default function PlayPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950">
      <div className="container mx-auto p-4 pt-20">
        <div className="max-w-4xl mx-auto">
          <MissionsSystem />
        </div>
      </div>
    </div>
  )
}
