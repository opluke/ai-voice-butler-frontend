import { useState } from "react";
import { api } from "../services/api";  // ⭐ 使用 Render API

export default function VoiceRecorder({ onTranscript }) {
  const [rec, setRec] = useState(null);
  const [recording, setRecording] = useState(false);

  const startRecord = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream, { mimeType: "audio/webm" });

    let chunks = [];
    recorder.ondataavailable = (e) => chunks.push(e.data);

    recorder.onstop = async () => {
      const blob = new Blob(chunks, { type: "audio/webm" });

      const fd = new FormData();
      fd.append("audio", blob, "voice.webm");

      try {
        // ⭐ 改成打 Render 後端，不再使用 localhost
        const res = await api.post("/api/stt", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        const text = res.data.text;
        onTranscript(text);

      } catch (err) {
        console.error("❌ STT error:", err);
        onTranscript("語音辨識失敗，請再試一次。");
      }
    };

    recorder.start();
    setRec(recorder);
    setRecording(true);
  };

  const stopRecord = () => {
    if (rec) rec.stop();
    setRecording(false);
  };

  return (
    <div className="voice-area">
      <button
        className={`voice-btn start ${recording ? "disabled" : ""}`}
        onClick={startRecord}
        disabled={recording}
      >
        🎤 開始錄音
      </button>

      <button
        className={`voice-btn stop ${!recording ? "disabled" : ""}`}
        onClick={stopRecord}
        disabled={!recording}
      >
        ⏹ 停止錄音
      </button>
    </div>
  );
}
