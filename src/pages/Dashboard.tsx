"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LogOut, BookOpen, Calendar } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { logout } from "@/services/auth"
import StepByStepTab from "@/components/StepByStepTab"
import PlannerTab from "@/components/PlannerTab"

const Dashboard: React.FC = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!user) {
      navigate("/login")
    }
  }, [user, navigate])

  const handleLogout = async () => {
    setLoading(true)
    try {
      await logout()
      navigate("/")
    } catch (error) {
      console.error("Erro ao fazer logout:", error)
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-3"
            >
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl w-full font-bold text-gray-900">I forgot my book</h1>
                <p className="text-sm text-gray-600">Bem-vindo, {user.displayName}</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-4"
            >
              <Avatar>
                <AvatarImage src={user.photoURL || ""} />
                <AvatarFallback>
                  {user.displayName ? user.displayName.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <Button variant="outline" size="sm" onClick={handleLogout} disabled={loading}>
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Tabs defaultValue="stepbystep" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 ">
              <TabsTrigger value="stepbystep" className="flex items-center space-x-2 cursor-pointer">
                <BookOpen className="h-4 w-4" />
                <span>Passo a Passo</span>
              </TabsTrigger>
              <TabsTrigger value="planner" className="flex items-center space-x-2 cursor-pointer">
                <Calendar className="h-4 w-4" />
                <span>Planner</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="stepbystep">
              <StepByStepTab />
            </TabsContent>

            <TabsContent value="planner">
              <PlannerTab />
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>
    </div>
  )
}

export default Dashboard
