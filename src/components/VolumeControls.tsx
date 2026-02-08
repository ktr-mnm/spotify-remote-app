import { motion } from "framer-motion";

interface VolumeControlsProps {
  loading: boolean;
  volume: number | null;
  onVolumeUp: () => void;
  onVolumeDown: () => void;
  onMute: () => void;
  onUnmute: () => void;
}

export default function VolumeControls({
  loading,
  volume,
  onVolumeUp,
  onVolumeDown,
  onMute,
  onUnmute,
}: VolumeControlsProps) {
  return (
    <div className="w-full grid grid-cols-2 gap-4 md:mt-4 md:shrink-0">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.92, boxShadow: "0 0 0 14px rgba(59,130,246,0.25)" }}
        onClick={onVolumeUp}
        disabled={loading || volume === null}
        className="h-20 rounded-2xl bg-blue-500/15 text-blue-400 text-3xl font-semibold
                  shadow-lg hover:bg-blue-500/25 hover:text-blue-300
                  transition-all duration-150 disabled:opacity-40"
      >
        {loading ? "⏳" : "＋"}
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.92, boxShadow: "0 0 0 14px rgba(59,130,246,0.25)" }}
        onClick={onVolumeDown}
        disabled={loading || volume === null}
        className="h-20 rounded-2xl bg-blue-500/15 text-blue-400 text-3xl font-semibold
                  shadow-lg hover:bg-blue-500/25 hover:text-blue-300
                  transition-all duration-150 disabled:opacity-40"
      >
        {loading ? "⏳" : "ー"}
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.92, boxShadow: "0 0 0 14px rgba(239,68,68,0.25)" }}
        animate={volume === 0 ? { scale: [1, 1.05, 1] } : { scale: 1 }}
        transition={{ repeat: volume === 0 ? Infinity : 0, duration: 1.2, ease: "easeInOut" }}
        onClick={onMute}
        disabled={loading || volume === null || volume === 0}
        className="h-20 rounded-2xl bg-red-500/15 text-red-400 text-3xl font-semibold
                  shadow-lg hover:bg-red-500/25 hover:text-red-300
                  transition-all duration-150 disabled:opacity-40"
      >
        {loading ? "⏳" : "🔇"}
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.92, boxShadow: "0 0 0 14px rgba(34,197,94,0.25)" }}
        onClick={onUnmute}
        disabled={loading || volume === null || volume > 0}
        className="h-20 rounded-2xl bg-green-500/15 text-green-400 text-3xl font-semibold
                  shadow-lg hover:bg-green-500/25 hover:text-green-300
                  transition-all duration-150 disabled:opacity-40"
      >
        {loading ? "⏳" : "🔈"}
      </motion.button>
    </div>
  );
}
