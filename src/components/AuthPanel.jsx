// frontend/src/components/AuthPanel.jsx
import { useState } from "react";

export default function AuthPanel({ onLoginSuccess }) {
  const [mode, setMode] = useState("login"); // 'login' 或 'register'
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const title = mode === "login" ? "登入健康管家" : "建立新帳號";
  const switchText =
    mode === "login" ? "還沒有帳號嗎？" : "已經有帳號了嗎？";
  const switchBtnText = mode === "login" ? "註冊一個" : "改為登入";

  const resetForm = () => {
    setError("");
    setPassword("");
  };

  const handleSwitchMode = () => {
    setMode((prev) => (prev === "login" ? "register" : "login"));
    resetForm();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password || (mode === "register" && !name)) {
      setError("請把資料填寫完整唷。");
      return;
    }

    try {
      setLoading(true);

      // 模擬等待一下（純前端 demo）
      await new Promise((resolve) => setTimeout(resolve, 500));

      // 用 localStorage 當成簡單帳號儲存
      const STORAGE_KEY = "health_app_user";
      const saved = localStorage.getItem(STORAGE_KEY);
      const savedUser = saved ? JSON.parse(saved) : null;

      if (mode === "register") {
        // 若已有帳號且 email 一樣，不允許重複註冊
        if (savedUser && savedUser.email === email) {
          setError("此 Email 已經註冊過囉，請直接登入。");
          return;
        }

        const userData = { name, email, password };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
        onLoginSuccess({ name, email }); // 通知 App 已登入
        return;
      }

      // ====== login 模式 ======
      if (!savedUser) {
        setError("目前沒有已註冊的帳號，請先註冊。");
        return;
      }

      if (savedUser.email !== email || savedUser.password !== password) {
        setError("Email 或密碼不正確，請再確認一次喔。");
        return;
      }

      // 登入成功
      onLoginSuccess({ name: savedUser.name, email: savedUser.email });
    } catch (err) {
      console.error(err);
      setError("登入時發生問題，等等再試試看～");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-overlay">
      <div className="auth-card">
        <h2>{title}</h2>
        <p className="auth-subtitle">
          歡迎使用 AI 健康小管家，我會幫你一起記錄與關心每天的身體狀況 🌿
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          {mode === "register" && (
            <div className="input-row">
              <label>稱呼 / 暱稱</label>
              <input
                type="text"
                placeholder="例如：阿嬤、小明爸"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}

          <div className="input-row">
            <label>Email</label>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-row">
            <label>密碼</label>
            <input
              type="password"
              placeholder="請輸入密碼"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <div className="auth-error">{error}</div>}

          <button
            type="submit"
            className="auth-submit-btn"
            disabled={loading}
          >
            {loading
              ? mode === "login"
                ? "登入中..."
                : "建立中..."
              : mode === "login"
              ? "立即登入"
              : "建立帳號"}
          </button>
        </form>

        <div className="auth-switch">
          {switchText}
          <button type="button" onClick={handleSwitchMode}>
            {switchBtnText}
          </button>
        </div>
      </div>
    </div>
  );
}
