import { useState, type FormEvent } from "react";

const API_URL = "http://127.0.0.1:8001";

type LoginProps = {
  onLoginSuccess: (email: string) => void;
  onRegister: () => void;
};

function Login({ onLoginSuccess, onRegister }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();

    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || data.message || "Invalid email or password."
        );
      }

      onLoginSuccess(email.trim());
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to login. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* =====================================================
          TOP NAVIGATION
      ===================================================== */}

      <header className="top-nav">
        <div className="brand">
          <div className="brand-logo">🤖</div>

          <div>
            <div className="brand-name">Student AI</div>
            <div className="brand-subtitle">
              Intelligent Student Assistant
            </div>
          </div>
        </div>

        <div className="nav-status">
          <span className="online-dot"></span>
          System Online
        </div>
      </header>

      {/* =====================================================
          MAIN HORIZONTAL HERO
      ===================================================== */}

      <main className="main-container">
        <section className="hero-section">
          {/* LEFT */}

          <div className="hero-content">
            <div className="small-heading">
              🤖 SMART STUDENT SUPPORT
            </div>

            <h1>
              Your AI-powered
              <br />
              <span>student companion.</span>
            </h1>

            <p className="hero-description">
              Get intelligent assistance for your studies,
              career preparation, college information and
              academic documents — all in one place.
            </p>

            {/* FEATURES HORIZONTAL */}

            <div className="feature-row">
              <Feature
                icon="📚"
                title="Study"
                text="Learn & prepare"
              />

              <Feature
                icon="💼"
                title="Career"
                text="Build your future"
              />

              <Feature
                icon="🎓"
                title="College"
                text="Academic support"
              />

              <Feature
                icon="📄"
                title="Documents"
                text="Ask from PDFs"
              />
            </div>
          </div>

          {/* LOGIN CARD */}

          <div className="login-card">
            <div className="login-icon">👋</div>

            <h2>Welcome Back</h2>

            <p className="login-subtitle">
              Sign in to access your Student AI dashboard.
            </p>

            {error && (
              <div className="error-box">
                ❌ {error}
              </div>
            )}

            <form onSubmit={handleLogin}>
              {/* EMAIL */}

              <label>Email Address</label>

              <div className="input-wrapper">
                <span>✉️</span>

                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  autoComplete="email"
                />
              </div>

              {/* PASSWORD */}

              <label>Password</label>

              <div className="input-wrapper">
                <span>🔒</span>

                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  autoComplete="current-password"
                />
              </div>

              <button
                type="submit"
                className="login-button"
                disabled={loading}
              >
                {loading
                  ? "⏳ Signing in..."
                  : "🔐 Sign In"}
              </button>
            </form>

            <div className="register-text">
              Don't have an account?

              <button
                onClick={onRegister}
                className="register-button"
              >
                Create Account
              </button>
            </div>

            <div className="secure-text">
              🔒 Secure student account
            </div>
          </div>
        </section>

        {/* =====================================================
            AI AGENTS SECTION
        ===================================================== */}

        <section className="agents-section">
          <div className="section-title">
            Everything you need in one place
          </div>

          <div className="agent-cards">
            <AgentCard
              icon="📚"
              title="Study Agent"
              description="Get explanations, notes, concepts and exam preparation assistance."
            />

            <AgentCard
              icon="💼"
              title="Career Agent"
              description="Improve your resume, prepare for interviews and discover career paths."
            />

            <AgentCard
              icon="🎓"
              title="College Agent"
              description="Ask questions about college information, subjects, syllabus and documents."
            />

            <AgentCard
              icon="📄"
              title="Document Assistant"
              description="Upload academic PDFs and interact with your study material."
            />
          </div>
        </section>
      </main>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="footer">
        <div>
          © 2026 Student AI
        </div>

        <div>
          AI-powered academic assistance
        </div>

        <div>
          🟢 Services Available
        </div>
      </footer>

      {/* =====================================================
          CSS
      ===================================================== */}

      <style>{`
        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          font-family:
            Inter,
            Arial,
            Helvetica,
            sans-serif;
          background: #f8fafc;
        }

        .login-page {
          min-height: 100vh;
          width: 100%;
          background:
            linear-gradient(
              135deg,
              #f8fbff 0%,
              #eef4ff 45%,
              #f7f5ff 100%
            );
          color: #172033;
        }

        /* NAVBAR */

        .top-nav {
          height: 78px;
          width: 100%;
          padding: 0 6%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: rgba(255,255,255,0.9);
          border-bottom: 1px solid #e5eaf2;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .brand-logo {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 25px;
          background:
            linear-gradient(
              135deg,
              #2563eb,
              #6366f1
            );
          box-shadow:
            0 7px 18px
            rgba(37,99,235,0.25);
        }

        .brand-name {
          font-size: 21px;
          font-weight: 800;
          color: #172033;
        }

        .brand-subtitle {
          font-size: 11px;
          color: #718096;
          margin-top: 2px;
        }

        .nav-status {
          padding: 9px 16px;
          border-radius: 25px;
          background: #f0fdf4;
          color: #15803d;
          border: 1px solid #bbf7d0;
          font-size: 13px;
          font-weight: 700;
        }

        .online-dot {
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #22c55e;
          margin-right: 7px;
        }

        /* MAIN */

        .main-container {
          width: 88%;
          max-width: 1450px;
          margin: 0 auto;
        }

        /* HERO */

        .hero-section {
          min-height: 460px;
          padding: 55px 0 45px;
          display: grid;
          grid-template-columns:
            1fr
            410px;
          gap: 80px;
          align-items: center;
        }

        .hero-content {
          padding-left: 25px;
        }

        .small-heading {
          color: #4f46e5;
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 1.5px;
          margin-bottom: 18px;
        }

        .hero-content h1 {
          margin: 0;
          font-size: clamp(42px, 5vw, 68px);
          line-height: 1.08;
          letter-spacing: -2px;
          color: #172033;
        }

        .hero-content h1 span {
          background:
            linear-gradient(
              90deg,
              #2563eb,
              #7c3aed
            );
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .hero-description {
          max-width: 690px;
          font-size: 17px;
          line-height: 1.7;
          color: #64748b;
          margin: 24px 0 32px;
        }

        /* FEATURE ROW */

        .feature-row {
          display: grid;
          grid-template-columns:
            repeat(4, 1fr);
          gap: 12px;
          max-width: 720px;
        }

        .feature {
          padding: 15px;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 14px;
          box-shadow:
            0 5px 18px
            rgba(15,23,42,0.05);
        }

        .feature-icon {
          font-size: 22px;
          margin-bottom: 8px;
        }

        .feature-title {
          font-size: 14px;
          font-weight: 800;
          color: #1e293b;
        }

        .feature-text {
          font-size: 11px;
          color: #64748b;
          margin-top: 3px;
        }

        /* LOGIN CARD */

        .login-card {
          background: white;
          border-radius: 24px;
          padding: 32px;
          border: 1px solid #e2e8f0;
          box-shadow:
            0 20px 55px
            rgba(30,64,175,0.12);
        }

        .login-icon {
          width: 50px;
          height: 50px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #eff6ff;
          font-size: 25px;
          margin-bottom: 17px;
        }

        .login-card h2 {
          margin: 0 0 7px;
          font-size: 27px;
          color: #111827;
        }

        .login-subtitle {
          margin: 0 0 22px;
          font-size: 13px;
          line-height: 1.5;
          color: #64748b;
        }

        .error-box {
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #b91c1c;
          padding: 10px 12px;
          border-radius: 9px;
          font-size: 12px;
          margin-bottom: 16px;
        }

        .login-card label {
          display: block;
          font-size: 12px;
          font-weight: 800;
          color: #374151;
          margin-bottom: 7px;
        }

        .input-wrapper {
          height: 46px;
          display: flex;
          align-items: center;
          gap: 9px;
          border: 1px solid #dbe2ea;
          border-radius: 10px;
          padding: 0 12px;
          margin-bottom: 16px;
          background: #f8fafc;
        }

        .input-wrapper:focus-within {
          border-color: #4f46e5;
          background: white;
          box-shadow:
            0 0 0 3px
            rgba(79,70,229,0.08);
        }

        .input-wrapper span {
          font-size: 16px;
        }

        .input-wrapper input {
          width: 100%;
          height: 100%;
          border: none;
          outline: none;
          background: transparent;
          font-size: 13px;
          color: #1e293b;
        }

        .login-button {
          width: 100%;
          height: 48px;
          border: none;
          border-radius: 10px;
          color: white;
          font-size: 14px;
          font-weight: 800;
          cursor: pointer;
          background:
            linear-gradient(
              135deg,
              #2563eb,
              #4f46e5
            );
          box-shadow:
            0 8px 18px
            rgba(37,99,235,0.25);
          transition: 0.2s;
        }

        .login-button:hover {
          transform: translateY(-1px);
          box-shadow:
            0 11px 23px
            rgba(37,99,235,0.32);
        }

        .login-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .register-text {
          text-align: center;
          margin-top: 20px;
          color: #64748b;
          font-size: 12px;
        }

        .register-button {
          border: none;
          background: transparent;
          color: #2563eb;
          font-weight: 800;
          cursor: pointer;
          margin-left: 5px;
          font-size: 12px;
        }

        .secure-text {
          text-align: center;
          margin-top: 16px;
          font-size: 10px;
          color: #94a3b8;
        }

        /* AGENTS */

        .agents-section {
          padding: 18px 0 48px;
        }

        .section-title {
          text-align: center;
          font-size: 19px;
          font-weight: 800;
          color: #1e293b;
          margin-bottom: 20px;
        }

        .agent-cards {
          display: grid;
          grid-template-columns:
            repeat(4, 1fr);
          gap: 18px;
        }

        .agent-card {
          background: white;
          padding: 23px;
          border-radius: 17px;
          border: 1px solid #e2e8f0;
          transition: 0.2s;
        }

        .agent-card:hover {
          transform: translateY(-4px);
          box-shadow:
            0 12px 28px
            rgba(15,23,42,0.08);
        }

        .agent-icon {
          width: 46px;
          height: 46px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 13px;
          background: #eff6ff;
          font-size: 23px;
          margin-bottom: 14px;
        }

        .agent-card h3 {
          margin: 0 0 7px;
          font-size: 16px;
          color: #1e293b;
        }

        .agent-card p {
          margin: 0;
          font-size: 12px;
          line-height: 1.6;
          color: #64748b;
        }

        /* FOOTER */

        .footer {
          width: 100%;
          min-height: 60px;
          padding: 15px 6%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          background: white;
          border-top: 1px solid #e5e7eb;
          color: #94a3b8;
          font-size: 11px;
        }

        /* RESPONSIVE */

        @media (max-width: 1050px) {
          .hero-section {
            grid-template-columns: 1fr 360px;
            gap: 35px;
          }

          .feature-row {
            grid-template-columns:
              repeat(2, 1fr);
          }

          .agent-cards {
            grid-template-columns:
              repeat(2, 1fr);
          }
        }

        @media (max-width: 800px) {
          .top-nav {
            padding: 0 5%;
          }

          .main-container {
            width: 92%;
          }

          .hero-section {
            grid-template-columns: 1fr;
            gap: 35px;
            padding-top: 35px;
          }

          .hero-content {
            padding-left: 0;
          }

          .hero-content h1 {
            font-size: 44px;
          }

          .login-card {
            max-width: 500px;
            width: 100%;
            margin: auto;
          }

          .footer {
            flex-direction: column;
            justify-content: center;
          }
        }

        @media (max-width: 500px) {
          .brand-subtitle {
            display: none;
          }

          .nav-status {
            font-size: 11px;
            padding: 7px 10px;
          }

          .hero-content h1 {
            font-size: 38px;
          }

          .feature-row,
          .agent-cards {
            grid-template-columns: 1fr;
          }

          .login-card {
            padding: 25px;
          }
        }
      `}</style>
    </div>
  );
}

/* ============================================================
   FEATURE
============================================================ */

function Feature({
  icon,
  title,
  text,
}: {
  icon: string;
  title: string;
  text: string;
}) {
  return (
    <div className="feature">
      <div className="feature-icon">
        {icon}
      </div>

      <div className="feature-title">
        {title}
      </div>

      <div className="feature-text">
        {text}
      </div>
    </div>
  );
}

/* ============================================================
   AGENT CARD
============================================================ */

function AgentCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="agent-card">
      <div className="agent-icon">
        {icon}
      </div>

      <h3>{title}</h3>

      <p>{description}</p>
    </div>
  );
}

export default Login;