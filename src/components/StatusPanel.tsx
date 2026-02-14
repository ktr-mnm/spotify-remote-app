import { AnimatePresence, motion } from "framer-motion";
import type { LogItem } from "../types";

interface Track {
  id: string;
  name: string;
  artists: { id: string; name: string }[];
  album: { images: { url: string }[] };
  duration_ms: number;
}

interface StatusPanelProps {
  logs: LogItem[];
  nextTracks?: Track[];
}

export default function StatusPanel({ logs, nextTracks }: StatusPanelProps) {
  const latest = logs[logs.length - 1];
  const nextTrack = nextTracks?.[0];
  const remainingTracks = nextTracks?.slice(1, 6) ?? [];

  return (
    <div className="hidden md:flex md:flex-col w-full max-w-xl min-h-0
                    rounded-xl md:flex-[2]
                    bg-black/50 border border-white/10 shadow-2xl backdrop-blur-xl overflow-hidden
                    relative">
      {/* 📋 キューの曲を表示 */}
      {nextTrack && (
        <div className="flex-1 min-h-0 p-4 overflow-y-auto flex flex-col gap-4">
          {/* 🎯 最初の曲（装飾付き） */}
          <div>
            <p className="text-xs font-semibold text-white/60 uppercase tracking-widest mb-3">
              ▶ Up Next
            </p>
            <AnimatePresence mode="wait">
              <motion.div
                key={nextTrack.id}
                className="flex gap-3 relative"
                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -15, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 30, duration: 0.6 }}
              >
                {/* 背景グロー */}
                <motion.div
                  className="absolute inset-0 -z-10 bg-gradient-to-br from-green-500/20 via-cyan-500/10 to-transparent rounded-lg blur-xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1, duration: 0.5 }}
                />
                <motion.img
                  src={nextTrack.album.images[2]?.url || nextTrack.album.images[0]?.url}
                  alt={nextTrack.name}
                  className="w-16 h-16 rounded-lg shadow-lg object-cover shrink-0"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  whileHover={{ scale: 1.05 }}
                />
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <motion.h3
                    className="text-sm font-semibold text-white line-clamp-2"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15, type: "spring", stiffness: 300 }}
                  >
                    {nextTrack.name}
                  </motion.h3>
                  <motion.p
                    className="text-xs text-white/60 line-clamp-2 mt-1"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
                  >
                    {nextTrack.artists.map((a) => a.name).join(", ")}
                  </motion.p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* 📑 後続の曲リスト */}
          {remainingTracks.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-white/50 uppercase tracking-widest mb-2">
                Queue
              </p>
              <div className="flex flex-col gap-2">
                <AnimatePresence>
                  {remainingTracks.map((track, idx) => (
                    <motion.div
                      key={track.id}
                      className="flex gap-2 p-2 rounded-lg hover:bg-white/5 transition-colors group cursor-pointer relative"
                      initial={{ opacity: 0, x: -20, scale: 0.95 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: -20, scale: 0.95 }}
                      transition={{ 
                        delay: idx * 0.08, 
                        type: "spring", 
                        stiffness: 350, 
                        damping: 35,
                        duration: 0.5
                      }}
                      whileHover={{ x: 4 }}
                    >
                      {/* ホバー時の背景グロー */}
                      <motion.div
                        className="absolute inset-0 -z-10 bg-gradient-to-r from-blue-500/10 via-cyan-500/5 to-transparent rounded-lg"
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                      <motion.img
                        src={track.album.images[2]?.url || track.album.images[0]?.url}
                        alt={track.name}
                        className="w-10 h-10 rounded object-cover shrink-0"
                        whileHover={{ scale: 1.08 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      />
                      <div className="flex-1 min-w-0">
                        <motion.p
                          className="text-xs font-medium text-white/80 line-clamp-1"
                          initial={{ opacity: 0.6 }}
                          whileHover={{ opacity: 1 }}
                          transition={{ duration: 0.2 }}
                        >
                          {track.name}
                        </motion.p>
                        <motion.p
                          className="text-xs text-white/50 line-clamp-1 group-hover:text-white/60"
                          initial={{ opacity: 0.4 }}
                          whileHover={{ opacity: 0.8 }}
                          transition={{ duration: 0.2 }}
                        >
                          {track.artists.map((a) => a.name).join(", ")}
                        </motion.p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ステータス（最新ログ1行） */}
      <div className="shrink-0 px-4 py-3 border-t border-white/10 bg-black/30">
        <AnimatePresence mode="wait">
          {latest ? (
            <motion.div
              key={latest.id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="flex items-center gap-2 text-xs font-mono"
            >
              <span
                className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                  latest.type === "success"
                    ? "bg-green-400 shadow-[0_0_8px_rgba(34,197,94,0.8)]"
                    : latest.type === "error"
                    ? "bg-red-400 shadow-[0_0_8px_rgba(239,68,68,0.8)]"
                    : "bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.6)]"
                }`}
              />
              <span className="text-white/80 truncate">{latest.message}</span>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 text-xs font-mono text-white/50"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-pulse" />
              Connecting…
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
