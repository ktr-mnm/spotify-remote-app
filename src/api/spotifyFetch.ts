// 異常ログアウト系
let unauthorizedHandler: (() => void) | null = null;

export function setUnauthorizedHandler(fn: () => void) {
  unauthorizedHandler = fn;
}

// ログ処理
type Logger = (message: string, type?: "info" | "success" | "error") => void;

let logger: Logger | null = null;

export const setLogger = (fn: Logger) => {
  logger = fn;
};

const log = (message: string, type: "info" | "success" | "error" = "info") => {
  if (logger) logger(message, type);
};


const CLIENT_ID = "522ee48389954795ba7a7750a2c00ef8";

// 🔄 リフレッシュ関数
async function refreshAccessToken() {
  const refreshToken = localStorage.getItem("refresh_token");
  if (!refreshToken) return null;

  const body = new URLSearchParams();
  body.append("client_id", CLIENT_ID);
  body.append("grant_type", "refresh_token");
  body.append("refresh_token", refreshToken);

  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  const data = await res.json();
  console.log("REFRESH TOKEN RESPONSE:", data);

  if (data.access_token) {
    localStorage.setItem("access_token", data.access_token);
    localStorage.setItem("refresh_token", data.refresh_token);
    log("🔑 Access token refreshed successfully", "success");
    return data.access_token;
  }

  return null;
}

// 共通 fetch（GET/PUT/POST 全対応）
async function spotifyFetchBase(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem("access_token");

  const doFetch = async (accessToken: string | null) =>
    fetch(url, {
      ...options,
      headers: {
        ...(options.headers || {}),
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
    });

  try {
    let res = await doFetch(token);

    if (res.status === 401) {
      // 🔄 自動リフレッシュ
      log("⚠️ Access token expired", "error");
      log("🔄 Refreshing access token...");
      const newToken = await refreshAccessToken();
      if (!newToken) {
        unauthorizedHandler?.();
        return null;
      }
      // 🔁 リトライ
      res = await doFetch(newToken);
    }

    if (!res.ok) {
      console.error("Spotify API Error:", res.status);
      return null;
    }

    const text = await res.text();
    return text ? JSON.parse(text) : true; // PUT/POSTはtrue返す

  } catch (err) {
    console.error("Network fetch error:", err);
    unauthorizedHandler?.();
    return null;
  }
}

// === 公開API ===

export async function spotifyFetch(url: string, options: RequestInit = {}) {
  return spotifyFetchBase(url, options);
}

export async function spotifyGet(url: string, options: RequestInit = {}) {
  return spotifyFetchBase(url, { ...options, method: "GET" });
}

export async function spotifyCmd(url: string, options: RequestInit = {}) {
  return spotifyFetchBase(url, options);
}

export function logout() {
  unauthorizedHandler?.();
}
