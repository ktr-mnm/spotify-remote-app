import { AnimatePresence, motion } from "framer-motion";
import type { LogItem } from "../types";

interface StatusPanelProps {
  logs: LogItem[];
}

export default function StatusPanel({ logs }: StatusPanelProps) {
  const latest = logs[logs.length - 1];

  return (
    <div className="hidden md:flex md:flex-col w-full max-w-xl min-h-0
                    rounded-xl md:flex-[2]
                    bg-black/50 border border-white/10 shadow-2xl backdrop-blur-xl overflow-hidden
                    relative">
      {/* 背景のゆっくり動くグラデーション */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-green-500/10 via-cyan-500/5 to-blue-500/10 rounded-full blur-3xl"
          animate={{
            x: ["0%", "20%", "0%"],
            y: ["0%", "15%", "0%"],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-blue-500/10 via-cyan-500/5 to-green-500/10 rounded-full blur-3xl"
          animate={{
            x: ["0%", "-15%", "0%"],
            y: ["0%", "-10%", "0%"],
          }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="flex-1 min-h-0" />

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
