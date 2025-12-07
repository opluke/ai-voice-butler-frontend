// frontend/src/components/HealthInputPanel.jsx

export default function HealthInputPanel({ mode, onUpdate }) {
  const handleSubmit = (e) => {
    e.preventDefault();

    const form = new FormData(e.target);
    const newData = {
      heartRate: Number(form.get("heartRate")),
      bloodPressure: `${form.get("bpHigh")} / ${form.get("bpLow")}`,
      glucose: Number(form.get("glucose")),
      steps: Number(form.get("steps")),
      sleep: Number(form.get("sleep")),
      mood: form.get("mood"),   // ⭐ 新增心情欄位
    };

    onUpdate(newData);
    e.target.reset();
  };

  if (mode !== "manual") return null;

  return (
    <form className="health-input-panel" onSubmit={handleSubmit}>
      <h3 className="hip-title">✍️ 手動輸入健康數據</h3>

      <div className="hip-row">
        <label>心跳（bpm）</label>
        <input name="heartRate" type="number" placeholder="例如：75" required />
      </div>

      <div className="hip-row">
        <label>血壓（mmHg）</label>
        <div className="hip-bp-group">
          <input name="bpHigh" type="number" placeholder="收縮壓" required />
          <span>/</span>
          <input name="bpLow" type="number" placeholder="舒張壓" required />
        </div>
      </div>

      <div className="hip-row">
        <label>血糖（mg/dL）</label>
        <input name="glucose" type="number" placeholder="例如：110" required />
      </div>

      <div className="hip-row">
        <label>今日步數</label>
        <input name="steps" type="number" placeholder="例如：3500" required />
      </div>

      <div className="hip-row">
        <label>睡眠（小時）</label>
        <input
          name="sleep"
          type="number"
          step="0.1"
          placeholder="例如：7.5"
          required
        />
      </div>

      {/* ⭐ 新增心情輸入欄位 */}
      <div className="hip-row">
        <label>心情狀態</label>
        <select name="mood" defaultValue="🙂 良好" required>
          <option>😄 開心</option>
          <option>🙂 良好</option>
          <option>😐 普通</option>
          <option>😪 疲倦</option>
          <option>😢 難過</option>
          <option>😡 生氣</option>
          <option>😣 不舒服</option>
        </select>
      </div>

      <button className="hip-submit">✔ 更新健康狀態</button>
    </form>
  );
}
