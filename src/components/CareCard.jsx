export default function CareCard({ careMessage, onGenerate }) {
  return (
    <div className="care-card">
      <h2>💖 每日關懷</h2>

      <p className="care-text">
        {careMessage || "點擊下方按鈕，獲得今日關懷語句。"}
      </p>

      <button className="care-btn" onClick={onGenerate}>
        🌤 產生今日暖心一句
      </button>
    </div>
  );
}
