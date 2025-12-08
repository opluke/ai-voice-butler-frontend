// src/components/HealthDashboard.jsx

export default function HealthDashboard({ health }) {
  // ========= 先做一層安全包裝，避免 health 是 undefined =========
  const safe = {
    bloodPressure: health?.bloodPressure ?? "118 / 75",
    heartRate: health?.heartRate ?? 72,
    glucose: health?.glucose ?? 95,
    steps: health?.steps ?? 0,
    sleep: health?.sleep ?? 0,
    mood: health?.mood ?? "🙂 良好",
  };

  // ========= 安全拆血壓 =========
  let sys = 0;
  let dia = 0;
  if (safe.bloodPressure) {
    const parts = String(safe.bloodPressure).split("/");
    if (parts.length >= 2) {
      sys = Number(parts[0].trim());
      dia = Number(parts[1].trim());
    }
  }
  if (!Number.isFinite(sys) || !Number.isFinite(dia)) {
    sys = 120;
    dia = 80;
  }

  // ========= 各項異常判斷 =========
  const warn = {
    bp: sys > 140 || dia > 90,
    heart: safe.heartRate > 100 || safe.heartRate < 50,
    glucose: safe.glucose > 130 || safe.glucose < 70,
  };

  // ========= 心情判斷 =========
  const badMood = ["難過", "悲傷", "生氣", "不舒服", "累", "疲倦", "壓力", "煩"];
  const moodText = safe.mood;
  const moodAlert = badMood.some((k) => moodText.includes(k));

  return (
    <div className="health-dashboard">
      <h2 className="health-title">🩺 健康狀態儀表板</h2>

      <div className="health-grid">

        {/* 血壓 */}
        <div className={`health-card ${warn.bp ? "alert" : ""}`}>
          <div className="health-label">血壓</div>
          <div className="health-value">{safe.bloodPressure}</div>
          {warn.bp && (
            <div className="health-alert">⚠ 血壓偏高，請多休息並留意血壓變化</div>
          )}
        </div>

        {/* 心跳 */}
        <div className={`health-card ${warn.heart ? "alert" : ""}`}>
          <div className="health-label">心跳</div>
          <div className="health-value">{safe.heartRate} / 分</div>
          {warn.heart && (
            <div className="health-alert">⚠ 心跳異常，如持續不適請與醫師討論</div>
          )}
        </div>

        {/* 血糖 */}
        <div className={`health-card ${warn.glucose ? "alert" : ""}`}>
          <div className="health-label">血糖</div>
          <div className="health-value">{safe.glucose} mg/dL</div>
          {warn.glucose && (
            <div className="health-alert">⚠ 血糖偏離正常，請注意飲食與作息</div>
          )}
        </div>

        {/* 步數 */}
        <div className="health-card">
          <div className="health-label">今日步數</div>
          <div className="health-value">{safe.steps}</div>
        </div>

        {/* 睡眠 */}
        <div className="health-card">
          <div className="health-label">睡眠時數</div>
          <div className="health-value">{safe.sleep} 小時</div>
        </div>

        {/* 心情 */}
        <div className={`health-card ${moodAlert ? "alert" : ""}`}>
          <div className="health-label">今日心情</div>
          <div className="health-value">{moodText}</div>
          {moodAlert ? (
            <div className="health-alert">💗 今天心情好像有點沉重，我都在這陪你。</div>
          ) : (
            <div className="health-tip">狀態很不錯，維持良好的作息喔～</div>
          )}
        </div>
      </div>
    </div>
  );
}
