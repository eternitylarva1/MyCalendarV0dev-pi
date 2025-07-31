"use client"

import { useState } from "react"
import { ArrowLeft, Plus, Edit, Trash2, X, Check } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useHolidays } from "@/context/HolidayContext"
import type { Holiday } from "@/types/calendar"

export default function HolidaysPage() {
  const router = useRouter()
  const { holidays, addHoliday, updateHoliday, deleteHoliday } = useHolidays()
  const [showModal, setShowModal] = useState(false)
  const [editingHoliday, setEditingHoliday] = useState<Holiday | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    startDate: "",
    endDate: "",
    type: "custom" as const,
    description: "",
  })

  // 只显示自定义假期
  const customHolidays = holidays.filter((h) => h.type === "custom")

  const handleAddHoliday = () => {
    setEditingHoliday(null)
    setFormData({
      name: "",
      startDate: "",
      endDate: "",
      type: "custom",
      description: "",
    })
    setShowModal(true)
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
    setShowModal(true)
  }

  const handleSave = () => {
    if (!formData.name || !formData.startDate || !formData.endDate) {
      alert("请填写完整信息")
      return
    }

    const holidayData: Omit<Holiday, "id"> = {
      name: formData.name,
      startDate: formData.startDate,
      endDate: formData.endDate,
      type: formData.type,
      description: formData.description,
    }

    if (editingHoliday) {
      updateHoliday(editingHoliday.id, holidayData)
    } else {
      addHoliday(holidayData)
    }

    setShowModal(false)
  }

  const handleDelete = (id: string) => {
    if (confirm("确定要删除这个假期吗？")) {
      deleteHoliday(id)
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + "T00:00:00")
    return `${date.getMonth() + 1}月${date.getDate()}日`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-medium">假期设置</h1>
        </div>
        <Button onClick={handleAddHoliday} size="sm" className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-1" />
          添加假期
        </Button>
      </div>

      {/* 内容区域 */}
      <div className="p-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">自定义假期</CardTitle>
          </CardHeader>
          <CardContent>
            {customHolidays.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>暂无自定义假期</p>
                <p className="text-sm mt-1">点击右上角添加按钮创建假期</p>
              </div>
            ) : (
              <div className="space-y-3">
                {customHolidays.map((holiday) => (
                  <div key={holiday.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{holiday.name}</div>
                      <div className="text-sm text-gray-600">
                        {formatDate(holiday.startDate)} - {formatDate(holiday.endDate)}
                      </div>
                      {holiday.description && <div className="text-sm text-gray-500 mt-1">{holiday.description}</div>}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEditHoliday(holiday)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(holiday.id)}>
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 安卓风格添加/编辑假期模态框 */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1000,
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            paddingTop: "200px",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowModal(false)
            }
          }}
        >
          <div
            style={{
              width: "100vw",
              maxWidth: "500px",
              height: "500px",
              backgroundColor: "white",
              borderRadius: "20px 20px 0 0",
              boxShadow: "0 -4px 20px rgba(0, 0, 0, 0.15)",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            {/* 顶部操作栏 */}
            <div
              style={{
                height: "70px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 25px",
                borderBottom: "1px solid #f0f0f0",
                backgroundColor: "white",
              }}
            >
              <button
                onClick={() => setShowModal(false)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "20px",
                  color: "#666",
                  cursor: "pointer",
                  padding: "10px",
                  margin: "-10px",
                }}
              >
                <X size={24} />
              </button>
              <div
                style={{
                  fontSize: "20px",
                  fontWeight: "500",
                  color: "#333",
                }}
              >
                {editingHoliday ? "编辑假期" : "添加假期"}
              </div>
              <button
                onClick={handleSave}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "20px",
                  color: "#1976d2",
                  cursor: "pointer",
                  padding: "10px",
                  margin: "-10px",
                }}
              >
                <Check size={24} />
              </button>
            </div>

            {/* 内容区域 */}
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                backgroundColor: "white",
              }}
            >
              {/* 假期名称 */}
              <div
                style={{
                  padding: "25px",
                  borderBottom: "1px solid #f0f0f0",
                }}
              >
                <div
                  style={{
                    fontSize: "16px",
                    color: "#666",
                    marginBottom: "10px",
                  }}
                >
                  假期名称
                </div>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="请输入假期名称"
                  style={{
                    width: "100%",
                    border: "none",
                    outline: "none",
                    fontSize: "24px",
                    color: "#333",
                    backgroundColor: "transparent",
                  }}
                />
              </div>

              {/* 开始日期 */}
              <div
                style={{
                  padding: "25px",
                  borderBottom: "1px solid #f0f0f0",
                }}
              >
                <div
                  style={{
                    fontSize: "16px",
                    color: "#666",
                    marginBottom: "10px",
                  }}
                >
                  开始日期
                </div>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  style={{
                    width: "100%",
                    border: "none",
                    outline: "none",
                    fontSize: "24px",
                    color: "#333",
                    backgroundColor: "transparent",
                  }}
                />
              </div>

              {/* 结束日期 */}
              <div
                style={{
                  padding: "25px",
                  borderBottom: "1px solid #f0f0f0",
                }}
              >
                <div
                  style={{
                    fontSize: "16px",
                    color: "#666",
                    marginBottom: "10px",
                  }}
                >
                  结束日期
                </div>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  style={{
                    width: "100%",
                    border: "none",
                    outline: "none",
                    fontSize: "24px",
                    color: "#333",
                    backgroundColor: "transparent",
                  }}
                />
              </div>

              {/* 描述 */}
              <div
                style={{
                  padding: "25px",
                }}
              >
                <div
                  style={{
                    fontSize: "16px",
                    color: "#666",
                    marginBottom: "10px",
                  }}
                >
                  描述（可选）
                </div>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="请输入假期描述"
                  rows={3}
                  style={{
                    width: "100%",
                    border: "none",
                    outline: "none",
                    fontSize: "20px",
                    color: "#333",
                    backgroundColor: "transparent",
                    resize: "none",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
