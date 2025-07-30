import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
} from "firebase/firestore"
import { db } from "@/lib/firebase"
import type { StepByStep, Task } from "@/types"

// Step by Step operations
export const createStepByStep = async (stepByStep: Omit<StepByStep, "id" | "createdAt" | "updatedAt">) => {
  try {
    const docRef = await addDoc(collection(db, "stepBySteps"), {
      ...stepByStep,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    })
    return { id: docRef.id, error: null }
  } catch (error: any) {
    return { id: null, error: error.message }
  }
}

export const getStepBySteps = async (userId: string) => {
  try {
    const q = query(collection(db, "stepBySteps"), where("userId", "==", userId), orderBy("createdAt", "desc"))
    const querySnapshot = await getDocs(q)
    const stepBySteps: StepByStep[] = []

    querySnapshot.forEach((doc) => {
      const data = doc.data()
      stepBySteps.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
      } as StepByStep)
    })

    return { stepBySteps, error: null }
  } catch (error: any) {
    return { stepBySteps: [], error: error.message }
  }
}

export const updateStepByStep = async (id: string, updates: Partial<StepByStep>) => {
  try {
    const docRef = doc(db, "stepBySteps", id)
    await updateDoc(docRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    })
    return { error: null }
  } catch (error: any) {
    return { error: error.message }
  }
}

export const deleteStepByStep = async (id: string) => {
  try {
    await deleteDoc(doc(db, "stepBySteps", id))
    return { error: null }
  } catch (error: any) {
    return { error: error.message }
  }
}

// Task operations
export const createTask = async (task: Omit<Task, "id" | "createdAt" | "updatedAt">) => {
  try {
    const docRef = await addDoc(collection(db, "tasks"), {
      ...task,
      date: Timestamp.fromDate(task.date),
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    })
    return { id: docRef.id, error: null }
  } catch (error: any) {
    return { id: null, error: error.message }
  }
}

export const getTasks = async (userId: string) => {
  try {
    const q = query(collection(db, "tasks"), where("userId", "==", userId), orderBy("date", "asc"))
    const querySnapshot = await getDocs(q)
    const tasks: Task[] = []

    querySnapshot.forEach((doc) => {
      const data = doc.data()
      tasks.push({
        id: doc.id,
        ...data,
        date: data.date.toDate(),
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
      } as Task)
    })

    return { tasks, error: null }
  } catch (error: any) {
    return { tasks: [], error: error.message }
  }
}

export const updateTask = async (id: string, updates: Partial<Task>) => {
  try {
    const docRef = doc(db, "tasks", id)
    const updateData: any = {
      ...updates,
      updatedAt: Timestamp.now(),
    }

    if (updates.date) {
      updateData.date = Timestamp.fromDate(updates.date)
    }

    await updateDoc(docRef, updateData)
    return { error: null }
  } catch (error: any) {
    return { error: error.message }
  }
}

export const deleteTask = async (id: string) => {
  try {
    await deleteDoc(doc(db, "tasks", id))
    return { error: null }
  } catch (error: any) {
    return { error: error.message }
  }
}
