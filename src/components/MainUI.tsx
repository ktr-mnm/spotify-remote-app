// App.tsx
import { useState } from "react";
import NowPlaying from "./NowPlaying";
import { spotifyCmd, spotifyGet } from "../api/spotifyFetch";

export default function MainUI() {

  const [loading, setLoading] = useState(false);

  /**
   * ボリュームアップ
   * @returns 
   */
  const volumeUp = async () => {
    setLoading(true);
    try {
      const state = await spotifyGet("https://api.spotify.com/v1/me/player");
      if (!state.device) return alert("再生デバイスが見つからない");

      const currentVolume = state.device.volume_percent ?? 0;
      const newVolume = Math.min(100, currentVolume + 1);

      await spotifyCmd(
        `https://api.spotify.com/v1/me/player/volume?volume_percent=${newVolume}`,
        {
          method: "PUT",
        }
      );
    } catch {
      alert('ボリュームアップ失敗！');
    } finally {
      setLoading(false);
    }
  };

  /**
   * ボリュームダウン
   * @returns 
   */
  const volumeDown = async () => {
    setLoading(true);
    try {

      const stateRes = await spotifyGet("https://api.spotify.com/v1/me/player");
      const state = await stateRes;

      const currentVolume = state.device.volume_percent ?? 0;
      const newVolume = Math.max(0, currentVolume - 1);

      await spotifyCmd(
        `https://api.spotify.com/v1/me/player/volume?volume_percent=${newVolume}`,
        {
          method: "PUT",
        }
      );
    } catch {
      alert('ボリュームダウン失敗！');
    } finally {
      setLoading(false);
    }
  };

  const mute = async () => {
    setLoading(true);
    try {
      await spotifyCmd(`https://api.spotify.com/v1/me/player/volume?volume_percent=0`, {
        method: "PUT",
      });

    } catch {
      alert('mute失敗！');
    } finally {
      setLoading(false);
    }
  };

  const unmute = async () => {
    setLoading(true);
    try {
      const vol = 5;

      await spotifyCmd(
        `https://api.spotify.com/v1/me/player/volume?volume_percent=${vol}`,
        {
          method: "PUT",
        }
      );
    } catch {
      alert('ボリュームダウン失敗！');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto text-center">
      <div className="mb-4">
        <NowPlaying />
      </div>

      <div className="flex justify-between space-x-2 mb-4">
        <button
          onClick={volumeUp}
          disabled={loading}
          className="flex-1 py-3 bg-blue-800/70 text-white rounded-lg text-2xl font-bold shadow
                    hover:bg-blue-700/80 active:scale-95 transition-all duration-150 disabled:opacity-50"
        >
          {loading ? "⏳" : "＋"}
        </button>
        <button
          onClick={volumeDown}
          disabled={loading}
          className="flex-1 py-3 bg-blue-800/70 text-white rounded-lg text-2xl font-bold shadow
                    hover:bg-blue-700/80 active:scale-95 transition-all duration-150 disabled:opacity-50"
        >
          {loading ? "⏳" : "ー"}
        </button>
      </div>

      <div className="flex justify-between space-x-2">
        <button
          onClick={mute}
          disabled={loading}
          className="flex-1 py-3 bg-red-800/60 text-white rounded-lg text-2xl font-bold shadow
                    hover:bg-red-700/70 active:scale-95 transition-all duration-150 disabled:opacity-50"
        >
          {loading ? "⏳" : "🔇"}
        </button>
        <button
          onClick={unmute}
          disabled={loading}
          className="flex-1 py-3 bg-green-800/60 text-white rounded-lg text-2xl font-bold shadow
                    hover:bg-green-700/70 active:scale-95 transition-all duration-150 disabled:opacity-50"
        >
          {loading ? "⏳" : "🔈"}
        </button>
      </div>
      
    </div>
  );
}

