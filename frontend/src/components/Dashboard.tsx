type DashboardProps = {
  totalQuestions: number;
  studyQuestions: number;
  careerQuestions: number;
  collegeQuestions: number;
  pdfCount: number;
};

function Dashboard({
  totalQuestions,
  studyQuestions,
  careerQuestions,
  collegeQuestions,
  pdfCount,
}: DashboardProps) {
  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "30px",
        background:
          "radial-gradient(circle at top left, #172554 0%, #080b18 40%, #020617 100%)",
        color: "#ffffff",
        fontFamily: "Inter, Arial, sans-serif",
      }}
    >
      {/* TOP HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
          padding: "20px 24px",
          borderRadius: "20px",
          background: "rgba(15, 23, 42, 0.75)",
          border: "1px solid rgba(34, 211, 238, 0.25)",
          boxShadow: "0 0 25px rgba(34, 211, 238, 0.08)",
        }}
      >
        <div>
          <div
            style={{
              fontSize: "13px",
              color: "#22d3ee",
              letterSpacing: "2px",
              textTransform: "uppercase",
              marginBottom: "6px",
            }}
          >
            Intelligent Assistant
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: "28px",
              fontWeight: 800,
              background:
                "linear-gradient(90deg, #22d3ee, #818cf8, #c084fc)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            🤖 Student AI
          </h1>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "9px",
            padding: "10px 16px",
            borderRadius: "30px",
            background: "rgba(34, 197, 94, 0.08)",
            border: "1px solid rgba(74, 222, 128, 0.35)",
            color: "#4ade80",
            fontSize: "13px",
            fontWeight: 600,
            boxShadow: "0 0 15px rgba(74, 222, 128, 0.08)",
          }}
        >
          <span
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: "#4ade80",
              boxShadow: "0 0 12px #4ade80",
            }}
          />
          System Online
        </div>
      </div>

      {/* HERO SECTION */}
      <div
        style={{
          position: "relative",
          overflow: "hidden",
          padding: "45px",
          borderRadius: "28px",
          marginBottom: "28px",
          background:
            "linear-gradient(135deg, rgba(8,47,73,0.95), rgba(30,27,75,0.95))",
          border: "1px solid rgba(34, 211, 238, 0.35)",
          boxShadow:
            "0 0 30px rgba(34,211,238,0.12), inset 0 0 30px rgba(99,102,241,0.06)",
        }}
      >
        {/* Neon decoration */}
        <div
          style={{
            position: "absolute",
            width: "220px",
            height: "220px",
            right: "-80px",
            top: "-100px",
            borderRadius: "50%",
            background: "rgba(34, 211, 238, 0.08)",
            boxShadow: "0 0 80px rgba(34, 211, 238, 0.15)",
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 1,
          }}
        >
          <div
            style={{
              display: "inline-flex",
              padding: "8px 14px",
              borderRadius: "20px",
              background: "rgba(34, 211, 238, 0.08)",
              border: "1px solid rgba(34, 211, 238, 0.3)",
              color: "#67e8f9",
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "1px",
              marginBottom: "20px",
            }}
          >
            ✦ AI POWERED STUDENT SUPPORT
          </div>

          <h2
            style={{
              margin: "0 0 14px",
              fontSize: "42px",
              fontWeight: 800,
              lineHeight: 1.15,
              background:
                "linear-gradient(90deg, #ffffff, #67e8f9, #a5b4fc)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Welcome to Student AI
          </h2>

          <p
            style={{
              margin: 0,
              maxWidth: "680px",
              color: "#cbd5e1",
              fontSize: "16px",
              lineHeight: 1.8,
            }}
          >
            Your intelligent companion for study, career, college,
            documents, and academic support.
          </p>

          <div
            style={{
              marginTop: "25px",
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              padding: "11px 18px",
              borderRadius: "30px",
              background: "rgba(34,211,238,0.08)",
              border: "1px solid rgba(34,211,238,0.25)",
              color: "#67e8f9",
              fontSize: "13px",
            }}
          >
            🟢 AI Services Online
          </div>
        </div>
      </div>

      {/* STATISTICS TITLE */}
      <div style={{ marginBottom: "16px" }}>
        <h2
          style={{
            margin: 0,
            fontSize: "20px",
            color: "#f8fafc",
          }}
        >
          Activity Overview
        </h2>

        <p
          style={{
            margin: "6px 0 0",
            color: "#64748b",
            fontSize: "13px",
          }}
        >
          Your Student AI usage statistics
        </p>
      </div>

      {/* STATISTICS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
          gap: "18px",
          marginBottom: "35px",
        }}
      >
        <StatCard
          icon="💬"
          title="Questions"
          value={totalQuestions}
          description="Total questions asked"
        />

        <StatCard
          icon="📚"
          title="Study"
          value={studyQuestions}
          description="Study conversations"
        />

        <StatCard
          icon="💼"
          title="Career"
          value={careerQuestions}
          description="Career conversations"
        />

        <StatCard
          icon="🎓"
          title="College"
          value={collegeQuestions}
          description="College conversations"
        />

        <StatCard
          icon="📄"
          title="Documents"
          value={pdfCount}
          description="PDFs uploaded"
        />
      </div>

      {/* AGENTS */}
      <div style={{ marginBottom: "18px" }}>
        <h2
          style={{
            margin: 0,
            fontSize: "24px",
            color: "#f8fafc",
          }}
        >
          Choose AI Agent
        </h2>

        <p
          style={{
            margin: "7px 0 0",
            color: "#64748b",
            fontSize: "14px",
          }}
        >
          Select an intelligent assistant based on what you need.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "20px",
        }}
      >
        <AgentCard
          icon="📚"
          title="Study Agent"
          description="Get help with subjects, concepts, exams and study preparation."
          glow="#22d3ee"
        />

        <AgentCard
          icon="💼"
          title="Career Agent"
          description="Get guidance for jobs, resumes, interviews and career skills."
          glow="#a78bfa"
        />

        <AgentCard
          icon="🎓"
          title="College Agent"
          description="Ask questions about college, syllabus, documents and academics."
          glow="#38bdf8"
        />
      </div>
    </div>
  );
}

