// src/components/HealthChart.jsx

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

// ⭐ 確保每筆 history 都是完整健康資料（避免 undefined 崩潰）
function safeHealth(h) {
  if (!h || typeof h !== "object") return null;
  return {
    heartRate: h.heartRate ?? 72,
    glucose: h.glucose ?? 95,
    steps: h.steps ?? 3000,
    sleep: h.sleep ?? 7,
  };
}

export default function HealthChart({ history }) {
  // ---------------------------
  // ⭐ 防呆：空陣列 or 無效資料
  // ---------------------------
  if (!Array.isArray(history) || history.length === 0) {
    return <div className="chart-box">尚無圖表資料</div>;
  }

  // ---------------------------
  // ⭐ 過濾無效資料（避免 map undefined → crash）
  // ---------------------------
  const cleaned = history
    .map((item) => safeHealth(item))
    .filter((x) => x !== null);

  if (cleaned.length === 0) {
    return <div className="chart-box">資料格式異常，無法繪製圖表</div>;
  }

  const labels = cleaned.map((_, i) => `#${i + 1}`);

  // -------------------------------
  // ⭐ 數據來源（全部使用 cleaned）
  // -------------------------------
  const data = {
    labels,
    datasets: [
      {
        label: "🌡 心跳 (bpm)",
        data: cleaned.map((h) => h.heartRate),
        borderColor: "#ff6384",
        backgroundColor: "rgba(255, 99, 132, 0.15)",
        tension: 0.3,
        fill: true,
      },
      {
        label: "🩸 血糖 (mg/dL)",
        data: cleaned.map((h) => h.glucose),
        borderColor: "#36a2eb",
        backgroundColor: "rgba(54,162,235,0.15)",
        tension: 0.3,
        fill: true,
      },
      {
        label: "👣 步數",
        data: cleaned.map((h) => h.steps),
        borderColor: "#4bc0c0",
        backgroundColor: "rgba(75,192,192,0.15)",
        tension: 0.3,
        fill: true,
        yAxisID: "stepsAxis",
      },
      {
        label: "💤 睡眠 (hr)",
        data: cleaned.map((h) => h.sleep),
        borderColor: "#9966ff",
        backgroundColor: "rgba(153,102,255,0.15)",
        tension: 0.3,
        fill: true,
      },
    ],
  };

  // -------------------------------
  // ⭐ 圖表設定（步數獨立右側軸）
  // -------------------------------
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: { font: { size: 14 } },
      },
    },
    scales: {
      y: {
        title: { display: true, text: "一般健康數值", font: { size: 14 } },
        ticks: { font: { size: 13 } },
      },
      stepsAxis: {
        position: "right",
        ticks: { font: { size: 13 } },
        grid: { drawOnChartArea: false },
        title: { display: true, text: "步數", font: { size: 14 } },
      },
    },
  };

  return (
    <div className="chart-card">
      <h3>📈 健康折線圖趨勢</h3>
      <Line data={data} options={options} />
    </div>
  );
}
