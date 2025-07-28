"use client"

import { useResponsiveScale } from "@/hooks/useResponsiveScale"
import { useHolidays } from "@/context/HolidayContext"
import type { DayData } from "@/types/calendar"

interface DayCellProps {
  day: DayData
  isMonthView?: boolean
}

export function DayCell({ day, isMonthView = false }: DayCellProps) {
  const scale = useResponsiveScale(1408)
  const { isHoliday } = useHolidays()

  // 检查是否是节假日
  const isHolidayDate = isHoliday(day.fullDate)

  const cellStyle = {
    width: isMonthView ? "201px" : "100%",
    height: isMonthView ? "201px" : "140px",
    border: isMonthView ? "1px solid #e5e7eb" : "none",
    borderTop: isMonthView ? "1px solid #e5e7eb" : "none",
    borderLeft: isMonthView ? "1px solid #e5e7eb" : "none",
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "flex-start",
    justifyContent: "flex-start",
    padding: isMonthView ? "10px" : "20px 0",
    backgroundColor: day.isToday ? "#4f6ff1" : day.isInactive ? "#f9fafb" : "#ffffff",
    color: day.isToday ? "#ffffff" : day.isInactive ? "#9ca3af" : "#000000",
    position: "relative" as const,
    overflow: "hidden",
  }

  const dateStyle = {
    fontSize: isMonthView ? "72px" : "48px",
    fontWeight: day.isToday ? 700 : 400,
    lineHeight: 1,
    marginBottom: isMonthView ? "8px" : "4px",
  }

  const lunarStyle = {
    fontSize: isMonthView ? "24px" : "20px",
    fontWeight: 300,
    opacity: day.isInactive ? 0.5 : 0.7,
    lineHeight: 1,
  }

  return (
    <div style={cellStyle}>
      <div style={dateStyle}>{day.date}</div>
      {day.lunarDate && <div style={lunarStyle}>{day.lunarDate}</div>}

      {/* 节假日标识 - 仅在月视图显示 */}
      {isMonthView && isHolidayDate && (
        <div
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            fontSize: "36px",
            fontWeight: 500,
            color: day.isToday ? "#ffffff" : "#ff4444",
            zIndex: 10,
            lineHeight: 1,
          }}
        >
          休
        </div>
      )}
    </div>
  )
}
