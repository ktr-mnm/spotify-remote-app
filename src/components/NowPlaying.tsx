import { useEffect, useRef, useState } from "react";
import { spotifyGet } from "../api/spotifyFetch";
import { motion, AnimatePresence } from "framer-motion";

interface Track {
  id: string;
  name: string;
  artists: { id: string; name: string }[];
  album: { images: { url: string }[] };
  duration_ms: number;
}

export default function NowPlaying(
  { volume, setVolume, lastLocalVolumeChange, addLog, setArtists, setNextTrack }: 
  { volume: number | null,
    setVolume: React.Dispatch<React.SetStateAction<number | null>>,
    lastLocalVolumeChange: React.RefObject<number>,
    addLog: (message: string, type?: "info" | "success" | "error") => void,
    setArtists: React.Dispatch<React.SetStateAction<any[] | null>>;
    setNextTrack?: React.Dispatch<React.SetStateAction<Track[]>>;
  }) {
  const [track, setTrack] = useState<Track | null>(null);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const progressTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  // 🎧 楽曲情報を5秒ごとに同期
  useEffect(() => {
    const fetchNowPlaying = async () => {
      const res = await spotifyGet("https://api.spotify.com/v1/me/player");

      if (!res) {
        setTrack(null);
        setIsPlaying(false);
        setArtists?.(null);
        return;
      }

      if (res.item) {
        setTrack(res.item);
        setProgress(res.progress_ms);
        setIsPlaying(res.is_playing);

        const now = Date.now();
        const elapsed = now - lastLocalVolumeChange.current;

        // 👇 直近2秒以内にローカル操作があったら同期しない
        if (elapsed > 2000) {
          setVolume(res.device.volume_percent);
        }

        // 👤 再生中トラックの全アーティスト情報を取得（Get Several Artists）
        const artistIds = res.item.artists?.map((a: { id: string }) => a.id).filter(Boolean) ?? [];
        if (artistIds.length > 0) {
          try {
            const idsParam = artistIds.slice(0, 50).join(",");
            const data = await spotifyGet(`https://api.spotify.com/v1/artists?ids=${idsParam}`);
            const list = data?.artists?.filter(Boolean) ?? [];
            setArtists?.(list);
          } catch {
            setArtists?.(null);
          }
        } else {
          setArtists?.(null);
        }

        // 🎵 キュー情報を取得
        try {
          const queueRes = await spotifyGet("https://api.spotify.com/v1/me/player/queue");
          if (queueRes?.queue && queueRes.queue.length > 0) {
            setNextTrack?.(queueRes.queue.slice(0, 6));
          } else {
            setNextTrack?.([]);
          }
        } catch {
          setNextTrack?.([]);
        }

        addLog("🎧 Playback status fetched", "success");
      } else {
        setArtists?.(null);
      }
    };

    fetchNowPlaying();
    const interval = setInterval(fetchNowPlaying, 5000);
    return () => clearInterval(interval);
  }, []);

  // ⏱️ 再生中は進捗をローカル更新
  useEffect(() => {
    if (!isPlaying) {
      if (progressTimer.current) clearInterval(progressTimer.current);
      return;
    }

    progressTimer.current = setInterval(() => {
      setProgress((prev) => prev + 1000);
    }, 1000);

    return () => {
      if (progressTimer.current) clearInterval(progressTimer.current);
    };
  }, [isPlaying]);

  if (!track) {
    return (
      <div className="w-full bg-white/5 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/10
                  flex items-center justify-center min-h-[200px]">
        <p className="text-center text-white/60 py-8">
          🎧 再生中の曲はありません
        </p>
      </div>
    );
  }

  const progressPercent = Math.min(
    (progress / track.duration_ms) * 100,
    100
  );

  return (
    <>
      <motion.div
        className="w-full mx-auto bg-white/5 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* 🎨 Album Art */}
        <div className="relative flex justify-center">
          {/* オーラ背景 */}
          <motion.div
            className="absolute inset-0 rounded-3xl blur-3xl opacity-40 bg-gradient-to-br from-green-400 via-blue-500 to-purple-500"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
          />

          <AnimatePresence mode="wait">
            <motion.img
              key={track.id}
              layoutId="album-art"
              src={track.album.images[0]?.url}
              alt={track.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.4 }}
              className="relative w-72 h-72 md:w-100 md:h-100 rounded-3xl shadow-2xl z-10 cursor-pointer"
              onClick={() => setShowModal(true)}
            />
          </AnimatePresence>

          {/* 🔊 Volume Badge */}
          {volume !== null && (
            <motion.div
              className="absolute -bottom-4 -right-4 xl:right-13 flex items-center gap-2
                        bg-gradient-to-br from-blue-500/80 to-cyan-400/80
                        text-white text-lg font-semibold
                        px-4 py-2 rounded-full shadow-xl backdrop-blur
                        border border-white/20 z-20"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              🔊
              <motion.span
                key={volume}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                {volume}%
              </motion.span>
            </motion.div>
          )}
        </div>

        {/* 🎵 Track Info */}
        <div className="text-center mt-6">
          <motion.h2
            className="text-white text-xl font-semibold leading-tight truncate"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {track.name}
          </motion.h2>
          <motion.p
            className="text-white/60 text-sm mt-1 line-clamp-3"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            {track.artists.map((a) => a.name).join(", ")}
          </motion.p>
        </div>

        {/* 🎚 Progress Bar */}
        <div className="w-full mt-6">
          <div className="relative h-2 w-full bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-green-400 shadow-[0_0_15px_rgba(34,197,94,0.8)]"
              animate={{ width: `${progressPercent}%` }}
              transition={{ ease: "linear", duration: 1 }}
            />
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
              animate={{ x: ["-100%", "100%"] }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            />
          </div>
        </div>
      </motion.div>

      {/* 🖼️ フルスクリーンモーダル */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
          >
            <motion.img
              layoutId="album-art"
              src={track.album.images[0]?.url}
              alt={track.name}
              className="w-[90vw] max-w-xl rounded-3xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />

            {/* ❌ Close */}
            <motion.button
              onClick={() => setShowModal(false)}
              className="absolute top-6 right-6 text-white text-2xl bg-white/10 hover:bg-white/20 rounded-full w-10 h-10 flex items-center justify-center backdrop-blur border border-white/20"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
            >
              ✕
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