/* =========================================================
   STAT CARD
========================================================= */

type StatCardProps = {
  icon: string;
  title: string;
  value: number;
  description: string;
};

function StatCard({
  icon,
  title,
  value,
  description,
}: StatCardProps) {
  return (
    <div
      style={{
        padding: "22px",
        borderRadius: "20px",
        background:
          "linear-gradient(145deg, rgba(15,23,42,0.95), rgba(8,15,30,0.95))",
        border: "1px solid rgba(148,163,184,0.14)",
        boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
        transition: "all 0.3s ease",
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
        <div
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "15px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "22px",
            background: "rgba(34,211,238,0.08)",
            border: "1px solid rgba(34,211,238,0.2)",
            boxShadow: "0 0 18px rgba(34,211,238,0.08)",
          }}
        >
          {icon}
        </div>

        <div
          style={{
            fontSize: "30px",
            fontWeight: 800,
            color: "#67e8f9",
            textShadow: "0 0 15px rgba(34,211,238,0.35)",
          }}
        >
          {value}
        </div>
      </div>

      <h3
        style={{
          margin: "0 0 6px",
          fontSize: "16px",
          color: "#f8fafc",
        }}
      >
        {title}
      </h3>

      <p
        style={{
          margin: 0,
          color: "#64748b",
          fontSize: "13px",
        }}
      >
        {description}
      </p>
    </div>
  );
}

/* =========================================================
   AGENT CARD
========================================================= */

type AgentCardProps = {
  icon: string;
  title: string;
  description: string;
  glow: string;
};

function AgentCard({
  icon,
  title,
  description,
  glow,
}: AgentCardProps) {
  return (
    <div
      style={{
        padding: "28px",
        borderRadius: "22px",
        background:
          "linear-gradient(145deg, rgba(15,23,42,0.96), rgba(8,15,30,0.96))",
        border: `1px solid ${glow}55`,
        boxShadow: `0 0 25px ${glow}12`,
        transition: "all 0.3s ease",
      }}
    >
      <div
        style={{
          width: "58px",
          height: "58px",
          borderRadius: "17px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "28px",
          marginBottom: "20px",
          background: `${glow}12`,
          border: `1px solid ${glow}55`,
          boxShadow: `0 0 20px ${glow}20`,
        }}
      >
        {icon}
      </div>

      <h3
        style={{
          margin: "0 0 10px",
          fontSize: "19px",
          color: "#f8fafc",
        }}
      >
        {title}
      </h3>

      <p
        style={{
          margin: 0,
          color: "#94a3b8",
          fontSize: "14px",
          lineHeight: 1.7,
        }}
      >
        {description}
      </p>

      <div
        style={{
          marginTop: "20px",
          color: glow,
          fontSize: "12px",
          fontWeight: 700,
          letterSpacing: "1px",
        }}
      >
        ONLINE • READY →
      </div>
    </div>
  );
}

export default Dashboard;