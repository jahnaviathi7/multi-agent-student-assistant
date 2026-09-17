import { useState } from "react";

const API_URL = "http://127.0.0.1:8000";

type Agent = "study" | "career" | "college";

function App() {
  const [page, setPage] = useState<"login" | "register" | "dashboard">(
    "login"
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [selectedAgent, setSelectedAgent] = useState<Agent>("study");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const [totalQuestions, setTotalQuestions] = useState(0);
  const [studyQuestions, setStudyQuestions] = useState(0);
  const [careerQuestions, setCareerQuestions] = useState(0);
  const [collegeQuestions, setCollegeQuestions] = useState(0);
  const [pdfCount, setPdfCount] = useState(0);

  const [activeMenu, setActiveMenu] = useState("Dashboard");

  // ============================================================
  // LOGIN
  // ============================================================

  const handleLogin = async () => {
    setError("");

    if (!email || !password) {
      setError("Please enter email and password.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Invalid email or password.");
      }

      localStorage.setItem("student_ai_logged_in", "true");
      localStorage.setItem("student_ai_email", email);

      setPage("dashboard");
      setActiveMenu("Dashboard");
      setError("");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to login. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // REGISTER
  // ============================================================

  const handleRegister = async () => {
    setError("");

    if (!name || !email || !password) {
      setError("Please fill all fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Registration failed.");
      }

      setError("");
      alert("Registration successful! Please login.");

      setName("");
      setPassword("");
      setPage("login");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // LOGOUT
  // ============================================================

  const handleLogout = () => {
    localStorage.removeItem("student_ai_logged_in");
    localStorage.removeItem("student_ai_email");

    setQuestion("");
    setAnswer("");
    setActiveMenu("Dashboard");

    setPage("login");
  };

  // ============================================================
  // ASK AI
  // ============================================================

  const askAI = async () => {
    if (!question.trim()) {
      return;
    }

    setLoading(true);
    setAnswer("");

    try {
      const response = await fetch(`${API_URL}/${selectedAgent}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: question,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "AI service unavailable.");
      }

      setAnswer(data.answer || "No response received.");

      setTotalQuestions((value) => value + 1);

      if (selectedAgent === "study") {
        setStudyQuestions((value) => value + 1);
      }

      if (selectedAgent === "career") {
        setCareerQuestions((value) => value + 1);
      }

      if (selectedAgent === "college") {
        setCollegeQuestions((value) => value + 1);
      }
    } catch (err) {
      setAnswer(
        `AI service is temporarily unavailable. ${
          err instanceof Error ? err.message : ""
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // PDF UPLOAD
  // ============================================================

  const uploadPDF = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".pdf")) {
      alert("Please select a PDF file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/upload-pdf`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Upload failed.");
      }

      setPdfCount((value) => value + 1);

      alert("PDF uploaded successfully!");
    } catch (err) {
      alert(
        err instanceof Error
          ? err.message
          : "PDF upload failed."
      );
    } finally {
      setLoading(false);
      event.target.value = "";
    }
  };

  // ============================================================
  // LOGIN PAGE
  // ============================================================

  if (page === "login") {
    return (
      <div style={styles.authPage}>
        <div style={styles.authGlow}></div>

        <div style={styles.authCard}>
          <div style={styles.logo}>🤖</div>

          <h1 style={styles.authTitle}>Student AI</h1>

          <p style={styles.authSubtitle}>
            Your intelligent student assistant
          </p>

          <div style={styles.neonLine}></div>

          <h2 style={styles.welcome}>Welcome Back 👋</h2>

          <p style={styles.authText}>
            Login to continue to your dashboard.
          </p>

          {error && (
            <div style={styles.errorBox}>
              ❌ {error}
            </div>
          )}

          <label style={styles.label}>Email</label>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
          />

          <label style={styles.label}>Password</label>

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleLogin();
              }
            }}
            style={styles.input}
          />

          <button
            onClick={handleLogin}
            style={styles.neonButton}
            disabled={loading}
          >
            {loading ? "⏳ Logging in..." : "🔐 Login"}
          </button>

          <p style={styles.switchText}>
            Don't have an account?{" "}
            <button
              onClick={() => {
                setError("");
                setPage("register");
              }}
              style={styles.linkButton}
            >
              Create Account
            </button>
          </p>
        </div>
      </div>
    );
  }

  // ============================================================
  // REGISTER PAGE
  // ============================================================

  if (page === "register") {
    return (
      <div style={styles.authPage}>
        <div style={styles.authGlow}></div>

        <div style={styles.authCard}>
          <div style={styles.logo}>🚀</div>

          <h1 style={styles.authTitle}>Join Student AI</h1>

          <p style={styles.authSubtitle}>
            Create your intelligent learning account
          </p>

          <div style={styles.neonLine}></div>

          {error && (
            <div style={styles.errorBox}>
              ❌ {error}
            </div>
          )}

          <label style={styles.label}>Full Name</label>

          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={styles.input}
          />

          <label style={styles.label}>Email</label>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
          />

          <label style={styles.label}>Password</label>

          <input
            type="password"
            placeholder="Create password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />

          <button
            onClick={handleRegister}
            style={styles.neonButton}
            disabled={loading}
          >
            {loading ? "⏳ Creating..." : "🚀 Create Account"}
          </button>

          <p style={styles.switchText}>
            Already have an account?{" "}
            <button
              onClick={() => {
                setError("");
                setPage("login");
              }}
              style={styles.linkButton}
            >
              Login
            </button>
          </p>
        </div>
      </div>
    );
  }

  // ============================================================
  // DASHBOARD
  // ============================================================

  return (
    <div style={styles.dashboardPage}>
      {/* SIDEBAR */}

      <aside style={styles.sidebar}>
        <div style={styles.brand}>
          <div style={styles.brandIcon}>🤖</div>

          <div>
            <h2 style={styles.brandTitle}>Student AI</h2>

            <span style={styles.brandSub}>
              Intelligent Assistant
            </span>
          </div>
        </div>

        <div style={styles.sidebarSection}>
          MAIN MENU
        </div>

        <button
          onClick={() => setActiveMenu("Dashboard")}
          style={
            activeMenu === "Dashboard"
              ? styles.activeMenu
              : styles.menuButton
          }
        >
          📊 Dashboard
        </button>

        <button
          onClick={() => setActiveMenu("AI Assistant")}
          style={
            activeMenu === "AI Assistant"
              ? styles.activeMenu
              : styles.menuButton
          }
        >
          💬 AI Assistant
        </button>

        <button
          onClick={() => setActiveMenu("Documents")}
          style={
            activeMenu === "Documents"
              ? styles.activeMenu
              : styles.menuButton
          }
        >
          📄 Documents
        </button>

        <div style={styles.sidebarSection}>
          AI AGENTS
        </div>

        <button
          onClick={() => {
            setSelectedAgent("study");
            setActiveMenu("AI Assistant");
          }}
          style={styles.menuButton}
        >
          📚 Study Agent
        </button>

        <button
          onClick={() => {
            setSelectedAgent("career");
            setActiveMenu("AI Assistant");
          }}
          style={styles.menuButton}
        >
          💼 Career Agent
        </button>

        <button
          onClick={() => {
            setSelectedAgent("college");
            setActiveMenu("AI Assistant");
          }}
          style={styles.menuButton}
        >
          🎓 College Agent
        </button>

        <div style={styles.sidebarBottom}>
          <div style={styles.onlineBox}>
            <span style={styles.greenDot}>●</span>

            <div>
              <strong>System Online</strong>

              <small>AI services available</small>
            </div>
          </div>

          <button
            onClick={handleLogout}
            style={styles.logoutButton}
          >
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* MAIN */}

      <main style={styles.mainContent}>
        <header style={styles.topBar}>
          <div>
            <h1 style={styles.pageTitle}>
              {activeMenu === "Dashboard"
                ? "Dashboard"
                : activeMenu}
            </h1>

            <p style={styles.pageSubtitle}>
              Your intelligent student assistant
            </p>
          </div>

          <div style={styles.userBox}>
            <div style={styles.userIcon}>👤</div>

            <div>
              <strong>Student</strong>

              <span>Online</span>
            </div>
          </div>
        </header>

        {/* DASHBOARD CONTENT */}

        {activeMenu === "Dashboard" && (
          <>
            <section style={styles.hero}>
              <div>
                <div style={styles.heroRobot}>🤖</div>

                <h2 style={styles.heroTitle}>
                  Welcome to Student AI
                </h2>

                <p style={styles.heroText}>
                  Your intelligent companion for study,
                  career, and college support.
                </p>
              </div>

              <div style={styles.onlinePill}>
                🟢 AI Services Online
              </div>
            </section>

            {/* STATS */}

            <div style={styles.statsGrid}>
              <Stat
                icon="💬"
                number={totalQuestions}
                title="Questions"
                text="Total questions asked"
              />

              <Stat
                icon="📚"
                number={studyQuestions}
                title="Study"
                text="Study conversations"
              />

              <Stat
                icon="💼"
                number={careerQuestions}
                title="Career"
                text="Career conversations"
              />

              <Stat
                icon="🎓"
                number={collegeQuestions}
                title="College"
                text="College conversations"
              />

              <Stat
                icon="📄"
                number={pdfCount}
                title="Documents"
                text="PDFs uploaded"
              />
            </div>

            {/* AGENTS */}

            <section>
              <h2 style={styles.sectionTitle}>
                Choose AI Agent
              </h2>

              <p style={styles.sectionText}>
                Select an assistant based on what you
                need help with.
              </p>

              <div style={styles.agentGrid}>
                <AgentCard
                  icon="📚"
                  title="Study Agent"
                  text="Get help with subjects, concepts, exams and study preparation."
                  onClick={() => {
                    setSelectedAgent("study");
                    setActiveMenu("AI Assistant");
                  }}
                />

                <AgentCard
                  icon="💼"
                  title="Career Agent"
                  text="Get guidance for jobs, resumes, interviews and career skills."
                  onClick={() => {
                    setSelectedAgent("career");
                    setActiveMenu("AI Assistant");
                  }}
                />

                <AgentCard
                  icon="🎓"
                  title="College Agent"
                  text="Ask questions about college, syllabus, documents and academics."
                  onClick={() => {
                    setSelectedAgent("college");
                    setActiveMenu("AI Assistant");
                  }}
                />
              </div>
            </section>
          </>
        )}

        {/* AI ASSISTANT */}

        {activeMenu === "AI Assistant" && (
          <section style={styles.aiPanel}>
            <div style={styles.aiHeader}>
              <div style={styles.aiRobot}>
                {selectedAgent === "study"
                  ? "📚"
                  : selectedAgent === "career"
                  ? "💼"
                  : "🎓"}
              </div>

              <div>
                <h2 style={styles.aiTitle}>
                  {selectedAgent === "study"
                    ? "Study Agent"
                    : selectedAgent === "career"
                    ? "Career Agent"
                    : "College Agent"}
                </h2>

                <p style={styles.aiSubtitle}>
                  Ask anything and get AI-powered assistance.
                </p>
              </div>
            </div>

            <div style={styles.agentSelector}>
              <button
                onClick={() => setSelectedAgent("study")}
                style={
                  selectedAgent === "study"
                    ? styles.selectedAgent
                    : styles.agentSelectButton
                }
              >
                📚 Study
              </button>

              <button
                onClick={() => setSelectedAgent("career")}
                style={
                  selectedAgent === "career"
                    ? styles.selectedAgent
                    : styles.agentSelectButton
                }
              >
                💼 Career
              </button>

              <button
                onClick={() => setSelectedAgent("college")}
                style={
                  selectedAgent === "college"
                    ? styles.selectedAgent
                    : styles.agentSelectButton
                }
              >
                🎓 College
              </button>
            </div>

            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Type your question here..."
              style={styles.textarea}
            />

            <button
              onClick={askAI}
              style={styles.askButton}
              disabled={loading}
            >
              {loading ? "⏳ Thinking..." : "⚡ Ask Student AI"}
            </button>

            {answer && (
              <div style={styles.answerBox}>
                <div style={styles.answerTitle}>
                  🤖 AI Response
                </div>

                <div style={styles.answerText}>
                  {answer}
                </div>
              </div>
            )}
          </section>
        )}

        {/* DOCUMENTS */}

        {activeMenu === "Documents" && (
          <section style={styles.documentPanel}>
            <div style={styles.documentIcon}>📄</div>

            <h2 style={styles.sectionTitle}>
              College Documents
            </h2>

            <p style={styles.sectionText}>
              Upload PDF documents for the College Agent
              to use as knowledge.
            </p>

            <label style={styles.uploadButton}>
              📤 Upload PDF
              <input
                type="file"
                accept=".pdf"
                onChange={uploadPDF}
                style={{ display: "none" }}
              />
            </label>

            <div style={styles.documentCount}>
              📄 {pdfCount} document(s) uploaded
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

// ============================================================
// STAT CARD
// ============================================================

function Stat({
  icon,
  number,
  title,
  text,
}: {
  icon: string;
  number: number;
  title: string;
  text: string;
}) {
  return (
    <div style={styles.statCard}>
      <div style={styles.statTop}>
        <div style={styles.statIcon}>{icon}</div>

        <strong style={styles.statNumber}>
          {number}
        </strong>
      </div>

      <h3 style={styles.statTitle}>{title}</h3>

      <p style={styles.statText}>{text}</p>
    </div>
  );
}

// ============================================================
// AGENT CARD
// ============================================================

function AgentCard({
  icon,
  title,
  text,
  onClick,
}: {
  icon: string;
  title: string;
  text: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={styles.agentCard}
    >
      <div style={styles.agentIcon}>{icon}</div>

      <h3 style={styles.agentTitle}>{title}</h3>

      <p style={styles.agentText}>{text}</p>

      <span style={styles.agentArrow}>
        Open Agent →
      </span>
    </button>
  );
}

// ============================================================
// STYLES
// ============================================================

const styles: Record<string, React.CSSProperties> = {
  authPage: {
    minHeight: "100vh",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background:
      "radial-gradient(circle at top, #172554 0%, #020617 45%, #000000 100%)",
    fontFamily:
      "Inter, Arial, sans-serif",
    position: "relative",
    overflow: "hidden",
  },

  authGlow: {
    position: "absolute",
    width: "500px",
    height: "500px",
    background:
      "radial-gradient(circle, rgba(0,229,255,0.18), transparent 65%)",
    filter: "blur(20px)",
  },

  authCard: {
    width: "430px",
    maxWidth: "90%",
    padding: "45px",
    borderRadius: "28px",
    background:
      "rgba(2, 6, 23, 0.86)",
    border:
      "1px solid rgba(0,229,255,0.35)",
    boxShadow:
      "0 0 25px rgba(0,229,255,0.15), inset 0 0 30px rgba(0,229,255,0.04)",
    position: "relative",
    zIndex: 2,
    backdropFilter: "blur(20px)",
  },

  logo: {
    width: "75px",
    height: "75px",
    margin: "0 auto 18px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "22px",
    fontSize: "38px",
    background:
      "rgba(0,229,255,0.08)",
    border:
      "1px solid rgba(0,229,255,0.5)",
    boxShadow:
      "0 0 25px rgba(0,229,255,0.3)",
  },

  authTitle: {
    textAlign: "center",
    margin: 0,
    fontSize: "34px",
    color: "#ffffff",
    textShadow:
      "0 0 15px rgba(0,229,255,0.6)",
  },

  authSubtitle: {
    textAlign: "center",
    color: "#94a3b8",
    margin: "8px 0 25px",
  },

  neonLine: {
    height: "2px",
    width: "100%",
    marginBottom: "30px",
    background:
      "linear-gradient(90deg, transparent, #00e5ff, #8b5cf6, transparent)",
    boxShadow:
      "0 0 12px rgba(0,229,255,0.8)",
  },

  welcome: {
    color: "#ffffff",
    margin: "0 0 8px",
    fontSize: "25px",
  },

  authText: {
    color: "#94a3b8",
    marginBottom: "25px",
  },

  errorBox: {
    padding: "12px 15px",
    borderRadius: "12px",
    background: "rgba(239,68,68,0.12)",
    border: "1px solid rgba(239,68,68,0.5)",
    color: "#fca5a5",
    marginBottom: "18px",
    fontSize: "14px",
  },

  label: {
    display: "block",
    color: "#cbd5e1",
    marginBottom: "8px",
    fontSize: "14px",
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "15px 16px",
    marginBottom: "18px",
    borderRadius: "13px",
    border:
      "1px solid rgba(0,229,255,0.25)",
    background: "rgba(15,23,42,0.9)",
    color: "#ffffff",
    outline: "none",
    fontSize: "15px",
  },

  neonButton: {
    width: "100%",
    padding: "15px",
    border: "none",
    borderRadius: "13px",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: "15px",
    color: "#001018",
    background:
      "linear-gradient(90deg, #00e5ff, #22d3ee)",
    boxShadow:
      "0 0 20px rgba(0,229,255,0.45)",
  },

  switchText: {
    textAlign: "center",
    color: "#94a3b8",
    marginTop: "24px",
  },

  linkButton: {
    border: "none",
    background: "none",
    color: "#22d3ee",
    cursor: "pointer",
    fontWeight: 700,
  },

  dashboardPage: {
    minHeight: "100vh",
    display: "flex",
    background:
      "radial-gradient(circle at top right, #172554 0%, #020617 45%, #000000 100%)",
    color: "#ffffff",
    fontFamily:
      "Inter, Arial, sans-serif",
  },

  sidebar: {
    width: "265px",
    minHeight: "100vh",
    padding: "25px 18px",
    boxSizing: "border-box",
    background:
      "rgba(2,6,23,0.94)",
    borderRight:
      "1px solid rgba(0,229,255,0.15)",
    position: "fixed",
    left: 0,
    top: 0,
    bottom: 0,
    display: "flex",
    flexDirection: "column",
  },

  brand: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "10px",
    marginBottom: "35px",
  },

  brandIcon: {
    fontSize: "32px",
    filter:
      "drop-shadow(0 0 10px rgba(0,229,255,0.7))",
  },

  brandTitle: {
    margin: 0,
    fontSize: "21px",
    color: "#ffffff",
  },

  brandSub: {
    color: "#64748b",
    fontSize: "11px",
  },

  sidebarSection: {
    color: "#475569",
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "1.5px",
    padding: "0 12px",
    margin: "12px 0",
  },

  menuButton: {
    width: "100%",
    padding: "13px 15px",
    marginBottom: "6px",
    textAlign: "left",
    border: "1px solid transparent",
    borderRadius: "11px",
    background: "transparent",
    color: "#94a3b8",
    cursor: "pointer",
    fontSize: "14px",
  },

  activeMenu: {
    width: "100%",
    padding: "13px 15px",
    marginBottom: "6px",
    textAlign: "left",
    borderRadius: "11px",
    border:
      "1px solid rgba(0,229,255,0.3)",
    background:
      "rgba(0,229,255,0.08)",
    color: "#22d3ee",
    cursor: "pointer",
    fontSize: "14px",
    boxShadow:
      "0 0 15px rgba(0,229,255,0.08)",
  },

  sidebarBottom: {
    marginTop: "auto",
  },

  onlineBox: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "13px",
    borderRadius: "12px",
    background:
      "rgba(34,197,94,0.05)",
    border:
      "1px solid rgba(34,197,94,0.15)",
    marginBottom: "10px",
  },

  greenDot: {
    color: "#22c55e",
    textShadow:
      "0 0 10px #22c55e",
  },

  logoutButton: {
    width: "100%",
    padding: "12px",
    borderRadius: "11px",
    border:
      "1px solid rgba(239,68,68,0.2)",
    background:
      "rgba(239,68,68,0.06)",
    color: "#fca5a5",
    cursor: "pointer",
  },

  mainContent: {
    marginLeft: "265px",
    width: "calc(100% - 265px)",
    minHeight: "100vh",
    padding: "35px 45px",
    boxSizing: "border-box",
  },

  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
  },

  pageTitle: {
    margin: 0,
    fontSize: "30px",
  },

  pageSubtitle: {
    margin: "5px 0 0",
    color: "#64748b",
  },

  userBox: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "8px 15px",
    borderRadius: "30px",
    background:
      "rgba(15,23,42,0.8)",
    border:
      "1px solid rgba(0,229,255,0.15)",
  },

  userIcon: {
    fontSize: "25px",
  },

  hero: {
    padding: "35px",
    borderRadius: "25px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "25px",
    flexWrap: "wrap",
    marginBottom: "25px",
    background:
      "linear-gradient(135deg, rgba(0,229,255,0.1), rgba(139,92,246,0.12))",
    border:
      "1px solid rgba(0,229,255,0.2)",
    boxShadow:
      "0 0 30px rgba(0,229,255,0.05)",
  },

  heroRobot: {
    fontSize: "45px",
  },

  heroTitle: {
    fontSize: "30px",
    margin: "10px 0",
    textShadow:
      "0 0 15px rgba(0,229,255,0.35)",
  },

  heroText: {
    color: "#94a3b8",
    maxWidth: "650px",
    lineHeight: 1.6,
  },

  onlinePill: {
    padding: "12px 18px",
    borderRadius: "30px",
    color: "#4ade80",
    background:
      "rgba(34,197,94,0.07)",
    border:
      "1px solid rgba(34,197,94,0.3)",
    boxShadow:
      "0 0 15px rgba(34,197,94,0.08)",
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "16px",
    marginBottom: "35px",
  },

  statCard: {
    padding: "20px",
    borderRadius: "18px",
    background:
      "rgba(15,23,42,0.72)",
    border:
      "1px solid rgba(0,229,255,0.12)",
    boxShadow:
      "0 8px 30px rgba(0,0,0,0.2)",
  },

  statTop: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },

  statIcon: {
    width: "45px",
    height: "45px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "13px",
    background:
      "rgba(0,229,255,0.08)",
    fontSize: "22px",
  },

  statNumber: {
    fontSize: "28px",
    color: "#22d3ee",
    textShadow:
      "0 0 12px rgba(34,211,238,0.35)",
  },

  statTitle: {
    margin: "17px 0 5px",
  },

  statText: {
    margin: 0,
    color: "#64748b",
    fontSize: "13px",
  },

  sectionTitle: {
    fontSize: "23px",
    margin: "0 0 7px",
  },

  sectionText: {
    color: "#64748b",
    marginTop: 0,
  },

  agentGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "18px",
    marginTop: "20px",
  },

  agentCard: {
    textAlign: "left",
    padding: "25px",
    borderRadius: "20px",
    background:
      "rgba(15,23,42,0.7)",
    border:
      "1px solid rgba(0,229,255,0.15)",
    color: "#ffffff",
    cursor: "pointer",
    transition: "0.2s",
  },

  agentIcon: {
    fontSize: "32px",
    marginBottom: "15px",
  },

  agentTitle: {
    margin: "0 0 8px",
  },

  agentText: {
    color: "#94a3b8",
    lineHeight: 1.5,
    fontSize: "14px",
  },

  agentArrow: {
    display: "block",
    color: "#22d3ee",
    marginTop: "18px",
    fontWeight: 700,
  },

  aiPanel: {
    padding: "30px",
    borderRadius: "22px",
    background:
      "rgba(15,23,42,0.72)",
    border:
      "1px solid rgba(0,229,255,0.16)",
  },

  aiHeader: {
    display: "flex",
    alignItems: "center",
    gap: "18px",
    marginBottom: "25px",
  },

  aiRobot: {
    fontSize: "40px",
  },

  aiTitle: {
    margin: 0,
    fontSize: "25px",
  },

  aiSubtitle: {
    margin: "5px 0",
    color: "#64748b",
  },

  agentSelector: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    marginBottom: "20px",
  },

  agentSelectButton: {
    padding: "10px 18px",
    borderRadius: "10px",
    border:
      "1px solid rgba(0,229,255,0.15)",
    background:
      "rgba(15,23,42,0.8)",
    color: "#94a3b8",
    cursor: "pointer",
  },

  selectedAgent: {
    padding: "10px 18px",
    borderRadius: "10px",
    border:
      "1px solid #22d3ee",
    background:
      "rgba(34,211,238,0.1)",
    color: "#22d3ee",
    cursor: "pointer",
    boxShadow:
      "0 0 15px rgba(34,211,238,0.12)",
  },

  textarea: {
    width: "100%",
    minHeight: "150px",
    boxSizing: "border-box",
    resize: "vertical",
    padding: "18px",
    borderRadius: "15px",
    border:
      "1px solid rgba(0,229,255,0.18)",
    background: "#020617",
    color: "#ffffff",
    outline: "none",
    fontSize: "15px",
  },

  askButton: {
    marginTop: "15px",
    padding: "14px 25px",
    border: "none",
    borderRadius: "12px",
    background:
      "linear-gradient(90deg, #00e5ff, #8b5cf6)",
    color: "#ffffff",
    fontWeight: 700,
    cursor: "pointer",
    boxShadow:
      "0 0 20px rgba(0,229,255,0.2)",
  },

  answerBox: {
    marginTop: "25px",
    padding: "22px",
    borderRadius: "15px",
    background:
      "rgba(0,229,255,0.04)",
    border:
      "1px solid rgba(0,229,255,0.18)",
  },

  answerTitle: {
    color: "#22d3ee",
    fontWeight: 700,
    marginBottom: "12px",
  },

  answerText: {
    color: "#cbd5e1",
    lineHeight: 1.7,
    whiteSpace: "pre-wrap",
  },

  documentPanel: {
    textAlign: "center",
    padding: "70px 30px",
    borderRadius: "22px",
    background:
      "rgba(15,23,42,0.7)",
    border:
      "1px solid rgba(0,229,255,0.15)",
  },

  documentIcon: {
    fontSize: "60px",
    marginBottom: "15px",
  },

  uploadButton: {
    display: "inline-block",
    marginTop: "20px",
    padding: "15px 25px",
    borderRadius: "12px",
    background:
      "linear-gradient(90deg, #00e5ff, #8b5cf6)",
    color: "#ffffff",
    cursor: "pointer",
    fontWeight: 700,
    boxShadow:
      "0 0 20px rgba(0,229,255,0.2)",
  },

  documentCount: {
    marginTop: "20px",
    color: "#64748b",
  },
};

export default App;