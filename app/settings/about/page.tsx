"use client"

import { useRouter } from "next/navigation"
import { useResponsiveScale } from "@/hooks/useResponsiveScale"
import { Mail, School, Users, Code, Heart } from "lucide-react"

export default function AboutPage() {
  const router = useRouter()
  const scale = useResponsiveScale(1408)

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
            关于我们
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
          {/* App Info Card */}
          <div
            style={{
              background: "#fff",
              borderRadius: "25px",
              boxShadow: "0px 4px 10px rgba(0,0,0,0.05)",
              padding: "50px",
              marginBottom: "40px",
              textAlign: "center",
            }}
          >
            {/* App Icon */}
            <div
              style={{
                width: "120px",
                height: "120px",
                background: "linear-gradient(135deg, #1e39de 0%, #4159f7 100%)",
                borderRadius: "30px",
                margin: "0 auto 30px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0px 8px 20px rgba(30, 57, 222, 0.3)",
              }}
            >
              <span style={{ fontSize: "60px", color: "#fff" }}>📅</span>
            </div>

            <h2
              style={{
                fontSize: "56px",
                fontWeight: 700,
                color: "#1e39de",
                marginBottom: "20px",
              }}
            >
              学期日历
            </h2>

            <p
              style={{
                fontSize: "36px",
                color: "#666",
                marginBottom: "30px",
                lineHeight: "1.5",
              }}
            >
              一个简洁优雅的学期日历应用
              <br />
              帮助学生更好地管理学期时间
            </p>

            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                background: "#f8f9fa",
                padding: "15px 30px",
                borderRadius: "50px",
                fontSize: "32px",
                color: "#1e39de",
                fontWeight: 600,
              }}
            >
              版本 1.0.0
            </div>
          </div>

          {/* Team Info Card */}
          <div
            style={{
              background: "#fff",
              borderRadius: "25px",
              boxShadow: "0px 4px 10px rgba(0,0,0,0.05)",
              padding: "50px",
              marginBottom: "40px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "40px",
              }}
            >
              <Users size={48} color="#1e39de" style={{ marginRight: "20px" }} />
              <h3
                style={{
                  fontSize: "48px",
                  fontWeight: 600,
                  color: "#000",
                  margin: 0,
                }}
              >
                开发团队
              </h3>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "30px",
              }}
            >
              <School size={40} color="#666" style={{ marginRight: "20px" }} />
              <span
                style={{
                  fontSize: "36px",
                  color: "#666",
                }}
              >
                大连理工大学
              </span>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "40px",
                marginTop: "40px",
              }}
            >
              {/* Developer 1 */}
              <div
                style={{
                  background: "#f8f9fa",
                  borderRadius: "20px",
                  padding: "30px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    width: "80px",
                    height: "80px",
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    borderRadius: "50%",
                    margin: "0 auto 20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "36px",
                    color: "#fff",
                    fontWeight: 600,
                  }}
                >
                  高
                </div>
                <h4
                  style={{
                    fontSize: "40px",
                    fontWeight: 600,
                    color: "#000",
                    marginBottom: "10px",
                  }}
                >
                  高铭
                </h4>
                <p
                  style={{
                    fontSize: "28px",
                    color: "#666",
                  }}
                >
                  核心开发者
                </p>
              </div>

              {/* Developer 2 */}
              <div
                style={{
                  background: "#f8f9fa",
                  borderRadius: "20px",
                  padding: "30px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    width: "80px",
                    height: "80px",
                    background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                    borderRadius: "50%",
                    margin: "0 auto 20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "36px",
                    color: "#fff",
                    fontWeight: 600,
                  }}
                >
                  张
                </div>
                <h4
                  style={{
                    fontSize: "40px",
                    fontWeight: 600,
                    color: "#000",
                    marginBottom: "10px",
                  }}
                >
                  张凯
                </h4>
                <p
                  style={{
                    fontSize: "28px",
                    color: "#666",
                  }}
                >
                  核心开发者
                </p>
              </div>
            </div>
          </div>

          {/* Contact Info Card */}
          <div
            style={{
              background: "#fff",
              borderRadius: "25px",
              boxShadow: "0px 4px 10px rgba(0,0,0,0.05)",
              padding: "50px",
              marginBottom: "40px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "40px",
              }}
            >
              <Mail size={48} color="#1e39de" style={{ marginRight: "20px" }} />
              <h3
                style={{
                  fontSize: "48px",
                  fontWeight: 600,
                  color: "#000",
                  margin: 0,
                }}
              >
                联系我们
              </h3>
            </div>

            <div
              style={{
                background: "#f8f9fa",
                borderRadius: "20px",
                padding: "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Mail size={40} color="#1e39de" style={{ marginRight: "20px" }} />
              <a
                href="mailto:2674610176@qq.com"
                style={{
                  fontSize: "36px",
                  color: "#1e39de",
                  textDecoration: "none",
                  fontWeight: 500,
                }}
              >
                2674610176@qq.com
              </a>
            </div>

            <p
              style={{
                fontSize: "28px",
                color: "#666",
                textAlign: "center",
                marginTop: "30px",
                lineHeight: "1.6",
              }}
            >
              如果您在使用过程中遇到任何问题或有任何建议，
              <br />
              欢迎通过邮件与我们联系，我们会尽快回复您。
            </p>
          </div>

          {/* Features Card */}
          <div
            style={{
              background: "#fff",
              borderRadius: "25px",
              boxShadow: "0px 4px 10px rgba(0,0,0,0.05)",
              padding: "50px",
              marginBottom: "40px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "40px",
              }}
            >
              <Code size={48} color="#1e39de" style={{ marginRight: "20px" }} />
              <h3
                style={{
                  fontSize: "48px",
                  fontWeight: 600,
                  color: "#000",
                  margin: 0,
                }}
              >
                主要功能
              </h3>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "30px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <div
                  style={{
                    width: "12px",
                    height: "12px",
                    background: "#1e39de",
                    borderRadius: "50%",
                    marginRight: "20px",
                  }}
                />
                <span style={{ fontSize: "32px", color: "#333" }}>学期日历视图</span>
              </div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <div
                  style={{
                    width: "12px",
                    height: "12px",
                    background: "#1e39de",
                    borderRadius: "50%",
                    marginRight: "20px",
                  }}
                />
                <span style={{ fontSize: "32px", color: "#333" }}>月份详细视图</span>
              </div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <div
                  style={{
                    width: "12px",
                    height: "12px",
                    background: "#1e39de",
                    borderRadius: "50%",
                    marginRight: "20px",
                  }}
                />
                <span style={{ fontSize: "32px", color: "#333" }}>自定义学期时间</span>
              </div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <div
                  style={{
                    width: "12px",
                    height: "12px",
                    background: "#1e39de",
                    borderRadius: "50%",
                    marginRight: "20px",
                  }}
                />
                <span style={{ fontSize: "32px", color: "#333" }}>假期管理</span>
              </div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <div
                  style={{
                    width: "12px",
                    height: "12px",
                    background: "#1e39de",
                    borderRadius: "50%",
                    marginRight: "20px",
                  }}
                />
                <span style={{ fontSize: "32px", color: "#333" }}>响应式设计</span>
              </div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <div
                  style={{
                    width: "12px",
                    height: "12px",
                    background: "#1e39de",
                    borderRadius: "50%",
                    marginRight: "20px",
                  }}
                />
                <span style={{ fontSize: "32px", color: "#333" }}>简洁易用</span>
              </div>
            </div>
          </div>

          {/* Thank You Card */}
          <div
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              borderRadius: "25px",
              padding: "50px",
              textAlign: "center",
              color: "#fff",
            }}
          >
            <Heart size={60} color="#fff" style={{ marginBottom: "20px" }} />
            <h3
              style={{
                fontSize: "48px",
                fontWeight: 600,
                marginBottom: "20px",
              }}
            >
              感谢使用
            </h3>
            <p
              style={{
                fontSize: "32px",
                lineHeight: "1.6",
                opacity: 0.9,
              }}
            >
              感谢您选择我们的学期日历应用！
              <br />
              我们致力于为学生提供更好的时间管理工具，
              <br />
              让学习生活更加有序和高效。
            </p>
          </div>
        </main>
      </div>
    </div>
  )
}
