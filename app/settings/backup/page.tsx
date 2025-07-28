"use client"

import type React from "react"

import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { useResponsiveScale } from "@/hooks/useResponsiveScale"
import { Download, Upload, RefreshCw, AlertCircle, CheckCircle, FileText, Calendar } from "lucide-react"
import { useCalendarSettings } from "@/context/CalendarSettingsContext"
import { useHolidays } from "@/context/HolidayContext"

interface BackupData {
  version: string
  timestamp: string
  currentSemester: any
  holidays: any[]
  metadata: {
    totalHolidays: number
    semesterInfo: string
    exportDate: string
  }
}

export default function BackupPage() {
  const router = useRouter()
  const scale = useResponsiveScale(1408)
  const { currentSemester, setCurrentSemester } = useCalendarSettings()
  const { holidays, addHoliday, deleteHoliday } = useHolidays()

  const [isExporting, setIsExporting] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [lastBackupTime, setLastBackupTime] = useState<string | null>(null)
  const [importStatus, setImportStatus] = useState<{
    type: "success" | "error" | "info" | null
    message: string
  }>({ type: null, message: "" })

  // 在客户端加载时获取备份时间
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedBackupTime = localStorage.getItem("lastBackupTime")
      setLastBackupTime(savedBackupTime)
    }
  }, [])

  // 导出数据
  const handleExportData = async () => {
    setIsExporting(true)
    try {
      const backupData: BackupData = {
        version: "1.0.0",
        timestamp: new Date().toISOString(),
        currentSemester,
        holidays,
        metadata: {
          totalHolidays: holidays.length,
          semesterInfo: currentSemester.name,
          exportDate: new Date().toLocaleDateString("zh-CN"),
        },
      }

      const dataStr = JSON.stringify(backupData, null, 2)
      const dataBlob = new Blob([dataStr], { type: "application/json" })

      const link = document.createElement("a")
      link.href = URL.createObjectURL(dataBlob)
      link.download = `calendar-backup-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      const now = new Date().toLocaleString("zh-CN")
      setLastBackupTime(now)
      if (typeof window !== "undefined") {
        localStorage.setItem("lastBackupTime", now)
      }

      setImportStatus({
        type: "success",
        message: "数据导出成功！备份文件已下载到您的设备。",
      })
    } catch (error) {
      setImportStatus({
        type: "error",
        message: "导出失败，请重试。",
      })
    } finally {
      setIsExporting(false)
    }
  }

  // 导入数据
  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsImporting(true)
    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        const backupData: BackupData = JSON.parse(content)

        // 验证数据格式
        if (!backupData.version || !backupData.currentSemester || !Array.isArray(backupData.holidays)) {
          throw new Error("备份文件格式不正确")
        }

        // 确认导入
        const confirmMessage = `确定要导入以下数据吗？\n\n学期：${backupData.currentSemester.name}\n假期数量：${backupData.holidays.length}个\n备份时间：${new Date(backupData.timestamp).toLocaleString("zh-CN")}\n\n注意：这将覆盖当前的所有设置！`

        if (confirm(confirmMessage)) {
          // 清除现有假期
          holidays.forEach((holiday) => {
            if (holiday.type !== "national") {
              deleteHoliday(holiday.id)
            }
          })

          // 导入新假期（跳过国家法定假日，因为它们是预设的）
          backupData.holidays.forEach((holiday) => {
            if (holiday.type !== "national") {
              addHoliday({
                name: holiday.name,
                startDate: holiday.startDate,
                endDate: holiday.endDate,
                type: holiday.type,
                description: holiday.description,
              })
            }
          })

          // 导入学期设置
          setCurrentSemester(backupData.currentSemester)

          setImportStatus({
            type: "success",
            message: "数据导入成功！您的设置已恢复。",
          })
        } else {
          setImportStatus({
            type: "info",
            message: "导入已取消。",
          })
        }
      } catch (error) {
        setImportStatus({
          type: "error",
          message: "导入失败，请检查文件格式是否正确。",
        })
      } finally {
        setIsImporting(false)
        // 清除文件选择
        event.target.value = ""
      }
    }

    reader.readAsText(file)
  }

  // 重置所有数据
  const handleResetData = () => {
    const confirmMessage =
      "确定要重置所有数据吗？\n\n这将：\n• 删除所有自定义假期\n• 重置学期设置为默认值\n• 清除备份记录\n\n此操作不可撤销！"

    if (confirm(confirmMessage)) {
      // 删除所有非国家法定假期
      holidays.forEach((holiday) => {
        if (holiday.type !== "national") {
          deleteHoliday(holiday.id)
        }
      })

      // 重置学期为当前默认学期
      // 这里可以调用 getCurrentSemester() 来获取默认学期

      // 清除备份记录
      if (typeof window !== "undefined") {
        localStorage.removeItem("lastBackupTime")
      }
      setLastBackupTime(null)

      setImportStatus({
        type: "success",
        message: "所有数据已重置为默认设置。",
      })
    }
  }

  const getStatusIcon = () => {
    switch (importStatus.type) {
      case "success":
        return <CheckCircle size={32} color="#10b981" />
      case "error":
        return <AlertCircle size={32} color="#ef4444" />
      case "info":
        return <AlertCircle size={32} color="#3b82f6" />
      default:
        return null
    }
  }

  const getStatusColor = () => {
    switch (importStatus.type) {
      case "success":
        return "#10b981"
      case "error":
        return "#ef4444"
      case "info":
        return "#3b82f6"
      default:
        return "#666"
    }
  }

  return (
    <div
      style={{
        backgroundColor: "#f0f2f5",
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        overflowX: "hidden",
        overflowY: "auto",
      }}
    >
      <div
        style={{
          width: "1408px",
          transform: `scale(${scale})`,
          transformOrigin: "top center",
          fontFamily: '"Microsoft YaHei", sans-serif',
          height: "auto",
          position: "relative",
        }}
      >
        {/* Header */}
        <header
          style={{
            background: "#1e39de",
            height: "150px",
            boxShadow: "4px 4px 10px rgba(30,57,222,1)",
            display: "flex",
            alignItems: "center",
            padding: "0 60px",
            position: "relative",
          }}
        >
          <button
            onClick={() => router.back()}
            style={{
              width: "80px",
              height: "80px",
              background: "rgba(255,255,255,0.2)",
              borderRadius: "50%",
              border: "2px solid rgba(255,255,255,0.3)",
              color: "#fff",
              fontSize: "32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            ←
          </button>

          <h1
            style={{
              color: "#fff",
              fontSize: "64px",
              fontWeight: 400,
              margin: "0 auto",
            }}
          >
            数据备份
          </h1>

          <div style={{ width: "80px", height: "80px" }} />
        </header>

        {/* Content */}
        <main
          style={{
            width: "1408px",
            minHeight: "calc(100vh - 150px)",
            background: "rgba(230,230,230,0.2)",
            padding: "40px 60px",
          }}
        >
          {/* Status Message */}
          {importStatus.type && (
            <div
              style={{
                background: "#fff",
                borderRadius: "25px",
                padding: "30px 40px",
                marginBottom: "30px",
                display: "flex",
                alignItems: "center",
                gap: "20px",
                boxShadow: "0px 4px 10px rgba(0,0,0,0.05)",
                border: `2px solid ${getStatusColor()}`,
              }}
            >
              {getStatusIcon()}
              <span
                style={{
                  fontSize: "32px",
                  color: getStatusColor(),
                  fontWeight: 500,
                }}
              >
                {importStatus.message}
              </span>
              <button
                onClick={() => setImportStatus({ type: null, message: "" })}
                style={{
                  marginLeft: "auto",
                  background: "none",
                  border: "none",
                  fontSize: "24px",
                  color: "#999",
                  cursor: "pointer",
                }}
              >
                ✕
              </button>
            </div>
          )}

          {/* Current Data Info */}
          <div
            style={{
              background: "#fff",
              borderRadius: "25px",
              boxShadow: "0px 4px 10px rgba(0,0,0,0.05)",
              padding: "40px",
              marginBottom: "30px",
            }}
          >
            <h2
              style={{
                fontSize: "48px",
                fontWeight: 600,
                color: "#000",
                marginBottom: "30px",
                display: "flex",
                alignItems: "center",
                gap: "15px",
              }}
            >
              <FileText size={48} color="#1e39de" />
              当前数据概览
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "30px",
              }}
            >
              <div
                style={{
                  background: "#f8f9fa",
                  borderRadius: "20px",
                  padding: "30px",
                  display: "flex",
                  alignItems: "center",
                  gap: "20px",
                }}
              >
                <Calendar size={40} color="#1e39de" />
                <div>
                  <div
                    style={{
                      fontSize: "28px",
                      color: "#666",
                      marginBottom: "5px",
                    }}
                  >
                    当前学期
                  </div>
                  <div
                    style={{
                      fontSize: "36px",
                      fontWeight: 600,
                      color: "#000",
                    }}
                  >
                    {currentSemester.name}
                  </div>
                </div>
              </div>

              <div
                style={{
                  background: "#f8f9fa",
                  borderRadius: "20px",
                  padding: "30px",
                  display: "flex",
                  alignItems: "center",
                  gap: "20px",
                }}
              >
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    background: "#10b981",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontSize: "20px",
                    fontWeight: 600,
                  }}
                >
                  {holidays.filter((h) => h.type !== "national").length}
                </div>
                <div>
                  <div
                    style={{
                      fontSize: "28px",
                      color: "#666",
                      marginBottom: "5px",
                    }}
                  >
                    自定义假期
                  </div>
                  <div
                    style={{
                      fontSize: "36px",
                      fontWeight: 600,
                      color: "#000",
                    }}
                  >
                    {holidays.filter((h) => h.type !== "national").length} 个
                  </div>
                </div>
              </div>
            </div>

            {lastBackupTime && (
              <div
                style={{
                  marginTop: "30px",
                  padding: "20px",
                  background: "#e0f2fe",
                  borderRadius: "15px",
                  fontSize: "28px",
                  color: "#0369a1",
                }}
              >
                上次备份时间：{lastBackupTime}
              </div>
            )}
          </div>

          {/* Backup Actions */}
          <div
            style={{
              background: "#fff",
              borderRadius: "25px",
              boxShadow: "0px 4px 10px rgba(0,0,0,0.05)",
              padding: "40px",
              marginBottom: "30px",
            }}
          >
            <h2
              style={{
                fontSize: "48px",
                fontWeight: 600,
                color: "#000",
                marginBottom: "30px",
              }}
            >
              备份操作
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "30px",
              }}
            >
              {/* Export Button */}
              <button
                onClick={handleExportData}
                disabled={isExporting}
                style={{
                  background: isExporting ? "#94a3b8" : "#10b981",
                  borderRadius: "20px",
                  border: "none",
                  padding: "40px",
                  cursor: isExporting ? "not-allowed" : "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "15px",
                  transition: "all 0.3s ease",
                }}
              >
                {isExporting ? (
                  <RefreshCw size={48} color="#fff" className="animate-spin" />
                ) : (
                  <Download size={48} color="#fff" />
                )}
                <div
                  style={{
                    fontSize: "36px",
                    fontWeight: 600,
                    color: "#fff",
                  }}
                >
                  {isExporting ? "导出中..." : "导出数据"}
                </div>
                <div
                  style={{
                    fontSize: "24px",
                    color: "rgba(255,255,255,0.8)",
                    textAlign: "center",
                    lineHeight: "1.4",
                  }}
                >
                  将当前设置和假期数据
                  <br />
                  导出为备份文件
                </div>
              </button>

              {/* Import Button */}
              <label
                style={{
                  background: isImporting ? "#94a3b8" : "#3b82f6",
                  borderRadius: "20px",
                  padding: "40px",
                  cursor: isImporting ? "not-allowed" : "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "15px",
                  transition: "all 0.3s ease",
                }}
              >
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportData}
                  disabled={isImporting}
                  style={{ display: "none" }}
                />
                {isImporting ? (
                  <RefreshCw size={48} color="#fff" className="animate-spin" />
                ) : (
                  <Upload size={48} color="#fff" />
                )}
                <div
                  style={{
                    fontSize: "36px",
                    fontWeight: 600,
                    color: "#fff",
                  }}
                >
                  {isImporting ? "导入中..." : "导入数据"}
                </div>
                <div
                  style={{
                    fontSize: "24px",
                    color: "rgba(255,255,255,0.8)",
                    textAlign: "center",
                    lineHeight: "1.4",
                  }}
                >
                  从备份文件恢复
                  <br />
                  设置和假期数据
                </div>
              </label>
            </div>
          </div>

          {/* Advanced Options */}
          <div
            style={{
              background: "#fff",
              borderRadius: "25px",
              boxShadow: "0px 4px 10px rgba(0,0,0,0.05)",
              padding: "40px",
            }}
          >
            <h2
              style={{
                fontSize: "48px",
                fontWeight: 600,
                color: "#000",
                marginBottom: "30px",
              }}
            >
              高级选项
            </h2>

            <button
              onClick={handleResetData}
              style={{
                background: "#ef4444",
                borderRadius: "20px",
                border: "none",
                padding: "30px 40px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "20px",
                width: "100%",
                transition: "all 0.3s ease",
              }}
            >
              <RefreshCw size={40} color="#fff" />
              <div>
                <div
                  style={{
                    fontSize: "36px",
                    fontWeight: 600,
                    color: "#fff",
                    textAlign: "left",
                  }}
                >
                  重置所有数据
                </div>
                <div
                  style={{
                    fontSize: "24px",
                    color: "rgba(255,255,255,0.8)",
                    textAlign: "left",
                    marginTop: "5px",
                  }}
                >
                  清除所有自定义设置，恢复到初始状态
                </div>
              </div>
            </button>

            <div
              style={{
                marginTop: "20px",
                padding: "20px",
                background: "#fef3c7",
                borderRadius: "15px",
                display: "flex",
                alignItems: "center",
                gap: "15px",
              }}
            >
              <AlertCircle size={32} color="#d97706" />
              <div
                style={{
                  fontSize: "24px",
                  color: "#92400e",
                  lineHeight: "1.4",
                }}
              >
                <strong>注意：</strong>重置操作将永久删除所有自定义数据，包括假期设置和学期配置。
                建议在重置前先导出备份。
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
