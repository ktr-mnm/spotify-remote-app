import { motion } from "framer-motion";

export default function LoginScreen({ onLogin }: { onLogin: () => void }) {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col justify-center items-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold text-white mb-4">
          Spotify Remote
        </h1>
        <p className="text-gray-400 mb-8">
          Spotify に接続して音量・再生中の曲を操作できます
        </p>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onLogin}
          className="w-60 py-3 text-lg font-bold 
          bg-green-500/80 hover:bg-green-400 
          text-white rounded-xl shadow-xl 
          transition-all"
        >
          🎧 Spotify Login
        </motion.button>
      </motion.div>
    </div>
  );
}
