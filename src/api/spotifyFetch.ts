let unauthorizedHandler: (() => void) | null = null;

export function setUnauthorizedHandler(fn: () => void) {
  unauthorizedHandler = fn;
}

export async function spotifyFetch(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem("access_token");

  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    });

    // Token無効
    if (res.status === 401) {
      unauthorizedHandler?.();
      return null;
    }

    // Spotifyはエラーでも JSON 返すのでチェック
    if (!res.ok) {
      console.error("Spotify API Error:", res.status);
      return null;
    }

    return await res.json();

  } catch (err) {
    console.error("Network fetch error:", err);
    // ネットワーク落ちてる or fetch が throw → 強制ログアウトでもOK
    unauthorizedHandler?.();
    return null;
  }
}

export async function spotifyGet(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem("access_token");
  if (!token) {
    unauthorizedHandler?.();
    return null;
  }

  const res = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  if (res.status === 401) {
    unauthorizedHandler?.();
    return null;
  }

  if (!res.ok) return null;

  const text = await res.text();
  return text ? JSON.parse(text) : null;
}


export async function spotifyCmd(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem("access_token");
  if (!token) {
    unauthorizedHandler?.();
    return null;
  }

  const res = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  if (res.status === 401) {
    unauthorizedHandler?.();
    return null;
  }

  if (!res.ok) {
    console.error("Spotify CMD Error", res.status);
    return null;
  }

  // PUT は 204 No Content が普通なので返り値なしでOK
  return true;
}

