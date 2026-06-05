import axios, { type InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "@/store/useAuthStore";
import { getAccessToken as getZaloAccessToken } from "./zalo-auth";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_GATEWAY_URL ?? "http://localhost:8080",
  timeout: 15_000,
});

api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const { appToken } = useAuthStore.getState();
  const token = appToken ?? (await getZaloAccessToken());
  if (token && config.headers) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error?.response?.status === 401) {
      useAuthStore.getState().reset();
    }
    return Promise.reject(error);
  },
);

export async function askPharmacist(question: string): Promise<{ content: string }> {
  const { data } = await api.post("/patient/ask-pharmacist", { question });
  return data;
}

export async function checkSafety(newMed: string): Promise<{ alerts: unknown[] }> {
  const { data } = await api.post("/patient/check-safety", { newMed });
  return data;
}
