// App.tsx
import { useEffect, useState } from "react";
import MainUI from "./components/MainUI";
import LoginScreen from "./components/LoginScreen";
import { setUnauthorizedHandler } from "./api/spotifyFetch";

const clientId = "522ee48389954795ba7a7750a2c00ef8";
const redirectUri = import.meta.env.VITE_REDIRECT_URI;
const scope = "user-read-playback-state user-modify-playback-state";


// PKCE: code_verifier の生成
function generateCodeVerifier(length = 128) {
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789._~-";
  let text = "";
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

// PKCE: code_challenge の生成
async function generateCodeChallenge(verifier: string) {
  const data = new TextEncoder().encode(verifier);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function App() {

  const [token, setToken] = useState(localStorage.getItem("access_token"));

  useEffect(() => {
    // /callback の時だけ動作させる
    // if (!window.location.pathname.startsWith("/callback")) return;
    // console.log(window.location.pathname)

    try {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");
      if (!code) return;

      const codeVerifier = localStorage.getItem("code_verifier");
      if (!codeVerifier) {
        console.error("code_verifier がありません");
        return;
      }

      // token交換
      (async () => {
        const body = new URLSearchParams();
        body.append("client_id", clientId);
        body.append("grant_type", "authorization_code");
        body.append("code", code);
        body.append("redirect_uri", redirectUri);
        body.append("code_verifier", codeVerifier);

        const res = await fetch("https://accounts.spotify.com/api/token", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body,
        });

        const data = await res.json();
        console.log("TOKEN RESPONSE:", data);

        if (data.access_token) {
          localStorage.setItem("access_token", data.access_token);
          if (data.refresh_token) {
            localStorage.setItem("refresh_token", data.refresh_token);
          }
          setToken(data.access_token);
          // base path を維持（GitHub Pages など /spotify-remote-app/ で配信する場合）
          window.history.replaceState({}, "", import.meta.env.BASE_URL || "/");
        } else {
          alert("ログイン失敗！");
        }
      })();
    } catch {
      alert("ログイン失敗！");
    }
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(logout);
  }, []);

  // ログイン処理
  const login = async () => {
    // PKCE
    const codeVerifier = generateCodeVerifier();
    localStorage.setItem("code_verifier", codeVerifier);

    const codeChallenge = await generateCodeChallenge(codeVerifier);

    const url =
      "https://accounts.spotify.com/authorize" +
      `?client_id=${clientId}` +
      `&response_type=code` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&scope=${encodeURIComponent(scope)}` +
      `&code_challenge_method=S256` +
      `&code_challenge=${codeChallenge}`;

    window.location.href = url;
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setToken(null);
  };


  if (!token) {
    return <LoginScreen onLogin={login} />;
  }

  return (
    <div>
      <MainUI />
    </div>
  );
}

export default App;
