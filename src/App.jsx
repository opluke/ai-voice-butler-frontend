// frontend/src/App.jsx
import { useState } from "react";
import ChatWindow from "./components/ChatWindow";
import VoiceRecorder from "./components/VoiceRecorder";
import CareCard from "./components/CareCard";
import Header from "./components/Header";
import HealthDashboard from "./components/HealthDashboard";
import HealthInputPanel from "./components/HealthInputPanel";
import HealthChart from "./components/HealthChart";
import AuthPanel from "./components/AuthPanel";
import { api } from "./services/api";
import "./index.css";

// ----------- 中文數字轉阿拉伯數字 -----------
const chineseMap = {
  "零": 0, "○": 0, "〇": 0,
  "一": 1, "二": 2, "兩": 2,
  "三": 3, "四": 4, "五": 5,
  "六": 6, "七": 7, "八": 8,
  "九": 9, "十": 10, "百": 100, "千": 1000,
};

function chineseToNumber(str) {
  let total = 0, section = 0, number = 0;
  for (const char of str) {
    const val = chineseMap[char];
    if (val == null) continue;

    if (val < 10) number = val;
    else {
      section += (number || 1) * val;
      number = 0;
    }
  }
  return total + section + number;
}

// ⭐ 確保每次 push history 都是完整的資料
function fillHealthDefaults(data) {
  return {
    heartRate: data.heartRate ?? 72,
    bloodPressure: data.bloodPressure ?? "118 / 75",
    glucose: data.glucose ?? 95,
    steps: data.steps ?? 3000,
    sleep: data.sleep ?? 7,
    mood: data.mood ?? "🙂 良好",
  };
}

