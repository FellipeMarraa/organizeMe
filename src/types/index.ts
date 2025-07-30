export interface User {
  uid: string
  email: string
  displayName?: string
  photoURL?: string
}

export interface StepByStep {
  id: string
  userId: string
  title: string
  description: string
  steps: string[]
  createdAt: Date
  updatedAt: Date
}

export interface Task {
  id: string
  userId: string
  title: string
  description?: string
  date: Date
  time?: string
  tags: string[]
  completed: boolean
  createdAt: Date
  updatedAt: Date
}

export interface PlannerView {
  MONTHLY: "monthly"
  WEEKLY: "weekly"
  DAILY: "daily"
}

export type ViewType = "monthly" | "weekly" | "daily"
