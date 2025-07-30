"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Plus, Clock, Tag, Edit, Trash2, ChevronLeft, ChevronRight } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { createTask, getTasks, updateTask, deleteTask } from "@/services/firestore"
import type { Task, ViewType } from "@/types"
import { formatTime } from "@/lib/utils"
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addWeeks,
  addMonths,
  subMonths,
  subWeeks,
  subDays,
  isSameDay,
  isSameMonth,
  isToday,
} from "date-fns"
import { ptBR } from "date-fns/locale"

const PlannerTab: React.FC = () => {
  const { user } = useAuth()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [viewType, setViewType] = useState<ViewType>("monthly")
  const [currentDate, setCurrentDate] = useState(new Date())
  const [, setSelectedDate] = useState<Date | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: format(new Date(), "yyyy-MM-dd"),
    time: "",
    tags: "",
  })

  useEffect(() => {
    if (user) {
      loadTasks()
    }
  }, [user])

  const loadTasks = async () => {
    if (!user) return

    setLoading(true)
    try {
      const { tasks, error } = await getTasks(user.uid)
      if (error) {
        console.error("Erro ao carregar tarefas:", error)
      } else {
        setTasks(tasks)
      }
    } catch (error) {
      console.error("Erro ao carregar tarefas:", error)
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    const taskDate = new Date(formData.date)
    const tags = formData.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag !== "")

    try {
      if (editingTask) {
        const { error } = await updateTask(editingTask.id, {
          title: formData.title,
          description: formData.description,
          date: taskDate,
          time: formData.time || undefined,
          tags,
        })
        if (!error) {
          await loadTasks()
        }
      } else {
        const { error } = await createTask({
          userId: user.uid,
          title: formData.title,
          description: formData.description,
          date: taskDate,
          time: formData.time || undefined,
          tags,
          completed: false,
        })
        if (!error) {
          await loadTasks()
        }
      }

      setIsDialogOpen(false)
      resetForm()
    } catch (error) {
      console.error("Erro ao salvar tarefa:", error)
    }
  }

  const handleEdit = (task: Task) => {
    setEditingTask(task)
    setFormData({
      title: task.title,
      description: task.description || "",
      date: format(task.date, "yyyy-MM-dd"),
      time: task.time || "",
      tags: task.tags.join(", "),
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir esta tarefa?")) {
      try {
        const { error } = await deleteTask(id)
        if (!error) {
          await loadTasks()
        }
      } catch (error) {
        console.error("Erro ao excluir tarefa:", error)
      }
    }
  }

  const toggleTaskComplete = async (task: Task) => {
    try {
      const { error } = await updateTask(task.id, {
        completed: !task.completed,
      })
      if (!error) {
        await loadTasks()
      }
    } catch (error) {
      console.error("Erro ao atualizar tarefa:", error)
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      date: format(new Date(), "yyyy-MM-dd"),
      time: "",
      tags: "",
    })
    setEditingTask(null)
  }

  const navigateDate = (direction: "prev" | "next") => {
    if (viewType === "monthly") {
      setCurrentDate(direction === "next" ? addMonths(currentDate, 1) : subMonths(currentDate, 1))
    } else if (viewType === "weekly") {
      setCurrentDate(direction === "next" ? addWeeks(currentDate, 1) : subWeeks(currentDate, 1))
    } else {
      setCurrentDate(direction === "next" ? addDays(currentDate, 1) : subDays(currentDate, 1))
    }
  }

  const getTasksForDate = (date: Date) => {
    return tasks.filter((task) => isSameDay(task.date, date))
  }

  const renderMonthlyView = () => {
    const monthStart = startOfMonth(currentDate)
    const monthEnd = endOfMonth(currentDate)
    const startDate = startOfWeek(monthStart)
    const endDate = endOfWeek(monthEnd)

    const days = []
    let day = startDate

    while (day <= endDate) {
      days.push(day)
      day = addDays(day, 1)
    }

    return (
      <div className="grid grid-cols-7 gap-1">
        {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((dayName) => (
          <div key={dayName} className="p-2 text-center text-sm font-medium text-gray-500">
            {dayName}
          </div>
        ))}
        {days.map((day, index) => {
          const dayTasks = getTasksForDate(day)
          const isCurrentMonth = isSameMonth(day, currentDate)
          const isCurrentDay = isToday(day)

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.01 }}
              className={`
                min-h-[100px] p-2 border rounded-lg cursor-pointer transition-colors
                ${isCurrentMonth ? "bg-white hover:bg-gray-50" : "bg-gray-50 text-gray-400"}
                ${isCurrentDay ? "ring-2 ring-primary" : ""}
              `}
              onClick={() => {
                setSelectedDate(day)
                setFormData({ ...formData, date: format(day, "yyyy-MM-dd") })
                setIsDialogOpen(true)
              }}
            >
              <div className={`text-sm font-medium mb-1 ${isCurrentDay ? "text-primary" : ""}`}>{format(day, "d")}</div>
              <div className="space-y-1">
                {dayTasks.slice(0, 2).map((task) => (
                  <div
                    key={task.id}
                    className={`text-xs p-1 rounded truncate ${
                      task.completed ? "bg-green-100 text-green-800 line-through" : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {task.time && `${formatTime(task.time)} `}
                    {task.title}
                  </div>
                ))}
                {dayTasks.length > 2 && <div className="text-xs text-gray-500">+{dayTasks.length - 2} mais</div>}
              </div>
            </motion.div>
          )
        })}
      </div>
    )
  }

  const renderWeeklyView = () => {
    const weekStart = startOfWeek(currentDate)
    const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

    return (
      <div className="grid grid-cols-7 gap-4">
        {days.map((day, index) => {
          const dayTasks = getTasksForDate(day)
          const isCurrentDay = isToday(day)

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={isCurrentDay ? "ring-2 ring-primary" : ""}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">{format(day, "EEE", { locale: ptBR })}</CardTitle>
                  <CardDescription className={isCurrentDay ? "text-primary font-medium" : ""}>
                    {format(day, "d MMM", { locale: ptBR })}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {dayTasks.map((task) => (
                    <div
                      key={task.id}
                      className={`p-2 rounded-md text-sm cursor-pointer hover:shadow-sm transition-shadow ${
                        task.completed ? "bg-green-50 text-green-800 line-through" : "bg-blue-50 text-blue-800"
                      }`}
                      onClick={() => handleEdit(task)}
                    >
                      <div className="font-medium truncate">{task.title}</div>
                      {task.time && <div className="text-xs opacity-75">{formatTime(task.time)}</div>}
                    </div>
                  ))}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      setSelectedDate(day)
                      setFormData({ ...formData, date: format(day, "yyyy-MM-dd") })
                      setIsDialogOpen(true)
                    }}
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Adicionar
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>
    )
  }

  const renderDailyView = () => {
    const dayTasks = getTasksForDate(currentDate).sort((a, b) => {
      if (a.time && b.time) return a.time.localeCompare(b.time)
      if (a.time) return -1
      if (b.time) return 1
      return 0
    })

    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>{format(currentDate, "EEEE, d 'de' MMMM", { locale: ptBR })}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {dayTasks.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">Nenhuma tarefa para hoje</p>
                <Button onClick={() => setIsDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Tarefa
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {dayTasks.map((task, index) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-4 rounded-lg border transition-all hover:shadow-md ${
                      task.completed ? "bg-green-50 border-green-200" : "bg-white border-gray-200"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={() => toggleTaskComplete(task)}
                            className="rounded border-gray-300 text-primary focus:ring-primary"
                          />
                          <h3 className={`font-medium ${task.completed ? "line-through text-gray-500" : ""}`}>
                            {task.title}
                          </h3>
                          {task.time && (
                            <Badge variant="outline" className="text-xs">
                              <Clock className="h-3 w-3 mr-1" />
                              {formatTime(task.time)}
                            </Badge>
                          )}
                        </div>
                        {task.description && (
                          <p className={`text-sm mb-2 ${task.completed ? "text-gray-400" : "text-gray-600"}`}>
                            {task.description}
                          </p>
                        )}
                        {task.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {task.tags.map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                <Tag className="h-3 w-3 mr-1" />
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <Button variant="outline" size="icon" onClick={() => handleEdit(task)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => handleDelete(task.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    )
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
          <h2 className="text-2xl font-bold text-gray-900">Planner</h2>
          <p className="text-gray-600">Organize sua rotina e compromissos</p>
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
              <Plus className="h-4 w-4 mr-2" />
              Nova Tarefa
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingTask ? "Editar Tarefa" : "Nova Tarefa"}</DialogTitle>
              <DialogDescription>Adicione uma nova tarefa ao seu planner</DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Ex: Reunião com cliente"
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
                  placeholder="Detalhes da tarefa..."
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Data</Label>
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time">Horário (opcional)</Label>
                  <Input id="time" name="time" type="time" value={formData.time} onChange={handleInputChange} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags (separadas por vírgula)</Label>
                <Input
                  id="tags"
                  name="tags"
                  placeholder="trabalho, pessoal, urgente"
                  value={formData.tags}
                  onChange={handleInputChange}
                />
              </div>

              <DialogFooter>
                <Button type="submit">{editingTask ? "Salvar Alterações" : "Criar Tarefa"}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* View Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" onClick={() => navigateDate("prev")}>
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <h3 className="text-lg font-semibold min-w-[200px] text-center">
            {viewType === "monthly" && format(currentDate, "MMMM yyyy", { locale: ptBR })}
            {viewType === "weekly" &&
              `${format(startOfWeek(currentDate), "d MMM", { locale: ptBR })} - ${format(endOfWeek(currentDate), "d MMM yyyy", { locale: ptBR })}`}
            {viewType === "daily" && format(currentDate, "d 'de' MMMM yyyy", { locale: ptBR })}
          </h3>

          <Button variant="outline" size="icon" onClick={() => navigateDate("next")}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <Select value={viewType} onValueChange={(value: ViewType) => setViewType(value)}>
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="monthly">Mensal</SelectItem>
            <SelectItem value="weekly">Semanal</SelectItem>
            <SelectItem value="daily">Diário</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Calendar Views */}
      <motion.div
        key={viewType}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {viewType === "monthly" && renderMonthlyView()}
        {viewType === "weekly" && renderWeeklyView()}
        {viewType === "daily" && renderDailyView()}
      </motion.div>
    </div>
  )
}

export default PlannerTab
