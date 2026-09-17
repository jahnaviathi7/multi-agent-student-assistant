import { FormEvent, useState } from "react";

type RegisterProps = {
  onLogin: () => void;
  onBackToLogin: () => void;
};

const API_URL = "http://127.0.0.1:8000";

function Register({ onLogin, onBackToLogin }: RegisterProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleRegister(e: FormEvent) {
    e.preventDefault();

    setError("");
    setMessage("");

    if (!name.trim() || !email.trim() || !password.trim()) {
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
          name: name.trim(),
          email: email.trim(),
          password,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.detail || data.message || "Registration failed."
        );
      }

      setMessage("Account created successfully! Redirecting to login...");

      setName("");
      setEmail("");
      setPassword("");

      setTimeout(() => {
        onLogin();
      }, 1200);
    } catch (err) {
      console.error("Register error:", err);

      if (err instanceof TypeError) {
        setError(
          "Cannot connect to the backend. Make sure FastAPI is running on port 8000."
        );
      } else {
        setError(
          err instanceof Error ? err.message : "Registration failed."
        );
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.backgroundGlowOne} />
      <div style={styles.backgroundGlowTwo} />

      <div style={styles.card}>
        <div style={styles.logo}>🤖</div>

        <h1 style={styles.title}>Join Student AI</h1>

        <p style={styles.subtitle}>
          Create your intelligent learning account
        </p>

        {error && (
          <div style={styles.error}>
            ❌ {error}
          </div>
        )}

        {message && (
          <div style={styles.success}>
            ✅ {message}
          </div>
        )}

        <form onSubmit={handleRegister}>
          <label style={styles.label}>Full Name</label>

          <input
            type="text"
            placeholder="Enter your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={styles.input}
            disabled={loading}
          />

          <label style={styles.label}>Email</label>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            disabled={loading}
          />

          <label style={styles.label}>Password</label>

          <input
            type="password"
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            disabled={loading}
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.button,
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "⏳ Creating..." : "🚀 Create Account"}
          </button>
        </form>

        <div style={styles.divider}>
          <span>Already have an account?</span>
        </div>

        <button
          type="button"
          onClick={onBackToLogin}
          disabled={loading}
          style={styles.loginButton}
        >
          🔐 Back to Login
        </button>

        <div style={styles.footer}>
          Student AI • Intelligent Student Assistant
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background:
      "radial-gradient(circle at top left, #172554 0%, #020617 45%, #000000 100%)",
    position: "relative",
    overflow: "hidden",
    fontFamily: "Inter, Arial, sans-serif",
    padding: "30px 20px",
    boxSizing: "border-box",
  },

  backgroundGlowOne: {
    position: "absolute",
    width: "350px",
    height: "350px",
    borderRadius: "50%",
    background: "#00f5ff",
    opacity: 0.12,
    filter: "blur(100px)",
    top: "-120px",
    left: "-100px",
  },

  backgroundGlowTwo: {
    position: "absolute",
    width: "400px",
    height: "400px",
    borderRadius: "50%",
    background: "#a855f7",
    opacity: 0.12,
    filter: "blur(110px)",
    bottom: "-150px",
    right: "-120px",
  },

  card: {
    width: "100%",
    maxWidth: "480px",
    padding: "42px",
    borderRadius: "28px",
    background: "rgba(15, 23, 42, 0.82)",
    border: "1px solid rgba(0, 245, 255, 0.25)",
    boxShadow:
      "0 0 30px rgba(0, 245, 255, 0.10), 0 25px 80px rgba(0, 0, 0, 0.55)",
    backdropFilter: "blur(20px)",
    position: "relative",
    zIndex: 2,
    boxSizing: "border-box",
  },

  logo: {
    width: "78px",
    height: "78px",
    margin: "0 auto 20px",
    borderRadius: "22px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "40px",
    background:
      "linear-gradient(135deg, rgba(0,245,255,.18), rgba(168,85,247,.2))",
    border: "1px solid rgba(0,245,255,.35)",
    boxShadow: "0 0 30px rgba(0,245,255,.18)",
  },

  title: {
    color: "#ffffff",
    textAlign: "center",
    margin: "0 0 10px",
    fontSize: "32px",
    fontWeight: 800,
  },

  subtitle: {
    color: "#94a3b8",
    textAlign: "center",
    margin: "0 0 30px",
    fontSize: "15px",
  },

  label: {
    display: "block",
    color: "#cbd5e1",
    fontSize: "14px",
    fontWeight: 600,
    marginBottom: "8px",
    marginTop: "18px",
  },

  input: {
    width: "100%",
    padding: "14px 16px",
    borderRadius: "13px",
    border: "1px solid rgba(148,163,184,.25)",
    background: "rgba(2,6,23,.75)",
    color: "#ffffff",
    outline: "none",
    fontSize: "15px",
    boxSizing: "border-box",
  },

  button: {
    width: "100%",
    marginTop: "28px",
    padding: "15px",
    borderRadius: "14px",
    border: "none",
    background:
      "linear-gradient(135deg, #06b6d4, #2563eb, #7c3aed)",
    color: "#ffffff",
    fontSize: "16px",
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "0 0 25px rgba(6,182,212,.25)",
  },

  loginButton: {
    width: "100%",
    padding: "14px",
    borderRadius: "14px",
    border: "1px solid rgba(0,245,255,.35)",
    background: "rgba(0,245,255,.06)",
    color: "#67e8f9",
    fontSize: "15px",
    fontWeight: 700,
    cursor: "pointer",
  },

  divider: {
    textAlign: "center",
    color: "#64748b",
    fontSize: "13px",
    margin: "24px 0 14px",
  },

  error: {
    background: "rgba(239,68,68,.12)",
    border: "1px solid rgba(239,68,68,.35)",
    color: "#fca5a5",
    padding: "12px",
    borderRadius: "12px",
    fontSize: "14px",
    marginBottom: "18px",
  },

  success: {
    background: "rgba(34,197,94,.12)",
    border: "1px solid rgba(34,197,94,.35)",
    color: "#86efac",
    padding: "12px",
    borderRadius: "12px",
    fontSize: "14px",
    marginBottom: "18px",
  },

  footer: {
    textAlign: "center",
    color: "#475569",
    fontSize: "12px",
    marginTop: "28px",
  },
};

export default Register;