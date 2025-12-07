import axios from "axios";

export const api = axios.create({
  baseURL: "https://ai-voice-butler-backend.onrender.com",
});