export default function App() {
  const [theme, setTheme] = useState("light");
  const [messages, setMessages] = useState([]);
  const [careMessage, setCareMessage] = useState("");
  const [inputMode, setInputMode] = useState("voice");
  const [user, setUser] = useState(null);

  const [health, setHealth] = useState({
    heartRate: 72,
    bloodPressure: "118 / 75",
    glucose: 95,
    steps: 4123,
    sleep: 7.1,
    mood: "🙂 放鬆",
  });

  const [healthHistory, setHealthHistory] = useState([]);
  const [pendingHealth, setPendingHealth] = useState(null);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  const logout = () => {
    setUser(null);
    setMessages([]);
    setHealthHistory([]);
    setPendingHealth(null);
  };

  const addMessage = (role, text) =>
    setMessages((prev) => [...prev, { role, text }]);

  const playVoice = async (text) => {
    try {
      const res = await api.post(
        "/api/tts",
        { text },
        { responseType: "arraybuffer" }
      );

      const blob = new Blob([res.data], { type: "audio/mp3" });
      const url = URL.createObjectURL(blob);
      new Audio(url).play();
    } catch (err) {
      console.error("❌ 播放語音錯誤：", err);
    }
  };

  // ---------------- 健康數據解析（數字 + 心情） ----------------
  const parseHealthData = (rawText) => {
    if (!rawText) return {};

    let text = rawText.replace(
      /[零○〇一二兩三四五六七八九十百千]+/g,
      (match) => chineseToNumber(match)
    );

    let updated = {};

    const bpFull =
      text.match(/血壓\D*(\d{2,3})\D+(\d{2,3})/) ||
      text.match(/(\d{2,3})\s*(?:\/|over|比)\s*(\d{2,3})/i);

    if (bpFull) updated.bloodPressure = `${bpFull[1]} / ${bpFull[2]}`;
    else {
      const bpSingle = text.match(/血壓\D*(\d{2,3})/);
      if (bpSingle) {
        const sys = Number(bpSingle[1]);
        const dia = Math.round(sys * 0.6);
        updated.bloodPressure = `${sys} / ${dia}`;
      }
    }

    const hr = text.match(/心(?:跳|率)\D*(\d{2,3})/);
    if (hr) updated.heartRate = Number(hr[1]);

    const glu = text.match(/血糖\D*(\d{2,3})/);
    if (glu) updated.glucose = Number(glu[1]);

    const steps = text.match(/(\d{3,6})\s*步/);
    if (steps) updated.steps = Number(steps[1]);

    const sleep = text.match(/睡(?:了)?\D*(\d+(?:\.\d+)?)\D*小時/);
    if (sleep) updated.sleep = Number(sleep[1]);

    const moodMap = [
      { keywords: ["開心", "高興", "愉快", "不錯"], mood: "😄 開心" },
      { keywords: ["放鬆", "舒服"], mood: "😊 放鬆" },
      { keywords: ["普通", "一般"], mood: "🙂 普通" },
      { keywords: ["難過", "心情不好"], mood: "😢 難過" },
      { keywords: ["生氣", "不爽", "火大"], mood: "😡 生氣" },
      { keywords: ["累", "疲倦"], mood: "😪 疲倦" },
      { keywords: ["不舒服", "怪怪"], mood: "😣 不舒服" },
    ];

    const moodHit = moodMap.find((m) =>
      m.keywords.some((kw) => rawText.includes(kw))
    );

    if (moodHit) updated.mood = moodHit.mood;

    return updated;
  };

  // ---------------- 語音輸入 ----------------
  const onTranscript = (text) => {
    addMessage("user", text);
    const updates = parseHealthData(text);

    if (Object.keys(updates).length > 0) {
      const base = pendingHealth || health;
      const newHealth = fillHealthDefaults({ ...base, ...updates });

      setPendingHealth(newHealth);
      setHealth(newHealth);

      const notify =
        "👌 已更新暫存健康數據，可以繼續分段說。完成後請按「結束輸入數據」喔～";
      addMessage("assistant", notify);
      playVoice(notify);
      return;
    }

    requestAI(text);
  };

  // ---------------- AI 聊天 ----------------
  const requestAI = async (text) => {
    try {
      const res = await api.post("/api/chat", { text });
      addMessage("assistant", res.data.reply);
      playVoice(res.data.reply);
    } catch (err) {
      console.error("AI chat error:", err);
      addMessage("assistant", "⚠ AI 回覆失敗");
    }
  };

  // ---------------- 健康分析 ----------------
  const analyzeHealth = async () => {
    try {
      if (healthHistory.length === 0) {
        const msg = "目前還沒有足夠的健康紀錄喔～";
        addMessage("assistant", msg);
        playVoice(msg);
        return;
      }

      const res = await api.post("/api/health-analysis", {
        history: healthHistory,
      });

      const reply = res.data.analysis || "暫時無法分析～稍後再試看看喔！";
      addMessage("assistant", reply);
      playVoice(reply);
    } catch (err) {
      console.error("健康趨勢分析錯誤：", err);
      addMessage("assistant", "⚠ 趨勢分析失敗");
    }
  };

  // ---------------- 儲存健康資料 ----------------
  const confirmPendingHealth = () => {
    if (!pendingHealth) {
      const msg = "目前沒有新的健康數據喔～";
      addMessage("assistant", msg);
      playVoice(msg);
      return;
    }

    const full = fillHealthDefaults(pendingHealth);

    setHealthHistory((prev) => [...prev, full]);
    setPendingHealth(null);

    const msg = "✅ 已記錄並更新折線圖。";
    addMessage("assistant", msg);
    playVoice(msg);
  };

  // ---------------- 手動輸入 ----------------
  const handleManualHealth = (data) => {
    const newHealth = fillHealthDefaults({ ...health, ...data });

    setHealth(newHealth);
    setHealthHistory((prev) => [...prev, newHealth]);

    const msg = "👌 已更新手動輸入的健康數據！";
    addMessage("assistant", msg);
    playVoice(msg);
  };

  // ---------------- 每日關懷 ----------------
  const generateCareMessage = async () => {
    try {
      const res = await api.get("/api/care");
      setCareMessage(res.data.message);
    } catch (err) {
      console.error("Care API error:", err);
      setCareMessage("今天也要記得吃飯喔～");
    }
  };

  // ---------------- 未登入 ----------------
  if (!user) {
    return (
      <div className={`app-root ${theme}`}>
        <Header theme={theme} toggleTheme={toggleTheme} />
        <AuthPanel onLoginSuccess={setUser} />
      </div>
    );
  }

  // ---------------- 主畫面 ----------------
  return (
    <div className={`app-root ${theme}`}>
      <Header theme={theme} toggleTheme={toggleTheme} user={user} onLogout={logout} />

      <CareCard careMessage={careMessage} onGenerate={generateCareMessage} />

      <button className="ai-health-btn arrow" onClick={analyzeHealth}>
        📊 AI 健康趨勢分析 <span className="arrow-icon">➜</span>
      </button>

      <HealthDashboard health={health || {}} />
      <HealthChart history={healthHistory} />

      {pendingHealth && (
        <div className="pending-hint">
          已更新暫存健康資料，可繼續用語音補充～
          <strong>完成後請按「結束輸入數據」</strong>
        </div>
      )}

      <div className="input-mode-switch">
        <button
          className={inputMode === "voice" ? "active" : ""}
          onClick={() => setInputMode("voice")}
        >
          🎤 語音輸入
        </button>

        <button
          className={inputMode === "manual" ? "active" : ""}
          onClick={() => setInputMode("manual")}
        >
          ✍️ 手動輸入
        </button>
      </div>

      <HealthInputPanel mode={inputMode} onUpdate={handleManualHealth} />

      <div className="confirm-health-zone">
        <button
          className="confirm-health-btn"
          onClick={confirmPendingHealth}
          disabled={!pendingHealth}
        >
          ✅ 結束輸入數據並更新圖表
        </button>
      </div>

      <ChatWindow messages={messages} />

      {inputMode === "voice" && (
        <div className="voice-zone">
          <VoiceRecorder onTranscript={onTranscript} />
        </div>
      )}
    </div>
  );
}
