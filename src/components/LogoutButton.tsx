import { motion } from "framer-motion";
import { logout } from "../api/spotifyFetch";

export default function LogoutButton() {
  return (
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
        <span>Sign out</span>
        <span className="text-lg">⎋</span>
      </motion.button>
    </motion.div>
  );
}
