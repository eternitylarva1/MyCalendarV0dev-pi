"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import type { Holiday } from "@/types/calendar"

interface HolidayContextType {
  holidays: Holiday[]
  addHoliday: (holiday: Omit<Holiday, "id">) => void
  updateHoliday: (id: string, holiday: Partial<Holiday>) => void
  deleteHoliday: (id: string) => void
  getHolidaysForDate: (date: Date) => Holiday[]
  isHoliday: (date: Date) => boolean
}

// 预设的国家法定假日
const DEFAULT_HOLIDAYS: Holiday[] = [
  {
    id: "new-year-2025",
    name: "元旦",
    startDate: "2025-01-01",
    endDate: "2025-01-01",
    type: "national",
    description: "国家法定假日",
  },
  {
    id: "spring-festival-2025",
    name: "春节",
    startDate: "2025-01-28",
    endDate: "2025-02-03",
    type: "national",
    description: "国家法定假日",
  },
  {
    id: "qingming-2025",
    name: "清明节",
    startDate: "2025-04-05",
    endDate: "2025-04-07",
    type: "national",
    description: "国家法定假日",
  },
  {
    id: "labor-day-2025",
    name: "劳动节",
    startDate: "2025-05-01",
    endDate: "2025-05-05",
    type: "national",
    description: "国家法定假日",
  },
  {
    id: "dragon-boat-2025",
    name: "端午节",
    startDate: "2025-05-31",
    endDate: "2025-06-02",
    type: "national",
    description: "国家法定假日",
  },
  {
    id: "national-day-2025",
    name: "国庆节",
    startDate: "2025-10-01",
    endDate: "2025-10-07",
    type: "national",
    description: "国家法定假日",
  },
]

const HolidayContext = createContext<HolidayContextType | undefined>(undefined)

export function HolidayProvider({ children }: { children: ReactNode }) {
  const [holidays, setHolidays] = useState<Holiday[]>(DEFAULT_HOLIDAYS)

  const addHoliday = (holiday: Omit<Holiday, "id">) => {
    const newHoliday: Holiday = {
      ...holiday,
      id: `holiday-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    }
    setHolidays((prev) => [...prev, newHoliday])
  }

  const updateHoliday = (id: string, updatedHoliday: Partial<Holiday>) => {
    setHolidays((prev) => prev.map((h) => (h.id === id ? { ...h, ...updatedHoliday } : h)))
  }

  const deleteHoliday = (id: string) => {
    setHolidays((prev) => prev.filter((h) => h.id !== id))
  }

  const getHolidaysForDate = (date: Date): Holiday[] => {
    const dateStr = date.toISOString().split("T")[0]
    return holidays.filter((holiday) => {
      return dateStr >= holiday.startDate && dateStr <= holiday.endDate
    })
  }

  const isHoliday = (date: Date): boolean => {
    return getHolidaysForDate(date).length > 0
  }

  const contextValue = {
    holidays,
    addHoliday,
    updateHoliday,
    deleteHoliday,
    getHolidaysForDate,
    isHoliday,
  }

  return <HolidayContext.Provider value={contextValue}>{children}</HolidayContext.Provider>
}

export function useHolidays() {
  const context = useContext(HolidayContext)
  if (context === undefined) {
    throw new Error("useHolidays must be used within a HolidayProvider")
  }
  return context
}
