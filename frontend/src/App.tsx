
import {
  useEffect,
  useState,
  type ChangeEvent,
  type ReactNode,
} from "react";

import Dashboard from "./Dashboard";

const API_URL = "http://127.0.0.1:8001";

type Agent = "study" | "career" | "college";

type Page = "dashboard" | "assistant" | "documents";

type ChatMessage = {
  id: number;
  sender: "user" | "ai";
  text: string;
  agent: Agent;
};

function App() {
  const [page, setPage] = useState<Page>("dashboard");
  const [agent, setAgent] = useState<Agent>("study");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [chatHistory, setChatHistory] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem(
        "student_assistant_history"
      );

      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [pdfCount, setPdfCount] = useState<number>(() => {
    try {
      return Number(
        localStorage.getItem(
          "student_assistant_pdf_count"
        ) || "0"
      );
    } catch {
      return 0;
    }
  });

  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");

  const studyQuestions = chatHistory.filter(
    (chat) =>
      chat.agent === "study" &&
      chat.sender === "user"
  ).length;

  const careerQuestions = chatHistory.filter(
    (chat) =>
      chat.agent === "career" &&
      chat.sender === "user"
  ).length;

  const collegeQuestions = chatHistory.filter(
    (chat) =>
      chat.agent === "college" &&
      chat.sender === "user"
  ).length;

  const totalQuestions =
    studyQuestions +
    careerQuestions +
    collegeQuestions;

  useEffect(() => {
    try {
      localStorage.setItem(
        "student_assistant_history",
        JSON.stringify(chatHistory)
      );
    } catch (error) {
      console.error(error);
    }
  }, [chatHistory]);

  const askAI = async () => {
    if (!message.trim() || loading) {
      return;
    }

    const userQuestion = message.trim();

    const userChat: ChatMessage = {
      id: Date.now(),
      sender: "user",
      text: userQuestion,
      agent,
    };

    setChatHistory((previous) => [
      ...previous,
      userChat,
    ]);

    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/${agent}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: userQuestion,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Server returned ${response.status}`
        );
      }

      const data = await response.json();

      const aiChat: ChatMessage = {
        id: Date.now() + 1,
        sender: "ai",
        text:
          data.answer ||
          "AI returned an empty answer.",
        agent,
      };

      setChatHistory((previous) => [
        ...previous,
        aiChat,
      ]);
    } catch (error) {
      console.error("AI request error:", error);

      const errorChat: ChatMessage = {
        id: Date.now() + 1,
        sender: "ai",
        text:
          "AI service is temporarily unavailable.\n\n" +
          "Please check that the FastAPI backend is running on:\n" +
          API_URL,
        agent,
      };

      setChatHistory((previous) => [
        ...previous,
        errorChat,
      ]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setChatHistory([]);

    localStorage.removeItem(
      "student_assistant_history"
    );
  };

  const uploadPDF = async (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (
      !file.name
        .toLowerCase()
        .endsWith(".pdf")
    ) {
      setUploadMessage(
        "❌ Please select a PDF file."
      );
      return;
    }

    setUploading(true);
    setUploadMessage("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(
        `${API_URL}/upload-pdf`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(
          `Upload failed: ${response.status}`
        );
      }

      const data = await response.json();

      if (data.success) {
        setPdfCount((previous) => {
          const newCount = previous + 1;

          localStorage.setItem(
            "student_assistant_pdf_count",
            String(newCount)
          );

          return newCount;
        });

        setUploadMessage(
          `✅ ${file.name} uploaded successfully.`
        );
      } else {
        setUploadMessage(
          `❌ ${
            data.message ||
            "PDF upload failed."
          }`
        );
      }
    } catch (error) {
      console.error(error);

      setUploadMessage(
        "❌ Unable to upload PDF. Make sure FastAPI is running."
      );
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  const getAgentName = (agentName: Agent) => {
    if (agentName === "study") {
      return "📚 Study";
    }

    if (agentName === "career") {
      return "💼 Career";
    }

    return "🎓 College";
  };

  const openAssistant = (selectedAgent: Agent) => {
    setAgent(selectedAgent);
    setPage("assistant");
  };

  return (
    <div
      className="app-container"
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        display: "flex",
      }}
    >
      {/* SIDEBAR */}

      <aside
        className="sidebar"
        style={{
          width: "250px",
          minHeight: "100vh",
          background: "#ffffff",
          borderRight: "1px solid #e2e8f0",
          padding: "22px 16px",
          position: "fixed",
          left: 0,
          top: 0,
          display: "flex",
          flexDirection: "column",
          zIndex: 10,
        }}
      >
        {/* LOGO */}

        <div
          style={{
            padding: "8px 10px 25px",
          }}
        >
          <div
            style={{
              fontSize: "30px",
              marginBottom: "8px",
            }}
          >
            🤖
          </div>

          <h2
            style={{
              margin: 0,
              color: "#0f172a",
              fontSize: "22px",
            }}
          >
            Student AI
          </h2>

          <p
            style={{
              margin: "5px 0 0",
              color: "#64748b",
              fontSize: "13px",
            }}
          >
            Multi-Agent Assistant
          </p>
        </div>

        {/* MAIN MENU */}

        <p
          style={{
            fontSize: "11px",
            fontWeight: "bold",
            color: "#94a3b8",
            padding: "0 10px",
            letterSpacing: "1px",
          }}
        >
          MAIN MENU
        </p>

        <NavButton
          active={page === "dashboard"}
          onClick={() => setPage("dashboard")}
        >
          📊 Dashboard
        </NavButton>

        <NavButton
          active={page === "assistant"}
          onClick={() => setPage("assistant")}
        >
          💬 AI Assistant
        </NavButton>

        <NavButton
          active={page === "documents"}
          onClick={() => setPage("documents")}
        >
          📄 Documents
        </NavButton>

        {/* AGENTS */}

        <p
          style={{
            fontSize: "11px",
            fontWeight: "bold",
            color: "#94a3b8",
            padding: "15px 10px 5px",
            letterSpacing: "1px",
          }}
        >
          AI AGENTS
        </p>

        <NavButton
          active={
            page === "assistant" &&
            agent === "study"
          }
          onClick={() =>
            openAssistant("study")
          }
        >
          📚 Study Agent
        </NavButton>

        <NavButton
          active={
            page === "assistant" &&
            agent === "career"
          }
          onClick={() =>
            openAssistant("career")
          }
        >
          💼 Career Agent
        </NavButton>

        <NavButton
          active={
            page === "assistant" &&
            agent === "college"
          }
          onClick={() =>
            openAssistant("college")
          }
        >
          🎓 College Agent
        </NavButton>

        {/* FOOTER */}

        <div
          className="sidebar-footer"
          style={{
            marginTop: "auto",
            padding: "15px 10px",
            borderTop: "1px solid #e2e8f0",
          }}
        >
          <div
            style={{
              fontSize: "13px",
              fontWeight: "bold",
              color: "#16a34a",
            }}
          >
            🟢 System Online
          </div>

          <div
            style={{
              fontSize: "12px",
              color: "#64748b",
              marginTop: "5px",
            }}
          >
            AI services available
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}

      <main
        className="main-content"
        style={{
          marginLeft: "250px",
          width: "calc(100% - 250px)",
          minHeight: "100vh",
          padding: "35px",
        }}
      >
        {/* TOP BAR */}

        <div
          className="top-bar"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "25px",
          }}
        >
          <div>
            <h1
              style={{
                margin: 0,
                color: "#0f172a",
                fontSize: "28px",
              }}
            >
              {page === "dashboard" &&
                "Dashboard"}

              {page === "assistant" &&
                "AI Assistant"}

              {page === "documents" &&
                "Documents"}
            </h1>

            <p
              style={{
                margin: "6px 0 0",
                color: "#64748b",
              }}
            >
              Intelligent academic support
              powered by AI
            </p>
          </div>

          <div
            style={{
              background: "#dcfce7",
              color: "#15803d",
              padding: "9px 15px",
              borderRadius: "20px",
              fontSize: "13px",
              fontWeight: "bold",
            }}
          >
            🟢 Online
          </div>
        </div>

        {/* DASHBOARD */}

        {page === "dashboard" && (
          <Dashboard
            totalQuestions={totalQuestions}
            studyQuestions={studyQuestions}
            careerQuestions={careerQuestions}
            collegeQuestions={collegeQuestions}
            pdfCount={pdfCount}
          />
        )}

        {/* AI ASSISTANT */}

        {page === "assistant" && (
          <>
            {/* Agent Selection */}

            <div
              style={{
                background: "white",
                borderRadius: "18px",
                padding: "22px",
                marginBottom: "20px",
                border: "1px solid #e2e8f0",
                boxShadow:
                  "0 4px 15px rgba(15,23,42,0.05)",
              }}
            >
              <h3
                style={{
                  marginTop: 0,
                }}
              >
                Choose AI Agent
              </h3>

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  flexWrap: "wrap",
                }}
              >
                <AgentButton
                  active={agent === "study"}
                  onClick={() =>
                    setAgent("study")
                  }
                >
                  📚 Study Agent
                </AgentButton>

                <AgentButton
                  active={agent === "career"}
                  onClick={() =>
                    setAgent("career")
                  }
                >
                  💼 Career Agent
                </AgentButton>

                <AgentButton
                  active={agent === "college"}
                  onClick={() =>
                    setAgent("college")
                  }
                >
                  🎓 College Agent
                </AgentButton>
              </div>
            </div>

            {/* CHAT */}

            <div
              style={{
                background: "white",
                borderRadius: "18px",
                padding: "25px",
                border: "1px solid #e2e8f0",
                boxShadow:
                  "0 4px 15px rgba(15,23,42,0.05)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "18px",
                }}
              >
                <div>
                  <h2
                    style={{
                      margin: 0,
                    }}
                  >
                    💬 Chat
                  </h2>

                  <p
                    style={{
                      margin: "5px 0 0",
                      color: "#64748b",
                      fontSize: "14px",
                    }}
                  >
                    Currently using{" "}
                    <strong>
                      {getAgentName(agent)}
                    </strong>
                  </p>
                </div>

                {chatHistory.length > 0 && (
                  <button
                    onClick={clearChat}
                    style={{
                      padding: "8px 14px",
                      border: "none",
                      borderRadius: "8px",
                      background: "#fee2e2",
                      color: "#b91c1c",
                      cursor: "pointer",
                      fontWeight: "bold",
                    }}
                  >
                    🗑️ Clear
                  </button>
                )}
              </div>

              {/* CHAT HISTORY */}

              <div
                className="chat-messages"
                style={{
                  height: "480px",
                  overflowY: "auto",
                  marginBottom: "18px",
                  padding: "5px",
                }}
              >
                {chatHistory.length === 0 ? (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "100px 20px",
                      color: "#94a3b8",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "50px",
                      }}
                    >
                      🤖
                    </div>

                    <h3
                      style={{
                        color: "#475569",
                      }}
                    >
                      Ask your AI assistant
                    </h3>

                    <p>
                      Get help with study,
                      career, or college
                      questions.
                    </p>
                  </div>
                ) : (
                  chatHistory.map((chat) => (
                    <div
                      key={chat.id}
                      style={{
                        display: "flex",
                        justifyContent:
                          chat.sender === "user"
                            ? "flex-end"
                            : "flex-start",
                        marginBottom: "15px",
                      }}
                    >
                      <div
                        className="message-bubble"
                        style={{
                          maxWidth: "75%",
                          padding: "15px",
                          borderRadius: "15px",
                          background:
                            chat.sender ===
                            "user"
                              ? "#2563eb"
                              : "#f1f5f9",
                          color:
                            chat.sender ===
                            "user"
                              ? "white"
                              : "#1e293b",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "12px",
                            fontWeight: "bold",
                            marginBottom: "7px",
                            opacity: 0.75,
                          }}
                        >
                          {chat.sender ===
                          "user"
                            ? "👤 You"
                            : `🤖 ${getAgentName(
                                chat.agent
                              )}`}
                        </div>

                        <div
                          style={{
                            whiteSpace:
                              "pre-wrap",
                            lineHeight: 1.6,
                          }}
                        >
                          {chat.text}
                        </div>
                      </div>
                    </div>
                  ))
                )}

                {loading && (
                  <div
                    style={{
                      padding: "15px",
                      color: "#64748b",
                    }}
                  >
                    🤖 Thinking...
                  </div>
                )}
              </div>

              {/* INPUT */}

              <textarea
                value={message}
                onChange={(e) =>
                  setMessage(e.target.value)
                }
                onKeyDown={(e) => {
                  if (
                    e.key === "Enter" &&
                    !e.shiftKey
                  ) {
                    e.preventDefault();
                    askAI();
                  }
                }}
                placeholder={`Ask your ${agent} question...`}
                rows={4}
                style={{
                  width: "100%",
                  padding: "15px",
                  borderRadius: "10px",
                  border:
                    "1px solid #cbd5e1",
                  resize: "vertical",
                  fontSize: "15px",
                  marginBottom: "10px",
                }}
              />

              <button
                onClick={askAI}
                disabled={
                  loading ||
                  !message.trim()
                }
                style={{
                  width: "100%",
                  padding: "14px",
                  borderRadius: "10px",
                  border: "none",
                  background:
                    loading ||
                    !message.trim()
                      ? "#94a3b8"
                      : "#2563eb",
                  color: "white",
                  fontWeight: "bold",
                  fontSize: "15px",
                  cursor:
                    loading ||
                    !message.trim()
                      ? "not-allowed"
                      : "pointer",
                }}
              >
                {loading
                  ? "🤔 Thinking..."
                  : "🚀 Ask AI"}
              </button>
            </div>
          </>
        )}

        {/* DOCUMENTS */}

        {page === "documents" && (
          <div
            style={{
              background: "white",
              borderRadius: "18px",
              padding: "30px",
              border: "1px solid #e2e8f0",
              boxShadow:
                "0 4px 15px rgba(15,23,42,0.05)",
            }}
          >
            <div
              style={{
                textAlign: "center",
                padding: "25px",
              }}
            >
              <div
                style={{
                  fontSize: "55px",
                }}
              >
                📄
              </div>

              <h2>
                College Documents
              </h2>

              <p
                style={{
                  color: "#64748b",
                }}
              >
                Upload PDF study material for
                the College AI assistant.
              </p>

              <label
                style={{
                  display: "inline-block",
                  padding: "14px 25px",
                  background: "#2563eb",
                  color: "white",
                  borderRadius: "10px",
                  cursor: uploading
                    ? "not-allowed"
                    : "pointer",
                  fontWeight: "bold",
                }}
              >
                📤{" "}
                {uploading
                  ? "Processing..."
                  : "Choose PDF"}
                <input
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={uploadPDF}
                  disabled={uploading}
                  style={{
                    display: "none",
                  }}
                />
              </label>

              {uploadMessage && (
                <p
                  style={{
                    marginTop: "20px",
                    fontWeight: "bold",
                  }}
                >
                  {uploadMessage}
                </p>
              )}

              <div
                style={{
                  marginTop: "30px",
                  padding: "20px",
                  background: "#f8fafc",
                  borderRadius: "12px",
                }}
              >
                <strong>
                  📄 {pdfCount}
                </strong>

                <p
                  style={{
                    margin:
                      "5px 0 0",
                    color: "#64748b",
                  }}
                >
                  Documents uploaded
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function NavButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        textAlign: "left",
        padding: "12px 14px",
        marginBottom: "5px",
        border: "none",
        borderRadius: "9px",
        cursor: "pointer",
        background: active
          ? "#eff6ff"
          : "transparent",
        color: active
          ? "#2563eb"
          : "#475569",
        fontWeight: active
          ? "bold"
          : "normal",
        fontSize: "14px",
      }}
    >
      {children}
    </button>
  );
}

function AgentButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "12px 20px",
        borderRadius: "9px",
        border: active
          ? "1px solid #2563eb"
          : "1px solid #e2e8f0",
        cursor: "pointer",
        background: active
          ? "#2563eb"
          : "#f8fafc",
        color: active
          ? "white"
          : "#334155",
        fontWeight: "bold",
      }}
    >
      {children}
    </button>
  );
}

export default App;

