import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import NowPlaying from "./NowPlaying";
import { spotifyCmd, spotifyGet, logout } from "../api/spotifyFetch";

export default function MainUI() {
  const [loading, setLoading] = useState(false);
  const [volume, setVolume] = useState<number | null>(null);
  const [lastVolume, setLastVolume] = useState<number>(20); // ミュート解除用

  // 🔊 初回 + 定期的に現在音量を取得（他端末操作と同期）
  useEffect(() => {
    const fetchVolume = async () => {
      try {
        const state = await spotifyGet("https://api.spotify.com/v1/me/player");
        if (state?.device?.volume_percent !== undefined) {
          setVolume(state.device.volume_percent);
        }
      } catch {
        console.warn("音量取得失敗");
      }
    };

    fetchVolume(); // 初回
    const interval = setInterval(fetchVolume, 15000); // 15秒ごと同期
    return () => clearInterval(interval);
  }, []);

  const setSpotifyVolume = async (newVolume: number) => {
    setLoading(true);
    try {
      await spotifyCmd(
        `https://api.spotify.com/v1/me/player/volume?volume_percent=${newVolume}`,
        { method: "PUT" }
      );
      setVolume(newVolume);
    } catch {
      alert("音量変更失敗！");
    } finally {
      setLoading(false);
    }
  };

  const volumeUp = () => {
    if (volume === null) return;
    setSpotifyVolume(Math.min(100, volume + 1));
  };

  const volumeDown = () => {
    if (volume === null) return;
    setSpotifyVolume(Math.max(0, volume - 1));
  };

  const mute = () => {
    if (volume === null) return;
    setLastVolume(volume > 0 ? volume : lastVolume);
    setSpotifyVolume(0);
  };

  const unmute = () => {
    setSpotifyVolume(lastVolume || 10);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black text-white flex flex-col items-center px-4 pt-8 pb-16 overflow-hidden">

      {/* 🎧 Now Playing Card */}
      <div className="w-full max-w-md mb-8">
        <NowPlaying volume={volume} />
      </div>

      <div className="w-full max-w-md grid grid-cols-2 gap-4">
        {/* 🔊 Volume Up */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{
            scale: 0.92,
            boxShadow: "0 0 0 14px rgba(59,130,246,0.25)",
          }}
          onClick={volumeUp}
          disabled={loading || volume === null}
          className="h-20 rounded-2xl bg-blue-500/15 text-blue-400 text-3xl font-semibold
                    shadow-lg hover:bg-blue-500/25 hover:text-blue-300
                    transition-all duration-150 disabled:opacity-40"
        >
          {loading ? "⏳" : "＋"}
        </motion.button>

        {/* 🔉 Volume Down */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{
            scale: 0.92,
            boxShadow: "0 0 0 14px rgba(59,130,246,0.25)",
          }}
          onClick={volumeDown}
          disabled={loading || volume === null}
          className="h-20 rounded-2xl bg-blue-500/15 text-blue-400 text-3xl font-semibold
                    shadow-lg hover:bg-blue-500/25 hover:text-blue-300
                    transition-all duration-150 disabled:opacity-40"
        >
          {loading ? "⏳" : "ー"}
        </motion.button>

        {/* 🔇 Mute */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{
            scale: 0.92,
            boxShadow: "0 0 0 14px rgba(239,68,68,0.25)",
          }}
          animate={
            volume === 0
              ? { scale: [1, 1.05, 1] }
              : { scale: 1 }
          }
          transition={{
            repeat: volume === 0 ? Infinity : 0,
            duration: 1.2,
            ease: "easeInOut",
          }}
          onClick={mute}
          disabled={loading || volume === null || volume === 0}
          className="h-20 rounded-2xl bg-red-500/15 text-red-400 text-3xl font-semibold
                    shadow-lg hover:bg-red-500/25 hover:text-red-300
                    transition-all duration-150 disabled:opacity-40"
        >
          {loading ? "⏳" : "🔇"}
        </motion.button>

        {/* 🔈 Unmute */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{
            scale: 0.92,
            boxShadow: "0 0 0 14px rgba(34,197,94,0.25)",
          }}
          onClick={unmute}
          disabled={loading || volume === null || volume > 0}
          className="h-20 rounded-2xl bg-green-500/15 text-green-400 text-3xl font-semibold
                    shadow-lg hover:bg-green-500/25 hover:text-green-300
                    transition-all duration-150 disabled:opacity-40"
        >
          {loading ? "⏳" : "🔈"}
        </motion.button>
      </div>

      {/* 🚪 Logout */}
      <motion.div
        className="fixed bottom-4 left-0 right-0 flex justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <motion.button
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.05 }}
          onClick={logout}
          className="flex items-center gap-2 px-6 py-3 rounded-full
                     bg-red-500/10 text-red-400 border border-red-400/20
                     shadow-xl backdrop-blur
                     hover:bg-red-500/20 hover:text-red-300
                     transition-all duration-150"
        >
          <span>ログアウト</span>
          <span className="text-lg">⎋</span>
        </motion.button>
      </motion.div>
    </div>
  );
}