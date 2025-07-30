"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Plus, BookOpen, Edit, Trash2, ChevronDown, ChevronRight } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { createStepByStep, getStepBySteps, updateStepByStep, deleteStepByStep } from "@/services/firestore"
import type { StepByStep } from "@/types"
import { formatDate } from "@/lib/utils"

const StepByStepTab: React.FC = () => {
  const { user } = useAuth()
  const [stepBySteps, setStepBySteps] = useState<StepByStep[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<StepByStep | null>(null)
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    steps: [""],
  })

  useEffect(() => {
    if (user) {
      loadStepBySteps()
    }
  }, [user])

  const loadStepBySteps = async () => {
    if (!user) return

    setLoading(true)
    try {
      const { stepBySteps, error } = await getStepBySteps(user.uid)
      if (error) {
        console.error("Erro ao carregar passo a passo:", error)
      } else {
        setStepBySteps(stepBySteps)
      }
    } catch (error) {
      console.error("Erro ao carregar passo a passo:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleStepChange = (index: number, value: string) => {
    const newSteps = [...formData.steps]
    newSteps[index] = value
    setFormData({
      ...formData,
      steps: newSteps,
    })
  }

  const addStep = () => {
    setFormData({
      ...formData,
      steps: [...formData.steps, ""],
    })
  }

  const removeStep = (index: number) => {
    if (formData.steps.length > 1) {
      const newSteps = formData.steps.filter((_, i) => i !== index)
      setFormData({
        ...formData,
        steps: newSteps,
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    const filteredSteps = formData.steps.filter((step) => step.trim() !== "")
    if (filteredSteps.length === 0) return

    try {
      if (editingItem) {
        const { error } = await updateStepByStep(editingItem.id, {
          title: formData.title,
          description: formData.description,
          steps: filteredSteps,
        })
        if (!error) {
          await loadStepBySteps()
        }
      } else {
        const { error } = await createStepByStep({
          userId: user.uid,
          title: formData.title,
          description: formData.description,
          steps: filteredSteps,
        })
        if (!error) {
          await loadStepBySteps()
        }
      }

      setIsDialogOpen(false)
      resetForm()
    } catch (error) {
      console.error("Erro ao salvar passo a passo:", error)
    }
  }

  const handleEdit = (item: StepByStep) => {
    setEditingItem(item)
    setFormData({
      title: item.title,
      description: item.description,
      steps: item.steps,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir este passo a passo?")) {
      try {
        const { error } = await deleteStepByStep(id)
        if (!error) {
          await loadStepBySteps()
        }
      } catch (error) {
        console.error("Erro ao excluir passo a passo:", error)
      }
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      steps: [""],
    })
    setEditingItem(null)
  }

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedItems(newExpanded)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Passo a Passo</h2>
          <p className="text-gray-600">Registre processos técnicos e operacionais</p>
        </div>

        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open)
            if (!open) resetForm()
          }}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4" />
              Novo processo
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingItem ? "Editar Passo a Passo" : "Novo Passo a Passo"}</DialogTitle>
              <DialogDescription>Crie um guia detalhado com passos organizados</DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Ex: Como criar uma planilha"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Breve descrição do processo..."
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Passos</Label>
                <div className="space-y-2 max-h-60 overflow-auto">
                  {formData.steps.map((step, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Badge variant="outline" className="min-w-[2rem] justify-center">
                        {index + 1}
                      </Badge>
                      <Input
                        placeholder={`Passo ${index + 1}`}
                        value={step}
                        onChange={(e) => handleStepChange(index, e.target.value)}
                        required
                      />
                      {formData.steps.length > 1 && (
                        <Button type="button" variant="outline" size="icon" onClick={() => removeStep(index)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
                <Button type="button" variant="outline" onClick={addStep} className="w-full bg-transparent">
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Passo
                </Button>
              </div>

              <DialogFooter>
                <Button type="submit">{editingItem ? "Salvar Alterações" : "Criar Passo a Passo"}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {stepBySteps.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BookOpen className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum passo a passo criado</h3>
            <p className="text-gray-600 text-center mb-4">Comece criando seu primeiro guia de processo</p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Criar Primeiro Passo a Passo
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          <AnimatePresence>
            {stepBySteps.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <button
                            onClick={() => toggleExpanded(item.id)}
                            className="flex items-center space-x-2 text-left hover:text-primary transition-colors"
                          >
                            {expandedItems.has(item.id) ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                            <CardTitle className="text-lg">{item.title}</CardTitle>
                          </button>
                        </div>
                        {item.description && <CardDescription>{item.description}</CardDescription>}
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                          <span>{item.steps.length} passos</span>
                          <span>Criado em {formatDate(item.createdAt)}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="icon" onClick={() => handleEdit(item)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => handleDelete(item.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>

                  <AnimatePresence>
                    {expandedItems.has(item.id) && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <CardContent>
                          <div className="space-y-3">
                            {item.steps.map((step, stepIndex) => (
                              <div key={stepIndex} className="flex items-start space-x-3">
                                <Badge variant="default" className="min-w-[2rem] justify-center mt-0.5">
                                  {stepIndex + 1}
                                </Badge>
                                <p className="text-sm text-gray-700 flex-1">{step}</p>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}

export default StepByStepTab
