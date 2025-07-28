"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { useResponsiveScale } from "@/hooks/useResponsiveScale"
import { Plus, Trash2, Edit3 } from "lucide-react"
import { useHolidays } from "@/context/HolidayContext"
import type { Holiday } from "@/types/calendar"
import { MonthSelectorModal } from "@/components/MonthSelectorModal"

export default function HolidaysPage() {
  const router = useRouter()
  const scale = useResponsiveScale(1408)
  const { holidays, addHoliday, updateHoliday, deleteHoliday } = useHolidays()

  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showStartDateModal, setShowStartDateModal] = useState(false)
  const [showEndDateModal, setShowEndDateModal] = useState(false)
  const [editingHoliday, setEditingHoliday] = useState<Holiday | null>(null)
  const [isSelectingStartDate, setIsSelectingStartDate] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    startDate: "",
    endDate: "",
    type: "school" as Holiday["type"],
    description: "",
  })

  const resetForm = () => {
    setFormData({
      name: "",
      startDate: "",
      endDate: "",
      type: "school",
      description: "",
    })
  }

  const handleAddHoliday = () => {
    resetForm()
    const today = new Date()
    const todayStr = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, "0")}-${today.getDate().toString().padStart(2, "0")}`
    setFormData((prev) => ({
      ...prev,
      startDate: todayStr,
      endDate: todayStr,
    }))
    setShowAddModal(true)
  }

  const handleEditHoliday = (holiday: Holiday) => {
    setEditingHoliday(holiday)
    setFormData({
      name: holiday.name,
      startDate: holiday.startDate,
      endDate: holiday.endDate,
      type: holiday.type,
      description: holiday.description || "",
    })
    setShowEditModal(true)
  }

  const handleDeleteHoliday = (id: string) => {
    if (confirm("确定要删除这个假期吗？")) {
      deleteHoliday(id)
    }
  }

  const handleSaveHoliday = () => {
    if (!formData.name || !formData.startDate || !formData.endDate) {
      alert("请填写完整信息")
      return
    }

    if (formData.startDate > formData.endDate) {
      alert("开始日期不能晚于结束日期")
      return
    }

    if (editingHoliday) {
      updateHoliday(editingHoliday.id, formData)
      setShowEditModal(false)
      setEditingHoliday(null)
    } else {
      addHoliday(formData)
      setShowAddModal(false)
    }
    resetForm()
  }

  const handleDateSelect = (year: number, month: number, day: number) => {
    const dateStr = `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`

    if (isSelectingStartDate) {
      setFormData((prev) => ({ ...prev, startDate: dateStr }))
      setShowStartDateModal(false)
    } else {
      setFormData((prev) => ({ ...prev, endDate: dateStr }))
      setShowEndDateModal(false)
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + "T00:00:00")
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
  }

  const getTypeLabel = (type: Holiday["type"]) => {
    switch (type) {
      case "national":
        return "国家法定"
      case "school":
        return "学校假期"
      case "custom":
        return "自定义"
      default:
        return "未知"
    }
  }

  const getTypeColor = (type: Holiday["type"]) => {
    switch (type) {
      case "national":
        return "#ff4757"
      case "school":
        return "#3742fa"
      case "custom":
        return "#2ed573"
      default:
        return "#747d8c"
    }
  }

  // 按类型分组假期
  const groupedHolidays = holidays.reduce(
    (groups, holiday) => {
      if (!groups[holiday.type]) {
        groups[holiday.type] = []
      }
      groups[holiday.type].push(holiday)
      return groups
    },
    {} as Record<Holiday["type"], Holiday[]>,
  )

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
            假期设置
          </h1>

          <button
            onClick={handleAddHoliday}
            style={{
              width: "80px",
              height: "80px",
              background: "rgba(255,255,255,0.2)",
              borderRadius: "50%",
              border: "2px solid rgba(255,255,255,0.3)",
              color: "#fff",
              fontSize: "24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <Plus size={32} />
          </button>
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
          {/* Holiday Groups */}
          {Object.entries(groupedHolidays).map(([type, holidayList]) => (
            <div key={type} style={{ marginBottom: "40px" }}>
              <h2
                style={{
                  fontSize: "48px",
                  fontWeight: 600,
                  color: "#000",
                  marginBottom: "20px",
                  display: "flex",
                  alignItems: "center",
                  gap: "15px",
                }}
              >
                <span
                  style={{
                    width: "8px",
                    height: "48px",
                    background: getTypeColor(type as Holiday["type"]),
                    borderRadius: "4px",
                  }}
                />
                {getTypeLabel(type as Holiday["type"])}假期
              </h2>

              <div
                style={{
                  background: "#fff",
                  borderRadius: "25px",
                  boxShadow: "0px 4px 10px rgba(0,0,0,0.05)",
                  overflow: "hidden",
                }}
              >
                {holidayList.map((holiday, index) => (
                  <div
                    key={holiday.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "30px 40px",
                      borderBottom: index === holidayList.length - 1 ? "none" : "1px solid #e5e7eb",
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontSize: "42px",
                          fontWeight: 600,
                          color: "#000",
                          marginBottom: "8px",
                        }}
                      >
                        {holiday.name}
                      </div>
                      <div
                        style={{
                          fontSize: "32px",
                          color: "#666",
                          marginBottom: "4px",
                        }}
                      >
                        {formatDate(holiday.startDate)} - {formatDate(holiday.endDate)}
                      </div>
                      {holiday.description && (
                        <div
                          style={{
                            fontSize: "28px",
                            color: "#999",
                          }}
                        >
                          {holiday.description}
                        </div>
                      )}
                    </div>

                    {holiday.type !== "national" && (
                      <div style={{ display: "flex", gap: "15px" }}>
                        <button
                          onClick={() => handleEditHoliday(holiday)}
                          style={{
                            width: "60px",
                            height: "60px",
                            background: "#3742fa",
                            borderRadius: "15px",
                            border: "none",
                            color: "#fff",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Edit3 size={24} />
                        </button>
                        <button
                          onClick={() => handleDeleteHoliday(holiday.id)}
                          style={{
                            width: "60px",
                            height: "60px",
                            background: "#ff4757",
                            borderRadius: "15px",
                            border: "none",
                            color: "#fff",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Trash2 size={24} />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </main>
      </div>

      {/* Add/Edit Holiday Modal - 安卓风格全屏模态框 */}
      {(showAddModal || showEditModal) && (
        <>
          {/* 背景遮罩 */}
          <div
            className="fixed inset-0 z-[9998] bg-black/30 backdrop-blur-sm"
            onClick={() => {
              setShowAddModal(false)
              setShowEditModal(false)
              setEditingHoliday(null)
              resetForm()
            }}
          />

          {/* 模态框内容 - 参考 MonthSelectorModal 的风格 */}
          <div
            className="fixed left-0 z-[10000]"
            style={{
              top: "200px",
              background: "white",
              width: "100vw",
              height: "500px",
              overflow: "hidden",
              fontFamily: '"Microsoft YaHei", sans-serif',
              boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
            }}
          >
            {/* 顶部操作栏 - 参考 MonthSelectorModal 的样式 */}
            <div
              className="flex items-center justify-between"
              style={{
                height: "70px",
                padding: "0 40px",
                borderBottom: "1px solid #e5e7eb",
              }}
            >
              <button
                onClick={() => {
                  setShowAddModal(false)
                  setShowEditModal(false)
                  setEditingHoliday(null)
                  resetForm()
                }}
                style={{
                  fontSize: "24px",
                  fontWeight: 400,
                  color: "#000000",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                取消
              </button>
              <div
                style={{
                  fontSize: "28px",
                  fontWeight: 600,
                  color: "#000000",
                }}
              >
                {editingHoliday ? "编辑假期" : "添加假期"}
              </div>
              <button
                onClick={handleSaveHoliday}
                style={{
                  fontSize: "24px",
                  fontWeight: 600,
                  color: "#4f6ff1",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                {editingHoliday ? "保存" : "添加"}
              </button>
            </div>

            {/* 表单内容区域 - 可滚动 */}
            <div
              className="overflow-y-auto hide-scrollbar"
              style={{
                height: "calc(100% - 70px)",
                padding: "0",
              }}
            >
              {/* 假期名称 */}
              <div
                style={{
                  padding: "25px 40px",
                  borderBottom: "1px solid #f0f0f0",
                }}
              >
                <div
                  style={{
                    fontSize: "20px",
                    fontWeight: 500,
                    color: "#333",
                    marginBottom: "10px",
                  }}
                >
                  假期名称
                </div>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="请输入假期名称"
                  style={{
                    width: "100%",
                    padding: "15px 0",
                    fontSize: "24px",
                    border: "none",
                    outline: "none",
                    background: "transparent",
                    color: "#000",
                  }}
                />
              </div>

              {/* 开始日期 */}
              <div
                style={{
                  padding: "25px 40px",
                  borderBottom: "1px solid #f0f0f0",
                }}
              >
                <div
                  style={{
                    fontSize: "20px",
                    fontWeight: 500,
                    color: "#333",
                    marginBottom: "10px",
                  }}
                >
                  开始日期
                </div>
                <button
                  onClick={() => {
                    setIsSelectingStartDate(true)
                    setShowStartDateModal(true)
                  }}
                  style={{
                    width: "100%",
                    padding: "15px 0",
                    fontSize: "24px",
                    border: "none",
                    outline: "none",
                    background: "transparent",
                    color: formData.startDate ? "#000" : "#999",
                    textAlign: "left",
                    cursor: "pointer",
                  }}
                >
                  {formData.startDate ? formatDate(formData.startDate) : "选择开始日期"}
                </button>
              </div>

              {/* 结束日期 */}
              <div
                style={{
                  padding: "25px 40px",
                  borderBottom: "1px solid #f0f0f0",
                }}
              >
                <div
                  style={{
                    fontSize: "20px",
                    fontWeight: 500,
                    color: "#333",
                    marginBottom: "10px",
                  }}
                >
                  结束日期
                </div>
                <button
                  onClick={() => {
                    setIsSelectingStartDate(false)
                    setShowEndDateModal(true)
                  }}
                  style={{
                    width: "100%",
                    padding: "15px 0",
                    fontSize: "24px",
                    border: "none",
                    outline: "none",
                    background: "transparent",
                    color: formData.endDate ? "#000" : "#999",
                    textAlign: "left",
                    cursor: "pointer",
                  }}
                >
                  {formData.endDate ? formatDate(formData.endDate) : "选择结束日期"}
                </button>
              </div>

              {/* 假期类型 */}
              <div
                style={{
                  padding: "25px 40px",
                  borderBottom: "1px solid #f0f0f0",
                }}
              >
                <div
                  style={{
                    fontSize: "20px",
                    fontWeight: 500,
                    color: "#333",
                    marginBottom: "10px",
                  }}
                >
                  假期类型
                </div>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData((prev) => ({ ...prev, type: e.target.value as Holiday["type"] }))}
                  style={{
                    width: "100%",
                    padding: "15px 0",
                    fontSize: "24px",
                    border: "none",
                    outline: "none",
                    background: "transparent",
                    color: "#000",
                  }}
                >
                  <option value="school">学校假期</option>
                  <option value="custom">自定义</option>
                </select>
              </div>

              {/* 备注说明 */}
              <div
                style={{
                  padding: "25px 40px",
                }}
              >
                <div
                  style={{
                    fontSize: "20px",
                    fontWeight: 500,
                    color: "#333",
                    marginBottom: "10px",
                  }}
                >
                  备注说明
                </div>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="请输入备注说明（可选）"
                  style={{
                    width: "100%",
                    padding: "15px 0",
                    fontSize: "24px",
                    border: "none",
                    outline: "none",
                    background: "transparent",
                    color: "#000",
                    minHeight: "80px",
                    resize: "none",
                  }}
                />
              </div>
            </div>
          </div>
        </>
      )}

      {/* Date Selector Modals */}
      <MonthSelectorModal
        isOpen={showStartDateModal}
        currentYear={
          formData.startDate ? new Date(formData.startDate + "T00:00:00").getFullYear() : new Date().getFullYear()
        }
        currentMonth={
          formData.startDate ? new Date(formData.startDate + "T00:00:00").getMonth() + 1 : new Date().getMonth() + 1
        }
        currentDay={formData.startDate ? new Date(formData.startDate + "T00:00:00").getDate() : new Date().getDate()}
        isFromSettings={true}
        onMonthSelect={handleDateSelect}
        onClose={() => setShowStartDateModal(false)}
      />

      <MonthSelectorModal
        isOpen={showEndDateModal}
        currentYear={
          formData.endDate ? new Date(formData.endDate + "T00:00:00").getFullYear() : new Date().getFullYear()
        }
        currentMonth={
          formData.endDate ? new Date(formData.endDate + "T00:00:00").getMonth() + 1 : new Date().getMonth() + 1
        }
        currentDay={formData.endDate ? new Date(formData.endDate + "T00:00:00").getDate() : new Date().getDate()}
        isFromSettings={true}
        onMonthSelect={handleDateSelect}
        onClose={() => setShowEndDateModal(false)}
      />
    </div>
  )
}
