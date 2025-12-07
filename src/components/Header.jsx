// src/components/HealthDashboard.jsx
export default function HealthDashboard({ health }) {
  // ========= 安全拆血壓 =========
  let sys = 0;
  let dia = 0;
  if (health.bloodPressure) {
    const parts = health.bloodPressure.split("/");
    if (parts.length >= 2) {
      sys = Number(parts[0]);
      dia = Number(parts[1]);
    }
  }

  // ========= 各項異常判斷 =========
  const warn = {
    bp: sys > 140 || dia > 90,                            // 高血壓
    heart: health.heartRate > 100 || health.heartRate < 50, // 心跳過快/過慢
    glucose: health.glucose > 130 || health.glucose < 70, // 高/低血糖
  };

  // ========= 心情異常（簡單用關鍵字判斷） =========
  const badMoodKeywords = ["難過", "悲傷", "生氣", "不舒服", "累", "疲倦", "壓力", "煩"];
  const moodText = health.mood || ""; // 避免 undefined
  const moodAlert = badMoodKeywords.some((kw) => moodText.includes(kw));

  return (
    <div className="health-dashboard">
      <h2 className="health-title">🩺 健康狀態儀表板</h2>

      <div className="health-grid">

        {/* 血壓 */}
        <div className={`health-card ${warn.bp ? "alert" : ""}`}>
          <div className="health-label">血壓</div>
          <div className="health-value">{health.bloodPressure}</div>
          {warn.bp && (
            <div className="health-alert">⚠ 血壓偏高，請多休息並留意血壓變化</div>
          )}
        </div>

        {/* 心跳 */}
        <div className={`health-card ${warn.heart ? "alert" : ""}`}>
          <div className="health-label">心跳</div>
          <div className="health-value">{health.heartRate} / 分</div>
          {warn.heart && (
            <div className="health-alert">⚠ 心跳異常，如持續不適請與醫師討論</div>
          )}
        </div>

        {/* 血糖 */}
        <div className={`health-card ${warn.glucose ? "alert" : ""}`}>
          <div className="health-label">血糖</div>
          <div className="health-value">{health.glucose} mg/dL</div>
          {warn.glucose && (
            <div className="health-alert">⚠ 血糖偏離正常，請注意飲食與作息</div>
          )}
        </div>

        {/* 步數 */}
        <div className="health-card">
          <div className="health-label">今日步數</div>
          <div className="health-value">{health.steps}</div>
        </div>

        {/* 睡眠 */}
        <div className="health-card">
          <div className="health-label">睡眠時數</div>
          <div className="health-value">{health.sleep} 小時</div>
        </div>

        {/* 今日心情 */}
        <div className={`health-card ${moodAlert ? "alert" : ""}`}>
          <div className="health-label">今日心情</div>
          <div className="health-value">{moodText}</div>
          {moodAlert ? (
            <div className="health-alert">
              💗 今天心情好像有點沉重，如果願意可以跟我聊聊，我陪你一起慢慢調整。
            </div>
          ) : (
            <div className="health-tip">
              保持這樣的狀態很好，維持規律作息與放鬆，也很重要喔～
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
