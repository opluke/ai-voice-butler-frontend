import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Legend,
  Tooltip,
} from "chart.js";

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Legend,
  Tooltip
);

export default function HealthChart({ history }) {
  if (!history || history.length < 2) {
    return <div className="chart-empty">📊 還沒有足夠資料顯示趨勢</div>;
  }

  const labels = history.map((_, i) => `紀錄 ${i + 1}`);

  const data = {
    labels,
    datasets: [
      {
        label: "心跳",
        data: history.map((h) => h.heartRate),
        borderColor: "#ff7675",
        tension: 0.4,
      },
      {
        label: "血糖",
        data: history.map((h) => h.glucose),
        borderColor: "#0984e3",
        tension: 0.4,
      },
      {
        label: "睡眠",
        data: history.map((h) => h.sleep),
        borderColor: "#00b894",
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="health-chart">
      <h3>📈 健康趨勢圖</h3>
      <Line data={data} height={120} />
    </div>
  );
}