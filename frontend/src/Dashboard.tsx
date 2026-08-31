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
    <section style={{ marginBottom: "28px" }}>
      {/* Welcome Header */}
      <div
        style={{
          background:
            "linear-gradient(135deg, #2563eb 0%, #4f46e5 55%, #7c3aed 100%)",
          borderRadius: "24px",
          padding: "36px",
          color: "white",
          marginBottom: "24px",
          boxShadow: "0 12px 35px rgba(79, 70, 229, 0.20)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "25px",
            flexWrap: "wrap",
          }}
        >
          <div>
            <div
              style={{
                fontSize: "42px",
                marginBottom: "12px",
              }}
            >
              🤖
            </div>

            <h2
              style={{
                margin: "0 0 10px",
                fontSize: "32px",
                fontWeight: 700,
              }}
            >
              Welcome to Student AI
            </h2>

            <p
              style={{
                margin: 0,
                fontSize: "16px",
                opacity: 0.9,
                lineHeight: 1.6,
                maxWidth: "600px",
              }}
            >
              Your intelligent companion for study, career, and college
              support.
            </p>
          </div>

          <div
            style={{
              background: "rgba(255,255,255,0.16)",
              border: "1px solid rgba(255,255,255,0.25)",
              padding: "12px 18px",
              borderRadius: "30px",
              fontSize: "14px",
              fontWeight: 600,
              whiteSpace: "nowrap",
            }}
          >
            🟢 AI Services Online
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
          gap: "18px",
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
    </section>
  );
}

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
        background: "#ffffff",
        borderRadius: "18px",
        padding: "20px",
        border: "1px solid #e5e7eb",
        boxShadow: "0 5px 20px rgba(15, 23, 42, 0.06)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "16px",
        }}
      >
        <div
          style={{
            width: "46px",
            height: "46px",
            borderRadius: "13px",
            background: "#eff6ff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "22px",
          }}
        >
          {icon}
        </div>

        <span
          style={{
            fontSize: "26px",
            fontWeight: 700,
            color: "#1e293b",
          }}
        >
          {value}
        </span>
      </div>

      <h3
        style={{
          margin: "0 0 6px",
          fontSize: "16px",
          color: "#1e293b",
        }}
      >
        {title}
      </h3>

      <p
        style={{
          margin: 0,
          fontSize: "13px",
          color: "#64748b",
        }}
      >
        {description}
      </p>
    </div>
  );
}

export default Dashboard;