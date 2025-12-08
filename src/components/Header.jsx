// frontend/src/components/Header.jsx

export default function Header({ theme, toggleTheme, user, onLogout }) {
  return (
    <header className="app-header">
      {/* 左側：標題 */}
      <h1>AI 健康語音助理</h1>

      {/* 右側：登入資訊 / 主題切換 */}
      <div className="header-right">

        {/* 若有登入 → 顯示使用者名稱 & 登出 */}
        {user && (
          <div className="user-box">
            <div className="user-name">👤 {user.username}</div>
            <button className="logout-btn" onClick={onLogout}>
              登出
            </button>
          </div>
        )}

        {/* 主題切換按鈕 */}
        <button className="theme-btn" onClick={toggleTheme}>
          {theme === "light" ? "🌙 深色模式" : "☀️ 淺色模式"}
        </button>
      </div>
    </header>
  );
}
