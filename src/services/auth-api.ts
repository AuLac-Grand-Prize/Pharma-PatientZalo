import axios from "axios";

const baseURL = import.meta.env.VITE_API_GATEWAY_URL ?? "http://localhost:8080";

export interface AppUser {
  id: string;
  zaloId: string;
  name: string;
  avatar?: string;
  phoneMasked?: string;
  hasMedicalProfile: boolean;
}

export interface AppLoginResponse {
  user: AppUser;
  appToken: string;
  expiresAt: number;
}

interface LoginPayload {
  zaloAccessToken: string;
  phoneToken?: string;
  userInfo?: { name: string; avatar?: string };
}

export async function loginWithZalo(payload: LoginPayload): Promise<AppLoginResponse> {
  try {
    const { data } = await axios.post<AppLoginResponse>(
      `${baseURL}/auth/patient/zalo`,
      payload,
      { timeout: 12_000 },
    );
    return data;
  } catch {
    return mockLogin(payload);
  }
}

function mockLogin(payload: LoginPayload): AppLoginResponse {
  return {
    user: {
      id: `mock_${Math.random().toString(36).slice(2, 8)}`,
      zaloId: payload.zaloAccessToken.slice(0, 10),
      name: payload.userInfo?.name ?? "Người dùng Zalo",
      avatar: payload.userInfo?.avatar,
      phoneMasked: payload.phoneToken ? "090***892" : undefined,
      hasMedicalProfile: false,
    },
    appToken: `mock.${btoa(payload.zaloAccessToken).slice(0, 24)}`,
    expiresAt: Date.now() + 60 * 60 * 1000,
  };
}
